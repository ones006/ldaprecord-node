import * as dotenv from 'dotenv';
import { LdapConnection } from './src/Connection/LdapConnection.js';
import { User as LdapUser } from './src/Models/ActiveDirectory/User.js';
import util from 'util';

dotenv.config();

// Global error handler for debugging the [Object: null prototype] issue
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', util.inspect(reason, { depth: null }));
});
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', util.inspect(err, { depth: null }));
});

async function run() {
  console.log('--- LdapRecord Node.js - 2-Way Sync Test ---');

  const config = {
    hosts: [process.env.LDAP_HOST || ''],
    port: parseInt(process.env.LDAP_PORT || '389'),
    username: process.env.LDAP_USERNAME || '',
    password: process.env.LDAP_PASSWORD || '',
    baseDn: process.env.LDAP_BASE_DN || '',
    useSsl: process.env.LDAP_SSL === 'true',
    useTls: process.env.LDAP_TLS === 'true',
    timeout: parseInt(process.env.LDAP_TIMEOUT || '5') * 1000,
  };

  const connection = new LdapConnection(config);

  try {
    await connection.connect();
    LdapUser.setConnection(connection);

    const testDn = `CN=LdapRecordTest,CN=Users,${process.env.LDAP_BASE_DN}`;
    const newUser = new LdapUser({
      cn: 'LdapRecordTest',
      sAMAccountName: 'ldaprecordtest',
      givenName: 'LdapRecord',
      sn: 'Test',
      userPrincipalName: `ldaprecordtest@${process.env.LDAP_BASE_DN?.replace(/dc=/g, '').replace(/,/g, '.')}`,
      objectClass: ['top', 'person', 'organizationalPerson', 'user']
    }, false);
    newUser.setDn(testDn);

    // Pre-cleanup
    try {
      const existing = await LdapUser.query().where('sAMAccountName', '=', 'ldaprecordtest').get();
      if (existing.length > 0) {
        console.log('ℹ️ Found existing test user, cleaning up...');
        const model = new LdapUser(existing[0], true);
        await model.delete();
      }
    } catch (e) { }

    console.log(`🚀 Creating test user: ${testDn}...`);
    try {
      await newUser.save();
      console.log('✅ User created successfully!');
    } catch (e: any) {
      console.error('Caught error during save:', util.inspect(e, { depth: null }));
    }

    console.log('🔄 Searching for test user to update...');
    const users = await LdapUser.query().where('sAMAccountName', '=', 'ldaprecordtest').get();
    if (users.length > 0) {
      const userModel = new LdapUser(users[0], true);
      console.log('✅ Found user, updating description...');
      userModel.setAttribute('description', `Updated at ${new Date().toISOString()}`);
      await userModel.save();
      console.log('✅ User updated successfully!');
    }

  } catch (error: any) {
    console.error('❌ Top-level error:', util.inspect(error, { depth: null }));
  } finally {
    await connection.disconnect();
    console.log('Disconnected.');
  }
}

run().catch(err => {
  console.error('Fatal internal error:', util.inspect(err, { depth: null }));
});

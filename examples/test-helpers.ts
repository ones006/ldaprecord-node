import * as dotenv from 'dotenv';
import { LdapConnection } from './src/Connection/LdapConnection.js';
import { User as LdapUser } from './src/Models/ActiveDirectory/User.js';

dotenv.config();

async function run() {
  console.log('--- LdapRecord Node.js - Attribute Helpers Test ---');

  const config = {
    hosts: [process.env.LDAP_HOST || ''],
    port: parseInt(process.env.LDAP_PORT || '389'),
    username: process.env.LDAP_USERNAME || '',
    password: process.env.LDAP_PASSWORD || '',
    baseDn: process.env.LDAP_BASE_DN || '',
    useSsl: process.env.LDAP_SSL === 'true',
    useTls: process.env.LDAP_TLS === 'true',
    timeout: 10000,
  };

  const connection = new LdapConnection(config);

  try {
    await connection.connect();
    LdapUser.setConnection(connection);

    console.log('🔍 Fetching Administrator using helpers...');
    const admin = await LdapUser.query()
      .where('sAMAccountName', '=', 'administrator')
      .first();

    if (admin) {
      const user = new LdapUser(admin, true);

      // Using convenience methods
      console.log('✅ Found User successfully!');
      console.log('-----------------------------------');
      console.log(`Display Name : ${user.getDisplayName()}`);
      console.log(`Account Name : ${user.getAccountName()}`);
      console.log(`Email        : ${user.getEmail() || 'N/A'}`);
      console.log(`Title        : ${user.getTitle() || 'N/A'}`);
      console.log(`Department   : ${user.getDepartment() || 'N/A'}`);
      console.log(`Groups Count : ${user.getGroups().length}`);
      console.log('-----------------------------------');

      // Testing setter
      console.log('Test changing first name in memory...');
      user.setFirstName('Super');
      console.log(`New First Name: ${user.getFirstName()}`);
    }

  } catch (error: any) {
    console.error('❌ Error:', error);
  } finally {
    await connection.disconnect();
  }
}

run();

import * as dotenv from 'dotenv';
import { LdapConnection } from './src/Connection/LdapConnection.js';
import { User as LdapUser } from './src/Models/ActiveDirectory/User.js';
import { Synchronizer, type DatabaseModel } from './src/Adonis/Synchronizer.js';

dotenv.config();

// Mocking a Lucid Model
class UserDB implements DatabaseModel {
  public id: number | null = null;
  public username: string = '';
  public email: string = '';
  public display_name: string = '';
  public guid: string = '';

  async save() {
    console.log('💾 Saving to Database:', {
      username: this.username,
      email: this.email,
      display_name: this.display_name,
      guid: this.guid
    });
    return this;
  }
}

async function run() {
  console.log('--- LdapRecord Node.js Refactor - Sync Demo ---');

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

    console.log('🔍 Searching LDAP for administrator...');
    const ldapUsers = await LdapUser.query()
      .where('sAMAccountName', '=', 'administrator')
      .get();

    if (ldapUsers.length > 0) {
      const rawLdapUser = ldapUsers[0];
      // In a real Model, we would wrap the raw entry in an LdapUser instance
      const userModel = new LdapUser(rawLdapUser, true);

      console.log('✅ LDAP User found:', userModel.getAttribute('sAMAccountName'));

      // Define attribute mapping (like in AdonisJS config)
      const mapping = {
        'sAMAccountName': 'username',
        'mail': 'email',
        'cn': 'display_name',
        'distinguishedName': 'guid' // temporary mapping for demo
      };

      const dbUser = new UserDB();
      const synchronizer = new Synchronizer(userModel, dbUser, mapping);

      console.log('🔄 Synchronizing attributes...');
      synchronizer.synchronize();

      await synchronizer.save();
      console.log('✅ Synchronization complete!');
    }

  } catch (error: any) {
    console.error('❌ Error:', error);
    if (error.stack) console.error(error.stack);
  } finally {
    await connection.disconnect();
  }
}

run();

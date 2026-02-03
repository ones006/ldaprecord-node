import * as dotenv from 'dotenv';
import { LdapConnection } from './src/Connection/LdapConnection.js';
import { User } from './src/Models/ActiveDirectory/User.js';

dotenv.config();

async function run() {
  console.log('--- LdapRecord Node.js Refactor POC ---');

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

  console.log(`Connecting to ${config.hosts[0]}...`);

  const connection = new LdapConnection(config);

  try {
    await connection.connect();
    console.log('✅ Connected successfully!');

    User.setConnection(connection);

    console.log('Querying users...');
    const users = await User.query()
      .where('sAMAccountName', '=', 'administrator')
      .limit(1)
      .get();

    console.log(`Found ${users.length} user(s).`);
    if (users.length > 0) {
      console.log('Administrator details:', JSON.stringify(users[0], null, 2));
    }

  } catch (error: any) {
    console.error('❌ Error:', error.message);
  } finally {
    await connection.disconnect();
    console.log('Disconnected.');
  }
}

run();

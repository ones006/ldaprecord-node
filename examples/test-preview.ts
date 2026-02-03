import * as dotenv from 'dotenv';
import { LdapConnection } from './src/Connection/LdapConnection.js';
import { User as LdapUser } from './src/Models/ActiveDirectory/User.js';

dotenv.config();

async function run() {
  console.log('--- LdapRecord Node.js - User Import Preview ---');

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

    console.log('🔍 Fetching top 5 users for preview...\n');

    const users = await LdapUser.query()
      .limit(5)
      .get();

    if (users.length === 0) {
      console.log('No users found.');
      return;
    }

    users.forEach((rawUser, index) => {
      const user = new LdapUser(rawUser, true);
      console.log(`[USER ${index + 1}] ------------------------------------------`);
      console.log(`DN: ${user.getDn()}`);

      const attributes = user.getAttributes();
      const keys = Object.keys(attributes).sort();

      console.log('Attributes:');
      keys.forEach(key => {
        let val = attributes[key];

        // Format value for display
        if (Buffer.isBuffer(val)) {
          val = `<Buffer length ${val.length}> (Hex: ${val.toString('hex').substring(0, 16)}...)`;
        } else if (Array.isArray(val)) {
          if (val.length === 1) {
            val = val[0];
          } else {
            val = `[${val.join(', ')}]`;
          }
        }

        // Skip huge attributes or internal ones if necessary, but here we show "lengkap"
        console.log(`  ${key.padEnd(25)}: ${val}`);
      });
      console.log('\n');
    });

  } catch (error: any) {
    console.error('❌ Error:', error);
  } finally {
    await connection.disconnect();
  }
}

run();

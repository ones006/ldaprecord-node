import * as dotenv from 'dotenv';
import { Client } from 'ldapts';

dotenv.config();

async function run() {
  console.log('--- Simple ldapts Write Test ---');

  const client = new Client({
    url: `ldap://${process.env.LDAP_HOST}:389`,
    timeout: 5000,
  });

  try {
    await client.bind(process.env.LDAP_USERNAME || '', process.env.LDAP_PASSWORD || '');
    console.log('✅ Bind successful');

    const testDn = `CN=SimpleTest,CN=Users,${process.env.LDAP_BASE_DN}`;
    const entry = {
      cn: 'SimpleTest',
      sAMAccountName: 'simpletest',
      objectClass: ['top', 'person', 'organizationalPerson', 'user']
    };

    console.log(`🚀 Adding ${testDn}...`);
    await client.add(testDn, entry);
    console.log('✅ Entry added');

    console.log('🗑 Deleting entry...');
    await client.del(testDn);
    console.log('✅ Entry deleted');

  } catch (error: any) {
    console.error('❌ Error in simple test:', error.message || error);
  } finally {
    await client.unbind();
  }
}

run();

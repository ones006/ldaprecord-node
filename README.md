# LdapRecord Node.js (Active Directory & LDAP for Node.js)

Refactor of the famous PHP LdapRecord library to Node.js / TypeScript. Designed for simplicity and deep integration with frameworks like **AdonisJS**.

## Features

- **Fluent Query Builder**: Construct LDAP queries with a syntax similar to Eloquent/Lucid.
- **ActiveRecord Models**: Interact with LDAP entries as objects.
- **2-Way Sync**: Support for Create, Read, Update, and Delete (CRUD).
- **Attribute Helpers**: Pre-mapped Active Directory attributes with IntelliSense.
- **AdonisJS Ready**: Includes Service Provider and Synchronizer for Lucid models.

## Installation

```bash
npm install ldaprecord-node
```

## Quick Start (Core)

```typescript
import { LdapConnection, AdUser } from 'ldaprecord-node';

const connection = new LdapConnection({
  hosts: ['192.168.0.1'],
  username: 'admin@example.com',
  password: 'password',
  baseDn: 'dc=example,dc=com'
});

AdUser.setConnection(connection);

// Search for a user
const user = await AdUser.query().where('sAMAccountName', '=', 'jdoe').first();

if (user) {
  console.log(user.getEmail());
  user.setAttribute('title', 'Lead Developer');
  await user.save(); // Direct write to AD
}
```

## AdonisJS Integration

### 1. Register Provider
Add to `start/app.ts`:
```typescript
const providers = [
  // ...
  './providers/LdapServiceProvider'
]
```

### 2. Configure
Create `config/ldap.ts`:
```typescript
import Env from '@ioc:Adonis/Core/Env';

export default {
  hosts: [Env.get('LDAP_HOST')],
  // ... (see sample config in package)
}
```

### 3. Sync LDAP to Database
Use the `Synchronizer` in your commands or auth logic:
```typescript
import { Synchronizer, AdUser } from 'ldaprecord-node';
import DatabaseUser from 'App/Models/User';

const ldapUser = await AdUser.query().where('mail', '=', email).first();
const dbUser = await DatabaseUser.firstOrCreate({ email });

const sync = new Synchronizer(ldapUser, dbUser, {
  'givenName': 'first_name',
  'sn': 'last_name',
  'displayName': 'full_name'
});

sync.synchronize();
await sync.save();
```

## Credits
Based on the original [LdapRecord PHP library](https://ldaprecord.com).

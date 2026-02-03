import { LdapConnection } from '../Connection/LdapConnection.js';
import { Model } from '../Models/Model.js';

/**
 * AdonisJS Service Provider for LdapRecord
 */
export default class LdapServiceProvider {
  constructor(protected app: any) { }

  public register() {
    this.app.container.singleton('LdapRecord/Connection', () => {
      const config = this.app.container.resolveBinding('Adonis/Core/Config').get('ldap');
      return new LdapConnection(config);
    });
  }

  public async boot() {
    // Set the default connection for all Models when the app boots
    const connection = this.app.container.resolveBinding('LdapRecord/Connection');
    Model.setConnection(connection);
  }
}

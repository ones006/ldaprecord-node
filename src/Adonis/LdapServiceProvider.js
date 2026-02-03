import { LdapConnection } from '../Connection/LdapConnection.js';
import { Model } from '../Models/Model.js';
/**
 * AdonisJS Service Provider for LdapRecord
 */
export default class LdapServiceProvider {
    app;
    constructor(app) {
        this.app = app;
    }
    register() {
        this.app.container.singleton('LdapRecord/Connection', () => {
            const config = this.app.container.resolveBinding('Adonis/Core/Config').get('ldap');
            return new LdapConnection(config);
        });
    }
    async boot() {
        // Set the default connection for all Models when the app boots
        const connection = this.app.container.resolveBinding('LdapRecord/Connection');
        Model.setConnection(connection);
    }
}
//# sourceMappingURL=LdapServiceProvider.js.map
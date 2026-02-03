import { Client } from 'ldapts';
export class LdapConnection {
    client = null;
    config;
    constructor(config) {
        this.config = config;
    }
    async connect() {
        if (this.client)
            return;
        const url = this.buildUrl();
        this.client = new Client({
            url,
            timeout: this.config.timeout || 10000,
            connectTimeout: this.config.timeout || 10000,
        });
        if (this.config.useTls) {
            await this.client.startTLS();
        }
        if (this.config.username && this.config.password) {
            await this.client.bind(this.config.username, this.config.password);
        }
    }
    getClient() {
        if (!this.client) {
            throw new Error('LDAP connection not established. Call connect() first.');
        }
        return this.client;
    }
    async disconnect() {
        if (this.client) {
            await this.client.unbind();
            this.client = null;
        }
    }
    buildUrl() {
        const protocol = this.config.useSsl ? 'ldaps' : 'ldap';
        const host = this.config.hosts[0]; // Simple implementation: use first host
        const port = this.config.port || (this.config.useSsl ? 636 : 389);
        return `${protocol}://${host}:${port}`;
    }
    getBaseDn() {
        return this.config.baseDn;
    }
}
//# sourceMappingURL=LdapConnection.js.map
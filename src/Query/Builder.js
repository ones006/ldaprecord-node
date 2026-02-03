import { LdapConnection } from '../Connection/LdapConnection.js';
import {} from 'ldapts';
export class Builder {
    connection;
    baseDn;
    filters = [];
    selectedAttributes = ['*'];
    limitCount = 0;
    constructor(connection) {
        this.connection = connection;
        this.baseDn = connection.getBaseDn() || '';
    }
    where(attribute, operator, value) {
        let filter = '';
        switch (operator) {
            case '=':
                filter = `(${attribute}=${this.escape(value)})`;
                break;
            case '*':
                filter = `(${attribute}=*${this.escape(value)}*)`;
                break;
            case 'startsWith':
                filter = `(${attribute}=${this.escape(value)}*)`;
                break;
            case 'endsWith':
                filter = `(${attribute}=*${this.escape(value)})`;
                break;
            default:
                filter = `(${attribute}${operator}${this.escape(value)})`;
        }
        this.filters.push(filter);
        return this;
    }
    select(attributes) {
        this.selectedAttributes = attributes;
        return this;
    }
    limit(count) {
        this.limitCount = count;
        return this;
    }
    async get() {
        await this.connection.connect();
        const client = this.connection.getClient();
        const filter = this.buildFilter();
        const options = {
            scope: 'sub',
            filter: filter,
            attributes: this.selectedAttributes,
            sizeLimit: this.limitCount,
        };
        const { searchEntries } = await client.search(this.baseDn, options);
        return searchEntries;
    }
    /**
     * Get the first result of the query.
     */
    async first() {
        this.limit(1);
        const results = await this.get();
        return results.length > 0 ? results[0] : null;
    }
    buildFilter() {
        if (this.filters.length === 0)
            return '(objectClass=*)';
        if (this.filters.length === 1)
            return this.filters[0];
        return `(&${this.filters.join('')})`;
    }
    escape(value) {
        return value.replace(/\\/g, '\\5c')
            .replace(/\*/g, '\\2a')
            .replace(/\(/g, '\\28')
            .replace(/\)/g, '\\29')
            .replace(/\0/g, '\\00');
    }
}
//# sourceMappingURL=Builder.js.map
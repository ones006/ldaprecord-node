import { LdapConnection } from '../Connection/LdapConnection.js';
import { Builder } from '../Query/Builder.js';
import { Change, Attribute } from 'ldapts';
import util from 'util';
export class Model {
    static connection = null;
    attributes = {};
    original = {};
    exists = false;
    dn = '';
    static setConnection(connection) {
        this.connection = connection;
    }
    static getConnection() {
        return this.connection;
    }
    static query() {
        const connection = this.getConnection();
        if (!connection) {
            throw new Error(`Connection not set for model ${this.name}. Use Model.setConnection().`);
        }
        const builder = new Builder(connection);
        // Apply default object classes if defined in child class
        const objectClasses = this.objectClasses;
        if (objectClasses && Array.isArray(objectClasses)) {
            objectClasses.forEach(cls => builder.where('objectClass', '=', cls));
        }
        return builder;
    }
    constructor(attributes = {}, exists = false) {
        this.attributes = { ...attributes };
        this.original = { ...attributes };
        this.exists = exists;
        if (attributes.dn) {
            this.dn = attributes.dn;
        }
    }
    getAttributes() {
        return this.attributes;
    }
    getAttribute(key) {
        return this.attributes[key];
    }
    setAttribute(key, value) {
        this.attributes[key] = value;
        return this;
    }
    getDn() {
        return this.dn;
    }
    setDn(dn) {
        this.dn = dn;
        return this;
    }
    /**
     * Get the attributes that have been modified.
     */
    getDirty() {
        const dirty = {};
        for (const [key, value] of Object.entries(this.attributes)) {
            if (JSON.stringify(value) !== JSON.stringify(this.original[key])) {
                dirty[key] = value;
            }
        }
        return dirty;
    }
    /**
     * Save the LDAP model (Create or Update).
     */
    async save() {
        const constructor = this.constructor;
        const connection = constructor.getConnection();
        if (!connection) {
            throw new Error(`Connection not set for model ${constructor.name}.`);
        }
        const client = connection.getClient();
        try {
            if (this.exists) {
                // Update existing record: only send DIRTY attributes
                const dirty = this.getDirty();
                const changes = [];
                for (const [key, value] of Object.entries(dirty)) {
                    if (key === 'dn' || key === 'objectClass')
                        continue;
                    const normalized = this.normalizeValue(value);
                    const values = Array.isArray(normalized) ? normalized : [normalized];
                    changes.push(new Change({
                        operation: 'replace',
                        modification: new Attribute({
                            type: key,
                            values: values
                        })
                    }));
                }
                if (changes.length > 0) {
                    await client.modify(this.dn, changes);
                }
            }
            else {
                // Create new record
                if (!this.dn) {
                    throw new Error('DN must be set to create a new record.');
                }
                const createAttributes = [];
                for (const [key, value] of Object.entries(this.attributes)) {
                    if (key === 'dn')
                        continue;
                    const normalized = this.normalizeValue(value);
                    const values = Array.isArray(normalized) ? normalized : [normalized];
                    createAttributes.push(new Attribute({
                        type: key,
                        values: values
                    }));
                }
                await client.add(this.dn, createAttributes);
                this.exists = true;
            }
            // Sync original with updated attributes
            this.original = { ...this.attributes };
        }
        catch (error) {
            console.error('[LDAP ERROR DETAILS]');
            console.error(util.inspect(error, { showHidden: false, depth: null, colors: true }));
            throw error;
        }
    }
    /**
     * Delete the LDAP model.
     */
    async delete() {
        const constructor = this.constructor;
        const connection = constructor.getConnection();
        if (!connection) {
            throw new Error(`Connection not set for model ${constructor.name}.`);
        }
        if (!this.exists || !this.dn) {
            throw new Error('Cannot delete a model that does not exist or have a DN.');
        }
        const client = connection.getClient();
        try {
            await client.del(this.dn);
            this.exists = false;
        }
        catch (error) {
            console.error('[LDAP ERROR] Delete Error:', error.message);
            throw error;
        }
    }
    normalizeValue(value) {
        if (Array.isArray(value)) {
            return value.map(v => String(v));
        }
        return String(value);
    }
}
//# sourceMappingURL=Model.js.map
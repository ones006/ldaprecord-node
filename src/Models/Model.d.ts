import { LdapConnection } from '../Connection/LdapConnection.js';
import { Builder } from '../Query/Builder.js';
export declare abstract class Model {
    protected static connection: LdapConnection | null;
    protected attributes: Record<string, any>;
    protected original: Record<string, any>;
    protected exists: boolean;
    protected dn: string;
    static setConnection(connection: LdapConnection): void;
    static getConnection(): LdapConnection | null;
    static query(): Builder;
    constructor(attributes?: Record<string, any>, exists?: boolean);
    getAttributes(): Record<string, any>;
    getAttribute(key: string): any;
    setAttribute(key: string, value: any): this;
    getDn(): string;
    setDn(dn: string): this;
    /**
     * Get the attributes that have been modified.
     */
    getDirty(): Record<string, any>;
    /**
     * Save the LDAP model (Create or Update).
     */
    save(): Promise<void>;
    /**
     * Delete the LDAP model.
     */
    delete(): Promise<void>;
    protected normalizeValue(value: any): string | string[];
}
//# sourceMappingURL=Model.d.ts.map
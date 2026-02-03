import { Model as LdapModel } from '../Models/Model.js';
export interface SyncAttributes {
    [ldapAttribute: string]: string;
}
export interface DatabaseModel {
    [key: string]: any;
    save(): Promise<this>;
}
export declare class Synchronizer {
    protected ldapModel: LdapModel;
    protected dbModel: DatabaseModel;
    protected attributeMapping: SyncAttributes;
    constructor(ldapModel: LdapModel, dbModel: DatabaseModel, attributeMapping: SyncAttributes);
    /**
     * Synchronize LDAP attributes to the database model.
     */
    synchronize(): void;
    /**
     * Save the database model.
     */
    save(): Promise<void>;
}
//# sourceMappingURL=Synchronizer.d.ts.map
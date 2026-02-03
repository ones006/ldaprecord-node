import { Model as LdapModel } from '../Models/Model.js';
export class Synchronizer {
    ldapModel;
    dbModel;
    attributeMapping;
    constructor(ldapModel, dbModel, attributeMapping) {
        this.ldapModel = ldapModel;
        this.dbModel = dbModel;
        this.attributeMapping = attributeMapping;
    }
    /**
     * Synchronize LDAP attributes to the database model.
     */
    synchronize() {
        for (const [ldapAttr, dbCol] of Object.entries(this.attributeMapping)) {
            const value = this.ldapModel.getAttribute(ldapAttr);
            if (value !== undefined) {
                // If it's an array with one element, unwrap it (common in LDAP)
                const normalizedValue = Array.isArray(value) && value.length === 1 ? value[0] : value;
                this.dbModel[dbCol] = normalizedValue;
            }
        }
    }
    /**
     * Save the database model.
     */
    async save() {
        await this.dbModel.save();
    }
}
//# sourceMappingURL=Synchronizer.js.map
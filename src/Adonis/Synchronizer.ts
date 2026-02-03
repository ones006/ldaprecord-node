import { Model as LdapModel } from '../Models/Model.js';

export interface SyncAttributes {
  [ldapAttribute: string]: string;
}

export interface DatabaseModel {
  [key: string]: any;
  save(): Promise<this>;
}

export class Synchronizer {
  protected ldapModel: LdapModel;
  protected dbModel: DatabaseModel;
  protected attributeMapping: SyncAttributes;

  constructor(ldapModel: LdapModel, dbModel: DatabaseModel, attributeMapping: SyncAttributes) {
    this.ldapModel = ldapModel;
    this.dbModel = dbModel;
    this.attributeMapping = attributeMapping;
  }

  /**
   * Synchronize LDAP attributes to the database model.
   */
  public synchronize(): void {
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
  public async save(): Promise<void> {
    await this.dbModel.save();
  }
}

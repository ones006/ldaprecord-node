import { LdapConnection } from '../Connection/LdapConnection.js';
import { Builder } from '../Query/Builder.js';
import { Change, Attribute } from 'ldapts';
import util from 'util';

export abstract class Model {
  protected static connection: LdapConnection | null = null;
  protected attributes: Record<string, any> = {};
  protected original: Record<string, any> = {};
  protected exists: boolean = false;
  protected dn: string = '';

  public static setConnection(connection: LdapConnection): void {
    this.connection = connection;
  }

  public static getConnection(): LdapConnection | null {
    return this.connection;
  }

  public static query(): Builder {
    const connection = this.getConnection();
    if (!connection) {
      throw new Error(`Connection not set for model ${this.name}. Use Model.setConnection().`);
    }
    const builder = new Builder(connection);

    // Apply default object classes if defined in child class
    const objectClasses = (this as any).objectClasses;
    if (objectClasses && Array.isArray(objectClasses)) {
      objectClasses.forEach(cls => builder.where('objectClass', '=', cls));
    }

    return builder;
  }

  /**
   * Find a model by its Distinguished Name.
   */
  public static async find(dn: string): Promise<any | null> {
    return this.query().find(dn);
  }

  /**
   * Get all models.
   */
  public static async all(): Promise<any[]> {
    return this.query().get();
  }

  constructor(attributes: Record<string, any> = {}, exists: boolean = false) {
    this.attributes = { ...attributes };
    this.original = { ...attributes };
    this.exists = exists;
    if (attributes.dn) {
      this.dn = attributes.dn;
    }
  }

  public getAttributes(): Record<string, any> {
    return this.attributes;
  }

  public getAttribute(key: string): any {
    return this.attributes[key];
  }

  public setAttribute(key: string, value: any): this {
    this.attributes[key] = value;
    return this;
  }

  public getDn(): string {
    return this.dn;
  }

  public setDn(dn: string): this {
    this.dn = dn;
    return this;
  }

  /**
   * Get the attributes that have been modified.
   */
  public getDirty(): Record<string, any> {
    const dirty: Record<string, any> = {};
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
  public async save(): Promise<void> {
    const constructor = this.constructor as typeof Model;
    const connection = constructor.getConnection();

    if (!connection) {
      throw new Error(`Connection not set for model ${constructor.name}.`);
    }

    const client = connection.getClient();

    try {
      if (this.exists) {
        // Update existing record: only send DIRTY attributes
        const dirty = this.getDirty();
        const changes: Change[] = [];

        for (const [key, value] of Object.entries(dirty)) {
          if (key === 'dn' || key === 'objectClass') continue;

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
      } else {
        // Create new record
        if (!this.dn) {
          throw new Error('DN must be set to create a new record.');
        }

        const createAttributes: Attribute[] = [];
        for (const [key, value] of Object.entries(this.attributes)) {
          if (key === 'dn') continue;

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

    } catch (error: any) {
      console.error('[LDAP ERROR DETAILS]');
      console.error(util.inspect(error, { showHidden: false, depth: null, colors: true }));
      throw error;
    }
  }

  /**
   * Delete the LDAP model.
   */
  public async delete(): Promise<void> {
    const constructor = this.constructor as typeof Model;
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
    } catch (error: any) {
      console.error('[LDAP ERROR] Delete Error:', error.message);
      throw error;
    }
  }

  protected normalizeValue(value: any): string | string[] {
    if (Array.isArray(value)) {
      return value.map(v => String(v));
    }
    return String(value);
  }
}

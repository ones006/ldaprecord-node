import { LdapConnection } from '../Connection/LdapConnection.js';
import { type SearchOptions } from 'ldapts';

export class Builder {
  protected connection: LdapConnection;
  protected baseDn: string;
  protected filters: string[] = [];
  protected selectedAttributes: string[] = ['*'];
  protected limitCount: number = 0;

  constructor(connection: LdapConnection) {
    this.connection = connection;
    this.baseDn = connection.getBaseDn() || '';
  }

  public where(attribute: string, operator: string, value: string): this {
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

  public select(attributes: string[]): this {
    this.selectedAttributes = attributes;
    return this;
  }

  public limit(count: number): this {
    this.limitCount = count;
    return this;
  }

  public async get(): Promise<any[]> {
    await this.connection.connect();
    const client = this.connection.getClient();

    const filter = this.buildFilter();
    const options: SearchOptions = {
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
  public async first(): Promise<any | null> {
    this.limit(1);
    const results = await this.get();
    return results.length > 0 ? results[0] : null;
  }

  /**
   * Find a specific record by its Distinguished Name.
   */
  public async find(dn: string): Promise<any | null> {
    await this.connection.connect();
    const client = this.connection.getClient();

    try {
      const { searchEntries } = await client.search(dn, {
        scope: 'base',
        filter: '(objectClass=*)',
        attributes: this.selectedAttributes,
      });

      return searchEntries.length > 0 ? searchEntries[0] : null;
    } catch (e: any) {
      if (e.name === 'NoSuchObjectError') return null;
      throw e;
    }
  }

  /**
   * Get the number of records matching the query.
   */
  public async count(): Promise<number> {
    const results = await this.get();
    return results.length;
  }

  protected buildFilter(): string {
    if (this.filters.length === 0) return '(objectClass=*)';
    if (this.filters.length === 1) return this.filters[0] as string;
    return `(&${this.filters.join('')})`;
  }

  protected escape(value: string): string {
    return value.replace(/\\/g, '\\5c')
      .replace(/\*/g, '\\2a')
      .replace(/\(/g, '\\28')
      .replace(/\)/g, '\\29')
      .replace(/\0/g, '\\00');
  }
}

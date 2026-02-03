import { Client, type ClientOptions } from 'ldapts';

export interface ConnectionConfig {
  hosts: string[];
  port?: number;
  baseDn?: string;
  username?: string;
  password?: string;
  timeout?: number;
  useSsl?: boolean;
  useTls?: boolean;
}

export class LdapConnection {
  protected client: Client | null = null;
  protected config: ConnectionConfig;

  constructor(config: ConnectionConfig) {
    this.config = config;
  }

  public async connect(): Promise<void> {
    if (this.client) return;

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

  public getClient(): Client {
    if (!this.client) {
      throw new Error('LDAP connection not established. Call connect() first.');
    }
    return this.client;
  }

  public async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.unbind();
      this.client = null;
    }
  }

  protected buildUrl(): string {
    const protocol = this.config.useSsl ? 'ldaps' : 'ldap';
    const host = this.config.hosts[0]; // Simple implementation: use first host
    const port = this.config.port || (this.config.useSsl ? 636 : 389);
    return `${protocol}://${host}:${port}`;
  }

  public getBaseDn(): string | undefined {
    return this.config.baseDn;
  }
}

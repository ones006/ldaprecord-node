import { Client } from 'ldapts';
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
export declare class LdapConnection {
    protected client: Client | null;
    protected config: ConnectionConfig;
    constructor(config: ConnectionConfig);
    connect(): Promise<void>;
    getClient(): Client;
    disconnect(): Promise<void>;
    protected buildUrl(): string;
    getBaseDn(): string | undefined;
}
//# sourceMappingURL=LdapConnection.d.ts.map
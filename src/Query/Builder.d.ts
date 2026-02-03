import { LdapConnection } from '../Connection/LdapConnection.js';
export declare class Builder {
    protected connection: LdapConnection;
    protected baseDn: string;
    protected filters: string[];
    protected selectedAttributes: string[];
    protected limitCount: number;
    constructor(connection: LdapConnection);
    where(attribute: string, operator: string, value: string): this;
    select(attributes: string[]): this;
    limit(count: number): this;
    get(): Promise<any[]>;
    /**
     * Get the first result of the query.
     */
    first(): Promise<any | null>;
    protected buildFilter(): string;
    protected escape(value: string): string;
}
//# sourceMappingURL=Builder.d.ts.map
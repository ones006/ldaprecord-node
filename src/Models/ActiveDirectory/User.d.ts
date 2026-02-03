import { Model } from '../Model.js';
export declare class User extends Model {
    static objectClasses: string[];
    /**
     * Get the user's first name.
     */
    getFirstName(): string | undefined;
    /**
     * Set the user's first name.
     */
    setFirstName(value: string): this;
    /**
     * Get the user's last name.
     */
    getLastName(): string | undefined;
    /**
     * Set the user's last name.
     */
    setLastName(value: string): this;
    /**
     * Get the user's email address.
     */
    getEmail(): string | undefined;
    /**
     * Set the user's email address.
     */
    setEmail(value: string): this;
    /**
     * Get the user's display name.
     */
    getDisplayName(): string | undefined;
    /**
     * Get the user's account name (sAMAccountName).
     */
    getAccountName(): string | undefined;
    /**
     * Get the user's group memberships.
     */
    getGroups(): string[];
    /**
     * Get the user's job title.
     */
    getTitle(): string | undefined;
    /**
     * Get the user's department.
     */
    getDepartment(): string | undefined;
}
//# sourceMappingURL=User.d.ts.map
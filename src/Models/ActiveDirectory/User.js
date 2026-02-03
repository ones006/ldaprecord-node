import { Model } from '../Model.js';
import { AdAttributes } from './Attributes.js';
export class User extends Model {
    static objectClasses = ['top', 'person', 'organizationalPerson', 'user'];
    /**
     * Get the user's first name.
     */
    getFirstName() {
        return this.getAttribute(AdAttributes.FIRST_NAME);
    }
    /**
     * Set the user's first name.
     */
    setFirstName(value) {
        return this.setAttribute(AdAttributes.FIRST_NAME, value);
    }
    /**
     * Get the user's last name.
     */
    getLastName() {
        return this.getAttribute(AdAttributes.LAST_NAME);
    }
    /**
     * Set the user's last name.
     */
    setLastName(value) {
        return this.setAttribute(AdAttributes.LAST_NAME, value);
    }
    /**
     * Get the user's email address.
     */
    getEmail() {
        return this.getAttribute(AdAttributes.MAIL);
    }
    /**
     * Set the user's email address.
     */
    setEmail(value) {
        return this.setAttribute(AdAttributes.MAIL, value);
    }
    /**
     * Get the user's display name.
     */
    getDisplayName() {
        return this.getAttribute(AdAttributes.DISPLAY_NAME);
    }
    /**
     * Get the user's account name (sAMAccountName).
     */
    getAccountName() {
        return this.getAttribute(AdAttributes.SAM_ACCOUNT_NAME);
    }
    /**
     * Get the user's group memberships.
     */
    getGroups() {
        const groups = this.getAttribute(AdAttributes.MEMBER_OF);
        if (!groups)
            return [];
        return Array.isArray(groups) ? groups : [groups];
    }
    /**
     * Get the user's job title.
     */
    getTitle() {
        return this.getAttribute(AdAttributes.TITLE);
    }
    /**
     * Get the user's department.
     */
    getDepartment() {
        return this.getAttribute(AdAttributes.DEPARTMENT);
    }
}
//# sourceMappingURL=User.js.map
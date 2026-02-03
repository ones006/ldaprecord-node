import { Model } from '../Model.js';
import { AdAttributes } from './Attributes.js';

export class User extends Model {
  public static objectClasses: string[] = ['top', 'person', 'organizationalPerson', 'user'];

  /**
   * Get the user's first name.
   */
  public getFirstName(): string | undefined {
    return this.getAttribute(AdAttributes.FIRST_NAME);
  }

  /**
   * Set the user's first name.
   */
  public setFirstName(value: string): this {
    return this.setAttribute(AdAttributes.FIRST_NAME, value);
  }

  /**
   * Get the user's last name.
   */
  public getLastName(): string | undefined {
    return this.getAttribute(AdAttributes.LAST_NAME);
  }

  /**
   * Set the user's last name.
   */
  public setLastName(value: string): this {
    return this.setAttribute(AdAttributes.LAST_NAME, value);
  }

  /**
   * Get the user's email address.
   */
  public getEmail(): string | undefined {
    return this.getAttribute(AdAttributes.MAIL);
  }

  /**
   * Set the user's email address.
   */
  public setEmail(value: string): this {
    return this.setAttribute(AdAttributes.MAIL, value);
  }

  /**
   * Get the user's display name.
   */
  public getDisplayName(): string | undefined {
    return this.getAttribute(AdAttributes.DISPLAY_NAME);
  }

  /**
   * Get the user's account name (sAMAccountName).
   */
  public getAccountName(): string | undefined {
    return this.getAttribute(AdAttributes.SAM_ACCOUNT_NAME);
  }

  /**
   * Get the user's group memberships.
   */
  public getGroups(): string[] {
    const groups = this.getAttribute(AdAttributes.MEMBER_OF);
    if (!groups) return [];
    return Array.isArray(groups) ? groups : [groups];
  }

  /**
   * Get the user's job title.
   */
  public getTitle(): string | undefined {
    return this.getAttribute(AdAttributes.TITLE);
  }

  /**
   * Get the user's department.
   */
  public getDepartment(): string | undefined {
    return this.getAttribute(AdAttributes.DEPARTMENT);
  }
}

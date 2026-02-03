/**
 * Common Active Directory LDAP attribute names.
 * Reference: https://documentation.sailpoint.com/connectors/active_directory/help/integrating_active_directory/ldap_names.html
 */
export const AdAttributes = {
  // Basic Info
  FIRST_NAME: 'givenName',
  MIDDLE_NAME: 'initials',
  LAST_NAME: 'sn',
  DISPLAY_NAME: 'displayName',
  COMMON_NAME: 'cn',
  NAME: 'name',
  DESCRIPTION: 'description',

  // Account
  USER_PRINCIPAL_NAME: 'userPrincipalName',
  SAM_ACCOUNT_NAME: 'sAMAccountName',
  MAIL: 'mail',
  OBJECT_GUID: 'objectGUID',
  OBJECT_SID: 'objectSid',
  DISTINGUISHED_NAME: 'distinguishedName',
  OBJECT_CLASS: 'objectClass',

  // Organizational
  TITLE: 'title',
  DEPARTMENT: 'department',
  COMPANY: 'company',
  MANAGER: 'manager',
  OFFICE: 'physicalDeliveryOfficeName',

  // Contact
  TELEPHONE: 'telephoneNumber',
  MOBILE: 'mobile',
  HOME_PHONE: 'homePhone',
  STREET: 'streetAddress',
  CITY: 'l',
  STATE: 'st',
  POSTAL_CODE: 'postalCode',
  COUNTRY: 'co',

  // Groups & Membership
  MEMBER_OF: 'memberOf',
  PRIMARY_GROUP_ID: 'primaryGroupID',

  // System/Status
  USER_ACCOUNT_CONTROL: 'userAccountControl',
  ACCOUNT_EXPIRES: 'accountExpires',
  BAD_PWD_COUNT: 'badPwdCount',
  BAD_PASSWORD_TIME: 'badPasswordTime',
  LAST_LOGON: 'lastLogon',
  LAST_LOGOFF: 'lastLogoff',
  PWD_LAST_SET: 'pwdLastSet',
  WHEN_CREATED: 'whenCreated',
  WHEN_CHANGED: 'whenChanged',
} as const;

export type AdAttribute = typeof AdAttributes[keyof typeof AdAttributes];

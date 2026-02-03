/**
 * Common Active Directory LDAP attribute names.
 * Reference: https://documentation.sailpoint.com/connectors/active_directory/help/integrating_active_directory/ldap_names.html
 */
export declare const AdAttributes: {
    readonly FIRST_NAME: "givenName";
    readonly MIDDLE_NAME: "initials";
    readonly LAST_NAME: "sn";
    readonly DISPLAY_NAME: "displayName";
    readonly COMMON_NAME: "cn";
    readonly NAME: "name";
    readonly DESCRIPTION: "description";
    readonly USER_PRINCIPAL_NAME: "userPrincipalName";
    readonly SAM_ACCOUNT_NAME: "sAMAccountName";
    readonly MAIL: "mail";
    readonly OBJECT_GUID: "objectGUID";
    readonly OBJECT_SID: "objectSid";
    readonly DISTINGUISHED_NAME: "distinguishedName";
    readonly OBJECT_CLASS: "objectClass";
    readonly TITLE: "title";
    readonly DEPARTMENT: "department";
    readonly COMPANY: "company";
    readonly MANAGER: "manager";
    readonly OFFICE: "physicalDeliveryOfficeName";
    readonly TELEPHONE: "telephoneNumber";
    readonly MOBILE: "mobile";
    readonly HOME_PHONE: "homePhone";
    readonly STREET: "streetAddress";
    readonly CITY: "l";
    readonly STATE: "st";
    readonly POSTAL_CODE: "postalCode";
    readonly COUNTRY: "co";
    readonly MEMBER_OF: "memberOf";
    readonly PRIMARY_GROUP_ID: "primaryGroupID";
    readonly USER_ACCOUNT_CONTROL: "userAccountControl";
    readonly ACCOUNT_EXPIRES: "accountExpires";
    readonly BAD_PWD_COUNT: "badPwdCount";
    readonly BAD_PASSWORD_TIME: "badPasswordTime";
    readonly LAST_LOGON: "lastLogon";
    readonly LAST_LOGOFF: "lastLogoff";
    readonly PWD_LAST_SET: "pwdLastSet";
    readonly WHEN_CREATED: "whenCreated";
    readonly WHEN_CHANGED: "whenChanged";
};
export type AdAttribute = typeof AdAttributes[keyof typeof AdAttributes];
//# sourceMappingURL=Attributes.d.ts.map
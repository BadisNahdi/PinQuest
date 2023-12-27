import { RolesBuilder } from 'nest-access-control';
export declare enum UserRoles {
    Admin = "Admin",
    Reader = "Reader"
}
export declare const roles: RolesBuilder;

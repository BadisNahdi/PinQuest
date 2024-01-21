import { RolesBuilder } from 'nest-access-control';

export enum UserRoles {
  Admin = 'Admin',
  Reader = 'Reader',
}

export const roles: RolesBuilder = new RolesBuilder();

roles
  .grant(UserRoles.Reader)
  .readAny(['posts'])
  .createAny(['posts'])
  .deleteOwn(['posts'])
  .grant(UserRoles.Admin)
  .extend(UserRoles.Reader)
  .readAny(['posts'])
  .updateAny(['posts'])
  .createAny(['posts'])
  .deleteAny(['posts']);
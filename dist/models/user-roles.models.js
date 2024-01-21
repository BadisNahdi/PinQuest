"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roles = exports.UserRoles = void 0;
const nest_access_control_1 = require("nest-access-control");
var UserRoles;
(function (UserRoles) {
    UserRoles["Admin"] = "Admin";
    UserRoles["Reader"] = "Reader";
})(UserRoles || (exports.UserRoles = UserRoles = {}));
exports.roles = new nest_access_control_1.RolesBuilder();
exports.roles
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
//# sourceMappingURL=user-roles.models.js.map
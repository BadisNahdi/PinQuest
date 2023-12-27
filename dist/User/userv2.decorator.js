"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User_ = void 0;
const common_1 = require("@nestjs/common");
exports.User_ = (0, common_1.createParamDecorator)((data, req) => {
    return req.user;
});
//# sourceMappingURL=userv2.decorator.js.map
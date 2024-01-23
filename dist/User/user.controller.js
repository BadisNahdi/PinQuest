"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const current_user_guard_1 = require("./current-user.guard");
const common_1 = require("@nestjs/common");
const create_user_dto_1 = require("./dto/create-user.dto");
const user_service_1 = require("./user.service");
const user_entity_1 = require("./entities/user.entity");
const user_decorator_1 = require("./user.decorator");
const passport_1 = require("@nestjs/passport");
const nest_access_control_1 = require("nest-access-control");
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    async loginUser(loginDto, res) {
        const { token, user } = await this.userService.login(loginDto);
        res.cookie('IsAuthenticated', true, { maxAge: 2 * 60 * 60 * 1000 });
        res.cookie('Authentication', token, {
            httpOnly: true,
            maxAge: 2 * 60 * 60 * 1000,
        });
        return res.send({ success: true, user });
    }
    registerUser(body) {
        return this.userService.register(body);
    }
    logout(req, res) {
        res.clearCookie('Authentication');
        return res.status(200).send({ success: true });
    }
    authStatus(user) {
        return { status: !!user, user };
    }
    async forgotPassword(email) {
        await this.userService.sendPasswordResetEmail(email);
    }
    async renderResetPasswordForm(token) {
        try {
            const isValidToken = await this.userService.validateResetToken(token);
            if (!isValidToken) {
                throw new common_1.BadRequestException('Invalid or expired reset token 2');
            }
            return 'Render your password reset form here';
        }
        catch (error) {
            throw new common_1.BadRequestException('Invalid or expired reset token 3');
        }
    }
    async resetPassword(token, { newPassword }) {
        try {
            await this.userService.resetPassword(token, newPassword);
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to reset password');
        }
    }
    async blockUser(userId, req) {
        await this.userService.blockUser(req.user.id, userId);
        return 'User blocked successfully';
    }
    async unblockUser(userId, req) {
        await this.userService.unblockUser(req.user.id, userId);
        return 'User unblocked successfully';
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "loginUser", null);
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "registerUser", null);
__decorate([
    (0, common_1.Post)('logout'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "logout", null);
__decorate([
    (0, common_1.Get)('authstatus'),
    (0, common_1.UseGuards)(current_user_guard_1.ApplyUser),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "authStatus", null);
__decorate([
    (0, common_1.Post)('forgot-password'),
    __param(0, (0, common_1.Body)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.Get)('reset-password/:token'),
    __param(0, (0, common_1.Param)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "renderResetPasswordForm", null);
__decorate([
    (0, common_1.Post)('reset-password/:token'),
    __param(0, (0, common_1.Param)('token')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.Post)('block/:userId'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), nest_access_control_1.ACGuard),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "blockUser", null);
__decorate([
    (0, common_1.Post)('unblock/:userId'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), nest_access_control_1.ACGuard),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "unblockUser", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map
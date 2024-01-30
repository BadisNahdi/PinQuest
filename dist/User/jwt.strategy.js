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
exports.JwtStrategy = void 0;
const passport_1 = require("@nestjs/passport");
const passport_jwt_1 = require("passport-jwt");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("./entities/user.entity");
const typeorm_2 = require("typeorm");
const common_1 = require("@nestjs/common");
const jsonwebtoken_1 = require("jsonwebtoken");
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    constructor(repo) {
        super({
            ignoreExpiration: false,
            secretOrKey: 'secretStringThatNoOneCanGuess',
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
        });
        this.repo = repo;
    }
    async validate(payload, req) {
        try {
            if (!payload || !payload.email) {
                throw new common_1.UnauthorizedException('Invalid payload or missing email.');
            }
            const user = await this.repo.findOneBy({ email: payload.email });
            if (!user) {
                throw new common_1.UnauthorizedException('User not found.');
            }
            req.user = user;
            console.log('User set in req.user:', req.user);
            return req.user;
        }
        catch (error) {
            console.error('Error validating token:', error.message);
            throw new common_1.UnauthorizedException('Invalid or expired token.');
        }
    }
    generateResetToken(email) {
        return (0, jsonwebtoken_1.sign)({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    }
    verifyResetToken(token) {
        try {
            console.log('Verifying token:', token);
            const decodedToken = (0, jsonwebtoken_1.verify)(token, process.env.JWT_SECRET);
            console.log('Decoded token:', decodedToken);
            return decodedToken;
        }
        catch (error) {
            console.error('Error verifying token:', error);
            throw new common_1.UnauthorizedException('Invalid or expired reset token');
        }
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = __decorate([
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], JwtStrategy);
//# sourceMappingURL=jwt.strategy.js.map
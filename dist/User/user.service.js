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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("./entities/user.entity");
const typeorm_2 = require("typeorm");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcryptjs");
const jwt_strategy_1 = require("./jwt.strategy");
const nodemailer = require("nodemailer");
let UserService = class UserService {
    constructor(jwtStrategy, repo, jwt) {
        this.jwtStrategy = jwtStrategy;
        this.repo = repo;
        this.jwt = jwt;
    }
    async login(loginDto) {
        const user = await this.repo
            .createQueryBuilder('user')
            .addSelect('user.password')
            .where('user.email = :email', { email: loginDto.email })
            .getOne();
        if (!user) {
            throw new common_1.UnauthorizedException('Bad credentials');
        }
        else {
            if (await this.verifyPassword(loginDto.password, user.password)) {
                const token = await this.jwt.signAsync({
                    email: user.email,
                    id: user.id,
                });
                delete user.password;
                return { token, user };
            }
            else {
                throw new common_1.UnauthorizedException('Bad credentials');
            }
        }
    }
    async register(createUserDto) {
        const { firstname, lastname, email, password, profilePic } = createUserDto;
        const checkUser = await this.repo.findOne({ where: { email } });
        if (checkUser) {
            throw new common_1.BadRequestException('Please enter different email');
        }
        else {
            const user = new user_entity_1.User();
            user.firstname = firstname;
            user.lastname = lastname;
            user.email = email;
            user.password = password;
            user.profilePic = profilePic;
            this.repo.create(user);
            await this.repo.save(user);
            delete user.password;
            return user;
        }
    }
    async verifyPassword(password, userHash) {
        return await bcrypt.compare(password, userHash);
    }
    async getOneUser(id) {
        return await this.repo.findOneBy({ id });
    }
    async sendPasswordResetEmail(email) {
        const user = await this.repo.findOne({ where: { email } });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const resetToken = this.jwtStrategy.generateResetToken(email);
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.USER,
                pass: process.env.APP_PASSWORD,
            },
        });
        const resetLink = `http://127.0.0.1:5000/api/auth/reset-password?token=${resetToken}`;
        const mailOptions = {
            from: 'nesttest720@gmail.com',
            to: user.email,
            subject: 'Password Reset',
            text: `Click the following link to reset your password: ${resetLink}`,
        };
        try {
            await transporter.sendMail(mailOptions);
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to send password reset email');
        }
    }
    async resetPassword(resetToken, newPassword) {
        try {
            const decodedToken = this.jwtStrategy.verifyResetToken(resetToken);
            if (!decodedToken || decodedToken.exp < Date.now() / 1000) {
                throw new common_1.UnauthorizedException('Invalid or expired reset token');
            }
            const user = await this.repo.findOne({
                where: { email: decodedToken.email },
            });
            if (!user) {
                throw new common_1.NotFoundException('User not found');
            }
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedPassword;
            await this.repo.save(user);
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to reset password');
        }
    }
    async check(token) {
        try {
            const decodedToken = await this.jwtStrategy.verifyResetToken(token);
            console.log(decodedToken);
            return decodedToken;
        }
        catch (error) {
            console.error(error);
            return null;
        }
    }
    async validateResetToken(token) {
        try {
            const decodedToken = this.jwtStrategy.verifyResetToken(token);
            console.log(decodedToken);
            return !!decodedToken && decodedToken.exp >= Date.now() / 1000;
        }
        catch (error) {
            return false;
        }
    }
    async blockUser(userId, blockedUserId) {
        const user = await this.repo.findOneBy({ id: userId });
        if (!user) {
            throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
        }
        if (userId === blockedUserId) {
            throw new common_1.HttpException('Cannot block yourself', common_1.HttpStatus.BAD_REQUEST);
        }
        if (user.blockList && user.blockList.includes(blockedUserId)) {
            throw new common_1.HttpException('User is already blocked', common_1.HttpStatus.BAD_REQUEST);
        }
        const blockedUser = await this.repo.findOneBy({ id: blockedUserId });
        if (!blockedUser) {
            throw new common_1.HttpException('Blocked user not found', common_1.HttpStatus.NOT_FOUND);
        }
        user.blockList = user.blockList || [];
        user.blockList.push(blockedUserId);
        await this.repo.save(user);
    }
    async unblockUser(userId, unblockedUserId) {
        const user = await this.repo.findOneBy({ id: userId });
        if (!user) {
            throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
        }
        if (!user.blockList || !user.blockList.includes(unblockedUserId)) {
            throw new common_1.HttpException('User is not blocked', common_1.HttpStatus.BAD_REQUEST);
        }
        const unblockedUser = await this.repo.findOneBy({ id: userId });
        if (!unblockedUser) {
            throw new common_1.HttpException('Unblocked user not found', common_1.HttpStatus.NOT_FOUND);
        }
        user.blockList = user.blockList.filter((id) => id !== unblockedUserId);
        await this.repo.save(user);
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [jwt_strategy_1.JwtStrategy,
        typeorm_2.Repository,
        jwt_1.JwtService])
], UserService);
//# sourceMappingURL=user.service.js.map
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user.dto';
import { UserLoginDto } from './dto/userLogin.dto';
import { JwtStrategy } from './jwt.strategy';
export declare class UserService {
    private readonly jwtStrategy;
    private readonly repo;
    private jwt;
    constructor(jwtStrategy: JwtStrategy, repo: Repository<User>, jwt: JwtService);
    login(loginDto: UserLoginDto): Promise<{
        token: string;
        user: User;
    }>;
    register(createUserDto: CreateUserDto): Promise<User>;
    verifyPassword(password: string, userHash: string): Promise<boolean>;
    getOneUser(id: number): Promise<User>;
    sendPasswordResetEmail(email: string): Promise<void>;
    resetPassword(resetToken: string, newPassword: string): Promise<void>;
    check(token: string): Promise<any>;
    validateResetToken(token: string): Promise<boolean>;
    blockUser(userId: number, blockedUserId: number): Promise<void>;
    unblockUser(userId: number, unblockedUserId: number): Promise<void>;
}

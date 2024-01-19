import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user.dto';
import { UserLoginDto } from './dto/userLogin.dto';
export declare class UserService {
    private readonly repo;
    private jwt;
    constructor(repo: Repository<User>, jwt: JwtService);
    login(loginDto: UserLoginDto): Promise<{
        token: string;
        user: User;
    }>;
    register(createUserDto: CreateUserDto): Promise<User>;
    verifyPassword(password: string, userHash: string): Promise<any>;
    getOneUser(id: number): Promise<User>;
}

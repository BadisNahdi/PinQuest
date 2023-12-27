import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { Request, Response } from 'express';
import { User } from './entities/user.entity';
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    loginUser(loginDto: any, res: Response): Promise<Response<any, Record<string, any>>>;
    registerUser(body: CreateUserDto): Promise<User>;
    logout(req: Request, res: Response): Response<any, Record<string, any>>;
    authStatus(user: User): {
        status: boolean;
        user: User;
    };
}

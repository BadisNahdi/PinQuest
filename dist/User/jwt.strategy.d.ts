import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Request } from 'express';
declare const JwtStrategy_base: new (...args: any[]) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly repo;
    constructor(repo: Repository<User>);
    validate(payload: any, req: Request): Promise<any>;
}
export {};

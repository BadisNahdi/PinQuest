import { Post } from '../../post/entities/post.entity';
import { UserRoles } from '../../models/user-roles.models';
export declare class User {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    profilePic: string;
    roles: UserRoles;
    posts: Post[];
    resetToken: string;
    hashPass(): void;
}

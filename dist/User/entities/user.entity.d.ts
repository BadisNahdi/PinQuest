import { Post } from '../../post/entities/post.entity';
import { Comment } from '../../comment/entities/comment.entity';
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
    comments: Comment[];
    hashPass(): void;
    resetToken: string;
    blockList: number[];
}

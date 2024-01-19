import { User } from '../../user/entities/user.entity';
import { Post } from '../../post/entities/post.entity';
export declare class Comment {
    id: number;
    content: string;
    post: Post;
    user: User;
}

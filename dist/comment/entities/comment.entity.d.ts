import { User } from '../../user/entities/user.entity';
import { Post } from '../../post/entities/post.entity';
import { TimestampEntities } from 'src/Generics/timestamp.entities';
export declare class Comment extends TimestampEntities {
    id: number;
    content: string;
    post: Post;
    user: User;
}

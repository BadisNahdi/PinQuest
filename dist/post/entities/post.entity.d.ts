import { Category } from '../../category/entities/category.entity';
import { User } from '../../user/entities/user.entity';
import { Comment } from '../../comment/entities/comment.entity';
import { TimestampEntities } from 'src/Generics/timestamp.entities';
export declare class Post extends TimestampEntities {
    id: number;
    title: string;
    content: string;
    slug: string;
    hashtags: string[];
    categoryId: number;
    userId: number;
    category: Category;
    user: User;
    comments: Comment[];
    mainImageUrl: string;
    slugifyPost(): void;
    shareToken: string;
}

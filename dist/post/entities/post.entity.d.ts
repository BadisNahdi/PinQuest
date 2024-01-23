import { Category } from '../../category/entities/category.entity';
import { User } from '../../user/entities/user.entity';
import { Comment } from '../../comment/entities/comment.entity';
export declare class Post {
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
    createdOn: Date;
    modifiedOn: Date;
    mainImageUrl: string;
    slugifyPost(): void;
    shareToken: string;
}

import { Post } from '../../post/entities/post.entity';
export declare class Category {
    id: number;
    title: string;
    description: string;
    posts: Post[];
}

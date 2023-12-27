import { Category } from './../../category/entities/category.entity';
export declare class CreatePostDto {
    title: string;
    content: string;
    categoryId: number;
    mainImageUrl: string;
    category: Category;
}

import { Post } from '../../post/entities/post.entity';
export declare class UserResponseDto {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    posts: Post[];
}

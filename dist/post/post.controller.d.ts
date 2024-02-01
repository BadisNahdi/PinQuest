/// <reference types="multer" />
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
export declare class PostController {
    private readonly postService;
    constructor(postService: PostService);
    create(createPostDto: CreatePostDto, user: any): Promise<import("./entities/post.entity").Post>;
    uploadPhoto(file: Express.Multer.File): {
        filePath: string;
    } | {
        error: string;
    };
    serveAvatar(fileId: any, res: any): Promise<any>;
    findAll(query: any): Promise<import("./entities/post.entity").Post[]>;
    findOne(id: string): Promise<import("./entities/post.entity").Post>;
    findBySlug(slug: string): Promise<import("./entities/post.entity").Post>;
    update(slug: string, updatePostDto: UpdatePostDto): Promise<import("./entities/post.entity").Post>;
    remove(id: string): Promise<{
        success: boolean;
        post: import("./entities/post.entity").Post;
    }>;
}

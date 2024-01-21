/// <reference types="multer" />
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Request } from 'express';
import { UserService } from 'src/user/user.service';
export declare class PostController {
    private readonly postService;
    private readonly userService;
    constructor(postService: PostService, userService: UserService);
    create(createPostDto: CreatePostDto, req: Request): Promise<import("./entities/post.entity").Post>;
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
    deletePost(postId: number, req: Request): Promise<void>;
    getPostByShareToken(shareToken: string): Promise<import("./entities/post.entity").Post>;
    getPostsForUser(userId: number, viewerId?: number): Promise<import("./entities/post.entity").Post[]>;
}

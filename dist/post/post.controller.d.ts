/// <reference types="multer" />
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post as PostEntity } from './entities/post.entity';
export declare class PostController {
    private readonly postService;
    constructor(postService: PostService);
    create(createPostDto: CreatePostDto, user: any): Promise<PostEntity>;
    searchPosts(hashtags: string, title: string): Promise<PostEntity[]>;
    uploadPhoto(file: Express.Multer.File): {
        filePath: string;
    } | {
        error: string;
    };
    serveAvatar(fileId: any, res: any): Promise<any>;
    findAll(query: any): Promise<PostEntity[]>;
    findOne(id: string): Promise<PostEntity>;
    findBySlug(slug: string): Promise<PostEntity>;
    update(slug: string, updatePostDto: UpdatePostDto): Promise<PostEntity>;
    remove(id: string): Promise<{
        success: boolean;
        post: PostEntity;
    }>;
}

import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { User } from '../User/entities/user.entity';
import { CategoryService } from '../category/category.service';
export declare class PostService {
    private readonly repo;
    private catService;
    constructor(repo: Repository<Post>, catService: CategoryService);
    create(createPostDto: CreatePostDto, user: User): Promise<Post>;
    findAll(query?: string): Promise<Post[]>;
    findOne(id: number): Promise<Post>;
    findBySlug(slug: string): Promise<Post>;
    update(slug: string, updatePostDto: UpdatePostDto): Promise<Post>;
    remove(id: number): Promise<{
        success: boolean;
        post: Post;
    }>;
    searchPosts(hashtags: string[], title: string): Promise<Post[]>;
}

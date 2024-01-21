import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { User } from '../User/entities/user.entity';
import { CategoryService } from '../category/category.service';
export declare class PostService {
    private readonly repo;
    private catService;
    private readonly userRepo;
    constructor(repo: Repository<Post>, catService: CategoryService, userRepo: Repository<User>);
    create(createPostDto: CreatePostDto, user: User): Promise<Post>;
    getPostByShareToken(shareToken: string): Promise<Post>;
    findAll(query?: string): Promise<Post[]>;
    findOne(id: number): Promise<Post>;
    findBySlug(slug: string): Promise<Post>;
    update(slug: string, updatePostDto: UpdatePostDto): Promise<Post>;
    remove(id: number): Promise<{
        success: boolean;
        post: Post;
    }>;
    deletePost(postId: number, userId: number, userRole: string): Promise<void>;
    getPostsForUser(userId: number, viewerId?: number): Promise<Post[]>;
    private getUserBlockedUsers;
}

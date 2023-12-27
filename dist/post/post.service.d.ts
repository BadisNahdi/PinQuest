import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
export declare class PostService {
    private readonly postRepository;
    constructor(postRepository: Repository<Post>);
    create(createPostDto: CreatePostDto): Promise<CreatePostDto & Post>;
    findAll(): Promise<Post[]>;
    findOne(id: number): Promise<Post>;
    update(id: number, updatePostDto: UpdatePostDto): string;
    remove(id: number): string;
}

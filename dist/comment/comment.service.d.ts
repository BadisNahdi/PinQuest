import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { User } from '../user/entities/user.entity';
import { Post } from '../post/entities/post.entity';
export declare class CommentService {
    private readonly commentRepository;
    private readonly userRepository;
    private readonly postRepository;
    constructor(commentRepository: Repository<Comment>, userRepository: Repository<User>, postRepository: Repository<Post>);
    create(createCommentDto: CreateCommentDto): Promise<Comment>;
    update(id: number, updateCommentDto: UpdateCommentDto): Promise<Comment>;
    getCommentsByPost(postId: number): Promise<Comment[]>;
}

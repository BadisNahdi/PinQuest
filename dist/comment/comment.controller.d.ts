import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Request } from 'express';
export declare class CommentController {
    private readonly commentService;
    constructor(commentService: CommentService);
    create(req: Request, createCommentDto: CreateCommentDto): Promise<import("./entities/comment.entity").Comment>;
    getCommentsByPost(postId: number): Promise<import("./entities/comment.entity").Comment[]>;
    update(id: number, updateCommentDto: UpdateCommentDto): Promise<import("./entities/comment.entity").Comment>;
}

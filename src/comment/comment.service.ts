import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { User } from '../user/entities/user.entity';
import { Post } from '../post/entities/post.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async create(createCommentDto: CreateCommentDto): Promise<Comment> {
    const user = await this.userRepository.findOneBy({
      id: createCommentDto.userId,
    });
    if (!user) {
      throw new NotFoundException(
        `User with ID ${createCommentDto.userId} not found`,
      );
    }

    const post = await this.postRepository.findOneBy({
      id: createCommentDto.postId,
    });
    if (!post) {
      throw new NotFoundException(
        `Post with ID ${createCommentDto.postId} not found`,
      );
    }

    const comment = this.commentRepository.create({
      content: createCommentDto.content,
      user: user,
      post: post,
    });
    console.log(createCommentDto.content);

    return await this.commentRepository.save(comment);
  }

  async update(
    id: number,
    updateCommentDto: UpdateCommentDto,
  ): Promise<Comment> {
    const comment = await this.commentRepository.findOneBy({ id });
    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }
    console.log(updateCommentDto.content);
    comment.content = updateCommentDto.content;
    return await this.commentRepository.save(comment);
  }

  async getCommentsByPost(postId: number) {
    return await this.commentRepository.find({
      where: {
        post: {
          id: postId,
        },
      },
    });
  }
}

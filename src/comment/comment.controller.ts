import {
  Controller,
  Post,
  Patch,
  Param,
  Body,
  NotFoundException,
  BadRequestException,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { ACGuard } from 'nest-access-control';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}
  @Post()
  @UseGuards(AuthGuard('jwt'), ACGuard)
  async create(
    @Req() req: Request,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    try {
      return await this.commentService.create(createCommentDto, req.user.id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      console.log(req.user)
      throw new BadRequestException('Invalid data');
    }
  }

  @Get('/:postId')
  async getCommentsByPost(@Param() postId: number) {
    return await this.commentService.getCommentsByPost(postId);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    try {
      return await this.commentService.update(id, updateCommentDto);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw new BadRequestException('Invalid data');
    }
  }
}

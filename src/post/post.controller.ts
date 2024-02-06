import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Res,
  NotFoundException,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AuthGuard } from '@nestjs/passport';
import { ACGuard, UseRoles } from 'nest-access-control';
import { FileInterceptor } from '@nestjs/platform-express';
import multer, { diskStorage } from 'multer';
import { UserRoles } from 'src/models/user-roles.models';
import { Roles } from 'src/user/user.roles.decorator';
import { Post as PostEntity } from './entities/post.entity';
import { RolesGuard } from 'src/user/user.roles.guard';
import { CurrentUser } from 'src/user/user.decorator';
import { Request } from 'express';

@Controller('posts')
@UseInterceptors(ClassSerializerInterceptor)
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), ACGuard)
  create(
    @Body() createPostDto: CreatePostDto,
    @CurrentUser() user,
  ): Promise<PostEntity> {
    console.log(user);
    return this.postService.create(createPostDto, user);
  }

  @Get('search')
  async searchPosts(
    @Query('hashtags') hashtags: string,
    @Query('title') title: string,
  ): Promise<PostEntity[]> {
    const hashtagArray = hashtags ? hashtags.split(',') : [];
    return this.postService.searchPosts(hashtagArray, title);
  }

  @Post('upload-photo')
  @UseInterceptors(
    FileInterceptor('picture', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const name = file.originalname.split('.')[0];
          const fileExtension = file.originalname.split('.')[1];
          const newFilename =
            name.split(' ').join('_') + '_' + Date.now() + '.' + fileExtension;
          cb(null, newFilename);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
          return callback(null, false);
        }
        callback(null, true);
      },
    }),
  )
  uploadPhoto(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      return {
        error: 'File is not an image, please upload correct format',
      };
    } else {
      const response = {
        filePath: `http://localhost:5000/api/posts/pictures/${file.filename}`,
      };
      return response;
    }
  }

  @Get('pictures/:fileId')
  async serveAvatar(@Param('fileId') fileId, @Res() res): Promise<any> {
    res.sendFile(fileId, { root: './uploads' });
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), ACGuard)
  async findAll(
    @Req() req: Request,
    @Query() query: any,
  ): Promise<PostEntity[]> {
    if (req.user == undefined) {
      console.log(req.user);
      return this.postService.findAll(query);
    }
    console.log(query);
    return this.postService.findWithBlocked(req.user.id, query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(+id);
  }

  @Get('/slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.postService.findBySlug(slug);
  }

  @Patch(':slug')
  @UseGuards(AuthGuard('jwt'), ACGuard)
  @UseRoles({
    resource: 'posts',
    action: 'update',
    possession: 'any',
  })
  update(@Param('slug') slug: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(slug, updatePostDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRoles.Admin)
  remove(
    @Param('id') id: string,
  ): Promise<{ success: boolean; post: PostEntity }> {
    if (!this.postService.findOne(+id)) {
      throw new NotFoundException('Could not find the post to delete');
    }
    return this.postService.remove(+id);
  }
  @Get('share/:shareToken')
  async getPostByShareToken(@Param('shareToken') shareToken: string) {
    const post = await this.postService.getPostByShareToken(shareToken);
    return post;
  }
  @Get('user/:userId')
  @UseGuards(AuthGuard('jwt'), ACGuard)
  @UseRoles({
    resource: 'posts',
    action: 'read',
    possession: 'any',
  })
  async getPostsForUser(@Param('userId') userId: number, @Req() req: Request) {
    return this.postService.getPostsForUser(userId, req.user.id);
  }
}

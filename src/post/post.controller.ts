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
import { get } from 'http';

@Controller('posts')
@UseInterceptors(ClassSerializerInterceptor)
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get('number')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRoles.Admin)
  async postsNumber() {
    return this.postService.postsNumber();
  }

  @Get('reported-number')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRoles.Admin)
  async reportedPostsNumber() {
    return this.postService.reportedPostsNumber();
  }

  @Get('reported')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRoles.Admin)
  async getReportedPosts() {
    return this.postService.getReportedPosts();
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), ACGuard)
  create(@Body() createPostDto: CreatePostDto, @CurrentUser() user) {
    console.log(user);
    return this.postService.create(createPostDto, user);
  }

  @Get('search')
  async searchPosts(
    @Query('hashtags') hashtags: string,
    @Query('title') title: string,
  ) {
    const hashtagArray = hashtags ? hashtags.split(',') : [];
    return this.postService.searchPosts(hashtagArray, title);
  }

  @Get('report/:id')
  async reportPost(@Param('id') id: number) {
    return this.postService.reportPost(id);
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
  async findAll(@Req() req: Request, @Query() query: any) {
    if (req.user == undefined) {
      console.log(req.user);
      return this.postService.findAll(query);
    }
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
  
  @Get('delete-repot/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRoles.Admin)
  async deletereport(@Param('id') id: number) {
    return this.postService.deletereport(id);
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

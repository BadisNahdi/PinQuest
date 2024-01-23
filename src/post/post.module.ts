import { forwardRef, Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { CategoryModule } from '../category/category.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    forwardRef(() => CategoryModule),
    TypeOrmModule.forFeature([Post]),
    UserModule,
  ],
  controllers: [PostController],
  providers: [PostService],
  exports: [PostService, TypeOrmModule],
})
export class PostModule {}

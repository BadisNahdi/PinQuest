import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { User } from '../User/entities/user.entity';
import { CategoryService } from '../category/category.service';
import { UserRoles } from '../models/user-roles.models'
import * as shortid from 'shortid';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private readonly repo: Repository<Post>,
    private catService: CategoryService,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async create(createPostDto: CreatePostDto, user: User) {
    console.log(user)
    const post = new Post();
    post.userId = user.id;
    post.shareToken = shortid.generate();
    Object.assign(post, createPostDto);

    this.repo.create(post);
    return await this.repo.save(post);
  }

  async getPostByShareToken(shareToken: string): Promise<Post> {
    return this.repo.findOne({ where: { shareToken } });
  }

  async findAll(query?: string) {
    const myQuery = this.repo
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.category', 'category')
      .leftJoinAndSelect('post.user', 'user');

    // check if query is present
    if (!(Object.keys(query).length === 0) && query.constructor === Object) {
      const queryKeys = Object.keys(query); // get the keys of the query string

      // check if slug key is present
      if (queryKeys.includes('slug')) {
        myQuery.where('post.slug LIKE :slug', { slug: `%${query['slug']}%` });
      }
      // check if sort key is present, we will sort by Title field only
      if (queryKeys.includes('sort')) {
        myQuery.orderBy('post.title', query['sort'].toUpperCase());
      }

      // check if category is present, show only selected category items
      if (queryKeys.includes('category')) {
        myQuery.andWhere('category.title = :cat', { cat: query['category'] });
      }

      return await myQuery.getMany();
    } else {
      return await myQuery.getMany();
    }
  }

  async findOne(id: number) {
    try {
      const post = await this.repo.findOneOrFail({where: {id : id}});
      return post;
    } catch (err) {
      throw new BadRequestException('Post not found');
    }
  }

  async findBySlug(slug: string) {
    try {
      const post = await this.repo.findOneBy({ slug });
      return post;
    } catch (err) {
      throw new BadRequestException(`Post with slug ${slug} not found`);
    }
  }

  async update(slug: string, updatePostDto: UpdatePostDto) {
    const post = await this.repo.findOneBy({ slug });

    if (!post) {
      throw new BadRequestException('post not found');
    }

    post.modifiedOn = new Date(Date.now());
    post.category = updatePostDto.category;
    Object.assign(post, updatePostDto);
    return this.repo.save(post);
  }

  async remove(id: number) {
    const post = await this.repo.findOneBy({id});
    await this.repo.remove(post);
    return { success: true, post };
  }
  async deletePost(postId: number, userId: number, userRole: string): Promise<void> {
    const post = await this.repo.findOne({ where: { id: postId } });

    if (!post) {
      throw new NotFoundException('Blog post not found');
    }

    // Check if the user has the necessary role or owns the post
    if (userRole === UserRoles.Admin || post.userId === userId) {
      await this.repo.remove(post);
    } else {
      throw new ForbiddenException('You are not allowed to delete this post');
    }
  }
  async getPostsForUser(userId: number, viewerId?: number): Promise<Post[]> {
    const blockedUsers = viewerId ? await this.getUserBlockedUsers(viewerId) : [];
    const query = this.repo
      .createQueryBuilder('post')
      .where('post.userId = :userId', { userId });

    if (blockedUsers.length > 0) {
      query.andWhere('post.userId NOT IN (:...blockedUsers)', { blockedUsers });
    }

    return query.getMany();
  }

  private async getUserBlockedUsers(userId: number): Promise<number[]> {
    const user = await this.userRepo.findOneBy({id:userId});
    return user ? user.blockList || [] : [];
  }
}

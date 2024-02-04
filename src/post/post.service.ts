import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { User } from '../User/entities/user.entity';
import { CategoryService } from '../category/category.service';
@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private readonly repo: Repository<Post>,
    private catService: CategoryService,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async create(createPostDto: CreatePostDto, user: User) {
    const post = new Post();
    post.userId = user.id;
    Object.assign(post, createPostDto);
    this.repo.create(post);
    return await this.repo.save(post);
  }

  async findAll(query?: string) {
    const myQuery = this.repo
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.category', 'category')
      .leftJoinAndSelect('post.user', 'user');

    if (!(Object.keys(query).length === 0) && query.constructor === Object) {
      const queryKeys = Object.keys(query); // get the keys of the query string

      if (queryKeys.includes('slug')) {
        myQuery.where('post.slug LIKE :slug', { slug: `%${query['slug']}%` });
      }
      if (queryKeys.includes('sort')) {
        myQuery.orderBy('post.updatedAt', 'DESC');
      }

      if (queryKeys.includes('category')) {
        myQuery.andWhere('category.title = :cat', { cat: query['category'] });
      }

      return await myQuery.getMany();
    } else {
      return await myQuery.getMany();
    }
  }

  async findWithBlocked(userId?: number, query?: string) {
    const allPosts = await this.findAll(query);
    // console.log('posts', allPosts);
    let blockedUsers = await this.getUserBlockedUsers(userId);
    // console.log('blocked', blockedUsers);
    blockedUsers = blockedUsers.map(Number);
    const filteredPosts = allPosts.filter(
      (post) => !blockedUsers.includes(post.user.id),
    );
    // console.log(filteredPosts);
    return filteredPosts;
  }
  async findOne(id: number) {
    try {
      const post = await this.repo.findOneOrFail({ where: { id: id } });
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

    Object.assign(post, updatePostDto);
    return this.repo.save(post);
  }

  async remove(id: number) {
    const post = await this.repo.findOneBy({ id });
    await this.repo.remove(post);
    return { success: true, post };
  }

  async searchPosts(hashtags: string[], title: string): Promise<Post[]> {
    const queryBuilder = this.repo.createQueryBuilder('post');

    if (title) {
      queryBuilder.where('post.title LIKE :title', { title: `%${title}%` });
    }

    if (hashtags && hashtags.length > 0) {
      hashtags.forEach((hashtag, index) => {
        const query = `FIND_IN_SET(:hashtag${index}, post.hashtags)`;
        if (index === 0 && !title) {
          queryBuilder.where(query, { [`hashtag${index}`]: hashtag });
        } else {
          queryBuilder.orWhere(query, { [`hashtag${index}`]: hashtag });
        }
      });
    }

    return await queryBuilder.getMany();
  }

  async getPostsForUser(userId: number, viewerId?: number): Promise<Post[]> {
    const blockedUsers = viewerId
      ? await this.getUserBlockedUsers(viewerId)
      : [];
    const query = this.repo
      .createQueryBuilder('post')
      .where('post.userId = :userId', { userId });

    if (blockedUsers.length > 0) {
      query.andWhere('post.userId NOT IN (:...blockedUsers)', { blockedUsers });
    }

    return query.getMany();
  }

  async getPostByShareToken(shareToken: string): Promise<Post> {
    return this.repo.findOne({ where: { shareToken } });
  }

  private async getUserBlockedUsers(userId: number): Promise<number[]> {
    const user = await this.userRepo.findOneBy({ id: userId });
    return user ? user.blockList || [] : [];
  }
}

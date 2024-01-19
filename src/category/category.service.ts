import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Response } from 'express';
import { Post } from 'src/post/entities/post.entity';
import { In } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category) private readonly repo: Repository<Category>,
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const category = new Category();
    Object.assign(category, createCategoryDto);
    this.repo.create(category);
    return await this.repo.save(category);
  }

  async findAll() {
    return await this.repo.find();
  }

  async findOne(id: number) {
    return await this.repo.findOneBy({ id });
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.findOne(id);

    if (!category) {
      throw new BadRequestException('Category not found');
    }

    Object.assign(category, updateCategoryDto);
    return await this.repo.save(category);
  }

  async remove(id: number, res: Response) {
    const category = await this.findOne(id);

    if (!category) {
      throw new BadRequestException('Category not found');
    }

    try {
      await this.repo.remove(category);
      return res.status(200).json({ success: true, category: category });
    } catch (err) {
      throw new BadRequestException('Operation failed');
    }
  }
  async findPostsByCategories(categoryIds: number[]): Promise<Post[]> {
    const categories = await this.repo.find({
      where: { id: In(categoryIds) },
      relations: ['posts'],
    });

    let posts = [];
    categories.forEach((category) => {
      posts = posts.concat(category.posts);
    });

    return posts;
  }
}

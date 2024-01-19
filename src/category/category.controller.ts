import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Req() req, @Body() createCategoryDto: CreateCategoryDto) {
    if (!req.cookies['Authentication']) {
      throw new UnauthorizedException('No authorization token provided');
    }
    const token = req.cookies['Authentication'].split(' ');
    if (!token) {
      throw new UnauthorizedException('Invalid authorization token format');
    }
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: string, @Res() res: Response) {
    return this.categoryService.remove(+id, res);
  }

  @Get('filter/posts')
  async findPostsByCategory(@Query('categoryIds') categoryIds: string) {
    const ids = categoryIds.split(',').map((id) => parseInt(id, 10));
    return await this.categoryService.findPostsByCategories(ids);
  }
}

import { Type } from 'class-transformer';
import { Category } from './../../category/entities/category.entity';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  categoryId: number;

  @IsString()
  mainImageUrl: string;

  @IsArray()
  @IsOptional()
  hashtags: string[];
}

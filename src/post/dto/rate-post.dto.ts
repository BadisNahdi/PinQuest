import { CreatePostDto } from './create-post.dto'; // Adjust import path as needed
import { Min, Max } from 'class-validator';

export class PostRatingDto extends CreatePostDto {
  @Min(1)
  @Max(5)
  rating: number;
}

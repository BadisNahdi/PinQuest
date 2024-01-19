import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  userId: number;
  @IsNotEmpty()
  @IsString()
  content: string;
  @IsNotEmpty()
  postId: number;
}

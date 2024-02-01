import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  firstname: string;
  @IsString()
  @IsNotEmpty()
  lastname: string;
  @IsString()
  @IsNotEmpty()
  email: string;
  @IsString()
  @IsNotEmpty()
  password: string;
  @IsString()
  @IsOptional()
  profilePic: string;
  @IsOptional()
  @IsString()
  bio: string;
  @IsDate()
  @IsOptional()
  birthday: Date;
  @IsString()
  @IsOptional()
  place: string;
}

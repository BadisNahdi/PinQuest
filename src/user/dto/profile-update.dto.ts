
import { IsString, IsNotEmpty } from 'class-validator';

export class ProfileUpdateDto {
  @IsString()
  @IsNotEmpty()
  firstname: string;

  @IsString()
  @IsNotEmpty()
  lastname: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  password?: string; // Optional for password changes

  profilePic?: any; // Assuming a suitable type for uploaded files
}
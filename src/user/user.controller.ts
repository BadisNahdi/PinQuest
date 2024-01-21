import { ApplyUser } from './current-user.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import {  UserService } from './user.service';
import { UserLoginDto } from './dto/userLogin.dto';
import { Request, Response, request } from 'express';
import { User } from './entities/user.entity';
import { CurrentUser } from './user.decorator';
import { Roles } from './user-roles.decorator';


@Controller('auth')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('login')
  async loginUser(@Body() loginDto: any, @Res() res: Response) {
    const { token, user } = await this.userService.login(
      loginDto as UserLoginDto,
    );
    /*res.setHeader('Set-Cookie', token);
    return res.send({ success: true });
*/

    res.cookie('IsAuthenticated', true, { maxAge: 2 * 60 * 60 * 1000 });
    res.cookie('Authentication', token, {
      httpOnly: true,
      maxAge: 2 * 60 * 60 * 1000,
    }); // max age 2 hours

    return res.send({ success: true, user });
  }

  @Post('register')
  registerUser(@Body() body: CreateUserDto) {
    return this.userService.register(body);
  }

  @Post('logout')
  logout(@Req() req: Request, @Res() res: Response) {
    res.clearCookie('Authentication');
    return res.status(200).send({ success: true });
  }

  @Get('authstatus')
  @UseGuards(ApplyUser)
  authStatus(@CurrentUser() user: User) {
    console.log(!!user);
    return { status: !!user, user };
  }

  @Delete('users/:id')
  @Roles('Admin') // Only the admin can delete a user
  async deleteUser(@Param('id') userId: number) {
      await this.userService.deleteUser(userId);
      return 'User deleted successfully';
  }



}


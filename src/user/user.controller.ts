import { ApplyUser } from './current-user.guard';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { UserLoginDto } from './dto/userLogin.dto';
import { Request, Response } from 'express';
import { User } from './entities/user.entity';
import { CurrentUser } from './user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { ACGuard } from 'nest-access-control';
import { RolesGuard } from './user.roles.guard';
import { Roles } from './user.roles.decorator';
import { UserRoles } from 'src/models/user-roles.models';

@Controller('auth')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('login')
  @HttpCode(200) // Specify the desired status code
  async loginUser(@Body() loginDto: any, @Res() res: Response) {
    try {
      const { token, user } = await this.userService.login(
        loginDto as UserLoginDto,
      );

      // res.cookie('IsAuthenticated', true, { maxAge: 2 * 60 * 60 * 1000 });
      // res.cookie('Authentication', token, {
      //   httpOnly: true,
      //   maxAge: 2 * 60 * 60 * 1000,
      // });

      return res.send({ success: true, user, token });
    } catch (UnauthorizedException) {
      throw new HttpException('bad creds', 400);
    }
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
    return { status: !!user, user };
  }
  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    await this.userService.sendPasswordResetEmail(email);
  }
  @Get('reset-password/:token')
  async renderResetPasswordForm(
    @Param('token') token: string,
  ): Promise<string> {
    try {
      const isValidToken = await this.userService.validateResetToken(token);
      if (!isValidToken) {
        throw new BadRequestException('Invalid or expired reset token 2');
      }

      return 'Render your password reset form here';
    } catch (error) {
      throw new BadRequestException('Invalid or expired reset token 3');
    }
  }

  @Post('reset-password/:token')
  async resetPassword(
    @Param('token') token: string,
    @Body() { newPassword }: { newPassword: string },
  ): Promise<void> {
    try {
      await this.userService.resetPassword(token, newPassword);
    } catch (error) {
      throw new BadRequestException('Failed to reset password');
    }
  }

  @Get('profile/:userId?')
  @UseGuards(AuthGuard('jwt'), ACGuard)
  async getUserProfile(@Param('userId') userId: number, @CurrentUser() user) {
    try {
      if (userId == undefined) {
        return user;
      }
      const user1 = await this.userService.getUserProfile(userId);
      return user1;
    } catch (NotFoundException) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
  }

  @Post('block/:userId')
  @UseGuards(AuthGuard('jwt'), ACGuard)
  async blockUser(@Param('userId') userId: number, @Req() req: Request) {
    await this.userService.blockUser(req.user.id, userId);
    return 'User blocked successfully';
  }

  @Post('unblock/:userId')
  @UseGuards(AuthGuard('jwt'), ACGuard)
  async unblockUser(@Param('userId') userId: number, @Req() req: Request) {
    await this.userService.unblockUser(req.user.id, userId);
    return 'User unblocked successfully';
  }

  @Get('users-number')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRoles.Admin)
  async usersNumber() {
    console.log(this.userService.usersNumber());
    return this.userService.usersNumber();
  }
  
}

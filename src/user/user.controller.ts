import { ApplyUser } from './current-user.guard';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import {  UserService } from './user.service';
import { UserLoginDto } from './dto/userLogin.dto';
import { Request, Response } from 'express';
import { User } from './entities/user.entity';
import { CurrentUser } from './user.decorator';
import { ACGuard, UseRoles } from 'nest-access-control';
import { AuthGuard } from '@nestjs/passport';

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
  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    await this.userService.sendPasswordResetEmail(email);
  }
  @Get('reset-password/:token')
  async renderResetPasswordForm(@Param('token') token: string): Promise<string> {
    try {
      console.log(token)
      console.log(this.userService.check(token))
      // Validate the token and render the password reset form
      const isValidToken = await this.userService.validateResetToken(token);
      if (!isValidToken) {
        throw new BadRequestException('Invalid or expired reset token 2');
      }

      // Render your password reset form here (e.g., return HTML string or render a template)
      return 'Render your password reset form here';

    } catch (error) {
      throw new BadRequestException('Invalid or expired reset token 3');
    }
  }

  // POST endpoint to handle the password reset submission
  @Post('reset-password/:token')
  async resetPassword(@Param('token') token: string, @Body() { newPassword }: { newPassword: string }): Promise<void> {
    try {
      await this.userService.resetPassword(token, newPassword);
    } catch (error) {
      throw new BadRequestException('Failed to reset password');
    }
  }
  @Post('block/:userId')
  @UseGuards(AuthGuard('jwt'), ACGuard)
  async blockUser(@Param('userId') userId: number, @Req() req: Request) {
    console.log(req.user)
    await this.userService.blockUser(req.user.id, userId);
    return 'User blocked successfully';
}

  @Post('unblock/:userId')
  @UseGuards(AuthGuard('jwt'), ACGuard)
  async unblockUser(@Param('userId') userId: number, @Req() req: Request) {
    await this.userService.unblockUser(req.user.id, userId);
    return 'User unblocked successfully';
}
}
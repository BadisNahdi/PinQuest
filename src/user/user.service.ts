import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user.dto';
import { UserLoginDto } from './dto/userLogin.dto';
import * as bcrypt from 'bcryptjs';
import { JwtStrategy } from './jwt.strategy';
import * as nodemailer from 'nodemailer';
import { promises } from 'dns';


@Injectable()
export class UserService {
  constructor(
    private readonly jwtStrategy: JwtStrategy,
    @InjectRepository(User) private readonly repo: Repository<User>,
    private jwt: JwtService,
  ) {}

  // Login User
  async login(loginDto: UserLoginDto) {
    const user = await this.repo
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email: loginDto.email })
      .getOne();
    if (!user) {
      throw new UnauthorizedException('Bad credentials');
    } else {
      if (await this.verifyPassword(loginDto.password, user.password)) {
        const token = await this.jwt.signAsync({
          email: user.email,
          id: user.id,
        });
        delete user.password;
        return { token, user };
      } else {
        throw new UnauthorizedException('Bad credentials');
      }
    }
  }

  //  Register User
  async register(createUserDto: CreateUserDto) {
    const { firstname, lastname, email, password, profilePic } = createUserDto;

    /*Check if the user is already present in database, if yes, throw error */
    const checkUser = await this.repo.findOne({ where: { email } });
    if (checkUser) {
      throw new BadRequestException('Please enter different email');
    } else {
      const user = new User();
      user.firstname = firstname;
      user.lastname = lastname;
      user.email = email;
      user.password = password;
      user.profilePic = profilePic;

      this.repo.create(user); 
      await this.repo.save(user);
      delete user.password;
      return user;
    }
  }

  async verifyPassword(password: string, userHash: string) {
    return await bcrypt.compare(password, userHash);
  }

  async getOneUser(id: number) {
    return await this.repo.findOneBy({id});
  }
  
  async sendPasswordResetEmail(email: string): Promise<void> {
    const user = await this.repo.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const resetToken = this.jwtStrategy.generateResetToken(email);
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.USER,
        pass: process.env.APP_PASSWORD,
      },
    });

    const resetLink = `http://127.0.0.1:5000/api/auth/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: 'nesttest720@gmail.com',
      to: user.email,
      subject: 'Password Reset',
      text: `Click the following link to reset your password: ${resetLink}`,
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (error) {
      throw new BadRequestException('Failed to send password reset email');
    }
  }
  async resetPassword(resetToken: string, newPassword: string): Promise<void> {
    try {
      const decodedToken: any = this.jwtStrategy.verifyResetToken(resetToken);

      if (!decodedToken || decodedToken.exp < Date.now() / 1000) {
        throw new UnauthorizedException('Invalid or expired reset token');
      }
  
      const user = await this.repo.findOne({ where: { email: decodedToken.email } });
  
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      user.password = hashedPassword;
      await this.repo.save(user);
  
      // Optionally, you may want to invalidate the reset token to prevent its reuse
      // This could be done by marking the token as used in a database or setting an expiry time
  
    } catch (error) {
      throw new BadRequestException('Failed to reset password');
    }
  }
  async check(token: string): Promise<any> {
    try {
      const decodedToken = await this.jwtStrategy.verifyResetToken(token);
      console.log(decodedToken);
      return decodedToken;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
  async validateResetToken(token: string): Promise<boolean> {
    try {
      const decodedToken: any = this.jwtStrategy.verifyResetToken(token);
      console.log(decodedToken)

      return !!decodedToken && decodedToken.exp >= Date.now() / 1000;
    } catch (error) {
      return false;
    }
  }
  
}
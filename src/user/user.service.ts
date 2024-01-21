import {
  BadRequestException,
  ForbiddenException,
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


@Injectable()
export class UserService {
  constructor(
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

      this.repo.create(user); // this will run any hooks present, such as password hashing
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

  async deleteUser(userId: number) {
    const user = await this.repo.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    // Prevent deletion of admins 
    if (user.roles?.includes('Admin')) {
      throw new ForbiddenException('Cannot delete admins');
    }
  
    await this.repo.delete(userId);
  }

  asyn
  


}


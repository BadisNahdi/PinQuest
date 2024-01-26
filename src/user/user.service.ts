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
import { ProfileUpdateDto } from './dto/profile-update.dto';
import { UserFollow } from './entities/user-follow.entity';


@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserFollow) private userFollowRepository: Repository<UserFollow>,
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
  async updateProfile(userId: number, updateDto: ProfileUpdateDto) {
    const user = await this.repo.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Update user properties
    user.firstname = updateDto.firstname;
    user.lastname = updateDto.lastname;
    user.email = updateDto.email;

    // Handle password change if provided
    if (updateDto.password) {
      const hashedPassword = await bcrypt.hash(updateDto.password, 10);
      user.password = hashedPassword;
    }

    // Handle profile picture update
    if (updateDto.profilePic) {
      user.profilePic = updateDto.profilePic; // Assign directly to the entity property
    }
}


async followUser(followerId: number, userIdToFollow: number) {
  const follower = await this.repo.findOne({ where: { id: followerId } });
  const userToFollow = await  this.repo.findOne({ where: { id: userIdToFollow } })

  // Check for existing relationship and prevent following oneself
  if (!userToFollow || follower.id === userToFollow.id) {
      throw new BadRequestException('Invalid follow attempt');
  }

  const queryBuilder = await this.userFollowRepository
  .createQueryBuilder('userFollow')
  .where({ followedUser: { id: userIdToFollow } })
  .leftJoinAndSelect('follower', 'follower.id = :followerId', 'followerId'); // Pass 'followerId' as a string

  const existingFollow = await queryBuilder.getOne();
    
    if (!existingFollow) {
      const userFollow = new UserFollow();
      userFollow.follower = follower;
      userFollow.followedUser = userToFollow;
      await this.userFollowRepository.save(userFollow);
    }


}


}


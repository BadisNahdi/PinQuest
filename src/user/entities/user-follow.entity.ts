
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';


@Entity('user_follows')
export class UserFollow {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.followers)
    follower: User;

    @ManyToOne(() => User, (user) => user.followedUsers)
    followedUser: User;
  userFollow: Promise<User>;
}



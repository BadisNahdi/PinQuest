import { BeforeInsert, Column, Entity, OneToMany, PrimaryGeneratedColumn,ManyToMany,JoinTable } from 'typeorm';
import * as bcryptjs from 'bcryptjs';
import { Post } from '../../post/entities/post.entity';
import { UserRoles } from '../../models/user-roles.models';


@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column()
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ default: null })
  profilePic: string;

  @Column({ type: 'enum', enum: UserRoles, enumName: 'roles', default: UserRoles.Reader })
  roles: UserRoles;

  @BeforeInsert()
  hashPass() {
    this.password = bcryptjs.hashSync(this.password, 10);
  }

  
  @ManyToMany(() => User, (user) => user.followedUsers)
  @JoinTable()
  followers: User[];

  @ManyToMany(() => User, (user) => user.followers)
  @JoinTable()
  followedUsers: User[];

}


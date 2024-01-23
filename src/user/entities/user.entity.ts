import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  BeforeInsert,
} from 'typeorm';
import * as bcryptjs from 'bcryptjs';
import { Post } from '../../post/entities/post.entity';
import { Comment } from '../../comment/entities/comment.entity';
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

  @Column({
    type: 'enum',
    enum: UserRoles,
    enumName: 'roles',
    default: UserRoles.Reader,
  })
  roles: UserRoles;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @BeforeInsert()
  hashPass() {
    this.password = bcryptjs.hashSync(this.password, 10);
  }
  @Column({ nullable: true })
  resetToken: string;

  @Column({ type: 'simple-array', nullable: true })
  blockList: number[];
}

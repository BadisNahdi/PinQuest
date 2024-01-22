import { Post } from '../entities/post.entity';
import {
    BeforeInsert,
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
  } from 'typeorm';

@Entity('post_ratings')
export class PostRating {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  postId: number;

  @Column()
  rating: number;

  @Column()
  timestamp: Date;

  @ManyToOne(() => Post, (post) => post.ratings)
  post: Post;
}
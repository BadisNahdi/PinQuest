import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  BeforeInsert,
  JoinColumn,
} from 'typeorm';
import { Category } from '../../category/entities/category.entity';
import slugify from 'slugify';
import { User } from '../../user/entities/user.entity';
import { Comment } from '../../comment/entities/comment.entity';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column()
  slug: string;

  @Column({ type: 'simple-array' })
  hashtags: string[];

  @Column({ default: 3 })
  categoryId: number;

  @Column()
  userId: number;

  @ManyToOne(() => Category, (category) => category.posts, { eager: true })
  @JoinColumn({ referencedColumnName: 'id', name: 'categoryId' })
  category: Category;

  @ManyToOne(() => User, (user) => user.posts, { eager: true })
  @JoinColumn({ referencedColumnName: 'id', name: 'userId' })
  user: User;

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdOn: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  modifiedOn: Date;

  @Column({
    default:
      'https://i0.wp.com/clicxy.com/wp-content/uploads/2016/04/dummy-post-horisontal.jpg?ssl=1',
    nullable: true,
  })
  mainImageUrl: string;

  @BeforeInsert()
  slugifyPost() {
    this.slug = slugify(this.title.substr(0, 20), {
      replacement: '_',
      lower: true,
    });
  }
  @Column({ nullable: true })
  shareToken: string;
}

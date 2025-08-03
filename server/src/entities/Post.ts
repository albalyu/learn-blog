import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany, ManyToMany } from 'typeorm';
import { User } from './User';
import { Comment } from './Comment';
import { Tag } from './Tag';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('varchar')
  title!: string;

  @Column('text')
  content!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne(() => User, (user) => user.posts)
  author!: User;

  @OneToMany(() => Comment, (comment) => comment.post)
  comments!: Comment[];

  @ManyToMany(() => Tag, (tag) => tag.posts)
  tags!: Tag[];
}

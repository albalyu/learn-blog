import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from './User';
import { Comment } from './Comment';

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
}

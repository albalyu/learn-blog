import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from './User';

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
}

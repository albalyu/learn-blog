import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Post } from './Post';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('varchar', { unique: true })
  username!: string;

  @Column('varchar', { unique: true })
  email!: string;

  @Column('varchar')
  passwordHash!: string;

  @Column('varchar', { default: '/uploads/default-avatars/male-avatar-1.svg' })
  avatarUrl!: string;

  @OneToMany(() => Post, (post) => post.author)
  posts!: Post[];
}

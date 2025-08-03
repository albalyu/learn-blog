import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Post } from './Post';
import { Comment } from './Comment';

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

  @Column('varchar', { nullable: true })
  refreshToken!: string | null;

  @Column('varchar', { default: '/uploads/default-avatars/male-avatar-1.svg' })
  avatarUrl!: string;

  @OneToMany(() => Post, (post) => post.author)
  posts!: Post[];

  @OneToMany(() => Comment, (comment) => comment.author)
  comments!: Comment[];

  @ManyToMany(() => User, (user) => user.subscribers)
  @JoinTable({
    name: 'user_subscriptions',
    joinColumn: { name: 'followerId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'followingId', referencedColumnName: 'id' },
  })
  following!: User[];

  @ManyToMany(() => User, (user) => user.following)
  subscribers!: User[];
}

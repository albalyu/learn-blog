import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { Post } from './Post';

@Entity()
export class Tag {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('varchar', { unique: true })
  name!: string;

  @ManyToMany(() => Post, (post) => post.tags)
  @JoinTable()
  posts!: Post[];
}

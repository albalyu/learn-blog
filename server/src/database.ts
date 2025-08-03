import { DataSource } from 'typeorm';
import { User } from './entities/User';
import { Post } from './entities/Post';
import { Comment } from './entities/Comment';
import { Tag } from './entities/Tag';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'database.sqlite',
  synchronize: true, // Be careful with this in production
  logging: false,
  entities: [User, Post, Comment, Tag],
  subscribers: [],
  migrations: [],
});

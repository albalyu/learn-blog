import { DataSource } from 'typeorm';
import { User } from './entities/User';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'database.sqlite',
  synchronize: true, // Be careful with this in production
  logging: false,
  entities: [User],
  subscribers: [],
  migrations: [],
});
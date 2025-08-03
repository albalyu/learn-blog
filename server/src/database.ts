import { createConnection } from 'typeorm';
import { User } from './entities/User';

export const connectDB = async () => {
  return createConnection({
    type: 'sqlite',
    database: 'database.sqlite',
    synchronize: true,
    logging: true,
    entities: [User],
  });
};

import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { AppDataSource } from './database';
import { createAuthRoutes } from './routes/auth';
import { createPostRoutes } from './routes/posts';
import { createUserRoutes } from './routes/users';
import { createCommentRoutes } from './routes/comments';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const main = async () => {
  try {
    await AppDataSource.initialize();
    console.log('Database connection has been initialized!');

    const app = express();
    const port = 3001;

    app.use(cors());
    app.use(express.json());

    app.use('/uploads', express.static(path.join(__dirname, '..' , 'public')));

    const authRoutes = createAuthRoutes(AppDataSource);
    const postRoutes = createPostRoutes(AppDataSource);
    const userRoutes = createUserRoutes(AppDataSource);
    const commentRoutes = createCommentRoutes(AppDataSource);

    app.use('/api', authRoutes);
    app.use('/api', postRoutes);
    app.use('/api', userRoutes);
    app.use('/api', commentRoutes);

    app.get('/api', (req, res) => {
      res.json({ message: 'Backend is running!' });
    });

    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });

  } catch (error) {
    console.error('Error during server initialization:', error);
  }
};

main();
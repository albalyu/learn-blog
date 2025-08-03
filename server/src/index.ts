import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url'; // Import fileURLToPath
import { AppDataSource } from './database';
import { createAuthRoutes } from './routes/auth';
import { createPostRoutes } from './routes/posts';
import { createUserRoutes } from './routes/users';

// Get __dirname equivalent in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const main = async () => {
  try {
    // Initialize database connection
    await AppDataSource.initialize();
    console.log('Database connection has been initialized!');

    const app = express();
    const port = 3001;

    app.use(cors());
    app.use(express.json());

    // Serve static files from the 'public' directory under the '/uploads' prefix
    app.use('/uploads', express.static(path.join(__dirname, '..' , 'public')));

    // Create and use auth routes with the initialized data source
    const authRoutes = createAuthRoutes(AppDataSource);
    const postRoutes = createPostRoutes(AppDataSource);
    const userRoutes = createUserRoutes(AppDataSource);
    app.use('/api/auth', authRoutes);
    app.use('/api/posts', postRoutes);
    app.use('/api/users', userRoutes);

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
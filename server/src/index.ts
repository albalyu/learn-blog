import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import { AppDataSource } from './database';
import { createAuthRoutes } from './routes/auth';

const main = async () => {
  try {
    // Initialize database connection
    await AppDataSource.initialize();
    console.log('Database connection has been initialized!');

    const app = express();
    const port = 3001;

    app.use(cors());
    app.use(express.json());

    // Create and use auth routes with the initialized data source
    const authRoutes = createAuthRoutes(AppDataSource);
    app.use('/api/auth', authRoutes);

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
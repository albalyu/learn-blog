
import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import { connectDB } from './database';
import authRoutes from './routes/auth';

const main = async () => {
  await connectDB();
  const app = express();
  const port = 3001;

  app.use(cors());
  app.use(express.json());

  app.use('/api/auth', authRoutes);

  app.get('/api', (req, res) => {
    res.json({ message: 'Backend is running!' });
  });

  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
};

main().catch(console.error);


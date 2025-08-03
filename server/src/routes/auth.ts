import { Router } from 'express';
import { DataSource } from 'typeorm';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../entities/User';

export const createAuthRoutes = (dataSource: DataSource): Router => {
  const router = Router();
  const userRepository = dataSource.getRepository(User);

  // Register
  router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).send('Username, email, and password are required');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const user = userRepository.create({
        username,
        email,
        passwordHash: hashedPassword,
      });
      await userRepository.save(user);
      res.status(201).send('User created successfully');
    } catch (error) {
      // Basic error handling for unique constraint violation
      if (error.code === 'SQLITE_CONSTRAINT') {
        return res.status(409).send('Username or email already exists');
      }
      res.status(500).send('Error creating user');
    }
  });

  // Login
  router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send('Email and password are required');
    }

    const user = await userRepository.findOne({ where: { email } });

    if (!user) {
      return res.status(401).send('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return res.status(401).send('Invalid credentials');
    }

    const token = jwt.sign({ id: user.id, username: user.username }, 'your_jwt_secret', {
      expiresIn: '1h',
    });

    res.json({ token });
  });

  return router;
};
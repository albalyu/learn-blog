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

    import { Router } from 'express';
import { DataSource } from 'typeorm';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto'; // Import crypto
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

    const accessToken = jwt.sign({ id: user.id, username: user.username }, 'your_jwt_secret', {
      expiresIn: '15m', // Access token expires in 15 minutes
    });

    const refreshToken = crypto.randomBytes(64).toString('hex');
    user.refreshToken = refreshToken;
    await userRepository.save(user);

    res.json({ accessToken, refreshToken });
  });

  // Refresh token
  router.post('/refresh', async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).send('Refresh Token is required');
    }

    const user = await userRepository.findOne({ where: { refreshToken } });

    if (!user) {
      return res.status(403).send('Invalid Refresh Token');
    }

    const newAccessToken = jwt.sign({ id: user.id, username: user.username }, 'your_jwt_secret', {
      expiresIn: '15m',
    });

    const newRefreshToken = crypto.randomBytes(64).toString('hex');
    user.refreshToken = newRefreshToken;
    await userRepository.save(user);

    res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  });

  // Logout
  router.post('/logout', authMiddleware, async (req, res) => {
    const userId = req.user.id;
    const user = await userRepository.findOne({ where: { id: userId } });

    if (user) {
      user.refreshToken = null;
      await userRepository.save(user);
    }
    res.status(200).send('Logged out successfully');
  });

  return router;
};


    res.json({ token });
  });

  return router;
};
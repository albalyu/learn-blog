import { Router } from 'express';
import { getRepository } from 'typeorm';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../entities/User';

const router = Router();

// Register
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const userRepository = getRepository(User);

  try {
    const user = userRepository.create({
      username,
      email,
      passwordHash: hashedPassword,
    });
    await userRepository.save(user);
    res.status(201).send('User created');
  } catch (error) {
    res.status(400).send('Error creating user');
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const userRepository = getRepository(User);
  const user = await userRepository.findOne({ where: { email } });

  if (!user) {
    return res.status(404).send('User not found');
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    return res.status(401).send('Invalid password');
  }

  const token = jwt.sign({ id: user.id, username: user.username }, 'your_jwt_secret', {
    expiresIn: '1h',
  });

  res.json({ token });
});

export default router;

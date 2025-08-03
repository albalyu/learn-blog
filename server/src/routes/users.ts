import { Router } from 'express';
import { DataSource } from 'typeorm';
import multer from 'multer';
import path from 'path';
import { User } from '../entities/User';
import { authMiddleware } from '../middleware/auth';

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/avatars/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  }
});
const upload = multer({ storage: storage });


export const createUserRoutes = (dataSource: DataSource): Router => {
  const router = Router();
  const userRepository = dataSource.getRepository(User);

  // Get user profile
  router.get('/:id', async (req, res) => {
    const user = await userRepository.findOne({ 
      where: { id: parseInt(req.params.id) },
      relations: ['posts', 'posts.author'] 
    });
    if (!user) {
      return res.status(404).send('User not found');
    }
    // Don't send back the password hash
    const { passwordHash, ...profile } = user;
    res.json(profile);
  });

  // Update avatar from default list
  router.put('/me/avatar', authMiddleware, async (req, res) => {
    const { avatarUrl } = req.body;
    const userId = req.user.id;

    try {
      await userRepository.update(userId, { avatarUrl });
      res.status(200).send('Avatar updated successfully');
    } catch (error) {
      res.status(500).send('Error updating avatar');
    }
  });

  // Upload custom avatar
  router.post('/me/avatar/upload', [authMiddleware, upload.single('avatar')], async (req, res) => {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }
    const userId = req.user.id;
    const avatarUrl = `/uploads/avatars/${req.file.filename}`;

    try {
      await userRepository.update(userId, { avatarUrl });
      res.status(200).json({ message: 'Avatar uploaded successfully', avatarUrl });
    } catch (error) {
      res.status(500).send('Error uploading avatar');
    }
  });

  return router;
};

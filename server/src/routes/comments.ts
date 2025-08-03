import { Router } from 'express';
import { DataSource } from 'typeorm';
import { Comment } from '../entities/Comment';
import { User } from '../entities/User';
import { Post } from '../entities/Post';
import { authMiddleware } from '../middleware/auth';

export const createCommentRoutes = (dataSource: DataSource): Router => {
  const router = Router();
  const commentRepository = dataSource.getRepository(Comment);
  const userRepository = dataSource.getRepository(User);
  const postRepository = dataSource.getRepository(Post);

  // Get comments for a specific post
  router.get('/posts/:postId/comments', async (req, res) => {
    const postId = parseInt(req.params.postId);
    const comments = await commentRepository.find({
      where: { post: { id: postId } },
      relations: ['author'],
      order: { createdAt: 'ASC' },
    });
    res.json(comments);
  });

  // Add a comment to a post
  router.post('/posts/:postId/comments', authMiddleware, async (req, res) => {
    const postId = parseInt(req.params.postId);
    const userId = req.user.id;
    const { content } = req.body;

    if (!content || content.trim() === '') {
      return res.status(400).send('Содержание комментария не может быть пустым');
    }

    const author = await userRepository.findOne({ where: { id: userId } });
    const post = await postRepository.findOne({ where: { id: postId } });

    if (!author || !post) {
      return res.status(404).send('Автор или запись не найдены');
    }

    const comment = commentRepository.create({
      content,
      author,
      post,
    });

    await commentRepository.save(comment);
    res.status(201).json(comment);
  });

  return router;
};

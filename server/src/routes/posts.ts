import { Router } from 'express';
import { DataSource } from 'typeorm';
import { Post } from '../entities/Post';
import { User } from '../entities/User';
import { authMiddleware } from '../middleware/auth';

export const createPostRoutes = (dataSource: DataSource): Router => {
  const router = Router();
  const postRepository = dataSource.getRepository(Post);
  const userRepository = dataSource.getRepository(User);

  // Get all public posts
  router.get('/public', async (req, res) => {
    const posts = await postRepository.find({ relations: ['author'] });
    res.json(posts);
  });

  // Get single post by id
  router.get('/:id', async (req, res) => {
    const post = await postRepository.findOne({ where: { id: parseInt(req.params.id) }, relations: ['author'] });
    if (!post) {
      return res.status(404).send('Post not found');
    }
    res.json(post);
  });

  // Create a new post
  router.post('/', authMiddleware, async (req, res) => {
    const { title, content } = req.body;
    const userId = req.user.id;

    const author = await userRepository.findOne({ where: { id: userId } });
    if (!author) {
      return res.status(404).send('Author not found');
    }

    const post = postRepository.create({
      title,
      content,
      author,
    });

    await postRepository.save(post);
    res.status(201).json(post);
  });

  // Update a post
  router.put('/:id', authMiddleware, async (req, res) => {
    const postId = parseInt(req.params.id);
    const userId = req.user.id;
    const { title, content } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).send('Заголовок не может быть пустым');
    }
    if (!content || content.trim() === '') {
      return res.status(400).send('Содержание не может быть пустым');
    }

    const post = await postRepository.findOne({ where: { id: postId }, relations: ['author'] });

    if (!post) {
      return res.status(404).send('Post not found');
    }

    if (post.author.id !== userId) {
      return res.status(403).send('Forbidden: You are not the author of this post');
    }

    post.title = title;
    post.content = content;

    await postRepository.save(post);
    res.json(post);
  });

  // Delete a post
  router.delete('/:id', authMiddleware, async (req, res) => {
    const postId = parseInt(req.params.id);
    const userId = req.user.id;

    const post = await postRepository.findOne({ where: { id: postId }, relations: ['author'] });

    if (!post) {
      return res.status(404).send('Post not found');
    }

    if (post.author.id !== userId) {
      return res.status(403).send('Forbidden: You are not the author of this post');
    }

    await postRepository.remove(post);
    res.status(204).send(); // No content
  });

  return router;
};

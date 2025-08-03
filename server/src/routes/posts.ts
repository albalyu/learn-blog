import { Router } from 'express';
import { DataSource, In } from 'typeorm';
import { Post } from '../entities/Post';
import { User } from '../entities/User';
import { Tag } from '../entities/Tag';
import { authMiddleware } from '../middleware/auth';

export const createPostRoutes = (dataSource: DataSource): Router => {
  const router = Router();
  const postRepository = dataSource.getRepository(Post);
  const userRepository = dataSource.getRepository(User);
  const tagRepository = dataSource.getRepository(Tag);

  // Helper function to find or create tags
  const findOrCreateTags = async (tagNames: string[]): Promise<Tag[]> => {
    const tags: Tag[] = [];
    for (const tagName of tagNames) {
      let tag = await tagRepository.findOne({ where: { name: tagName.toLowerCase() } });
      if (!tag) {
        tag = tagRepository.create({ name: tagName.toLowerCase() });
        await tagRepository.save(tag);
      }
      tags.push(tag);
    }
    return tags;
  };

  // Get all public posts
  router.get('/posts/public', async (req, res) => {
    const posts = await postRepository.find({ relations: ['author', 'tags'] });
    res.json(posts);
  });

  // Get single post by id
  router.get('/posts/:id', async (req, res) => {
    const post = await postRepository.findOne({ where: { id: parseInt(req.params.id) }, relations: ['author', 'tags'] });
    if (!post) {
      return res.status(404).send('Post not found');
    }
    res.json(post);
  });

  // Create a new post
  router.post('/posts', authMiddleware, async (req, res) => {
    const { title, content, tags: tagNames = [] } = req.body;
    const userId = req.user.id;

    const author = await userRepository.findOne({ where: { id: userId } });
    if (!author) {
      return res.status(404).send('Author not found');
    }

    const tags = await findOrCreateTags(tagNames);

    const post = postRepository.create({
      title,
      content,
      author,
      tags,
    });

    await postRepository.save(post);
    res.status(201).json(post);
  });

  // Update a post
  router.put('/posts/:id', authMiddleware, async (req, res) => {
    const postId = parseInt(req.params.id);
    const userId = req.user.id;
    const { title, content, tags: tagNames = [] } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).send('Заголовок не может быть пустым');
    }
    if (!content || content.trim() === '') {
      return res.status(400).send('Содержание не может быть пустым');
    }

    const post = await postRepository.findOne({ where: { id: postId }, relations: ['author', 'tags'] });

    if (!post) {
      return res.status(404).send('Post not found');
    }

    if (post.author.id !== userId) {
      return res.status(403).send('Forbidden: You are not the author of this post');
    }

    const tags = await findOrCreateTags(tagNames);

    post.title = title;
    post.content = content;
    post.tags = tags;

    await postRepository.save(post);
    res.json(post);
  });

  // Delete a post
  router.delete('/posts/:id', authMiddleware, async (req, res) => {
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

  // Get posts by tag
  router.get('/posts/tags/:tagName', async (req, res) => {
    const tagName = req.params.tagName.toLowerCase();
    const tag = await tagRepository.findOne({ where: { name: tagName }, relations: ['posts', 'posts.author', 'posts.tags'] });

    if (!tag) {
      return res.status(404).send('Tag not found');
    }
    res.json(tag.posts);
  });

  return router;
};
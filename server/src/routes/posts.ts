import { Router } from 'express';
import { DataSource, In, Like } from 'typeorm';
import { Post } from '../entities/Post';
import { User } from '../entities/User';
import { Tag } from '../entities/Tag';
import { Comment } from '../entities/Comment';
import { authMiddleware } from '../middleware/auth';

export const createPostRoutes = (dataSource: DataSource): Router => {
  const router = Router();
  const postRepository = dataSource.getRepository(Post);
  const userRepository = dataSource.getRepository(User);
  const tagRepository = dataSource.getRepository(Tag);
  const commentRepository = dataSource.getRepository(Comment);

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

  // Get all posts (public, with optional tag filter)
  router.get('/', async (req, res) => {
    const { tag } = req.query;
    let posts;

    if (tag) {
      // Find posts by tag
      const foundTag = await tagRepository.findOne({ where: { name: String(tag).toLowerCase() }, relations: ['posts', 'posts.author', 'posts.tags'] });
      if (!foundTag) {
        return res.json([]); // Return empty array if tag not found
      }
      posts = foundTag.posts;
    } else {
      // Get all public posts
      posts = await postRepository.find({ relations: ['author', 'tags'] });
    }
    res.json(posts);
  });

  // Get single post by id
  router.get('/:id', async (req, res) => {
    const post = await postRepository.findOne({ where: { id: parseInt(req.params.id) }, relations: ['author', 'tags'] });
    if (!post) {
      return res.status(404).send('Post not found');
    }
    res.json(post);
  });

  // Create a new post
  router.post('/', authMiddleware, async (req, res) => {
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
  router.put('/:id', authMiddleware, async (req, res) => {
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

  // Get comments for a specific post
  router.get('/:postId/comments', async (req, res) => {
    const postId = parseInt(req.params.postId);
    const comments = await commentRepository.find({
      where: { post: { id: postId } },
      relations: ['author'],
      order: { createdAt: 'ASC' },
    });
    res.json(comments);
  });

  // Add a comment to a post
  router.post('/:postId/comments', authMiddleware, async (req, res) => {
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

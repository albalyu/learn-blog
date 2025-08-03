import { Router } from 'express';
import { DataSource } from 'typeorm';
import { Tag } from '../entities/Tag';
import { authMiddleware } from '../middleware/auth';

export const createTagRoutes = (dataSource: DataSource): Router => {
  const router = Router();
  const tagRepository = dataSource.getRepository(Tag);

  // Get all tags
  router.get('/', async (req, res) => {
    const tags = await tagRepository.find();
    res.json(tags);
  });

  // Get tag by id
  router.get('/:id', async (req, res) => {
    const tag = await tagRepository.findOne({ where: { id: parseInt(req.params.id) } });
    if (!tag) {
      return res.status(404).send('Tag not found');
    }
    res.json(tag);
  });

  // Create a new tag
  router.post('/', authMiddleware, async (req, res) => {
    const { name } = req.body;
    if (!name || name.trim() === '') {
      return res.status(400).send('Tag name cannot be empty');
    }

    try {
      const tag = tagRepository.create({ name: name.toLowerCase() });
      await tagRepository.save(tag);
      res.status(201).json(tag);
    } catch (error) {
      if (error.code === 'SQLITE_CONSTRAINT') {
        return res.status(409).send('Tag with this name already exists');
      }
      res.status(500).send('Error creating tag');
    }
  });

  // Update a tag
  router.put('/:id', authMiddleware, async (req, res) => {
    const tagId = parseInt(req.params.id);
    const { name } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).send('Tag name cannot be empty');
    }

    const tag = await tagRepository.findOne({ where: { id: tagId } });
    if (!tag) {
      return res.status(404).send('Tag not found');
    }

    tag.name = name.toLowerCase();
    await tagRepository.save(tag);
    res.json(tag);
  });

  // Delete a tag
  router.delete('/:id', authMiddleware, async (req, res) => {
    const tagId = parseInt(req.params.id);
    const tag = await tagRepository.findOne({ where: { id: tagId } });
    if (!tag) {
      return res.status(404).send('Tag not found');
    }

    await tagRepository.remove(tag);
    res.status(204).send();
  });

  return router;
};

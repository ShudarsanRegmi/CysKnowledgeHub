import { Router, Request, Response } from 'express';
import { Achievement } from '../models/Achievement';

const router = Router();

// GET /api/achievements
router.get('/', async (req: Request, res: Response) => {
  try {
    const filter: Record<string, any> = {};
    if (req.query.type && req.query.type !== 'All') {
      filter.type = req.query.type as string;
    }

    const achievements = await Achievement.find(filter).sort({ date: -1, createdAt: -1 });
    res.json(achievements);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch achievements' });
  }
});

// GET /api/achievements/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const achievement = await Achievement.findById(req.params.id);
    if (!achievement) return res.status(404).json({ error: 'Achievement not found' });
    res.json(achievement);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch achievement' });
  }
});

export default router;

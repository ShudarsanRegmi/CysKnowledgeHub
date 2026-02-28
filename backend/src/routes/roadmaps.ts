import { Router, Request, Response } from 'express';
import { Roadmap } from '../models/Roadmap';

const router = Router();

// GET /api/roadmaps
router.get('/', async (req: Request, res: Response) => {
  try {
    // Return list without the large steps array for listing view
    const roadmaps = await Roadmap.find({}, { id: 1, title: 1, subtitle: 1 });
    res.json(roadmaps);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch roadmaps' });
  }
});

// GET /api/roadmaps/:id  — id is the slug, e.g. SOC_ANALYST
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const roadmap = await Roadmap.findOne({ id: req.params.id });
    if (!roadmap) return res.status(404).json({ error: 'Roadmap not found' });
    res.json(roadmap);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch roadmap' });
  }
});

export default router;

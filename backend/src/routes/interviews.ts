import { Router, Request, Response } from 'express';
import { Interview } from '../models/Interview';

const router = Router();

// GET /api/interviews
router.get('/', async (req: Request, res: Response) => {
  try {
    const filter: Record<string, any> = {};
    if (req.query.company) filter.company = req.query.company as string;
    if (req.query.domain)  filter.domain  = req.query.domain  as string;
    if (req.query.result)  filter.result  = req.query.result  as string;

    const limit = parseInt(req.query.limit as string) || 0;

    const interviews = await Interview.find(filter)
      .sort({ date: -1, createdAt: -1 })
      .limit(limit);
    res.json(interviews);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch interviews' });
  }
});

// GET /api/interviews/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const interview = await Interview.findById(req.params.id);
    if (!interview) return res.status(404).json({ error: 'Interview not found' });
    res.json(interview);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch interview' });
  }
});

export default router;

import { Router, Request, Response } from 'express';
import { Publication } from '../models/Publication';

const router = Router();

// GET /api/publications
router.get('/', async (req: Request, res: Response) => {
  try {
    const filter: Record<string, any> = {};

    if (req.query.search) {
      const s = (req.query.search as string).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.$or = [
        { title: { $regex: s, $options: 'i' } },
        { authors: { $regex: s, $options: 'i' } },
        { keywords: { $regex: s, $options: 'i' } },
        { venue: { $regex: s, $options: 'i' } },
        { publisher: { $regex: s, $options: 'i' } },
        { abstract: { $regex: s, $options: 'i' } },
      ];
    }
    if (req.query.kind) {
      filter.kind = req.query.kind as string;
    }
    if (req.query.venueType) {
      filter.venueType = req.query.venueType as string;
    }
    if (req.query.publisher) {
      filter.publisher = req.query.publisher as string;
    }
    if (req.query.international === 'yes') {
      filter.isInternational = true;
    } else if (req.query.international === 'no') {
      filter.isInternational = false;
    }
    if (req.query.year) {
      const year = parseInt(req.query.year as string, 10);
      if (!isNaN(year)) {
        filter.publicationDate = { $regex: `^${year}` };
      }
    }

    const publications = await Publication.find(filter).sort({ publicationDate: -1 });
    res.json(publications);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch publications' });
  }
});

// GET /api/publications/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const publication = await Publication.findById(req.params.id);
    if (!publication) return res.status(404).json({ error: 'Publication not found' });
    res.json(publication);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch publication' });
  }
});

export default router;

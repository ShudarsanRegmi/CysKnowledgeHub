import express, { Request, Response } from 'express';
import Video from '../models/Video';
import { requireAuth } from '../middleware/auth';
import { requireRole } from '../middleware/requireRole';

const router = express.Router();

// 1. GET ALL VIDEOS
router.get('/', async (req: Request, res: Response) => {
    try {
        const filter: any = {};
        if (req.query.status) filter.status = req.query.status;
        if (req.query.category) filter.category = req.query.category;

        const videos = await Video.find(filter).sort({ date: -1 });
        res.json(videos);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching videos' });
    }
});

// 2. SUBMIT NEW VIDEO (Defaults to 'pending')
router.post('/', async (req: Request, res: Response) => {
    try {
        const newVideo = new Video({ ...req.body, status: 'pending' });
        const savedVideo = await newVideo.save();
        res.status(201).json(savedVideo);
    } catch (err) {
        res.status(400).json({ message: 'Error submitting video' });
    }
});

// 3. UPDATE STATUS (Admin Only)
router.patch('/:id/status', requireAuth, requireRole('admin'), async (req: Request, res: Response) => {
    try {
        const updatedVideo = await Video.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
        );
        res.json(updatedVideo);
    } catch (err) {
        res.status(500).json({ message: 'Error updating status' });
    }
});

export default router;
import { Router, Response } from 'express';
import mongoose from 'mongoose';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { requireRole } from '../middleware/requireRole';
import { User } from '../models/User';
import { Topic } from '../models/Topic';
import { Article } from '../models/Article';

const router = Router();

// All admin routes require auth + admin role
router.use(requireAuth, requireRole('admin'));

// ─── User management ─────────────────────────────────────────────────────────

/** GET /api/admin/users  — list all users */
router.get('/users', async (_req, res: Response): Promise<void> => {
  try {
    const users = await User.find({}, '-__v').sort({ createdAt: -1 });
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users', error: String(err) });
  }
});

/** PATCH /api/admin/users/:uid/role  — assign a role to a user */
router.patch('/users/:uid/role', async (req, res: Response): Promise<void> => {
  const { role } = req.body;
  if (!['student', 'author', 'admin'].includes(role)) {
    res.status(400).json({ message: 'Invalid role. Must be: student, author, or admin' });
    return;
  }

  try {
    const user = await User.findOneAndUpdate(
      { uid: req.params.uid },
      { role },
      { new: true }
    );
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json({ message: 'Role updated', user });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update role', error: String(err) });
  }
});

// ─── Topic management ─────────────────────────────────────────────────────────

/** GET /api/admin/topics — all topics (admin view) */
router.get('/topics', async (_req, res: Response): Promise<void> => {
  try {
    const topics = await Topic.find().sort({ order: 1, createdAt: 1 });
    res.json({ topics });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch topics', error: String(err) });
  }
});

/** POST /api/admin/topics — create a topic */
router.post('/topics', async (req: AuthRequest, res: Response): Promise<void> => {
  const { title, description, type } = req.body;
  if (!title?.trim()) {
    res.status(400).json({ message: 'Title is required' });
    return;
  }

  const allowedTypes = ['ctf', 'blog', 'experiment'];
  if (type && !allowedTypes.includes(type)) {
    res.status(400).json({ message: `Invalid type. Must be one of: ${allowedTypes.join(', ')}` });
    return;
  }

  try {
    // Compute max order
    const last = await Topic.findOne().sort({ order: -1 });
    const order = (last?.order ?? -1) + 1;

    const topic = await Topic.create({
      title: title.trim(),
      description: description?.trim(),
      type: type ?? 'ctf',
      createdBy: req.user!.uid,
      order,
    });
    res.status(201).json({ topic });
  } catch (err: any) {
    if (err.code === 11000) {
      res.status(409).json({ message: 'A topic with this slug already exists' });
    } else {
      res.status(500).json({ message: 'Failed to create topic', error: String(err) });
    }
  }
});

/** PATCH /api/admin/topics/:id — update a topic */
router.patch('/topics/:id', async (req, res: Response): Promise<void> => {
  const { title, description, order, type } = req.body;
  const allowedTypes = ['ctf', 'blog', 'experiment'];
  if (type && !allowedTypes.includes(type)) {
    res.status(400).json({ message: `Invalid type. Must be one of: ${allowedTypes.join(', ')}` });
    return;
  }
  try {
    const topic = await Topic.findByIdAndUpdate(
      req.params.id,
      {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(order !== undefined && { order }),
        ...(type && { type }),
      },
      { new: true, runValidators: true }
    );
    if (!topic) { res.status(404).json({ message: 'Topic not found' }); return; }
    res.json({ topic });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update topic', error: String(err) });
  }
});

/** DELETE /api/admin/topics/:id — delete a topic (and its articles) */
router.delete('/topics/:id', async (req, res: Response): Promise<void> => {
  try {
    const topic = await Topic.findByIdAndDelete(req.params.id);
    if (!topic) { res.status(404).json({ message: 'Topic not found' }); return; }
    await Article.deleteMany({ topicId: req.params.id });
    res.json({ message: 'Topic and associated articles deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete topic', error: String(err) });
  }
});

// ─── Article review & ordering ────────────────────────────────────────────────

/** GET /api/admin/articles — all articles with filters */
router.get('/articles', async (req, res: Response): Promise<void> => {
  try {
    const { status, topicId } = req.query;
    const filter: any = {};
    if (status) filter.status = status;
    if (topicId) filter.topicId = new mongoose.Types.ObjectId(topicId as string);

    const articles = await Article.find(filter)
      .populate('topicId', 'title slug')
      .sort({ createdAt: -1 });
    res.json({ articles });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch articles', error: String(err) });
  }
});

/** PATCH /api/admin/articles/:id/status — approve, reject, publish, unpublish */
router.patch('/articles/:id/status', async (req, res: Response): Promise<void> => {
  const { status, rejectionReason } = req.body;
  const allowed = ['approved', 'rejected', 'published', 'pending', 'draft'];
  if (!allowed.includes(status)) {
    res.status(400).json({ message: `Invalid status. Must be one of: ${allowed.join(', ')}` });
    return;
  }

  try {
    // Approving instantly publishes — no separate publish step required
    const resolvedStatus = status === 'approved' ? 'published' : status;
    const update: any = { status: resolvedStatus };
    if (status === 'rejected' && rejectionReason) update.rejectionReason = rejectionReason;
    if (resolvedStatus === 'published') update.publishedAt = new Date();

    const article = await Article.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!article) { res.status(404).json({ message: 'Article not found' }); return; }
    res.json({ article });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update status', error: String(err) });
  }
});

/** PATCH /api/admin/articles/:id/order — update article order within topic */
router.patch('/articles/:id/order', async (req, res: Response): Promise<void> => {
  const { order } = req.body;
  if (typeof order !== 'number') {
    res.status(400).json({ message: 'order must be a number' });
    return;
  }
  try {
    const article = await Article.findByIdAndUpdate(req.params.id, { order }, { new: true });
    if (!article) { res.status(404).json({ message: 'Article not found' }); return; }
    res.json({ article });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update order', error: String(err) });
  }
});

export default router;

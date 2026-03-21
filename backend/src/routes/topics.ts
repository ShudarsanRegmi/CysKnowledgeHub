import { Router, Request, Response } from 'express';
import { Topic } from '../models/Topic';
import { Article } from '../models/Article';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { requireRole } from '../middleware/requireRole';

const router = Router();

// ─── Authenticated: create a topic (author or admin) ─────────────────────────

/**
 * POST /api/topics
 * Authors and admins can create topics (categories).
 * Body: { title, description?, type: 'ctf'|'blog'|'experiment' }
 */
router.post('/', requireAuth, requireRole('author', 'admin'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description, type } = req.body;

    if (!title || typeof title !== 'string' || !title.trim()) {
      res.status(400).json({ message: 'Title is required.' });
      return;
    }

    const allowedTypes = ['ctf', 'blog', 'experiment', 'writeup'];
    if (!type || !allowedTypes.includes(type)) {
      res.status(400).json({ message: `type must be one of: ${allowedTypes.join(', ')}` });
      return;
    }

    const topic = await Topic.create({
      title: title.trim(),
      description: description?.trim() ?? '',
      type,
      createdBy: req.user!.uid,
      order: 0,
    });

    res.status(201).json({ topic });
  } catch (err: any) {
    if (err.code === 11000) {
      res.status(409).json({ message: 'A topic with this title already exists.' });
      return;
    }
    res.status(500).json({ message: 'Failed to create topic', error: String(err) });
  }
});

// ─── Public: list all topics ──────────────────────────────────────────────────

/** GET /api/topics?type=ctf|blog|experiment — list topics (public), optionally filtered by type */
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const filter: any = {};
    if (req.query.type) filter.type = req.query.type;
    const topics = await Topic.find(filter).sort({ order: 1, createdAt: 1 }).select('-__v');
    res.json({ topics });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch topics', error: String(err) });
  }
});

/**
 * GET /api/topics/grouped?type=ctf|blog
 * Returns topics with their associated published articles.
 */
router.get('/grouped', async (req: Request, res: Response): Promise<void> => {
  try {
    const { type } = req.query;
    const filter: any = {};
    if (type) filter.type = type;

    const topics = await Topic.find(filter).sort({ order: 1, createdAt: 1 }).lean();
    
    // For each topic, find published articles
    const grouped = await Promise.all(topics.map(async (topic) => {
      const articles = await Article.find({ topicId: topic._id, status: 'published' })
        .select('title slug coverImage authorName tags publishedAt order')
        .sort({ order: 1, publishedAt: -1 })
        .lean();
      return { ...topic, articles };
    }));

    res.json({ topics: grouped });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch grouped topics', error: String(err) });
  }
});

/**
 * GET /api/topics/feed?type=blog|experiment|ctf
 * Flat list of all published articles across topics of a given type.
 * Returned articles include populated topicId (title, slug, type).
 */
router.get('/feed', async (req: Request, res: Response): Promise<void> => {
  try {
    const { type } = req.query;
    const articleFilter: any = { status: 'published' };

    if (type) {
      const matchingTopics = await Topic.find({ type }).select('_id');
      articleFilter.topicId = { $in: matchingTopics.map((t) => t._id) };
    }

    const articles = await Article.find(articleFilter)
      .populate('topicId', 'title slug type')
      .select('title slug coverImage authorName tags publishedAt topicId order')
      .sort({ publishedAt: -1 });

    res.json({ articles });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch feed', error: String(err) });
  }
});

/** GET /api/topics/:slug/articles — list published articles under a topic (public) */
router.get('/:slug/articles', async (req: Request, res: Response): Promise<void> => {
  try {
    const topic = await Topic.findOne({ slug: req.params.slug });
    if (!topic) {
      res.status(404).json({ message: 'Topic not found' });
      return;
    }

    const articles = await Article.find({ topicId: topic._id, status: 'published' })
      .select('title slug coverImage authorName tags publishedAt order')
      .sort({ order: 1, publishedAt: -1 });

    res.json({ topic, articles });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch articles', error: String(err) });
  }
});

/** GET /api/topics/:topicSlug/articles/:articleSlug — single published article (public) */
router.get('/:topicSlug/articles/:articleSlug', async (req: Request, res: Response): Promise<void> => {
  try {
    const topic = await Topic.findOne({ slug: req.params.topicSlug });
    if (!topic) {
      res.status(404).json({ message: 'Topic not found' });
      return;
    }

    const article = await Article.findOne({
      topicId: topic._id,
      slug: req.params.articleSlug,
      status: 'published',
    });

    if (!article) {
      res.status(404).json({ message: 'Article not found or not published' });
      return;
    }

    res.json({ topic, article });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch article', error: String(err) });
  }
});

export default router;

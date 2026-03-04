import { Router, Request, Response } from 'express';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { Article } from '../models/Article';
import { Topic } from '../models/Topic';
import { Bookmark } from '../models/Bookmark';
import { Like } from '../models/Like';
import ArticleView from '../models/ArticleView';
import admin from '../config/firebase';
import mongoose from 'mongoose';

const router = Router();

// ─── Public: blog categories (topics of type 'blog') ────────────────────────

/** GET /api/blog/categories */
router.get('/categories', async (_req: Request, res: Response): Promise<void> => {
  try {
    const topics = await Topic.find({ type: 'blog' })
      .sort({ order: 1, createdAt: 1 })
      .select('_id title slug description');
    res.json({ categories: topics });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch categories', error: String(err) });
  }
});

// ─── Public: paginated blog feed ─────────────────────────────────────────────

/**
 * GET /api/blog/feed
 * Query params:
 *   page      - page number (default 1)
 *   limit     - items per page (default 10, max 30)
 *   topicId   - filter by topic/category id
 *   tag       - filter by tag
 *   sort      - "latest" (default) | "trending" (by viewCount)
 *   search    - full-text search across title, tags, authorName
 */
router.get('/feed', async (req: Request, res: Response): Promise<void> => {
  try {
    const page  = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(30, Math.max(1, parseInt(req.query.limit as string) || 10));
    const skip  = (page - 1) * limit;

    // Restrict to blog topics
    const blogTopics = await Topic.find({ type: 'blog' }).select('_id');
    const blogTopicIds = blogTopics.map((t) => t._id);

    const filter: any = {
      status: 'published',
      topicId: { $in: blogTopicIds },
    };

    if (req.query.topicId) {
      const requestedId = new mongoose.Types.ObjectId(req.query.topicId as string);
      // Only allow filtering by a topic that is actually a blog topic
      const isBlogTopic = blogTopicIds.some((id) => id.equals(requestedId));
      if (!isBlogTopic) {
        res.status(400).json({ message: 'Invalid topicId: not a blog category' });
        return;
      }
      filter.topicId = requestedId;
    }
    if (req.query.tag) {
      filter.tags = { $in: [req.query.tag as string] };
    }
    if (req.query.search) {
      const re = new RegExp(req.query.search as string, 'i');
      filter.$or = [{ title: re }, { tags: re }, { authorName: re }];
    }

    const sortField: Record<string, 1 | -1> = req.query.sort === 'trending'
      ? { viewCount: -1 }
      : { publishedAt: -1 };

    const [articles, total] = await Promise.all([
      Article.find(filter)
        .populate('topicId', 'title slug type')
        .select('title slug coverImage excerpt contentType authorUid authorName tags publishedAt viewCount likeCount topicId')
        .sort(sortField)
        .skip(skip)
        .limit(limit),
      Article.countDocuments(filter),
    ]);

    res.json({
      articles,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch blog feed', error: String(err) });
  }
});

// ─── Public: trending articles (top 6 by viewCount, last 30 days) ───────────

/** GET /api/blog/trending */
router.get('/trending', async (_req: Request, res: Response): Promise<void> => {
  try {
    const blogTopics = await Topic.find({ type: 'blog' }).select('_id');
    const blogTopicIds = blogTopics.map((t) => t._id);

    const since = new Date();
    since.setDate(since.getDate() - 30);

    const articles = await Article.find({
      status: 'published',
      topicId: { $in: blogTopicIds },
      publishedAt: { $gte: since },
    })
      .populate('topicId', 'title slug')
      .select('title slug coverImage excerpt authorName viewCount likeCount publishedAt tags topicId')
      .sort({ viewCount: -1, likeCount: -1 })
      .limit(6);

    res.json({ articles });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch trending articles', error: String(err) });
  }
});

// ─── Public: popular tags (top 20 by frequency) ─────────────────────────────

/** GET /api/blog/tags */
router.get('/tags', async (_req: Request, res: Response): Promise<void> => {
  try {
    const blogTopics = await Topic.find({ type: 'blog' }).select('_id');
    const blogTopicIds = blogTopics.map((t) => t._id);

    const result = await Article.aggregate([
      { $match: { status: 'published', topicId: { $in: blogTopicIds } } },
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 },
      { $project: { _id: 0, tag: '$_id', count: 1 } },
    ]);

    res.json({ tags: result });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch tags', error: String(err) });
  }
});

// ─── Auth: bookmarks ─────────────────────────────────────────────────────────

/** GET /api/blog/bookmarks/list — current user's bookmarked articles */
router.get('/bookmarks/list', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const bookmarks = await Bookmark.find({ userId: req.user!.uid })
      .populate({
        path: 'articleId',
        select: 'title slug coverImage excerpt authorName tags publishedAt viewCount likeCount topicId contentType',
        populate: { path: 'topicId', select: 'title slug type' },
      })
      .sort({ createdAt: -1 });

    // Filter out deleted articles (populate returns null if article was deleted)
    const articles = bookmarks
      .map((b) => b.articleId)
      .filter((a) => a !== null);

    res.json({ articles });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch bookmarks', error: String(err) });
  }
});

/** POST /api/blog/bookmarks/:articleId — toggle bookmark */
router.post('/bookmarks/:articleId', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { articleId } = req.params;
    const userId = req.user!.uid;

    const existing = await Bookmark.findOne({ userId, articleId });
    if (existing) {
      await existing.deleteOne();
      res.json({ bookmarked: false });
    } else {
      await Bookmark.create({ userId, articleId });
      res.json({ bookmarked: true });
    }
  } catch (err) {
    res.status(500).json({ message: 'Failed to toggle bookmark', error: String(err) });
  }
});

/** GET /api/blog/bookmarks/status/:articleId — check if user has bookmarked */
router.get('/bookmarks/status/:articleId', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const exists = await Bookmark.exists({
      userId: req.user!.uid,
      articleId: req.params.articleId,
    });
    res.json({ bookmarked: !!exists });
  } catch (err) {
    res.status(500).json({ message: 'Failed to check bookmark', error: String(err) });
  }
});

// ─── Auth: likes ─────────────────────────────────────────────────────────────

/** POST /api/blog/likes/:articleId — toggle like */
router.post('/likes/:articleId', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { articleId } = req.params;
    const userId = req.user!.uid;

    const existing = await Like.findOne({ userId, articleId });
    let liked: boolean;

    if (existing) {
      await existing.deleteOne();
      await Article.findByIdAndUpdate(articleId, { $inc: { likeCount: -1 } });
      liked = false;
    } else {
      await Like.create({ userId, articleId });
      await Article.findByIdAndUpdate(articleId, { $inc: { likeCount: 1 } });
      liked = true;
    }

    const article = await Article.findById(articleId).select('likeCount');
    res.json({ liked, likeCount: article?.likeCount ?? 0 });
  } catch (err) {
    res.status(500).json({ message: 'Failed to toggle like', error: String(err) });
  }
});

/** GET /api/blog/likes/status/:articleId — check if user liked */
router.get('/likes/status/:articleId', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const exists = await Like.exists({
      userId: req.user!.uid,
      articleId: req.params.articleId,
    });
    res.json({ liked: !!exists });
  } catch (err) {
    res.status(500).json({ message: 'Failed to check like status', error: String(err) });
  }
});

// ─── Public: single article by slug (unique view per user/IP) ───────────────
// IMPORTANT: This wildcard route must come LAST to avoid shadowing specific routes above.

/** GET /api/blog/:slug */
router.get('/:slug', async (req: Request, res: Response): Promise<void> => {
  try {
    const article = await Article.findOne({ slug: req.params.slug, status: 'published' })
      .populate('topicId', 'title slug type');

    if (!article) {
      res.status(404).json({ message: 'Article not found' });
      return;
    }

    // Determine a stable viewer key: Firebase UID (if authenticated) or IP address
    let viewerKey: string;
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      try {
        const decoded = await admin.auth().verifyIdToken(authHeader.slice(7));
        viewerKey = `uid:${decoded.uid}`;
      } catch {
        viewerKey = `ip:${req.ip}`;
      }
    } else {
      viewerKey = `ip:${req.ip}`;
    }

    // Try to record this view — the unique index rejects duplicates silently
    try {
      await ArticleView.create({ articleId: article._id, viewerKey });
      // New view — increment counter
      await Article.updateOne({ _id: article._id }, { $inc: { viewCount: 1 } });
      article.viewCount = (article.viewCount ?? 0) + 1;
    } catch (err: any) {
      // Duplicate key (code 11000) = already viewed; all other errors are also non-fatal
    }

    res.json({ article });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch article', error: String(err) });
  }
});

export default router;

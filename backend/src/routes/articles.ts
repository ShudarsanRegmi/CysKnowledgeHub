import { Router, Response } from 'express';
import sanitizeHtml from 'sanitize-html';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { requireRole } from '../middleware/requireRole';
import { Article } from '../models/Article';
import { Topic } from '../models/Topic';
import { User } from '../models/User';

const router = Router();

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Strip dangerous HTML from markdown content while keeping safe tags.
 * Novel (JSON) content is not sanitized here — it's structured data, not HTML.
 */
const ALLOWED_TAGS = [
  ...sanitizeHtml.defaults.allowedTags,
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'del', 's', 'pre', 'code', 'img', 'details', 'summary',
];

function sanitizeContent(content: string, type: string): string {
  if (type === 'novel') return content; // JSON — structural sanitization not required
  return sanitizeHtml(content, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      a:    ['href', 'title', 'target', 'rel'],
      img:  ['src', 'alt', 'title', 'width', 'height'],
      code: ['class'],
      pre:  ['class'],
    },
  });
}

// ─── Author routes (author + admin) ──────────────────────────────────────────

/** GET /api/articles/my  — list the current author's own articles */
router.get('/my', requireAuth, requireRole('author'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const articles = await Article.find({ authorUid: req.user!.uid })
      .populate('topicId', 'title slug type')
      .sort({ createdAt: -1 });
    res.json({ articles });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch your articles', error: String(err) });
  }
});

/** POST /api/articles  — create a new article (saved as draft) */
router.post('/', requireAuth, requireRole('author'), async (req: AuthRequest, res: Response): Promise<void> => {
  const { title, topicId, content, coverImage, tags } = req.body;

  if (!title?.trim() || !topicId || !content?.trim()) {
    res.status(400).json({ message: 'title, topicId, and content are required' });
    return;
  }

  try {
    const topic = await Topic.findById(topicId);
    if (!topic) { res.status(404).json({ message: 'Topic not found' }); return; }

    const dbUser = await User.findOne({ uid: req.user!.uid });
    const authorName = dbUser?.displayName || req.user!.email || 'Unknown Author';

    const { contentType, excerpt } = req.body;
    const safeContent = sanitizeContent(content, contentType ?? 'novel');
    const article = await Article.create({
      title: title.trim(),
      topicId,
      content: safeContent,
      contentType: contentType ?? 'novel',
      excerpt: excerpt?.trim(),
      coverImage,
      tags: tags ?? [],
      authorUid: req.user!.uid,
      authorName,
      status: 'draft',
    });

    res.status(201).json({ article });
  } catch (err: any) {
    if (err.code === 11000) {
      res.status(409).json({ message: 'Duplicate slug. Try a slightly different title.' });
    } else {
      res.status(500).json({ message: 'Failed to create article', error: String(err) });
    }
  }
});

/** GET /api/articles/:id  — get a single article (author must own it, admin can get any) */
router.get('/:id', requireAuth, requireRole('author'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const article = await Article.findById(req.params.id).populate('topicId', 'title slug');
    if (!article) { res.status(404).json({ message: 'Article not found' }); return; }

    const dbUser = (req as any).dbUser;
    if (dbUser?.role !== 'admin' && article.authorUid !== req.user!.uid) {
      res.status(403).json({ message: 'Not your article' });
      return;
    }

    res.json({ article });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch article', error: String(err) });
  }
});

/** PATCH /api/articles/:id  — update article content (only allowed in draft/rejected state) */
router.patch('/:id', requireAuth, requireRole('author'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) { res.status(404).json({ message: 'Article not found' }); return; }

    const dbUser = (req as any).dbUser;
    if (dbUser?.role !== 'admin' && article.authorUid !== req.user!.uid) {
      res.status(403).json({ message: 'Not your article' });
      return;
    }

    if (!['draft', 'rejected'].includes(article.status) && dbUser?.role !== 'admin') {
      res.status(400).json({ message: `Cannot edit an article in "${article.status}" state` });
      return;
    }

    const { title, topicId, content, coverImage, tags, contentType, excerpt } = req.body;
    const update: any = {};
    if (title) update.title = title.trim();
    if (topicId) update.topicId = topicId;
    if (content) update.content = sanitizeContent(content, contentType ?? article.contentType);
    if (coverImage !== undefined) update.coverImage = coverImage;
    if (tags) update.tags = tags;
    if (contentType) update.contentType = contentType;
    if (excerpt !== undefined) update.excerpt = excerpt?.trim();

    const updated = await Article.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    res.json({ article: updated });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update article', error: String(err) });
  }
});

/** DELETE /api/articles/:id  — delete a draft (author or admin) */
router.delete('/:id', requireAuth, requireRole('author'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) { res.status(404).json({ message: 'Article not found' }); return; }

    const dbUser = (req as any).dbUser;
    if (dbUser?.role !== 'admin' && article.authorUid !== req.user!.uid) {
      res.status(403).json({ message: 'Not your article' });
      return;
    }

    if (!['draft', 'rejected'].includes(article.status) && dbUser?.role !== 'admin') {
      res.status(400).json({ message: 'Can only delete draft or rejected articles' });
      return;
    }

    await article.deleteOne();
    res.json({ message: 'Article deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete article', error: String(err) });
  }
});

/** PATCH /api/articles/:id/submit  — submit for review (draft → pending) */
router.patch('/:id/submit', requireAuth, requireRole('author'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) { res.status(404).json({ message: 'Article not found' }); return; }

    if (article.authorUid !== req.user!.uid) {
      res.status(403).json({ message: 'Not your article' });
      return;
    }

    if (!['draft', 'rejected'].includes(article.status)) {
      res.status(400).json({ message: `Cannot submit an article in "${article.status}" state` });
      return;
    }

    // Ensure the article has real content before allowing submission
    if (!article.title?.trim()) {
      res.status(400).json({ message: 'Article must have a title before submitting' });
      return;
    }
    const rawContent = article.content?.trim() ?? '';
    let contentIsEmpty = !rawContent;
    if (!contentIsEmpty && article.contentType === 'novel') {
      try {
        const json = JSON.parse(rawContent);
        contentIsEmpty = !json.content || json.content.length === 0;
      } catch { /* malformed JSON – let it through, admin will see it */ }
    }
    if (contentIsEmpty) {
      res.status(400).json({ message: 'Article must have content before it can be submitted for review' });
      return;
    }

    article.status = 'pending';
    article.rejectionReason = undefined;
    await article.save();
    res.json({ article });
  } catch (err) {
    res.status(500).json({ message: 'Failed to submit article', error: String(err) });
  }
});

export default router;

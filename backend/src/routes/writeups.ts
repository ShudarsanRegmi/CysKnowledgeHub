import { Router, Response, Request } from 'express';
import sanitizeHtml from 'sanitize-html';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { requireRole } from '../middleware/requireRole';
import { CTFWriteup } from '../models/CTFWriteup';
import { User } from '../models/User';

const router = Router();

// ─── Helpers ──────────────────────────────────────────────────────────────────

const ALLOWED_TAGS = [
  ...sanitizeHtml.defaults.allowedTags,
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'del', 's', 'pre', 'code', 'img', 'details', 'summary',
];

function sanitizeContent(content: string, type: string): string {
  if (type === 'novel') return content; 
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

// ─── Public Routes ───────────────────────────────────────────────────────────

/** GET /api/writeups — list all published writeups */
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const writeups = await CTFWriteup.find({ status: 'published' })
      .select('-content -__v')
      .sort({ createdAt: -1 });
    res.json({ writeups });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch writeups', error: String(err) });
  }
});

/** GET /api/writeups/category/:category — list published by category */
router.get('/category/:category', async (req: Request, res: Response): Promise<void> => {
  try {
    const writeups = await CTFWriteup.find({ 
      category: req.params.category.toLowerCase(), 
      status: 'published' 
    })
      .select('-content -__v')
      .sort({ createdAt: -1 });
    res.json({ writeups });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch writeups', error: String(err) });
  }
});

/** GET /api/writeups/event/:eventSlug — list published by event */
router.get('/event/:eventSlug', async (req: Request, res: Response): Promise<void> => {
  try {
    const writeups = await CTFWriteup.find({ 
      eventSlug: req.params.eventSlug.toLowerCase(), 
      status: 'published' 
    })
      .select('-content -__v')
      .sort({ createdAt: -1 });
    res.json({ writeups });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch writeups', error: String(err) });
  }
});


// ─── Author Routes (POST) ────────────────────────────────────────────────────

/** GET /api/writeups/me — list my writeups */
router.get('/me', requireAuth, requireRole('author'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const writeups = await CTFWriteup.find({ authorUid: req.user!.uid })
      .select('-content -__v')
      .sort({ createdAt: -1 });
    res.json({ writeups });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch your writeups', error: String(err) });
  }
});

/** POST /api/writeups — create a new writeup */
router.post('/', requireAuth, requireRole('author'), async (req: AuthRequest, res: Response): Promise<void> => {
  const { 
    title, eventName, challengeName, category, difficulty, 
    content, contentType, coverImage, tags, status 
  } = req.body;

  if (!title?.trim() || !eventName?.trim() || !challengeName?.trim() || !content?.trim()) {
    res.status(400).json({ message: 'title, eventName, challengeName, and content are required' });
    return;
  }

  try {
    const dbUser = await User.findOne({ uid: req.user!.uid });
    const authorName = dbUser?.displayName || req.user!.email || 'Unknown Author';

    const safeContent = sanitizeContent(content, contentType ?? 'novel');
    
    const writeup = await CTFWriteup.create({
      title: title.trim(),
      eventName: eventName.trim(),
      challengeName: challengeName.trim(),
      category,
      difficulty,
      content: safeContent,
      contentType: contentType ?? 'novel',
      coverImage,
      tags: tags ?? [],
      authorUid: req.user!.uid,
      authorName,
      status: (status === 'published' || status === 'pending' || status === 'rejected') ? status : 'draft',
    });

    res.status(201).json({ writeup });
  } catch (err: any) {
    if (err.code === 11000) {
      res.status(409).json({ message: 'Duplicate slug. Try a slightly different title.' });
    } else {
      res.status(500).json({ message: 'Failed to create writeup', error: String(err) });
    }
  }
});

/** GET /api/writeups/:slug — get a single published writeup */
router.get('/:slug', async (req: Request, res: Response): Promise<void> => {
  try {
    const writeup = await CTFWriteup.findOne({ 
      slug: req.params.slug, 
      status: 'published' 
    });
    if (!writeup) {
      res.status(404).json({ message: 'Writeup not found or not published' });
      return;
    }
    res.json({ writeup });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch writeup', error: String(err) });
  }
});

/** PATCH /api/writeups/:id — update my writeup */
router.patch('/:id', requireAuth, requireRole('author'), async (req: AuthRequest, res: Response): Promise<void> => {
  const { 
    title, eventName, challengeName, category, difficulty, 
    content, contentType, coverImage, tags, status 
  } = req.body;

  try {
    const writeup = await CTFWriteup.findOne({ _id: req.params.id, authorUid: req.user!.uid });
    if (!writeup) {
      res.status(404).json({ message: 'Writeup not found or access denied' });
      return;
    }

    if (title) writeup.title = title.trim();
    if (eventName) writeup.eventName = eventName.trim();
    if (challengeName) writeup.challengeName = challengeName.trim();
    if (category) writeup.category = category;
    if (difficulty) writeup.difficulty = difficulty;
    if (content) writeup.content = sanitizeContent(content, contentType ?? writeup.contentType);
    if (contentType) writeup.contentType = contentType;
    if (coverImage !== undefined) writeup.coverImage = coverImage;
    if (tags) writeup.tags = tags;
    if (status) {
      // Authors can only move to draft or pending.
      // Published status is handled by admins via the admin dashboard routes.
      writeup.status = (status === 'pending') ? 'pending' : 'draft';
    }

    await writeup.save();
    res.json({ writeup });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update writeup', error: String(err) });
  }
});

/** DELETE /api/writeups/:id — delete my writeup */
router.delete('/:id', requireAuth, requireRole('author'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const result = await CTFWriteup.deleteOne({ _id: req.params.id, authorUid: req.user!.uid });
    if (result.deletedCount === 0) {
      res.status(404).json({ message: 'Writeup not found or access denied' });
      return;
    }
    res.json({ message: 'Writeup deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete writeup', error: String(err) });
  }
});

export default router;

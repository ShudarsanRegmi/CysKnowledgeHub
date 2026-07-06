import { Router, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { User } from '../models/User';
import imagekit, { isImageKitConfigured } from '../config/imagekit';
import { toFile } from '@imagekit/nodejs';

const router = Router();

// Roll number pattern: CH.SC.U4CYS23055  (case-insensitive)
const ROLL_NUMBER_RE = /^CH\.SC\.U4CYS\d{5}$/i;

// ─── GET /api/profile/me ──────────────────────────────────────────────────────
/**
 * Returns the current authenticated user's full profile including
 * student-specific fields.
 */
router.get('/me', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findOne({ uid: req.user!.uid }, '-__v');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', error: String(err) });
  }
});

// ─── PATCH /api/profile/me ────────────────────────────────────────────────────
/**
 * Update the current user's student profile.
 * Marks profileComplete = true once all required fields are present.
 */
router.patch('/me', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  const { displayName, campusMail, rollNumber, batch, section, bio, links } = req.body;

  // ── Validation ──────────────────────────────────────────────────────────────

  if (rollNumber !== undefined) {
    if (typeof rollNumber !== 'string' || !ROLL_NUMBER_RE.test(rollNumber.trim())) {
      res.status(400).json({
        message: 'Invalid roll number format. Expected: CH.SC.U4CYS followed by 5 digits (e.g. CH.SC.U4CYS23055)',
      });
      return;
    }

    // Ensure no other user already owns this roll number
    const conflict = await User.findOne({
      rollNumber: rollNumber.trim().toUpperCase(),
      uid: { $ne: req.user!.uid },
    });
    if (conflict) {
      res.status(409).json({ message: 'Roll number is already associated with another account' });
      return;
    }
  }

  if (batch !== undefined) {
    const allowed = ['2022', '2023', '2024', '2025', '2026'];
    if (!allowed.includes(batch)) {
      res.status(400).json({ message: `Invalid batch. Must be one of: ${allowed.join(', ')}` });
      return;
    }
  }

  if (section !== undefined) {
    const allowed = ['A', 'B', 'C', 'D'];
    if (!allowed.includes(section)) {
      res.status(400).json({ message: `Invalid section. Must be one of: ${allowed.join(', ')}` });
      return;
    }
  }

  if (campusMail !== undefined && campusMail !== '') {
    // Campus mails typically end with @cb.amrita.edu or similar — allow any
    // non-empty string but ensure it looks like an email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(campusMail.trim())) {
      res.status(400).json({ message: 'Invalid campus mail format' });
      return;
    }
  }

  if (bio !== undefined && typeof bio === 'string' && bio.length > 500) {
    res.status(400).json({ message: 'Bio must be 500 characters or fewer' });
    return;
  }

  if (links !== undefined && !Array.isArray(links)) {
    res.status(400).json({ message: 'links must be an array' });
    return;
  }

  // ── Build update payload ────────────────────────────────────────────────────

  const update: Record<string, unknown> = {};
  if (displayName  !== undefined) update.displayName = displayName.trim();
  if (campusMail   !== undefined) update.campusMail  = campusMail.trim();
  if (rollNumber   !== undefined) update.rollNumber  = rollNumber.trim().toUpperCase();
  if (batch        !== undefined) update.batch       = batch;
  if (section      !== undefined) update.section     = section;
  if (bio          !== undefined) update.bio         = bio.trim();
  if (links        !== undefined) update.links       = links;

  // Mark profile complete once the four key fields are all filled in
  // (we check against the merged state, not just the patch payload)
  try {
    const existing = await User.findOne({ uid: req.user!.uid });
    if (!existing) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const merged = {
      displayName: (update.displayName ?? existing.displayName) as string | undefined,
      rollNumber:  (update.rollNumber  ?? existing.rollNumber)  as string | undefined,
      batch:       (update.batch       ?? existing.batch)       as string | undefined,
      section:     (update.section     ?? existing.section)     as string | undefined,
      campusMail:  (update.campusMail  ?? existing.campusMail)  as string | undefined,
    };

    update.profileComplete =
      Boolean(merged.displayName?.trim()) &&
      Boolean(merged.rollNumber?.trim()) &&
      Boolean(merged.batch) &&
      Boolean(merged.section) &&
      Boolean(merged.campusMail?.trim());

    const user = await User.findOneAndUpdate(
      { uid: req.user!.uid },
      { $set: update },
      { new: true, runValidators: true, projection: '-__v' }
    );

    res.json({ message: 'Profile updated', user });
  } catch (err: any) {
    if (err.code === 11000) {
      res.status(409).json({ message: 'Roll number already in use' });
    } else {
      res.status(500).json({ message: 'Internal server error', error: String(err) });
    }
  }
});

// ─── GET /api/students ────────────────────────────────────────────────────────
/**
 * Public endpoint — returns all users who have completed their profile.
 * Sensitive fields (email, provider, __v) are stripped.
 * Supports optional ?batch=2023&section=A query filters.
 */
router.get('/students', async (req, res: Response): Promise<void> => {
  try {
    const { batch, section } = req.query;

    const filter: Record<string, unknown> = { profileComplete: true };
    if (batch)   filter.batch   = batch;
    if (section) filter.section = section;

    // Projection must be all-inclusion or all-exclusion (can't mix).
    // Exclude sensitive fields; everything else comes through.
    const users = await User.find(filter, {
      email: 0,
      campusMail: 0,
      provider: 0,
      lastLoginAt: 0,
      createdAt: 0,
      profileComplete: 0,
      __v: 0,
    }).sort({ batch: -1, section: 1, rollNumber: 1 });

    res.json({ students: users });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', error: String(err) });
  }
});

// ─── Avatar upload helpers ────────────────────────────────────────────────────

const avatarUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 3 * 1024 * 1024 }, // 3 MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed'));
  },
});

function localAvatarDir(): string {
  const dir = path.resolve(process.cwd(), 'uploads', 'avatars');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return dir;
}

// ─── POST /api/profile/avatar ─────────────────────────────────────────────────
/**
 * Upload / replace the current user's profile photo.
 * Accepts multipart/form-data with field name "avatar".
 * Returns { photoURL: string } and saves it on the User document.
 */
router.post(
  '/avatar',
  requireAuth,
  (req: AuthRequest, res: Response, next: any) => {
    avatarUpload.single('avatar')(req as any, res as any, (err: any) => {
      if (err instanceof multer.MulterError) {
        res.status(400).json({ message: `Upload error: ${err.message}` });
        return;
      }
      if (err) {
        res.status(400).json({ message: err.message });
        return;
      }
      next();
    });
  },
  async (req: AuthRequest, res: Response): Promise<void> => {
    const file = (req as any).file as Express.Multer.File | undefined;
    if (!file) {
      res.status(400).json({ message: 'No image file provided' });
      return;
    }

    let photoURL: string;

    if (isImageKitConfigured()) {
      try {
        const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
        const fileName = `avatar-${req.user!.uid}-${Date.now()}${ext}`;
        const uploadable = await toFile(file.buffer, fileName, { type: file.mimetype });
        const result = await imagekit.files.upload({
          file: uploadable,
          fileName,
          folder: '/avatars',
          useUniqueFileName: false,
        });
        photoURL = result.url ?? '';
      } catch (err: any) {
        res.status(500).json({ message: 'ImageKit upload failed: ' + (err.message ?? String(err)) });
        return;
      }
    } else {
      // Local fallback
      const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
      const fileName = `avatar-${req.user!.uid}-${Date.now()}${ext}`;
      fs.writeFileSync(path.join(localAvatarDir(), fileName), file.buffer);
      const baseUrl = process.env.SERVER_URL ?? `http://localhost:${process.env.PORT ?? 5000}`;
      photoURL = `${baseUrl}/uploads/avatars/${fileName}`;
    }

    try {
      await User.findOneAndUpdate({ uid: req.user!.uid }, { $set: { photoURL } });
      res.json({ photoURL });
    } catch (err) {
      res.status(500).json({ message: 'Failed to save photo URL', error: String(err) });
    }
  }
);

export default router;

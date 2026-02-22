import { Router, Response } from 'express';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { User } from '../models/User';

const router = Router();

/**
 * POST /api/auth/login
 * Called by the frontend right after Firebase sign-in.
 * Upserts the user record in MongoDB so we have a local profile.
 * Requires a valid Firebase ID token in Authorization header.
 */
router.post('/login', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const decoded = req.user!;

    const user = await User.findOneAndUpdate(
      { uid: decoded.uid },
      {
        uid:         decoded.uid,
        email:       decoded.email ?? '',
        displayName: decoded.name,
        photoURL:    decoded.picture,
        provider:    decoded.firebase?.sign_in_provider ?? 'password',
        lastLoginAt: new Date(),
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.json({ message: 'Login successful', user });
  } catch (err) {
    console.error('[Auth] /login error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * GET /api/auth/me
 * Returns the current user's DB profile.
 */
router.get('/me', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findOne({ uid: req.user!.uid });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;

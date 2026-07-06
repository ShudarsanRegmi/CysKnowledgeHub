import { Router, Response } from 'express';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { requireRole } from '../middleware/requireRole';
import { Faculty } from '../models/Faculty';

const router = Router();

// ─── Public: list all faculty ─────────────────────────────────────────────────

router.get('/', async (_req, res: Response): Promise<void> => {
  try {
    const faculty = await Faculty.find().sort({ order: 1, createdAt: 1 });
    res.json({ faculty });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch faculty', error: String(err) });
  }
});

// ─── Admin CRUD ───────────────────────────────────────────────────────────────

router.use('/admin', requireAuth, requireRole('admin'));

/** POST /api/faculty/admin — create a faculty member */
router.post('/admin', async (req: AuthRequest, res: Response): Promise<void> => {
  const { name, designation, email, linkedinUrl, scholarUrl, bio, photoUrl, subjects, researchInterests } = req.body;
  if (!name?.trim() || !designation?.trim() || !email?.trim() || !bio?.trim()) {
    res.status(400).json({ message: 'name, designation, email, and bio are required' });
    return;
  }

  try {
    const last = await Faculty.findOne().sort({ order: -1 });
    const order = (last?.order ?? -1) + 1;
    const faculty = await Faculty.create({
      name: name.trim(),
      designation: designation.trim(),
      email: email.trim(),
      linkedinUrl,
      scholarUrl,
      bio: bio.trim(),
      photoUrl,
      subjects: subjects ?? [],
      researchInterests: researchInterests ?? [],
      order,
    });
    res.status(201).json({ faculty });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create faculty', error: String(err) });
  }
});

/** PATCH /api/faculty/admin/:id — update a faculty member */
router.patch('/admin/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  const { name, designation, email, linkedinUrl, scholarUrl, bio, photoUrl, subjects, researchInterests } = req.body;
  try {
    const update: any = {};
    if (name !== undefined) update.name = name.trim();
    if (designation !== undefined) update.designation = designation.trim();
    if (email !== undefined) update.email = email.trim();
    if (linkedinUrl !== undefined) update.linkedinUrl = linkedinUrl;
    if (scholarUrl !== undefined) update.scholarUrl = scholarUrl;
    if (bio !== undefined) update.bio = bio.trim();
    if (photoUrl !== undefined) update.photoUrl = photoUrl;
    if (subjects !== undefined) update.subjects = subjects;
    if (researchInterests !== undefined) update.researchInterests = researchInterests;

    const faculty = await Faculty.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!faculty) { res.status(404).json({ message: 'Faculty not found' }); return; }
    res.json({ faculty });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update faculty', error: String(err) });
  }
});

/** DELETE /api/faculty/admin/:id — delete a faculty member */
router.delete('/admin/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const faculty = await Faculty.findByIdAndDelete(req.params.id);
    if (!faculty) { res.status(404).json({ message: 'Faculty not found' }); return; }
    res.json({ message: 'Faculty deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete faculty', error: String(err) });
  }
});

export default router;

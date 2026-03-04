import { Router, Response, Request } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { requireRole } from '../middleware/requireRole';

const router = Router();

// ─── Helpers ──────────────────────────────────────────────────────────────────

function uploadDir(type: string): string {
  const sub = type === 'blog' ? 'blog-images' : 'ctf-images';
  const dir = path.resolve(process.cwd(), 'uploads', sub);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return dir;
}

// Ensure both default dirs exist at startup
uploadDir('ctf');
uploadDir('blog');

// ─── Storage configuration ────────────────────────────────────────────────────

const storage = multer.diskStorage({
  destination: (req, _file, cb) => cb(null, uploadDir((req.query?.type as string) ?? 'ctf')),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB max
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

// ─── POST /api/upload/image ───────────────────────────────────────────────────

router.post(
  '/image',
  requireAuth,
  requireRole('author'),
  (req: Request, res: Response, next: any) => {
    upload.single('image')(req as any, res as any, (err: any) => {
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
  (req: Request, res: Response): void => {
    const file = (req as any).file as Express.Multer.File | undefined;
    if (!file) {
      res.status(400).json({ message: 'No image file provided' });
      return;
    }

    const uploadType = ((req as any).query?.type === 'blog') ? 'blog-images' : 'ctf-images';
    const baseUrl = process.env.SERVER_URL ?? `http://localhost:${process.env.PORT ?? 5000}`;
    const url = `${baseUrl}/uploads/${uploadType}/${file.filename}`;
    res.json({ url });
  }
);

export default router;

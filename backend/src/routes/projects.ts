import { Router, Request, Response } from 'express';
import { Project } from '../models/Project';

const router = Router();

// GET /api/projects
// Query params: featured, category, projectType, techStack, year, search
router.get('/', async (req: Request, res: Response) => {
  try {
    const filter: Record<string, any> = {};

    if (req.query.featured === 'true') filter.featured = true;
    if (req.query.category) filter.categories = req.query.category as string;
    if (req.query.projectType) filter.projectType = req.query.projectType as string;
    if (req.query.techStack) filter.techStack = req.query.techStack as string;
    if (req.query.year) filter.year = req.query.year as string;

    // Full-text search across title, abstract, tags, categories, contributors, techStack
    if (req.query.search) {
      const regex = new RegExp(req.query.search as string, 'i');
      filter.$or = [
        { title: regex },
        { abstract: regex },
        { description: regex },
        { tags: regex },
        { categories: regex },
        { contributors: regex },
        { techStack: regex },
      ];
    }

    const projects = await Project.find(filter).sort({ featured: -1, year: -1, createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// GET /api/projects/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

export default router;

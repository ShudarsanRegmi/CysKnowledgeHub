import { Router, Request, Response } from 'express';
import { Company } from '../models/Company';

const router = Router();

// GET /api/companies
router.get('/', async (req: Request, res: Response) => {
  try {
    const search = req.query.search as string | undefined;
    const industry = req.query.industry as string | undefined;
    const opportunityType = req.query.opportunityType as string | undefined;
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 12));

    const filter: Record<string, any> = {};

    if (search) {
      const regex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      filter.$or = [
        { companyName: regex },
        { industry: regex },
        { roles: regex },
      ];
    }

    if (industry) {
      const vals = industry.split(',').map(s => s.trim()).filter(Boolean);
      if (vals.length === 1) filter.industry = vals[0];
      else if (vals.length > 1) filter.industry = { $in: vals };
    }
    if (opportunityType) {
      const vals = opportunityType.split(',').map(s => s.trim()).filter(Boolean);
      if (vals.length === 1) filter.opportunityType = vals[0];
      else if (vals.length > 1) filter.opportunityType = { $in: vals };
    }

    const [companies, total] = await Promise.all([
      Company.find(filter).sort({ companyName: 1 }).skip((page - 1) * limit).limit(limit),
      Company.countDocuments(filter),
    ]);

    res.json({ companies, total, page, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch companies' });
  }
});

// GET /api/companies/filters — distinct filter options
router.get('/filters', async (_req: Request, res: Response) => {
  try {
    const [industries, opportunityTypes] = await Promise.all([
      Company.distinct('industry'),
      Company.distinct('opportunityType'),
    ]);
    res.json({
      industries: industries.filter(Boolean).sort(),
      opportunityTypes: opportunityTypes.filter(Boolean).sort(),
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch filters' });
  }
});

// GET /api/companies/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ error: 'Company not found' });
    res.json(company);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch company' });
  }
});

export default router;

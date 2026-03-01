import { Router, Request, Response } from 'express';
import { Company } from '../models/Company';

const router = Router();

// GET /api/companies
router.get('/', async (req: Request, res: Response) => {
  try {
    const filter: Record<string, any> = {};
    if (req.query.industry) filter.industry = req.query.industry as string;
    if (req.query.opportunityType) {
      filter.opportunityType = req.query.opportunityType as string;
    }

    const companies = await Company.find(filter).sort({ companyName: 1 });
    res.json(companies);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch companies' });
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

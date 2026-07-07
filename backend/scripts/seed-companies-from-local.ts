import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const MONGO_URI = (() => {
  const { MONGO_URI: uri, MONGODB_USERNAME, MONGODB_PASSWORD, MONGODB_CLUSTER } = process.env;
  if (uri) return uri;
  if (MONGODB_USERNAME && MONGODB_PASSWORD && MONGODB_CLUSTER) {
    return `mongodb+srv://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@${MONGODB_CLUSTER}.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
  }
  return 'mongodb://localhost:27017/ctf';
})();

const DATA_PATH = path.resolve(__dirname, '../companies/data3.json');

interface HavelocCompany {
  id: number;
  name: string;
  webSiteLink?: string;
  description?: string;
  imageUrl?: string;
  city?: string;
  state?: string;
  country?: string;
  businessNature?: string;
  organizationType?: string;
  employeeCount?: string;
  annualTurnover?: string;
  establishmentDate?: string;
  headOfficeAddress?: string;
  postalCode?: string;
}

const CompanySchema = new mongoose.Schema({
  companyName: { type: String, required: true, trim: true },
  logo: { type: String, default: '' },
  industry: { type: String, default: '' },
  location: { type: String, default: '' },
  website: { type: String, default: '' },
  roles: { type: [String], default: [] },
  eligibilityCriteria: { type: String, default: '' },
  salaryPackage: { type: String, default: '' },
  ctc: { type: Number },
  opportunityType: { type: [String], default: [] },
  selectionProcess: { type: [String], default: [] },
  interviewExperience: { type: String },
  notesTips: { type: String, default: '' },
}, { timestamps: true });

const Company = mongoose.model('Company', CompanySchema);

function buildLocation(c: HavelocCompany): string {
  const parts = [c.city, c.state, c.country].filter(Boolean);
  return parts.length > 0 ? parts.join(', ') : '';
}

function mapCompany(c: HavelocCompany) {
  if (!c.name || !c.name.trim()) return null;
  const industry = c.businessNature || c.organizationType || '';
  const location = buildLocation(c);
  const website = c.webSiteLink && c.webSiteLink.startsWith('http')
    ? c.webSiteLink
    : c.webSiteLink
      ? `https://${c.webSiteLink}`
      : '';
  const logo = c.imageUrl || '';
  const notesTips = c.description || '';

  return {
    companyName: c.name.trim(),
    logo,
    industry,
    location,
    website,
    notesTips,
  };
}

async function main() {
  console.log('📦 Connecting to MongoDB...');
  await mongoose.connect(MONGO_URI);
  console.log('✅ Connected to MongoDB\n');

  const raw = fs.readFileSync(DATA_PATH, 'utf-8');
  const data = JSON.parse(raw);
  const companies: HavelocCompany[] = data._embedded?.entityModels ?? [];
  console.log(`📄 Loaded ${companies.length} companies from data3.json\n`);

  let inserted = 0;
  let updated = 0;
  let skipped = 0;

  for (const c of companies) {
    const mapped = mapCompany(c);
    if (!mapped) { skipped++; continue; }

    const existing = await Company.findOne({ companyName: mapped.companyName });
    if (existing) {
      await Company.updateOne({ _id: existing._id }, { $set: mapped });
      updated++;
    } else {
      await Company.create(mapped);
      inserted++;
    }
  }

  console.log(`\n✅ Done! Inserted: ${inserted}, Updated: ${updated}, Skipped: ${skipped}`);
  await mongoose.disconnect();
}

main().catch(err => {
  console.error('❌ Script failed:', err);
  process.exit(1);
});

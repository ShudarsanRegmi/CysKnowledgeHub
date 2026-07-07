/**
 * seed-companies-from-haveloc.ts
 *
 * Fetches ALL companies from the Haveloc placement portal API (with pagination)
 * and upserts them into the MongoDB companies collection.
 *
 * Run: npx ts-node-dev --transpile-only scripts/seed-companies-from-haveloc.ts
 */

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Company } from '../src/models/Company';

dotenv.config();

// ─── MongoDB URI builder (same pattern as seed-content.ts) ───────────────────

function buildMongoURI(): string {
  if (process.env.MONGO_URI) return process.env.MONGO_URI;
  const username = process.env.MONGODB_USERNAME;
  const password = process.env.MONGODB_PASSWORD;
  const database = process.env.MONGODB_DATABASE ?? 'cybershield';
  if (username && password) {
    const cluster = process.env.MONGODB_CLUSTER ?? 'cysknowledgehub.sxc3yvo.mongodb.net';
    return `mongodb+srv://${encodeURIComponent(username)}:${encodeURIComponent(password)}@${cluster}/${database}?appName=Cysknowledgehub`;
  }
  return `mongodb://localhost:27017/${database}`;
}

// ─── Haveloc API helpers ─────────────────────────────────────────────────────

const HAVELOC_BASE = 'https://app.haveloc.com';
const PAGE_SIZE = 20;

interface HavelocCompany {
  id: number;
  name: string;
  webSiteLink?: string;
  description?: string;
  imagePath?: string;
  imageUrl?: string;
  city?: string;
  state?: string;
  country?: string;
  organizationType?: string;
  businessNature?: string;
  employeeCount?: string;
}

interface HavelocPage {
  _embedded?: { entityModels: HavelocCompany[] };
  _links?: {
    next?: { href: string };
    self?: { href: string };
  };
  page?: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
}

async function fetchPage(url: string): Promise<HavelocPage> {
  const apiKey = process.env.HAVELOC_API_KEY!;
  const cookie = process.env.HAVELOC_COOKIE!;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'api-key': apiKey,
      cookie: cookie,
      accept: 'application/json, text/plain, */*',
      origin: 'https://placements.haveloc.com',
      referer: 'https://placements.haveloc.com/',
    },
    body: '{}',
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status} fetching ${url}: ${await res.text()}`);
  }

  return res.json();
}

// ─── Mapper ──────────────────────────────────────────────────────────────────

function mapCompany(c: HavelocCompany) {
  const location = [c.city, c.state, c.country].filter(Boolean).join(', ');
  const notesTips = c.description
    ? c.description.replace(/<[^>]*>/g, '').trim()
    : '';

  let industry = c.organizationType ?? c.businessNature ?? '';
  if (!industry && notesTips.toLowerCase().includes('security')) {
    industry = 'Cybersecurity';
  }
  if (!industry) industry = 'Technology';

  return {
    companyName: c.name.trim(),
    logo: c.imageUrl ?? '',
    industry,
    location,
    website: c.webSiteLink ?? '',
    roles: [] as string[],
    eligibilityCriteria: '',
    salaryPackage: '',
    ctc: undefined as number | undefined,
    opportunityType: ['Placement'] as string[],
    selectionProcess: [] as string[],
    interviewExperience: undefined as string | undefined,
    notesTips,
  };
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  const uri = buildMongoURI();
  if (!uri) {
    console.error('❌ MONGODB_URI not set in environment / .env');
    process.exit(1);
  }
  if (!process.env.HAVELOC_API_KEY || !process.env.HAVELOC_COOKIE) {
    console.error('❌ HAVELOC_API_KEY and HAVELOC_COOKIE must be set in .env');
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log('📦 Connected to MongoDB\n');

  // ── Fetch first page to discover total pages ──────────────────────────────

  const firstUrl = `${HAVELOC_BASE}/app/companyViews?respectConfigProp=false&sort=name%2Casc&size=${PAGE_SIZE}`;
  console.log(`🌐 Fetching: ${firstUrl}`);
  const firstPage = await fetchPage(firstUrl);
  const companies = firstPage._embedded?.entityModels ?? [];
  const totalPages = firstPage.page?.totalPages ?? 1;
  const totalElements = firstPage.page?.totalElements ?? companies.length;
  console.log(`📊 Total elements: ${totalElements}, pages: ${totalPages}\n`);

  // ── Fetch remaining pages ─────────────────────────────────────────────────

  const fetches: Promise<HavelocPage>[] = [];
  for (let page = 1; page < totalPages; page++) {
    const url = `${HAVELOC_BASE}/app/companyViews?respectConfigProp=false&sort=name%2Casc&size=${PAGE_SIZE}&page=${page}`;
    console.log(`🌐 Fetching page ${page + 1}/${totalPages}`);
    fetches.push(fetchPage(url));
  }
  const restPages = await Promise.all(fetches);
  for (const pg of restPages) {
    companies.push(...(pg._embedded?.entityModels ?? []));
  }

  console.log(`\n📥 Total companies fetched: ${companies.length}`);

  // ── Upsert into MongoDB ───────────────────────────────────────────────────

  let inserted = 0;
  let updated = 0;

  for (const c of companies) {
    const doc = mapCompany(c);
    const existing = await Company.findOne({ companyName: doc.companyName });
    if (existing) {
      await Company.updateOne({ _id: existing._id }, { $set: doc });
      updated++;
    } else {
      await Company.create(doc);
      inserted++;
    }
  }

  console.log(`✅ Done — ${inserted} inserted, ${updated} updated`);

  await mongoose.disconnect();
  console.log('🔌 Disconnected from MongoDB');
}

main().catch((err) => {
  console.error('❌ Script failed:', err);
  process.exit(1);
});

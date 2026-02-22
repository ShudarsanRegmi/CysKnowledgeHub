import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/cybershield';

export async function connectDB(): Promise<void> {
  try {
    await mongoose.connect(MONGO_URI);
    console.log(`[MongoDB] Connected → ${MONGO_URI}`);
  } catch (err) {
    console.error('[MongoDB] Connection failed:', err);
    process.exit(1);
  }
}

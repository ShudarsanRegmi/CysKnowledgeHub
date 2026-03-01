import mongoose from 'mongoose';

function buildMongoURI(): string {
  if (process.env.MONGO_URI) return process.env.MONGO_URI;

  const username = process.env.MONGODB_USERNAME;
  const password = process.env.MONGODB_PASSWORD;

  if (username && password) {
    return `mongodb+srv://${encodeURIComponent(username)}:${encodeURIComponent(password)}@cysknowledgehub.sxc3yvo.mongodb.net/?appName=Cysknowledgehub`;
  }

  // Fallback to local instance
  return 'mongodb://localhost:27017/cybershield';
}

const MONGO_URI = buildMongoURI();

export async function connectDB(): Promise<void> {
  try {
    await mongoose.connect(MONGO_URI, { family: 4 });
    console.log(`[MongoDB] Connected → ${MONGO_URI}`);
  } catch (err) {
    console.error('[MongoDB] Connection failed:', err);
    process.exit(1);
  }
}

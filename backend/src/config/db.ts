import mongoose from 'mongoose';

function buildMongoURI(): string {
  if (process.env.MONGO_URI) return process.env.MONGO_URI;

  const username = process.env.MONGODB_USERNAME;
  const password = process.env.MONGODB_PASSWORD;

  // Each developer should set MONGODB_DATABASE to a unique name (e.g. 'cybershield_gokul')
  // so that different Firebase projects don't share the same collections on Atlas.
  const database = process.env.MONGODB_DATABASE ?? 'cybershield';

  if (username && password) {
    const cluster = process.env.MONGODB_CLUSTER ?? 'cysknowledgehub.sxc3yvo.mongodb.net';
    return `mongodb+srv://${encodeURIComponent(username)}:${encodeURIComponent(password)}@${cluster}/${database}?appName=Cysknowledgehub`;
  }

  // Fallback to local instance
  return `mongodb://localhost:27017/${database}`;
}

const database = process.env.MONGODB_DATABASE ?? 'cybershield';
const LOCAL_URI = `mongodb://localhost:27017/${database}`;
const MONGO_URI = buildMongoURI();

export async function connectDB(): Promise<void> {
  try {
    await mongoose.connect(MONGO_URI, { family: 4 });
    console.log(`[MongoDB] Connected → ${MONGO_URI}`);
  } catch (primaryErr) {
    if (MONGO_URI === LOCAL_URI) {
      // Already tried local — nothing left to fall back to
      console.error('[MongoDB] Connection failed:', primaryErr);
      process.exit(1);
    }

    console.warn(
      `[MongoDB] Primary connection failed — falling back to local instance (${LOCAL_URI})\n`,
      primaryErr,
    );

    try {
      await mongoose.connect(LOCAL_URI, { family: 4 });
      console.log(`[MongoDB] Connected (fallback) → ${LOCAL_URI}`);
    } catch (fallbackErr) {
      console.error('[MongoDB] Fallback connection also failed:', fallbackErr);
      process.exit(1);
    }
  }
}

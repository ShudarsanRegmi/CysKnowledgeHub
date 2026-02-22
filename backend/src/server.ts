import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { connectDB } from './config/db';
// Importing firebase config triggers admin SDK init with a clear warning
// if the service account key is missing.
import './config/firebase';

const PORT = Number(process.env.PORT ?? 5000);

async function bootstrap() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`[Server] Running on http://localhost:${PORT}`);
    console.log(`[Server] Health check → http://localhost:${PORT}/health`);
  });
}

bootstrap();

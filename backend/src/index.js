import dotenv from 'dotenv';
import app from './app.js';
import { initDb } from './config/db.js';

dotenv.config();

const port = process.env.PORT || 4000;

try {
  await initDb();
  app.listen(port, () => {
    console.log(`Backend listening on http://localhost:${port}`);
  });
} catch (error) {
  console.error('Failed to start backend:', error);
  process.exit(1);
}

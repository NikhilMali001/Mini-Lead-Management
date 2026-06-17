import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();
const { default: pool, initDb } = await import('../config/db.js');

const migrationPath = path.resolve('src', 'db', 'migrations.sql');

const runMigrations = async () => {
  await initDb();
  const sql = fs.readFileSync(migrationPath, 'utf8');
  await pool.query(sql);
  console.log('Database migration completed successfully.');
  process.exit(0);
};

runMigrations().catch((error) => {
  console.error('Database migration failed:', error);
  process.exit(1);
});

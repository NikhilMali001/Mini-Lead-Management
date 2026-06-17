import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

dotenv.config();
const { default: pool } = await import('../config/db.js');
const { findUserByEmail, createUser } = await import('../models/user.model.js');

const SALT_ROUNDS = 10;

const users = [
  { name: 'Admin User', email: 'admin@example.com', password: 'Admin@123', role: 'admin' },
  { name: 'Manager User', email: 'manager@example.com', password: 'Manager@123', role: 'manager' },
  { name: 'Agent User', email: 'agent@example.com', password: 'Agent@123', role: 'agent' },
];

const seedUsers = async () => {
  for (const entry of users) {
    const existing = await findUserByEmail(entry.email);
    if (!existing) {
      const passwordHash = await bcrypt.hash(entry.password, SALT_ROUNDS);
      await createUser({ name: entry.name, email: entry.email, passwordHash, role: entry.role });
      console.log(`Created user ${entry.email} (${entry.role})`);
    } else {
      console.log(`User ${entry.email} already exists`);
    }
  }
};

seedUsers()
  .then(() => {
    console.log('Seed complete');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  });

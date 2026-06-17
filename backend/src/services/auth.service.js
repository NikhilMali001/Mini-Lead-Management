import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { jwtSecret, jwtExpiresIn } from '../config/jwt.js';
import {
  createUser,
  findUserByEmail,
  findUserById,
} from '../models/user.model.js';

const SALT_ROUNDS = 10;

export const registerUser = async ({ name, email, password, role = 'agent' }) => {
  if (!name || !email || !password) {
    const error = new Error('Name, email, and password are required');
    error.status = 400;
    throw error;
  }

  const existing = await findUserByEmail(email);
  if (existing) {
    const error = new Error('Email already in use');
    error.status = 409;
    throw error;
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await createUser({ name, email, passwordHash, role });
  return { id: user.id, name: user.name, email: user.email, role: user.role };
};

export const loginUser = async ({ email, password }) => {
  if (!email || !password) {
    const error = new Error('Email and password are required');
    error.status = 400;
    throw error;
  }

  const user = await findUserByEmail(email);
  if (!user) {
    const error = new Error('Invalid email or password');
    error.status = 401;
    throw error;
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    const error = new Error('Invalid email or password');
    error.status = 401;
    throw error;
  }

  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role },
    jwtSecret,
    { expiresIn: jwtExpiresIn }
  );
  return token;
};

export const getCurrentUser = async (userId) => {
  return findUserById(userId);
};

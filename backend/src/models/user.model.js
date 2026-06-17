import pool from '../config/db.js';

export const findUserByEmail = async (email) => {
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0];
};

export const findUserById = async (id) => {
  const [rows] = await pool.query('SELECT id, name, email, role, created_at FROM users WHERE id = ?', [id]);
  return rows[0];
};

export const createUser = async ({ name, email, passwordHash, role }) => {
  const [result] = await pool.query(
    'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
    [name, email, passwordHash, role]
  );

  const [rows] = await pool.query('SELECT id, name, email, role, created_at FROM users WHERE id = ?', [result.insertId]);
  return rows[0];
};

export const listAgents = async () => {
  const [rows] = await pool.query('SELECT id, name, email, role FROM users WHERE role = ? ORDER BY name', ['agent']);
  return rows;
};

export const findAgentById = async (id) => {
  const [rows] = await pool.query('SELECT id, name, email, role FROM users WHERE id = ?', [id]);
  return rows[0];
};

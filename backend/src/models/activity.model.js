import pool from '../config/db.js';

export const createActivity = async ({ leadId, action, performedBy, notes = '' }) => {
  const [result] = await pool.query(
    'INSERT INTO activities (lead_id, action, performed_by, notes) VALUES (?, ?, ?, ?)',
    [leadId, action, performedBy, notes]
  );

  const [rows] = await pool.query('SELECT * FROM activities WHERE id = ?', [result.insertId]);
  return rows[0];
};

export const listActivities = async ({ page, limit, offset, leadId }) => {
  const filters = [];
  const values = [];

  if (leadId) {
    filters.push('lead_id = ?');
    values.push(leadId);
  }

  const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
  const [totalResult] = await pool.query(`SELECT COUNT(*) AS count FROM activities ${whereClause}`, values);
  const total = Number(totalResult[0].count);

  const query = `SELECT * FROM activities ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`;
  values.push(limit, offset);

  const [rows] = await pool.query(query, values);
  return {
    activities: rows,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
};

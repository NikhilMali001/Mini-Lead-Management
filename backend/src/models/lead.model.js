import pool from '../config/db.js';

export const findLeastLoadedAgent = async () => {
  const query = `
    SELECT u.id, u.name, u.email, COALESCE(counts.lead_count, 0) AS lead_count
    FROM users u
    LEFT JOIN (
      SELECT assigned_to, COUNT(*) AS lead_count
      FROM leads
      GROUP BY assigned_to
    ) counts ON u.id = counts.assigned_to
    WHERE u.role = ?
    ORDER BY COALESCE(counts.lead_count, 0), u.id
    LIMIT 1
  `;
  const [rows] = await pool.query(query, ['agent']);
  return rows[0];
};

export const createLead = async ({ name, email, phone, source, status = 'new', notes = '', assigned_to } = {}) => {
  let assignedTo = assigned_to;
  if (assignedTo === undefined) {
    const agent = await findLeastLoadedAgent();
    assignedTo = agent ? agent.id : null;
  }

  const [result] = await pool.query(
    'INSERT INTO leads (name, email, phone, source, status, assigned_to, notes) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [name, email, phone, source, status, assignedTo, notes]
  );

  const [rows] = await pool.query('SELECT * FROM leads WHERE id = ?', [result.insertId]);
  return rows[0];
};

export const getLeadById = async (id) => {
  const [rows] = await pool.query(
    `SELECT leads.*, u.name AS assigned_to_name, u.email AS assigned_to_email
     FROM leads
     LEFT JOIN users u ON leads.assigned_to = u.id
     WHERE leads.id = ?`,
    [id]
  );
  return rows[0];
};

export const updateLead = async (id, data) => {
  const fields = [];
  const values = [];

  for (const key of ['name', 'email', 'phone', 'source', 'status', 'assigned_to', 'notes']) {
    if (data[key] !== undefined) {
      fields.push(`${key} = ?`);
      values.push(data[key]);
    }
  }

  if (fields.length === 0) {
    const [rows] = await pool.query('SELECT * FROM leads WHERE id = ?', [id]);
    return rows[0];
  }

  values.push(id);
  const query = `UPDATE leads SET ${fields.join(', ')}, updated_at = NOW() WHERE id = ?`;
  await pool.query(query, values);

  const [rows] = await pool.query('SELECT * FROM leads WHERE id = ?', [id]);
  return rows[0];
};

export const deleteLead = async (id) => {
  await pool.query('DELETE FROM leads WHERE id = ?', [id]);
};

export const listLeads = async (user, query) => {
  const filters = [];
  const values = [];

  if (query.search) {
    const searchValue = `%${query.search}%`;
    filters.push(`(
      leads.name LIKE ? OR
      leads.email LIKE ? OR
      leads.phone LIKE ? OR
      leads.status LIKE ? OR
      leads.source LIKE ?
    )`);
    values.push(searchValue, searchValue, searchValue, searchValue, searchValue);
  }

  if (query.status) {
    filters.push('LOWER(leads.status) = LOWER(?)');
    values.push(query.status);
  }

  if (query.source) {
    filters.push('LOWER(leads.source) = LOWER(?)');
    values.push(query.source);
  }

  if (user.role === 'agent') {
    filters.push('leads.assigned_to = ?');
    values.push(user.id);
  }

  const where = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
  const sortField = ['name', 'created_at', 'status', 'source'].includes(query.sort) ? `leads.${query.sort}` : 'leads.created_at';
  const sortOrder = query.order === 'asc' ? 'ASC' : 'DESC';
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 50);
  const offset = (page - 1) * limit;

  const [countResult] = await pool.query(`SELECT COUNT(*) AS count FROM leads ${where}`, values);
  const total = Number(countResult[0].count);

  const [assignedCountResult] = await pool.query('SELECT COUNT(*) AS count FROM leads WHERE assigned_to IS NOT NULL');
  const assignedCount = Number(assignedCountResult[0].count);

  const finalQuery = `SELECT leads.*, u.name AS assigned_to_name, u.email AS assigned_to_email FROM leads LEFT JOIN users u ON leads.assigned_to = u.id ${where} ORDER BY ${sortField} ${sortOrder} LIMIT ? OFFSET ?`;
  values.push(limit, offset);
  const [rows] = await pool.query(finalQuery, values);

  return {
    leads: rows,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    assignedCount,
  };
};

import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL must be set in .env');
}

const databaseUrl = new URL(process.env.DATABASE_URL);
const dbName = databaseUrl.pathname?.slice(1);
const baseConfig = {
  host: databaseUrl.hostname,
  port: databaseUrl.port ? Number(databaseUrl.port) : 3306,
  user: databaseUrl.username,
  password: databaseUrl.password,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  multipleStatements: true,
};

let pool = mysql.createPool({
  ...baseConfig,
  database: dbName,
});

export const initDb = async () => {
  try {
    const connection = await pool.getConnection();
    try {
      await connection.ping();
      console.log('MySQL connected');
    } finally {
      connection.release();
    }
  } catch (error) {
    if (error.code === 'ER_BAD_DB_ERROR' && dbName) {
      const initPool = mysql.createPool(baseConfig);
      const connection = await initPool.getConnection();
      try {
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
        console.log(`Created database ${dbName}`);
      } finally {
        connection.release();
        await initPool.end();
      }

      pool = mysql.createPool({
        ...baseConfig,
        database: dbName,
      });
      const connection2 = await pool.getConnection();
      try {
        await connection2.ping();
        console.log('MySQL connected after creating database');
      } finally {
        connection2.release();
      }
    } else {
      throw error;
    }
  }
};

export default pool;

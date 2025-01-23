import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'bibliaho_noticias',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  dateStrings: true // This ensures dates are returned as strings in YYYY-MM-DD format
});

export async function query<T>(sql: string, params?: any[]): Promise<T> {
  try {
    const [rows] = await pool.execute(sql, params);
    return rows as T;
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
}

export const db = {
  query
};
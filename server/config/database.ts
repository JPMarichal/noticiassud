import pg from 'pg';
import mysql from 'mysql2/promise';

interface DatabaseConfig {
  type: 'mysql' | 'postgresql';
  host: string;
  user: string;
  password: string;
  database: string;
  port?: number;
}

const config: DatabaseConfig = {
  type: (process.env.DB_TYPE || 'mysql') as 'mysql' | 'postgresql',
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'bibliaho_noticias',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : undefined
};

class DatabaseConnection {
  private static mysqlPool: mysql.Pool;
  private static pgPool: pg.Pool;

  static async getConnection() {
    if (config.type === 'mysql') {
      if (!this.mysqlPool) {
        this.mysqlPool = mysql.createPool({
          host: config.host,
          user: config.user,
          password: config.password,
          database: config.database,
          waitForConnections: true,
          connectionLimit: 10,
          queueLimit: 0,
          dateStrings: true
        });
      }
      return this.mysqlPool;
    } else {
      if (!this.pgPool) {
        this.pgPool = new pg.Pool({
          connectionString: process.env.DATABASE_URL,
        });
      }
      return this.pgPool;
    }
  }

  static async query<T>(sql: string, params?: any[]): Promise<T> {
    try {
      const connection = await this.getConnection();

      if (config.type === 'mysql') {
        const [rows] = await (connection as mysql.Pool).execute(sql, params);
        return rows as T;
      } else {
        const { rows } = await (connection as pg.Pool).query(sql, params);
        return rows as T;
      }
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  }
}

export const db = {
  query: DatabaseConnection.query.bind(DatabaseConnection),
  config
};
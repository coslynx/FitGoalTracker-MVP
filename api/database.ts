import { Pool } from 'pg';

export class Database {
  private pool: Pool;

  constructor() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('DATABASE_URL environment variable not set.');
    }
    this.pool = new Pool({ connectionString });
  }

  async query(queryText: string, params?: any[]): Promise<any[]> {
    try {
      const client = await this.pool.connect();
      const result = await client.query(queryText, params);
      client.release();
      return result.rows;
    } catch (error) {
      console.error('Database query error:', error);
      throw new Error(`Database query failed: ${error.message}`);
    }
  }

  async transaction(queries: string[]): Promise<void> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      for (const query of queries) {
        await client.query(query);
      }
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Database transaction error:', error);
      throw new Error(`Database transaction failed: ${error.message}`);
    } finally {
      client.release();
    }
  }
}

export const db = new Database();

```
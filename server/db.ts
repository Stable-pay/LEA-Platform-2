
import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import ws from 'ws';
import * as schema from '@shared/schema';

neonConfig.webSocketConstructor = ws;

// Use default SQLite for local development if no DATABASE_URL
const DATABASE_URL = process.env.DATABASE_URL || 'postgres://postgres:postgres@0.0.0.0:5432/mydb';

// Create connection pool
const sql = neon(DATABASE_URL);
export const db = drizzle(sql, { schema });

// Test database connection
async function testConnection() {
  try {
    await sql`SELECT 1`;
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }
}

testConnection();

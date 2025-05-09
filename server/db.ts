
import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import ws from 'ws';
import * as schema from '@shared/schema';

neonConfig.webSocketConstructor = ws;

const DATABASE_URL = `https://${process.env.REPL_ID}.winter-water-28073687.repl.co`;

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

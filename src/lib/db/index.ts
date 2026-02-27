import { Pool, QueryResult } from "pg";

// Database connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Handle pool errors
pool.on("error", (err) => {
  console.error("Unexpected database pool error:", err);
});

// Query helper function
export async function query<T extends Record<string, any> = any>(
  text: string,
  params?: any[]
): Promise<QueryResult<T>> {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    
    if (process.env.NODE_ENV === "development") {
      console.log("Query executed:", { text: text.substring(0, 50), duration, rows: result.rowCount });
    }
    
    return result;
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  }
}

// Transaction helper
export async function transaction<T>(
  callback: (client: Pool) => Promise<T>
): Promise<T> {
  const client = await pool.connect();
  
  try {
    await client.query("BEGIN");
    const result = await callback(pool);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

// Connection test
export async function testConnection(): Promise<boolean> {
  try {
    const result = await query("SELECT NOW()");
    console.log("Database connected:", result.rows[0].now);
    return true;
  } catch (error) {
    console.error("Database connection failed:", error);
    return false;
  }
}

// Graceful shutdown
export async function closePool(): Promise<void> {
  await pool.end();
}

// Export pool for direct access if needed
export { pool };

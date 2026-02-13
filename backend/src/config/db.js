const { Pool } = require("pg")

// Create a new PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
})

// Test the connection immediately when server starts
const connectDB = async () => {
  try {
    const client = await pool.connect()
    console.log("PostgreSQL connected successfully")
    client.release()
  } catch (error) {
    console.error("PostgreSQL connection error:", error.message)
    process.exit(1)
  }
}

module.exports = {
  pool,
  connectDB
}

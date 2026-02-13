require("dotenv").config()
const fs = require("fs")
const path = require("path")
const { pool } = require("../config/db")

const runMigrations = async () => {
  try {
    const migrationsPath = path.join(__dirname, "migrations")
    const files = fs.readdirSync(migrationsPath).sort()

    for (const file of files) {
      const filePath = path.join(migrationsPath, file)
      const sql = fs.readFileSync(filePath, "utf-8")
      console.log(`Running migration: ${file}`)
      await pool.query(sql)
    }

    console.log("All migrations executed successfully")
    process.exit(0)
  } catch (error) {
    console.error("Migration error:", error)
    process.exit(1)
  }
}

runMigrations()

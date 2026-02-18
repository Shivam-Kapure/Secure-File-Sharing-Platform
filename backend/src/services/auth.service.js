const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { pool } = require("../config/db")

const SALT_ROUNDS = 10

// Register user
const registerUser = async (email, password) => {
  // Check if user exists
  const existingUser = await pool.query(
    "SELECT id FROM users WHERE email = $1",
    [email]
  )

  if (existingUser.rows.length > 0) {
    throw { status: 400, message: "Email already registered" }
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS)

  // Insert user
  const result = await pool.query(
    "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, created_at",
    [email, passwordHash]
  )

  return result.rows[0]
}

// Login user
const loginUser = async (email, password) => {
  const result = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  )

  if (result.rows.length === 0) {
    throw { status: 400, message: "Invalid credentials" }
  }

  const user = result.rows[0]

  const isMatch = await bcrypt.compare(password, user.password_hash)

  if (!isMatch) {
    throw { status: 400, message: "Invalid credentials" }
  }

  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  )

  return {
    token,
    user: {
      id: user.id,
      email: user.email
    }
  }
}

module.exports = {
  registerUser,
  loginUser
}

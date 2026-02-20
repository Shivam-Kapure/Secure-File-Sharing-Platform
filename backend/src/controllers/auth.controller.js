const { registerUser, loginUser } = require("../services/auth.service")

// Cookie options for JWT
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 60 * 60 * 1000 // 1 hour (matches JWT expiry)
}

const register = async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" })
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" })
    }

    const { user, token } = await registerUser(email, password)

    // Set JWT in HTTP-only cookie
    res.cookie("token", token, COOKIE_OPTIONS)

    res.status(201).json({
      message: "Registration successful",
      user
    })
  } catch (error) {
    next(error)
  }
}

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" })
    }

    const { user, token } = await loginUser(email, password)

    // Set JWT in HTTP-only cookie
    res.cookie("token", token, COOKIE_OPTIONS)

    res.status(200).json({
      message: "Login successful",
      user
    })
  } catch (error) {
    next(error)
  }
}

const logout = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict"
  })

  res.status(200).json({ message: "Logged out successfully" })
}

const getMe = async (req, res) => {
  res.status(200).json({
    message: "Authenticated",
    userId: req.user.userId
  })
}

module.exports = {
  register,
  login,
  logout,
  getMe
}

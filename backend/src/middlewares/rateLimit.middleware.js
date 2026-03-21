const rateLimit = require("express-rate-limit")

// General API limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests per IP
  message: {
    error: "Too many requests, please try again later."
  },
  standardHeaders: true,
  legacyHeaders: false
})

// Strict limiter for auth routes (login/register)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // stricter for login attempts
  message: {
    error: "Too many login attempts. Please try again later."
  }
})

module.exports = {
  apiLimiter,
  authLimiter
}
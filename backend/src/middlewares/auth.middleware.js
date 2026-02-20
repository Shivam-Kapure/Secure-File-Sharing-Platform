const jwt = require("jsonwebtoken")

const authenticate = (req, res, next) => {
    try {
        // Read JWT from HTTP-only cookie
        const token = req.cookies?.token

        if (!token) {
            return res.status(401).json({ error: "Authentication required" })
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = { userId: decoded.userId }

        next()
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ error: "Token expired, please login again" })
        }
        return res.status(401).json({ error: "Invalid token" })
    }
}

module.exports = { authenticate }

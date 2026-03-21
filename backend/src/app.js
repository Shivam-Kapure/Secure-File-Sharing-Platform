const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const { apiLimiter, authLimiter } = require("./middlewares/rateLimit.middleware");

const authRoutes = require("./routes/auth.routes");
const fileRoutes = require("./routes/file.routes");
const shareRoutes = require("./routes/share.routes");

const app = express();

// Security middleware
app.use(helmet());

// CORS
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true
}));

// Body parser
app.use(express.json({ limit: "10mb" }));

// Cookies
app.use(cookieParser());

// Logging
app.use(morgan("dev"));

// GLOBAL RATE LIMITER (applies to all routes)
app.use(apiLimiter);

// Auth routes with stricter limiter
app.use("/auth", authLimiter, authRoutes);

// Other routes
app.use("/files", fileRoutes);
app.use("/share", shareRoutes);

// Health check
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "OK",
        message: "Secure File Sharing Backend is running."
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: "Route not found."
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);

    res.status(err.status || 500).json({
        error: err.message || "Internal Server Error."
    });
});

module.exports = app;
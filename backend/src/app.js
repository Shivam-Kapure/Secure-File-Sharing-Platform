const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const authRoutes = require("./routes/auth.routes")



const app = express();

app.use(helmet());

app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true
}));

app.use(express.json({ limit: "10mb" }));

app.use(cookieParser());

app.use(morgan("dev"));

app.use("/auth", authRoutes)

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "OK",
        message: "Secure File Sharing Backend is running."
    })
});


app.use((req, res, next) => {
    res.status(404).json({
        error: "Route not found."
    })
});


app.use((err, req, res, next) => {
    console.error(err.stack)

    res.status(err.status || 500).json({
        error: err.message || "Internal Server Error."
    })
});


module.exports = app
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();

app.use(helmet());

app.use(cors());

app.use(express.json({ limit: "10mb"}));

app.use(morgan("dev"));

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

    res.status(err.stack || 500).json({
        error: err.message || "Internal Server Error."
    })
});


module.exports = app
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const issueRoutes = require("./routes/issueRoutes");

const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Root route
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome to CivicX API",
    });
});

// Health check
app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "CivicX backend is running",
    });
});

// Issue API routes
app.use("/api/issues", issueRoutes);

// Handle unknown routes
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "API route not found",
    });
});

// Connect database before starting server
const startServer = async () => {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`CivicX backend running at http://localhost:${PORT}`);
    });
};

startServer();
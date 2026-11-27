const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome to CivicX API",
    });
});


app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "CivicX backend is running",
        timestamp: new Date().toISOString(),
    });
});


app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "API route not found",
    });
});


app.listen(PORT, () => {
    console.log(`CivicX backend running at http://localhost:${PORT}`);
});
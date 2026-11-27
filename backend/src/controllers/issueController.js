const Issue = require("../models/Issue");

// Create a new civic issue
const createIssue = async (req, res) => {
    try {
        const issue = await Issue.create(req.body);

        res.status(201).json({
            success: true,
            message: "Civic issue reported successfully",
            data: issue,
        });
    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: Object.values(error.errors).map(
                    (item) => item.message
                ),
            });
        }

        res.status(500).json({
            success: false,
            message: "Failed to create civic issue",
        });
    }
};

// Get all civic issues
const getIssues = async (req, res) => {
    try {
        const issues = await Issue.find()
            .sort({ createdAt: -1 })
            .limit(100);

        res.status(200).json({
            success: true,
            count: issues.length,
            data: issues,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to retrieve civic issues",
        });
    }
};

module.exports = {
    createIssue,
    getIssues,
};
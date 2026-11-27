const express = require("express");

const {
    createIssue,
    getIssues,
} = require("../controllers/issueController");

const router = express.Router();

// POST /api/issues
router.post("/", createIssue);

// GET /api/issues
router.get("/", getIssues);

module.exports = router;
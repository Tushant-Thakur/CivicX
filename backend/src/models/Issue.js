const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Issue title is required"],
            trim: true,
            minlength: 5,
            maxlength: 100,
        },

        category: {
            type: String,
            required: [true, "Issue category is required"],
            enum: [
                "pothole",
                "garbage",
                "streetlight",
                "water",
                "road_damage",
                "drainage",
                "other",
            ],
        },

        description: {
            type: String,
            required: [true, "Issue description is required"],
            trim: true,
            minlength: 10,
            maxlength: 2000,
        },

        location: {
            address: {
                type: String,
                required: [true, "Issue location is required"],
                trim: true,
            },

            coordinates: {
                type: {
                    type: String,
                    enum: ["Point"],
                    default: "Point",
                },

                coordinates: {
                    type: [Number],
                    default: undefined,
                },
            },
        },

        imageUrl: {
            type: String,
            default: "",
            trim: true,
        },

        status: {
            type: String,
            enum: ["pending", "in_progress", "resolved"],
            default: "pending",
        },

        priority: {
            type: String,
            enum: ["low", "medium", "high", "critical"],
            default: "medium",
        },

        aiCategory: {
            type: String,
            default: "",
        },

        aiConfidence: {
            type: Number,
            min: 0,
            max: 1,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

const Issue = mongoose.model("Issue", issueSchema);

module.exports = Issue;
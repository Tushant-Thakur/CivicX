const API_BASE_URL = "http://localhost:5000/api";

export const createIssue = async (issueData) => {
    const response = await fetch(`${API_BASE_URL}/issues`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(issueData),
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result.message || "Failed to submit civic issue"
        );
    }

    return result;
};

export const getIssues = async () => {
    const response = await fetch(`${API_BASE_URL}/issues`);

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result.message || "Failed to retrieve civic issues"
        );
    }

    return result;
};
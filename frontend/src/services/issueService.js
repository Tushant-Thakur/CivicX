const API_BASE_URL = "http://localhost:5000/api";
const REQUEST_TIMEOUT_MS = 15000;

const buildApiError = (message, { status = null, errors = [], code = "SERVER_ERROR" } = {}) => {
    const error = new Error(message);
    error.status = status;
    error.errors = errors;
    error.code = code;
    return error;
};

const parseJsonSafely = async (response) => {
    try {
        return await response.json();
    } catch {
        return null;
    }
};

export const createIssue = async (issueData) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    let response;
    try {
        response = await fetch(`${API_BASE_URL}/issues`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(issueData),
            signal: controller.signal,
        });
    } catch (error) {
        if (error?.name === "AbortError") {
            throw buildApiError(
                "Your report could not be submitted because of a connection problem. Please try again.",
                { code: "TIMEOUT" }
            );
        }

        if (typeof navigator !== "undefined" && navigator.onLine === false) {
            throw buildApiError(
                "Your report could not be submitted because of a connection problem. Please try again.",
                { code: "NETWORK_ERROR" }
            );
        }

        throw buildApiError(
            "Unable to connect to CivicX. Please check your connection and try again.",
            { code: "BACKEND_UNREACHABLE" }
        );
    } finally {
        clearTimeout(timeoutId);
    }

    const result = await parseJsonSafely(response);

    if (!response.ok) {
        if (response.status === 400) {
            throw buildApiError(
                result?.message || "Validation failed",
                {
                    status: response.status,
                    errors: Array.isArray(result?.errors) ? result.errors : [],
                    code: "VALIDATION_ERROR",
                }
            );
        }

        throw buildApiError(
            "Something went wrong while submitting your report. Please try again later.",
            {
                status: response.status,
                errors: Array.isArray(result?.errors) ? result.errors : [],
                code: "SERVER_ERROR",
            }
        );
    }

    return result;
};

export const getIssues = async () => {
    let response;
    try {
        response = await fetch(`${API_BASE_URL}/issues`);
    } catch {
        throw buildApiError(
            "Unable to connect to CivicX. Please check your connection and try again.",
            { code: "BACKEND_UNREACHABLE" }
        );
    }

    const result = await parseJsonSafely(response);

    if (!response.ok) {
        throw buildApiError(
            result?.message || "Failed to retrieve civic issues",
            {
                status: response.status,
                errors: Array.isArray(result?.errors) ? result.errors : [],
                code: "SERVER_ERROR",
            }
        );
    }

    return result;
};
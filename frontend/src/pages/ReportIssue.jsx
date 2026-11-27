import { useRef, useState } from "react";
import {
    ArrowLeft,
    MapPin,
    ImagePlus,
    X,
    Send,
    FileText,
    Loader2,
    AlertCircle,
    LocateFixed,
    CheckCircle2,
} from "lucide-react";
import { createIssue } from "../services/issueService";

const CATEGORY_MAP = {
    "Road Damage": "road_damage",
    Pothole: "pothole",
    Garbage: "garbage",
    "Water Supply": "water",
    Streetlight: "streetlight",
    Drainage: "drainage",
    "Public Safety": "other",
    Other: "other",
};

// Validation constraints aligned with backend/src/models/Issue.js
const ISSUE_RULES = {
    titleMinLength: 5,
    titleMaxLength: 100,
    descriptionMinLength: 10,
    descriptionMaxLength: 2000,
    allowedCategories: [
        "pothole",
        "garbage",
        "streetlight",
        "water",
        "road_damage",
        "drainage",
        "other",
    ],
    allowedStatuses: ["pending", "in_progress", "resolved"],
    allowedPriorities: ["low", "medium", "high", "critical"],
};

const FIELD_ORDER = ["title", "category", "description", "location", "coordinates", "image"];

function validateCoordinates(coordinates) {
    if (coordinates === null || coordinates === undefined) {
        return null;
    }

    if (typeof coordinates !== "object") {
        return "Captured location coordinates are invalid. You can clear them and submit with the address only.";
    }

    const { latitude, longitude } = coordinates;
    const isValidLat =
        typeof latitude === "number" &&
        Number.isFinite(latitude) &&
        latitude >= -90 &&
        latitude <= 90;
    const isValidLng =
        typeof longitude === "number" &&
        Number.isFinite(longitude) &&
        longitude >= -180 &&
        longitude <= 180;

    if (!isValidLat || !isValidLng) {
        return "Captured location coordinates are invalid. You can clear them and submit with the address only.";
    }

    return null;
}

function validateReportForm(formData, coordinates) {
    const errors = {};

    const title = typeof formData.title === "string" ? formData.title.trim() : "";
    if (!title) {
        errors.title = "Please enter a title for the issue.";
    } else if (title.length < ISSUE_RULES.titleMinLength) {
        errors.title = `Issue title must contain at least ${ISSUE_RULES.titleMinLength} characters.`;
    } else if (title.length > ISSUE_RULES.titleMaxLength) {
        errors.title = `Issue title cannot exceed ${ISSUE_RULES.titleMaxLength} characters.`;
    }

    const rawCategory = typeof formData.category === "string" ? formData.category.trim() : "";
    const mappedCategory = CATEGORY_MAP[rawCategory];
    if (!rawCategory) {
        errors.category = "Please select an issue category.";
    } else if (!mappedCategory || !ISSUE_RULES.allowedCategories.includes(mappedCategory)) {
        errors.category = "Please select a valid issue category.";
    }

    const description =
        typeof formData.description === "string" ? formData.description.trim() : "";
    if (!description) {
        errors.description = "Please enter a description of the issue.";
    } else if (description.length < ISSUE_RULES.descriptionMinLength) {
        errors.description = `Please provide a more detailed description of the issue (at least ${ISSUE_RULES.descriptionMinLength} characters).`;
    } else if (description.length > ISSUE_RULES.descriptionMaxLength) {
        errors.description = `Issue description cannot exceed ${ISSUE_RULES.descriptionMaxLength} characters.`;
    }

    const address = typeof formData.location === "string" ? formData.location.trim() : "";
    if (!address) {
        errors.location = "Please enter the location of the issue.";
    }

    // Validate optional status/priority/imageUrl/aiConfidence if ever provided
    if (
        formData.status !== undefined &&
        !ISSUE_RULES.allowedStatuses.includes(formData.status)
    ) {
        errors.form = "The selected issue status is not valid.";
    }

    if (
        formData.priority !== undefined &&
        !ISSUE_RULES.allowedPriorities.includes(formData.priority)
    ) {
        errors.form = "The selected issue priority is not valid.";
    }

    const coordError = validateCoordinates(coordinates);
    if (coordError) {
        errors.coordinates = coordError;
    }

    return errors;
}

function mapSingleBackendError(rawMessage) {
    if (typeof rawMessage !== "string" || !rawMessage.trim()) {
        return {
            field: "form",
            message: "One or more fields contain invalid values. Please check your input.",
        };
    }

    const msg = rawMessage.trim();
    const lower = msg.toLowerCase();

    // Title errors
    if (lower.includes("title")) {
        if (lower.includes("required")) {
            return { field: "title", message: "Please enter a title for the issue." };
        }
        if (lower.includes("shorter") || lower.includes("minimum")) {
            return {
                field: "title",
                message: `Issue title must contain at least ${ISSUE_RULES.titleMinLength} characters.`,
            };
        }
        if (lower.includes("longer") || lower.includes("maximum")) {
            return {
                field: "title",
                message: `Issue title cannot exceed ${ISSUE_RULES.titleMaxLength} characters.`,
            };
        }
        return { field: "title", message: "Please enter a valid title for the issue." };
    }

    // Category errors
    if (lower.includes("category")) {
        if (lower.includes("required")) {
            return { field: "category", message: "Please select an issue category." };
        }
        return { field: "category", message: "Please select a valid issue category." };
    }

    // Description errors
    if (lower.includes("description")) {
        if (lower.includes("required")) {
            return { field: "description", message: "Please enter a description of the issue." };
        }
        if (lower.includes("shorter") || lower.includes("minimum")) {
            return {
                field: "description",
                message: `Please provide a more detailed description of the issue (at least ${ISSUE_RULES.descriptionMinLength} characters).`,
            };
        }
        if (lower.includes("longer") || lower.includes("maximum")) {
            return {
                field: "description",
                message: `Issue description cannot exceed ${ISSUE_RULES.descriptionMaxLength} characters.`,
            };
        }
        return {
            field: "description",
            message: "Please provide a valid description of the issue.",
        };
    }

    // Coordinates errors (check before general location/address)
    if (lower.includes("coordinates")) {
        return {
            field: "coordinates",
            message:
                "Captured location coordinates are invalid. You can clear them and submit with the address only.",
        };
    }

    // Location / address errors
    if (lower.includes("location") || lower.includes("address")) {
        return { field: "location", message: "Please enter the location of the issue." };
    }

    // Optional model field errors
    if (lower.includes("status")) {
        return { field: "form", message: "The selected issue status is not valid." };
    }

    if (lower.includes("priority")) {
        return { field: "form", message: "The selected issue priority is not valid." };
    }

    if (lower.includes("imageurl")) {
        return { field: "image", message: "The provided image reference is not valid." };
    }

    if (lower.includes("aiconfidence")) {
        return { field: "form", message: "Confidence score must be between 0 and 1." };
    }

    // Never leak raw Mongoose technical paths or stack details
    return {
        field: "form",
        message: "Please review your entries and correct any invalid information.",
    };
}

function parseBackendValidationErrors(errorsList) {
    const fieldErrors = {};
    let fallbackMessage = "";

    if (Array.isArray(errorsList)) {
        for (const item of errorsList) {
            const mapped = mapSingleBackendError(item);
            if (mapped.field === "form") {
                if (!fallbackMessage) fallbackMessage = mapped.message;
            } else if (!fieldErrors[mapped.field]) {
                fieldErrors[mapped.field] = mapped.message;
            }
        }
    }

    return { fieldErrors, fallbackMessage };
}

function ReportIssue({ onBack }) {
    const [formData, setFormData] = useState({
        title: "",
        category: "",
        description: "",
        location: "",
    });

    const [coordinates, setCoordinates] = useState(null);
    const [locationStatus, setLocationStatus] = useState("idle"); // "idle" | "loading" | "geocoding" | "success" | "error"
    const [locationMessage, setLocationMessage] = useState("");
    const [addressLookupError, setAddressLookupError] = useState("");
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});
    const [submitError, setSubmitError] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const fieldRefs = {
        title: useRef(null),
        category: useRef(null),
        description: useRef(null),
        location: useRef(null),
    };

    const focusFirstInvalidField = (errorsObj) => {
        const firstField = FIELD_ORDER.find(
            (key) => errorsObj[key] && fieldRefs[key]?.current
        );
        if (firstField) {
            const element = fieldRefs[firstField].current;
            element.scrollIntoView({ behavior: "smooth", block: "center" });
            element.focus({ preventScroll: true });
        }
    };

    const clearFieldError = (fieldName) => {
        setFieldErrors((prev) => {
            if (!prev[fieldName]) return prev;
            const next = { ...prev };
            delete next[fieldName];
            if (Object.keys(next).length === 0) {
                setSubmitError("");
            }
            return next;
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        clearFieldError(name);
        if (submitError && Object.keys(fieldErrors).length === 0) {
            setSubmitError("");
        }

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const reverseGeocodeCoordinates = async (latitude, longitude) => {
        setLocationStatus("geocoding");
        setLocationMessage("Finding address...");
        setAddressLookupError("");

        try {
            const params = new URLSearchParams({
                format: "jsonv2",
                lat: String(latitude),
                lon: String(longitude),
            });

            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?${params.toString()}`,
                {
                    headers: {
                        Accept: "application/json",
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`Reverse geocoding failed with status ${response.status}`);
            }

            const data = await response.json();
            const resolvedAddress =
                typeof data?.display_name === "string" ? data.display_name.trim() : "";

            if (!resolvedAddress) {
                throw new Error("No address returned for these coordinates");
            }

            setFormData((prev) => ({
                ...prev,
                location: resolvedAddress,
            }));
            clearFieldError("location");
            setLocationStatus("success");
            setLocationMessage("Location coordinates and address captured.");
        } catch {
            // Keep captured coordinates even when address lookup fails
            setLocationStatus("success");
            setLocationMessage("Location coordinates captured.");
            setAddressLookupError(
                "Could not find the street address automatically. Your coordinates are saved—please enter the address manually."
            );
        }
    };

    const handleUseMyLocation = () => {
        if (
            locationStatus === "loading" ||
            locationStatus === "geocoding" ||
            isSubmitting
        ) {
            return;
        }

        clearFieldError("coordinates");

        if (!navigator.geolocation) {
            setLocationStatus("error");
            setLocationMessage(
                "Geolocation is not supported by your browser. Please enter the address manually."
            );
            setAddressLookupError("");
            return;
        }

        setLocationStatus("loading");
        setLocationMessage("Waiting for location...");
        setAddressLookupError("");

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setCoordinates({ latitude, longitude });
                reverseGeocodeCoordinates(latitude, longitude);
            },
            (geoError) => {
                setCoordinates(null);
                setLocationStatus("error");
                setAddressLookupError("");

                if (geoError.code === geoError.PERMISSION_DENIED) {
                    setLocationMessage(
                        "Location permission denied. You can still submit the report using the address field."
                    );
                } else if (geoError.code === geoError.POSITION_UNAVAILABLE) {
                    setLocationMessage(
                        "Location is currently unavailable. Please enter the address manually."
                    );
                } else if (geoError.code === geoError.TIMEOUT) {
                    setLocationMessage(
                        "Location request timed out. You can try again or enter the address manually."
                    );
                } else {
                    setLocationMessage(
                        "Unable to capture location. You can still submit the report using the address field."
                    );
                }
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            }
        );
    };

    const clearCoordinates = () => {
        setCoordinates(null);
        setLocationStatus("idle");
        setLocationMessage("");
        setAddressLookupError("");
        clearFieldError("coordinates");
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setFieldErrors((prev) => ({
                ...prev,
                image: "Please select a valid image file (PNG, JPG, or JPEG).",
            }));
            e.target.value = "";
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setFieldErrors((prev) => ({
                ...prev,
                image: "Image size must be less than 5 MB.",
            }));
            e.target.value = "";
            return;
        }

        clearFieldError("image");
        if (preview) URL.revokeObjectURL(preview);

        setImage(file);
        setPreview(URL.createObjectURL(file));
    };

    const removeImage = () => {
        if (preview) URL.revokeObjectURL(preview);

        setImage(null);
        setPreview(null);
        clearFieldError("image");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isSubmitting) return;

        const validationErrors = validateReportForm(formData, coordinates);
        const hasValidationErrors = Object.keys(validationErrors).length > 0;

        if (hasValidationErrors) {
            const { form: formLevelError, ...specificFieldErrors } = validationErrors;
            setFieldErrors(specificFieldErrors);
            setSubmitError(
                formLevelError || "Please correct the highlighted fields before submitting."
            );
            focusFirstInvalidField(specificFieldErrors);
            return;
        }

        const trimmedTitle = formData.title.trim();
        const trimmedDescription = formData.description.trim();
        const trimmedLocation = formData.location.trim();

        const locationPayload = {
            address: trimmedLocation,
        };

        if (
            coordinates &&
            typeof coordinates.latitude === "number" &&
            typeof coordinates.longitude === "number"
        ) {
            locationPayload.coordinates = {
                type: "Point",
                coordinates: [coordinates.longitude, coordinates.latitude],
            };
        }

        const payload = {
            title: trimmedTitle,
            category: CATEGORY_MAP[formData.category],
            description: trimmedDescription,
            location: locationPayload,
        };

        setIsSubmitting(true);
        setFieldErrors({});
        setSubmitError("");

        try {
            await createIssue(payload);
            if (preview) URL.revokeObjectURL(preview);
            setSubmitted(true);
        } catch (err) {
            if (err?.status === 400) {
                const { fieldErrors: backendFieldErrors, fallbackMessage } =
                    parseBackendValidationErrors(err.errors);

                if (Object.keys(backendFieldErrors).length > 0) {
                    setFieldErrors(backendFieldErrors);
                    setSubmitError(
                        fallbackMessage ||
                        "Please correct the highlighted fields before submitting."
                    );
                    focusFirstInvalidField(backendFieldErrors);
                } else {
                    setSubmitError(
                        fallbackMessage ||
                        "Please review your entries and correct any invalid information."
                    );
                }
            } else if (err?.code === "BACKEND_UNREACHABLE") {
                setSubmitError(
                    "Unable to connect to CivicX. Please check your connection and try again."
                );
            } else if (err?.code === "TIMEOUT" || err?.code === "NETWORK_ERROR") {
                setSubmitError(
                    "Your report could not be submitted because of a connection problem. Please try again."
                );
            } else {
                setSubmitError(
                    "Something went wrong while submitting your report. Please try again later."
                );
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-slate-100 flex items-center justify-center p-5">

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-10 max-w-md w-full text-center">

                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-5">
                        <FileText size={32} />
                    </div>

                    <h2 className="text-2xl font-bold text-slate-800">
                        Report Submitted!
                    </h2>

                    <p className="text-slate-500 mt-3">
                        Your issue has been submitted successfully.
                        Authorities can now review and track your report.
                    </p>

                    <button
                        onClick={onBack}
                        className="mt-7 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
                    >
                        Back to Dashboard
                    </button>

                </div>

            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-100">

            {/* Header */}
            <header className="bg-white border-b border-slate-200 px-5 md:px-10 py-5">

                <div className="max-w-4xl mx-auto flex items-center gap-4">

                    <button
                        onClick={onBack}
                        className="p-2 hover:bg-slate-100 rounded-lg"
                    >
                        <ArrowLeft size={22} />
                    </button>

                    <div>
                        <h1 className="text-xl font-bold text-slate-800">
                            Report an Issue
                        </h1>

                        <p className="text-sm text-slate-500">
                            Help us make your city better.
                        </p>
                    </div>

                </div>

            </header>

            {/* Form */}
            <main className="max-w-4xl mx-auto p-5 md:p-10">

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">

                    <div className="mb-8">

                        <h2 className="text-2xl font-bold text-slate-800">
                            Issue Details
                        </h2>

                        <p className="text-sm text-slate-500 mt-2">
                            Provide accurate information so authorities
                            can resolve the issue efficiently.
                        </p>

                    </div>

                    <form onSubmit={handleSubmit} noValidate className="space-y-6">

                        {/* Form Summary / Server Error Banner */}
                        {submitError && (
                            <div
                                role="alert"
                                className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"
                            >
                                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                                <span>{submitError}</span>
                            </div>
                        )}

                        {/* Issue Title */}
                        <div>

                            <label
                                htmlFor="issue-title"
                                className="block text-sm font-semibold mb-2"
                            >
                                Issue Title *
                            </label>

                            <input
                                ref={fieldRefs.title}
                                id="issue-title"
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Example: Damaged road near main market"
                                aria-invalid={Boolean(fieldErrors.title)}
                                aria-describedby={fieldErrors.title ? "title-error" : undefined}
                                className={`w-full border rounded-lg px-4 py-3 outline-none transition ${fieldErrors.title
                                        ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                                        : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    }`}
                            />

                            {fieldErrors.title && (
                                <p
                                    id="title-error"
                                    role="alert"
                                    className="mt-1.5 text-xs font-medium text-red-600"
                                >
                                    {fieldErrors.title}
                                </p>
                            )}

                        </div>

                        {/* Category */}
                        <div>

                            <label
                                htmlFor="issue-category"
                                className="block text-sm font-semibold mb-2"
                            >
                                Issue Category *
                            </label>

                            <select
                                ref={fieldRefs.category}
                                id="issue-category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                aria-invalid={Boolean(fieldErrors.category)}
                                aria-describedby={
                                    fieldErrors.category ? "category-error" : undefined
                                }
                                className={`w-full border rounded-lg px-4 py-3 outline-none bg-white transition ${fieldErrors.category
                                        ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                                        : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    }`}
                            >
                                <option value="">Select a category</option>
                                <option value="Road Damage">Road Damage</option>
                                <option value="Garbage">Garbage / Waste Management</option>
                                <option value="Water Supply">Water Supply</option>
                                <option value="Streetlight">Streetlight</option>
                                <option value="Drainage">Drainage / Sewage</option>
                                <option value="Public Safety">Public Safety</option>
                                <option value="Other">Other</option>
                            </select>

                            {fieldErrors.category && (
                                <p
                                    id="category-error"
                                    role="alert"
                                    className="mt-1.5 text-xs font-medium text-red-600"
                                >
                                    {fieldErrors.category}
                                </p>
                            )}

                        </div>

                        {/* Description */}
                        <div>

                            <label
                                htmlFor="issue-description"
                                className="block text-sm font-semibold mb-2"
                            >
                                Issue Description *
                            </label>

                            <textarea
                                ref={fieldRefs.description}
                                id="issue-description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Describe the problem in detail..."
                                rows="5"
                                aria-invalid={Boolean(fieldErrors.description)}
                                aria-describedby={
                                    fieldErrors.description ? "description-error" : undefined
                                }
                                className={`w-full border rounded-lg px-4 py-3 outline-none resize-none transition ${fieldErrors.description
                                        ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                                        : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    }`}
                            />

                            {fieldErrors.description && (
                                <p
                                    id="description-error"
                                    role="alert"
                                    className="mt-1.5 text-xs font-medium text-red-600"
                                >
                                    {fieldErrors.description}
                                </p>
                            )}

                        </div>

                        {/* Location */}
                        <div>

                            <label
                                htmlFor="issue-location"
                                className="block text-sm font-semibold mb-2"
                            >
                                Issue Location *
                            </label>

                            <div className="flex flex-col sm:flex-row gap-3">

                                <div className="relative flex-1">

                                    <MapPin
                                        size={19}
                                        className="absolute left-4 top-3.5 text-slate-400"
                                    />

                                    <input
                                        ref={fieldRefs.location}
                                        id="issue-location"
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        placeholder="Enter street, area or landmark"
                                        aria-invalid={Boolean(fieldErrors.location)}
                                        aria-describedby={
                                            fieldErrors.location ? "location-error" : undefined
                                        }
                                        className={`w-full border rounded-lg pl-11 pr-4 py-3 outline-none transition ${fieldErrors.location
                                                ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                                                : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                            }`}
                                    />

                                </div>

                                <button
                                    type="button"
                                    onClick={handleUseMyLocation}
                                    disabled={
                                        locationStatus === "loading" ||
                                        locationStatus === "geocoding" ||
                                        isSubmitting
                                    }
                                    className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 disabled:opacity-60 disabled:cursor-not-allowed font-medium text-sm whitespace-nowrap transition"
                                >
                                    {locationStatus === "loading" ? (
                                        <>
                                            <Loader2 size={17} className="animate-spin" />
                                            Waiting for location...
                                        </>
                                    ) : locationStatus === "geocoding" ? (
                                        <>
                                            <Loader2 size={17} className="animate-spin" />
                                            Finding address...
                                        </>
                                    ) : (
                                        <>
                                            <LocateFixed size={17} />
                                            Use My Location
                                        </>
                                    )}
                                </button>

                            </div>

                            {fieldErrors.location && (
                                <p
                                    id="location-error"
                                    role="alert"
                                    className="mt-1.5 text-xs font-medium text-red-600"
                                >
                                    {fieldErrors.location}
                                </p>
                            )}

                            {coordinates &&
                                (locationStatus === "geocoding" || locationStatus === "success") && (
                                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2 bg-green-50 border border-green-200 text-green-800 px-3.5 py-2.5 rounded-lg text-xs">
                                        <div className="flex items-center gap-2">
                                            {locationStatus === "geocoding" ? (
                                                <Loader2
                                                    size={16}
                                                    className="text-blue-600 shrink-0 animate-spin"
                                                />
                                            ) : (
                                                <CheckCircle2
                                                    size={16}
                                                    className="text-green-600 shrink-0"
                                                />
                                            )}
                                            <span>
                                                <strong>{locationMessage}</strong>{" "}
                                                Latitude:{" "}
                                                <code className="font-mono">
                                                    {coordinates.latitude.toFixed(6)}
                                                </code>
                                                , Longitude:{" "}
                                                <code className="font-mono">
                                                    {coordinates.longitude.toFixed(6)}
                                                </code>
                                            </span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={clearCoordinates}
                                            disabled={isSubmitting || locationStatus === "geocoding"}
                                            className="text-green-700 hover:text-green-900 disabled:opacity-50 font-medium underline"
                                        >
                                            Clear
                                        </button>
                                    </div>
                                )}

                            {fieldErrors.coordinates && (
                                <p
                                    role="alert"
                                    className="mt-2 text-xs font-medium text-red-600"
                                >
                                    {fieldErrors.coordinates}
                                </p>
                            )}

                            {addressLookupError && (
                                <div
                                    role="status"
                                    className="mt-2 flex items-start gap-2 bg-amber-50 border border-amber-200 text-amber-800 px-3.5 py-2.5 rounded-lg text-xs"
                                >
                                    <AlertCircle
                                        size={16}
                                        className="text-amber-600 shrink-0 mt-0.5"
                                    />
                                    <span>{addressLookupError}</span>
                                </div>
                            )}

                            {locationStatus === "error" && locationMessage && (
                                <div
                                    role="status"
                                    className="mt-3 flex items-start gap-2 bg-amber-50 border border-amber-200 text-amber-800 px-3.5 py-2.5 rounded-lg text-xs"
                                >
                                    <AlertCircle
                                        size={16}
                                        className="text-amber-600 shrink-0 mt-0.5"
                                    />
                                    <span>{locationMessage}</span>
                                </div>
                            )}

                            {locationStatus === "idle" && (
                                <p className="text-xs text-slate-400 mt-2">
                                    Optionally click &ldquo;Use My Location&rdquo; to attach GPS
                                    coordinates. Address remains required and editable.
                                </p>
                            )}

                        </div>

                        {/* Image Upload */}
                        <div>

                            <label className="block text-sm font-semibold mb-2">
                                Upload Image (Optional)
                            </label>

                            {!preview ? (

                                <label
                                    className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition ${fieldErrors.image
                                            ? "border-red-400 bg-red-50/40 hover:border-red-500"
                                            : "border-slate-300 hover:border-blue-500 hover:bg-blue-50"
                                        }`}
                                >

                                    <ImagePlus size={35} className="text-blue-500 mb-3" />

                                    <span className="font-medium text-slate-700">
                                        Click to upload an image
                                    </span>

                                    <span className="text-xs text-slate-400 mt-2">
                                        PNG, JPG or JPEG (Maximum 5 MB)
                                    </span>

                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        disabled={isSubmitting}
                                        className="hidden"
                                    />

                                </label>

                            ) : (

                                <div>

                                    <div className="relative w-fit">

                                        <img
                                            src={preview}
                                            alt="Issue preview"
                                            className="w-48 h-40 object-cover rounded-xl border"
                                        />

                                        <button
                                            type="button"
                                            onClick={removeImage}
                                            disabled={isSubmitting}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full disabled:opacity-60"
                                        >
                                            <X size={16} />
                                        </button>

                                    </div>

                                    <p className="text-xs text-amber-600 mt-2">
                                        Preview only: image upload is not yet connected
                                        {image ? ` (${image.name} will not be uploaded)` : ""}.
                                    </p>

                                </div>

                            )}

                            {fieldErrors.image && (
                                <p
                                    role="alert"
                                    className="mt-1.5 text-xs font-medium text-red-600"
                                >
                                    {fieldErrors.image}
                                </p>
                            )}

                            {!preview && (
                                <p className="text-xs text-slate-400 mt-2">
                                    Image preview is supported locally; image upload to the server is
                                    not yet connected.
                                </p>
                            )}

                        </div>

                        {/* Submit */}
                        <div className="pt-4 border-t border-slate-100">

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <Send size={18} />
                                        Submit Issue Report
                                    </>
                                )}
                            </button>

                        </div>

                    </form>

                </div>

            </main>

        </div>
    );
}

export default ReportIssue;

import { useState } from "react";
import {
    ArrowLeft,
    MapPin,
    ImagePlus,
    X,
    Send,
    FileText,
    Loader2,
    AlertCircle,
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

function ReportIssue({ onBack }) {
    const [formData, setFormData] = useState({
        title: "",
        category: "",
        description: "",
        location: "",
    });

    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        if (error) setError("");

        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("Please select a valid image.");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert("Image size must be less than 5 MB.");
            return;
        }

        if (preview) URL.revokeObjectURL(preview);

        setImage(file);
        setPreview(URL.createObjectURL(file));
    };

    const removeImage = () => {
        if (preview) URL.revokeObjectURL(preview);

        setImage(null);
        setPreview(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isSubmitting) return;

        const trimmedTitle = formData.title.trim();
        const trimmedDescription = formData.description.trim();
        const trimmedLocation = formData.location.trim();

        if (!trimmedTitle || !formData.category || !trimmedDescription || !trimmedLocation) {
            setError("Please fill in all required fields.");
            return;
        }

        const payload = {
            title: trimmedTitle,
            category: CATEGORY_MAP[formData.category] || "other",
            description: trimmedDescription,
            location: {
                address: trimmedLocation,
            },
        };

        setIsSubmitting(true);
        setError("");

        try {
            await createIssue(payload);
            if (preview) URL.revokeObjectURL(preview);
            setSubmitted(true);
        } catch (err) {
            const message =
                err?.message === "Failed to fetch"
                    ? "Unable to reach the server. Please check that the backend is running and try again."
                    : err?.message || "Failed to submit issue report. Please try again.";
            setError(message);
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

                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Issue Title */}
                        <div>

                            <label className="block text-sm font-semibold mb-2">
                                Issue Title *
                            </label>

                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Example: Damaged road near main market"
                                required
                                className="w-full border border-slate-200 rounded-lg px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />

                        </div>

                        {/* Category */}
                        <div>

                            <label className="block text-sm font-semibold mb-2">
                                Issue Category *
                            </label>

                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                                className="w-full border border-slate-200 rounded-lg px-4 py-3 outline-none focus:border-blue-500 bg-white"
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

                        </div>

                        {/* Description */}
                        <div>

                            <label className="block text-sm font-semibold mb-2">
                                Issue Description *
                            </label>

                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Describe the problem in detail..."
                                rows="5"
                                required
                                className="w-full border border-slate-200 rounded-lg px-4 py-3 outline-none focus:border-blue-500 resize-none"
                            />

                        </div>

                        {/* Location */}
                        <div>

                            <label className="block text-sm font-semibold mb-2">
                                Issue Location *
                            </label>

                            <div className="relative">

                                <MapPin
                                    size={19}
                                    className="absolute left-4 top-3.5 text-slate-400"
                                />

                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    placeholder="Enter street, area or landmark"
                                    required
                                    className="w-full border border-slate-200 rounded-lg pl-11 pr-4 py-3 outline-none focus:border-blue-500"
                                />

                            </div>

                            <p className="text-xs text-slate-400 mt-2">
                                Map-based location selection will be added later.
                            </p>

                        </div>

                        {/* Image Upload */}
                        <div>

                            <label className="block text-sm font-semibold mb-2">
                                Upload Image (Optional)
                            </label>

                            {!preview ? (

                                <label className="border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition">

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
                                        Preview only: image upload is not yet connected{image ? ` (${image.name} will not be uploaded)` : ""}.
                                    </p>

                                </div>

                            )}

                            {!preview && (
                                <p className="text-xs text-slate-400 mt-2">
                                    Image preview is supported locally; image upload to the server is not yet connected.
                                </p>
                            )}

                        </div>

                        {/* Error Message */}
                        {error && (
                            <div
                                role="alert"
                                className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"
                            >
                                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                                <span>{error}</span>
                            </div>
                        )}

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
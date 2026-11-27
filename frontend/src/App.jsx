import { useCallback, useEffect, useMemo, useState } from "react";

import ReportIssue from "./pages/ReportIssue";
import { getIssues } from "./services/issueService";

import {
    LayoutDashboard,
    FileText,
    Map,
    Settings,
    Bell,
    Search,
    Plus,
    Clock,
    CheckCircle,
    AlertCircle,
    Menu,
    Loader2,
    RefreshCw,
} from "lucide-react";

const STATUS_LABELS = {
    pending: "Pending",
    in_progress: "In Progress",
    resolved: "Resolved",
};

const PRIORITY_LABELS = {
    low: "Low",
    medium: "Medium",
    high: "High",
    critical: "Critical",
};

const formatReportId = (id) => {
    if (!id || typeof id !== "string") return "N/A";
    return `#${id.slice(-6).toUpperCase()}`;
};

function App() {
    const [currentPage, setCurrentPage] = useState("dashboard");
    const [issues, setIssues] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    const fetchIssues = useCallback(async () => {
        setIsLoading(true);
        setError("");

        try {
            const response = await getIssues();
            const fetchedIssues = Array.isArray(response?.data) ? response.data : [];
            setIssues(fetchedIssues);
        } catch (err) {
            const message =
                err?.message === "Failed to fetch"
                    ? "Unable to reach the server. Please check that the backend is running and try again."
                    : err?.message || "Failed to load civic reports.";
            setError(message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchIssues();
    }, [fetchIssues]);

    const stats = useMemo(() => {
        const total = issues.length;
        const pending = issues.filter((issue) => issue.status === "pending").length;
        const resolved = issues.filter((issue) => issue.status === "resolved").length;
        const critical = issues.filter((issue) => issue.priority === "critical").length;

        const formatStat = (count) =>
            isLoading && issues.length === 0 ? "..." : count.toLocaleString();

        return [
            {
                title: "Total Reports",
                value: formatStat(total),
                icon: FileText,
                color: "text-blue-600",
                bg: "bg-blue-100",
            },
            {
                title: "Pending Issues",
                value: formatStat(pending),
                icon: Clock,
                color: "text-orange-600",
                bg: "bg-orange-100",
            },
            {
                title: "Resolved Issues",
                value: formatStat(resolved),
                icon: CheckCircle,
                color: "text-green-600",
                bg: "bg-green-100",
            },
            {
                title: "Critical Issues",
                value: formatStat(critical),
                icon: AlertCircle,
                color: "text-red-600",
                bg: "bg-red-100",
            },
        ];
    }, [issues, isLoading]);

    const sortedIssues = useMemo(() => {
        return [...issues].sort((a, b) => {
            const dateA = a?.createdAt ? new Date(a.createdAt).getTime() : 0;
            const dateB = b?.createdAt ? new Date(b.createdAt).getTime() : 0;
            return dateB - dateA;
        });
    }, [issues]);

    const filteredReports = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        if (!query) return sortedIssues;

        return sortedIssues.filter((issue) => {
            const title = (issue?.title || "").toLowerCase();
            const category = (issue?.category || "").toLowerCase();
            const address = (issue?.location?.address || "").toLowerCase();
            const rawStatus = (issue?.status || "").toLowerCase();
            const statusLabel = (STATUS_LABELS[issue?.status] || "").toLowerCase();

            return (
                title.includes(query) ||
                category.includes(query) ||
                address.includes(query) ||
                rawStatus.includes(query) ||
                statusLabel.includes(query)
            );
        });
    }, [sortedIssues, searchQuery]);

    // Navigate to Report Issue page
    if (currentPage === "report") {
        return (
            <ReportIssue
                onBack={() => {
                    setCurrentPage("dashboard");
                    fetchIssues();
                }}
            />
        );
    }

    return (
        <div className="min-h-screen bg-slate-100 text-slate-800 flex">

            {/* Sidebar */}
            <aside className="hidden md:flex w-64 bg-slate-950 text-white flex-col p-6">

                <h1 className="text-2xl font-bold mb-2">
                    Civic<span className="text-blue-400">X</span>
                </h1>

                <p className="text-xs text-slate-400 mb-10">
                    SMART CIVIC MANAGEMENT
                </p>

                <nav className="space-y-3">

                    <a className="flex items-center gap-3 bg-blue-600 p-3 rounded-lg">
                        <LayoutDashboard size={20} />
                        Dashboard
                    </a>

                    <a className="flex items-center gap-3 p-3 text-slate-300 hover:bg-slate-800 rounded-lg">
                        <FileText size={20} />
                        Reports
                    </a>

                    <a className="flex items-center gap-3 p-3 text-slate-300 hover:bg-slate-800 rounded-lg">
                        <Map size={20} />
                        Issue Map
                    </a>

                    <a className="flex items-center gap-3 p-3 text-slate-300 hover:bg-slate-800 rounded-lg">
                        <Settings size={20} />
                        Settings
                    </a>

                </nav>

                <div className="mt-auto text-xs text-slate-500">
                    CivicX Project © 2026
                </div>

            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0">

                {/* Topbar */}
                <header className="bg-white border-b border-slate-200 px-5 md:px-8 py-5 flex items-center justify-between">

                    <div className="flex items-center gap-3">

                        <button className="md:hidden">
                            <Menu />
                        </button>

                        <div>
                            <h2 className="text-xl font-bold">
                                Dashboard
                            </h2>

                            <p className="text-sm text-slate-500">
                                Welcome to CivicX Management Portal
                            </p>
                        </div>

                    </div>

                    <div className="flex items-center gap-5">

                        <button className="text-slate-500">
                            <Bell size={21} />
                        </button>

                        <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold">
                            T
                        </div>

                    </div>

                </header>

                {/* Dashboard Body */}
                <section className="p-5 md:p-8">

                    {/* Welcome Section */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">

                        <div>
                            <h2 className="text-2xl font-bold">
                                Civic Overview
                            </h2>

                            <p className="text-slate-500 mt-1">
                                Monitor and manage civic issues across your city.
                            </p>
                        </div>

                        {/* Report Issue Navigation */}
                        <button
                            onClick={() => setCurrentPage("report")}
                            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg font-medium transition"
                        >
                            <Plus size={19} />
                            Report an Issue
                        </button>

                    </div>

                    {/* Statistics */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">

                        {stats.map((item) => {
                            const Icon = item.icon;

                            return (
                                <div
                                    key={item.title}
                                    className="bg-white p-6 rounded-xl shadow-sm border border-slate-200"
                                >

                                    <div className="flex items-center justify-between">

                                        <div>
                                            <p className="text-sm text-slate-500">
                                                {item.title}
                                            </p>

                                            <h3 className="text-3xl font-bold mt-2">
                                                {item.value}
                                            </h3>
                                        </div>

                                        <div className={`${item.bg} ${item.color} p-3 rounded-xl`}>
                                            <Icon size={24} />
                                        </div>

                                    </div>

                                </div>
                            );
                        })}

                    </div>

                    {/* Reports Table */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">

                        <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row justify-between gap-4">

                            <div>
                                <h3 className="font-bold text-lg">
                                    Recent Civic Reports
                                </h3>

                                <p className="text-sm text-slate-500 mt-1">
                                    Latest reported civic issues
                                </p>
                            </div>

                            <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-2">

                                <Search size={18} className="text-slate-400" />

                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search reports..."
                                    className="outline-none text-sm w-full"
                                />

                            </div>

                        </div>

                        {isLoading ? (

                            <div className="p-12 flex flex-col items-center justify-center text-slate-500 gap-3">
                                <Loader2 size={28} className="animate-spin text-blue-600" />
                                <p className="text-sm font-medium">Loading civic reports...</p>
                            </div>

                        ) : error ? (

                            <div
                                role="alert"
                                className="p-10 flex flex-col items-center justify-center text-center gap-3"
                            >
                                <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
                                    <AlertCircle size={24} />
                                </div>
                                <p className="font-semibold text-slate-800">
                                    Failed to load reports
                                </p>
                                <p className="text-sm text-slate-500 max-w-md">
                                    {error}
                                </p>
                                <button
                                    type="button"
                                    onClick={fetchIssues}
                                    className="mt-2 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                                >
                                    <RefreshCw size={16} />
                                    Retry
                                </button>
                            </div>

                        ) : issues.length === 0 ? (

                            <div className="p-12 flex flex-col items-center justify-center text-center gap-2">
                                <div className="w-12 h-12 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center mb-1">
                                    <FileText size={24} />
                                </div>
                                <p className="font-semibold text-slate-800">
                                    No civic reports yet
                                </p>
                                <p className="text-sm text-slate-500 max-w-md">
                                    When citizens submit issues, they will appear here for tracking and resolution.
                                </p>
                            </div>

                        ) : filteredReports.length === 0 ? (

                            <div className="p-12 flex flex-col items-center justify-center text-center gap-2">
                                <p className="font-semibold text-slate-800">
                                    No matching reports found
                                </p>
                                <p className="text-sm text-slate-500">
                                    No reports matched &ldquo;{searchQuery}&rdquo;. Try searching by title, category, location, or status.
                                </p>
                                <button
                                    type="button"
                                    onClick={() => setSearchQuery("")}
                                    className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                                >
                                    Clear search
                                </button>
                            </div>

                        ) : (

                            <div className="overflow-x-auto">

                                <table className="w-full text-left min-w-[650px]">

                                    <thead className="bg-slate-50 text-slate-500 text-sm">
                                        <tr>
                                            <th className="p-4">Report ID</th>
                                            <th className="p-4">Issue</th>
                                            <th className="p-4">Location</th>
                                            <th className="p-4">Priority</th>
                                            <th className="p-4">Status</th>
                                        </tr>
                                    </thead>

                                    <tbody>

                                        {filteredReports.map((issue, index) => {
                                            const priorityLabel =
                                                PRIORITY_LABELS[issue?.priority] ||
                                                issue?.priority ||
                                                "Unknown";
                                            const statusLabel =
                                                STATUS_LABELS[issue?.status] ||
                                                issue?.status ||
                                                "Unknown";

                                            return (
                                                <tr
                                                    key={issue?._id || `issue-${index}`}
                                                    className="border-t border-slate-100"
                                                >

                                                    <td
                                                        className="p-4 font-medium text-blue-600"
                                                        title={issue?._id || ""}
                                                    >
                                                        {formatReportId(issue?._id)}
                                                    </td>

                                                    <td className="p-4 font-medium">
                                                        {issue?.title || "Untitled Issue"}
                                                    </td>

                                                    <td className="p-4 text-slate-500">
                                                        {issue?.location?.address || "Location not specified"}
                                                    </td>

                                                    <td className="p-4">
                                                        {priorityLabel}
                                                    </td>

                                                    <td className="p-4">

                                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${issue?.status === "resolved"
                                                                ? "bg-green-100 text-green-700"
                                                                : issue?.status === "pending"
                                                                    ? "bg-orange-100 text-orange-700"
                                                                    : "bg-blue-100 text-blue-700"
                                                            }`}>
                                                            {statusLabel}
                                                        </span>

                                                    </td>

                                                </tr>
                                            );
                                        })}

                                    </tbody>

                                </table>

                            </div>

                        )}

                    </div>

                    <p className="text-center text-xs text-slate-400 mt-8">
                        CivicX — AI-Powered Intelligent Civic Issue Reporting & Resolution Platform
                    </p>

                </section>

            </main>

        </div>
    );
}

export default App;
import { useState } from "react";

import ReportIssue from "./pages/ReportIssue";

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
} from "lucide-react";

const stats = [
    {
        title: "Total Reports",
        value: "1,284",
        icon: FileText,
        color: "text-blue-600",
        bg: "bg-blue-100",
    },
    {
        title: "Pending Issues",
        value: "342",
        icon: Clock,
        color: "text-orange-600",
        bg: "bg-orange-100",
    },
    {
        title: "Resolved Issues",
        value: "876",
        icon: CheckCircle,
        color: "text-green-600",
        bg: "bg-green-100",
    },
    {
        title: "Critical Issues",
        value: "66",
        icon: AlertCircle,
        color: "text-red-600",
        bg: "bg-red-100",
    },
];

const reports = [
    {
        id: "CX-1024",
        title: "Damaged Road",
        location: "Mathura, Uttar Pradesh",
        status: "Pending",
        priority: "High",
    },
    {
        id: "CX-1025",
        title: "Garbage Overflow",
        location: "Vrindavan, Uttar Pradesh",
        status: "In Progress",
        priority: "Medium",
    },
    {
        id: "CX-1026",
        title: "Streetlight Not Working",
        location: "Agra, Uttar Pradesh",
        status: "Resolved",
        priority: "Low",
    },
];

function App() {
    const [currentPage, setCurrentPage] = useState("dashboard");

    // Navigate to Report Issue page
    if (currentPage === "report") {
        return (
            <ReportIssue
                onBack={() => setCurrentPage("dashboard")}
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
                                    placeholder="Search reports..."
                                    className="outline-none text-sm w-full"
                                />

                            </div>

                        </div>

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

                                    {reports.map((report) => (
                                        <tr
                                            key={report.id}
                                            className="border-t border-slate-100"
                                        >

                                            <td className="p-4 font-medium text-blue-600">
                                                {report.id}
                                            </td>

                                            <td className="p-4 font-medium">
                                                {report.title}
                                            </td>

                                            <td className="p-4 text-slate-500">
                                                {report.location}
                                            </td>

                                            <td className="p-4">
                                                {report.priority}
                                            </td>

                                            <td className="p-4">

                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${report.status === "Resolved"
                                                        ? "bg-green-100 text-green-700"
                                                        : report.status === "Pending"
                                                            ? "bg-orange-100 text-orange-700"
                                                            : "bg-blue-100 text-blue-700"
                                                    }`}>
                                                    {report.status}
                                                </span>

                                            </td>

                                        </tr>
                                    ))}

                                </tbody>

                            </table>

                        </div>

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
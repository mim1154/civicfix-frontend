import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api";
import { FiEdit2, FiLogOut, FiSearch, FiTrash2 } from "react-icons/fi";

function Dashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [reports, setReports] = useState([]);
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState("");
    const [reportStatus, setReportStatus] = useState("");
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [pendingDelete, setPendingDelete] = useState(null);
    const [category, setCategory] = useState("");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [sortBy, setSortBy] = useState("created_at");
    const [sortOrder, setSortOrder] = useState("desc");
    const [pageSize, setPageSize] = useState(6);

    useEffect(() => {
        async function loadDashboard() {
            setLoading(true);

            try {
                const [userResponse, reportsResponse] = await Promise.all([
                    api.get("/api/auth/me"),
                    api.get("/api/reports/", {
                        params: {
                            q: search || undefined,
                            category: category || undefined,
                            status: reportStatus || undefined,
                            date_from: dateFrom ? `${dateFrom}T00:00:00` : undefined,
                            date_to: dateTo ? `${dateTo}T23:59:59` : undefined,
                            sort_by: sortBy,
                            sort_order: sortOrder,
                            page,
                            page_size: pageSize,
                        },
                    }),
                ]);

                setUser(userResponse.data);
                setReports(reportsResponse.data.items);
                setTotal(reportsResponse.data.total);
            } catch (error) {
                toast.error("Could not load dashboard. Please log in again.");
            } finally {
                setLoading(false);
            }
        }

        loadDashboard();
    }, [search, category, reportStatus, dateFrom, dateTo, sortBy, sortOrder, page, pageSize]);

    function logout() {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        toast.success("Logged out");
        navigate("/login");
    }

    async function confirmDelete() {
        try {
            await api.delete(`/api/reports/${pendingDelete.id}`);
            setReports((current) =>
                current.filter((report) => report.id !== pendingDelete.id)
            );
            setTotal((current) => current - 1);
            toast.success("Report deleted.");
        } catch {
            toast.error("Could not delete report.");
        } finally {
            setPendingDelete(null);
        }
    }

    async function changeStatus(reportId, newStatus) {
        try {
            await api.put(`/api/reports/${reportId}`, { status: newStatus });
            setReports((current) =>
                current.map((report) =>
                    report.id === reportId ? { ...report, status: newStatus } : report
                )
            );
            toast.success("Status updated.");
        } catch {
            toast.error("Could not update status.");
        }
    }

    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    return (
        <main className="min-h-screen bg-[#f5f7f4]">
            <header className="border-b border-slate-200 bg-white">
                <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
                    <Link to="/" className="text-xl font-extrabold text-emerald-800">
                        CivicFix
                    </Link>

                    <div className="flex items-center gap-4">
                        <span className="hidden text-sm text-slate-600 sm:inline">
                            {user?.name}
                        </span>
                        <button
                            onClick={logout}
                            className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold hover:bg-slate-50"
                        >
                            <FiLogOut /> Logout
                        </button>
                    </div>
                </nav>
            </header>

            <section className="mx-auto max-w-7xl px-5 py-10">
                <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                    <div>
                        <p className="font-semibold text-emerald-700">{user?.role === "admin" ? "ADMIN DASHBOARD" : "RESIDENT DASHBOARD"}</p>
                        <h1 className="mt-2 text-3xl font-extrabold text-slate-900">
                            {user ? `Hello, ${user.name}` : "Your reports"}
                        </h1>
                        <p className="mt-2 text-slate-500">
                            Follow the progress of issues you reported.
                        </p>
                    </div>

                    <Link
                        to="/reports/new"
                        className="rounded-xl bg-emerald-800 px-5 py-3 text-center font-bold text-white hover:bg-emerald-900"
                    >
                        + Submit a report
                    </Link>
                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                    {[
                        ["Your reports", total],
                        ["Account role", user?.role || "—"],
                        ["Current page", `${page} / ${totalPages}`],
                    ].map(([label, value]) => (
                        <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5">
                            <p className="text-sm text-slate-500">{label}</p>
                            <p className="mt-2 text-2xl font-extrabold capitalize text-slate-900">
                                {value}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    <label className="relative sm:col-span-2 lg:col-span-1">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 outline-none focus:border-emerald-700"
                            placeholder="Search reports"
                            value={search}
                            onChange={(event) => {
                                setPage(1);
                                setSearch(event.target.value);
                            }}
                        />
                    </label>

                    <select
                        className="rounded-xl border border-slate-200 bg-white px-4 py-3"
                        value={category}
                        onChange={(event) => {
                            setPage(1);
                            setCategory(event.target.value);
                        }}
                    >
                        <option value="">All categories</option>
                        <option>Road</option>
                        <option>Street Light</option>
                        <option>Drainage</option>
                        <option>Garbage</option>
                        <option>Water</option>
                        <option>Other</option>
                    </select>

                    <select
                        className="rounded-xl border border-slate-200 bg-white px-4 py-3"
                        value={reportStatus}
                        onChange={(event) => {
                            setPage(1);
                            setReportStatus(event.target.value);
                        }}
                    >
                        <option value="">All statuses</option>
                        <option>Submitted</option>
                        <option>In Progress</option>
                        <option>Resolved</option>
                    </select>

                    <label className="text-sm text-slate-600">
                        From
                        <input
                            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5"
                            type="date"
                            value={dateFrom}
                            onChange={(event) => {
                                setPage(1);
                                setDateFrom(event.target.value);
                            }}
                        />
                    </label>

                    <label className="text-sm text-slate-600">
                        To
                        <input
                            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5"
                            type="date"
                            value={dateTo}
                            onChange={(event) => {
                                setPage(1);
                                setDateTo(event.target.value);
                            }}
                        />
                    </label>

                    <select
                        className="self-end rounded-xl border border-slate-200 bg-white px-4 py-3"
                        value={`${sortBy}:${sortOrder}`}
                        onChange={(event) => {
                            const [newSortBy, newSortOrder] = event.target.value.split(":");
                            setSortBy(newSortBy);
                            setSortOrder(newSortOrder);
                            setPage(1);
                        }}
                    >
                        <option value="created_at:desc">Newest first</option>
                        <option value="created_at:asc">Oldest first</option>
                        <option value="title:asc">Title A–Z</option>
                        <option value="title:desc">Title Z–A</option>
                        <option value="status:asc">Status A–Z</option>
                    </select>

                    <label className="text-sm text-slate-600">
                        Reports per page
                        <select
                            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5"
                            value={pageSize}
                            onChange={(event) => {
                                setPage(1);
                                setPageSize(Number(event.target.value));
                            }}
                        >
                            <option value={6}>6</option>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                        </select>
                    </label>
                </div>

                {loading ? (
                    <p className="py-16 text-center text-slate-500">Loading reports...</p>
                ) : reports.length === 0 ? (
                    <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
                        <h2 className="text-lg font-bold">No reports found</h2>
                        <p className="mt-2 text-slate-500">Submit a report or try another search.</p>
                    </div>
                ) : (
                    <div className="mt-6 grid gap-4 md:grid-cols-2">
                        {reports.map((report) => (
                            <article
                                key={report.id}
                                className="rounded-2xl border border-slate-200 bg-white p-5"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">
                                            {report.category}
                                        </p>
                                        <h2 className="mt-2 text-lg font-bold">{report.title}</h2>
                                    </div>

                                    {user?.role === "admin" ? (
                                        <select
                                            className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-semibold"
                                            value={report.status}
                                            onChange={(event) => changeStatus(report.id, event.target.value)}
                                        >
                                            <option>Submitted</option>
                                            <option>In Progress</option>
                                            <option>Resolved</option>
                                        </select>
                                    ) : (
                                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
                                            {report.status}
                                        </span>
                                    )}
                                </div>

                                <p className="mt-2 text-sm text-slate-500">{report.location}</p>

                                <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">
                                    {report.description}
                                </p>

                                <div className="mt-5 flex gap-3 border-t border-slate-100 pt-4">
                                    <Link
                                        to={`/reports/${report.id}/edit`}
                                        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold hover:bg-slate-50"
                                    >
                                        <FiEdit2 /> Edit
                                    </Link>

                                    <button
                                        type="button"
                                        onClick={() => setPendingDelete(report)}
                                        className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50"
                                    >
                                        <FiTrash2 /> Delete
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                )}

                {!loading && totalPages > 1 && (
                    <div className="mt-6 flex items-center justify-center gap-4">
                        <button
                            className="rounded-lg border bg-white px-4 py-2 disabled:opacity-40"
                            disabled={page === 1}
                            onClick={() => setPage(page - 1)}
                        >
                            Previous
                        </button>
                        <span className="text-sm text-slate-600">
                            Page {page} of {totalPages}
                        </span>
                        <button
                            className="rounded-lg border bg-white px-4 py-2 disabled:opacity-40"
                            disabled={page === totalPages}
                            onClick={() => setPage(page + 1)}
                        >
                            Next
                        </button>
                    </div>
                )}
            </section>
            {pendingDelete && (
                <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4">
                    <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
                        <h2 className="text-xl font-bold">Delete this report?</h2>
                        <p className="mt-2 text-sm text-slate-600">
                            “{pendingDelete.title}”
                        </p>
                        <div className="mt-6 flex justify-end gap-3">
                            <button onClick={() => setPendingDelete(null)} className="rounded-lg border px-4 py-2 font-semibold">
                                Cancel
                            </button>
                            <button onClick={confirmDelete} className="rounded-lg bg-red-700 px-4 py-2 font-semibold text-white hover:bg-red-800">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}

export default Dashboard;
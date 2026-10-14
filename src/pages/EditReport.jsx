import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { FiArrowLeft } from "react-icons/fi";
import api from "../api";

function EditReport() {
    const { reportId } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({
        title: "",
        category: "",
        location: "",
        description: "",
        status: "Submitted",
    });

    useEffect(() => {
        async function loadReport() {
            try {
                const [reportResponse, userResponse] = await Promise.all([
                    api.get(`/api/reports/${reportId}`),
                    api.get("/api/auth/me"),
                ]);

                setForm({
                    title: reportResponse.data.title,
                    category: reportResponse.data.category,
                    location: reportResponse.data.location,
                    description: reportResponse.data.description,
                    status: reportResponse.data.status,
                });
                setUser(userResponse.data);
            } catch {
                toast.error("Could not load this report.");
                navigate("/dashboard");
            } finally {
                setLoading(false);
            }
        }

        loadReport();
    }, [reportId, navigate]);

    function handleChange(event) {
        setForm({ ...form, [event.target.name]: event.target.value });
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setSaving(true);

        const changes = { ...form };
        if (user?.role !== "admin") delete changes.status;

        try {
            await api.put(`/api/reports/${reportId}`, changes);
            toast.success("Report updated.");
            navigate("/dashboard");
        } catch (error) {
            const detail = error.response?.data?.detail;
            toast.error(typeof detail === "string" ? detail : "Could not update report.");
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return <p className="py-20 text-center text-slate-500">Loading report...</p>;
    }

    return (
        <main className="min-h-screen bg-[#f5f7f4] px-4 py-8 sm:py-12">
            <section className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 sm:p-9">
                <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-800">
                    <FiArrowLeft /> Back to dashboard
                </Link>

                <h1 className="mt-6 text-3xl font-extrabold">Edit report</h1>

                <form onSubmit={handleSubmit} className="mt-7 space-y-5">
                    <label className="block text-sm font-semibold">
                        Title
                        <input className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-normal" name="title" value={form.title} onChange={handleChange} minLength={3} maxLength={140} required />
                    </label>

                    <div className="grid gap-5 sm:grid-cols-2">
                        <label className="block text-sm font-semibold">
                            Category
                            <select className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-normal" name="category" value={form.category} onChange={handleChange} required>
                                <option>Road</option>
                                <option>Street Light</option>
                                <option>Drainage</option>
                                <option>Garbage</option>
                                <option>Water</option>
                                <option>Other</option>
                            </select>
                        </label>

                        <label className="block text-sm font-semibold">
                            Location
                            <input className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-normal" name="location" value={form.location} onChange={handleChange} maxLength={180} required />
                        </label>
                    </div>

                    <label className="block text-sm font-semibold">
                        Description
                        <textarea className="mt-2 min-h-32 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-normal" name="description" value={form.description} onChange={handleChange} minLength={10} required />
                    </label>

                    {user?.role === "admin" ? (
                        <select
                            className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-semibold"
                            value={report.status}
                            onChange={(event) => changeStatus(report.id, event.target.value)}>
                            <option>Submitted</option>
                            <option>In Progress</option>
                            <option>Resolved</option>
                        </select>
                    ) : (
                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
                            {report.status}
                        </span>
                    )}

                    <button className="w-full rounded-xl bg-emerald-800 px-5 py-3.5 font-bold text-white hover:bg-emerald-900 disabled:opacity-60" disabled={saving}>
                        {saving ? "Saving..." : "Save changes"}
                    </button>
                </form>
            </section>
        </main>
    );
}

export default EditReport;
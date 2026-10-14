import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FiArrowLeft, FiMapPin } from "react-icons/fi";
import api from "../api";

function NewReport() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    category: "",
    location: "",
    description: "",
  });

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);

    try {
      await api.post("/api/reports/", form);
      toast.success("Report submitted successfully!");
      navigate("/dashboard");
    } catch (error) {
      const detail = error.response?.data?.detail;
      toast.error(typeof detail === "string" ? detail : "Could not submit report.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f7f4] px-4 py-8 sm:py-12">
      <div className="mx-auto max-w-2xl">
        <Link
          to="/dashboard"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-emerald-800"
        >
          <FiArrowLeft /> Back to dashboard
        </Link>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-9">
          <div className="mb-7">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-100 text-xl text-emerald-800">
              <FiMapPin />
            </span>
            <p className="mt-6 text-sm font-bold uppercase tracking-widest text-emerald-700">
              Help improve your neighborhood
            </p>
            <h1 className="mt-2 text-3xl font-extrabold text-slate-900">
              Submit a report
            </h1>
            <p className="mt-2 text-slate-500">
              Share the issue and its location so the team can follow up.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                Report title
              </span>
              <input
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-emerald-700 focus:bg-white"
                name="title"
                value={form.title}
                onChange={handleChange}
                minLength={3}
                maxLength={140}
                placeholder="e.g. Pothole on Green Road"
                required
              />
            </label>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">
                  Category
                </span>
                <select
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-emerald-700"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Choose a category</option>
                  <option>Road</option>
                  <option>Street Light</option>
                  <option>Drainage</option>
                  <option>Garbage</option>
                  <option>Water</option>
                  <option>Other</option>
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">
                  Location
                </span>
                <input
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-emerald-700 focus:bg-white"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  maxLength={180}
                  placeholder="Area, road, or landmark"
                  required
                />
              </label>
            </div>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                Describe the issue
              </span>
              <textarea
                className="min-h-32 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-emerald-700 focus:bg-white"
                name="description"
                value={form.description}
                onChange={handleChange}
                minLength={10}
                placeholder="Add details that will help the team understand the issue."
                required
              />
            </label>

            <button
              className="w-full rounded-xl bg-emerald-800 px-5 py-3.5 font-bold text-white transition hover:bg-emerald-900 disabled:opacity-60"
              type="submit"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit report"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}

export default NewReport;
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api";
import AuthLayout from "../components/AuthLayout";
import { FiArrowRight, FiLock, FiMail, FiUser } from "react-icons/fi";

function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);

    try {
      await api.post("/api/auth/signup", form);

      toast.success("Account created! Please log in.");
      navigate("/login");
    } catch (error) {
      const detail = error.response?.data?.detail;
      const message = Array.isArray(detail)
        ? detail.map((item) => item.msg).join(", ")
        : detail || "Could not connect to the server.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join your community and help make it better."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-bold text-emerald-700">
            Log in
          </Link>
        </>
      }
    >
     <form onSubmit={handleSubmit} className="space-y-4">
  <label className="block">
    <span className="mb-2 block text-sm font-semibold text-slate-700">
      Full name
    </span>
    <span className="relative block">
      <FiUser
        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        aria-hidden="true"
      />
      <input
        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-700 focus:bg-white focus:ring-4 focus:ring-emerald-700/10"
        type="text"
        name="name"
        placeholder="Your name"
        value={form.name}
        onChange={handleChange}
        minLength={2}
        maxLength={100}
        autoComplete="name"
        required
      />
    </span>
  </label>

  <label className="block">
    <span className="mb-2 block text-sm font-semibold text-slate-700">
      Email address
    </span>
    <span className="relative block">
      <FiMail
        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        aria-hidden="true"
      />
      <input
        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-700 focus:bg-white focus:ring-4 focus:ring-emerald-700/10"
        type="email"
        name="email"
        placeholder="you@example.com"
        value={form.email}
        onChange={handleChange}
        autoComplete="email"
        required
      />
    </span>
  </label>

  <label className="block">
    <span className="mb-2 block text-sm font-semibold text-slate-700">
      Password
    </span>
    <span className="relative block">
      <FiLock
        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        aria-hidden="true"
      />
      <input
        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-700 focus:bg-white focus:ring-4 focus:ring-emerald-700/10"
        type="password"
        name="password"
        placeholder="At least 8 characters"
        value={form.password}
        onChange={handleChange}
        minLength={8}
        maxLength={72}
        autoComplete="new-password"
        required
      />
    </span>
  </label>

  <button
    className="group flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-800 px-5 py-3.5 font-bold text-white shadow-lg shadow-emerald-900/15 transition hover:-translate-y-0.5 hover:bg-emerald-900 disabled:cursor-wait disabled:opacity-60"
    type="submit"
    disabled={loading}
  >
    {loading ? "Creating account..." : "Create your account"}
    {!loading && (
      <FiArrowRight className="transition group-hover:translate-x-1" />
    )}
  </button>
</form>
    </AuthLayout>
  );
}

export default Signup;
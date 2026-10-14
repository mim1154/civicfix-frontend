import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api";
import AuthLayout from "../components/AuthLayout";
import { FiArrowRight, FiLock, FiMail } from "react-icons/fi";

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();
        setLoading(true);

        try {
            const { data } = await api.post("/api/auth/login", { email, password });

            localStorage.setItem("access_token", data.access_token);
            localStorage.setItem("refresh_token", data.refresh_token);

            const { data: profile } = await api.get("/api/auth/me");

            toast.success("Login successful!");
            navigate(profile.role === "admin" ? "/admin" : "/dashboard");
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
            title="Welcome back"
            subtitle="Log in to follow your community reports."
            footer={
                <>
                    New to CivicFix?{" "}
                    <Link to="/signup" className="font-bold text-emerald-700">
                        Create an account
                    </Link>
                </>
            }
        >
            <form onSubmit={handleSubmit} className="space-y-5">
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
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-700 focus:bg-white focus:ring-4 focus:ring-emerald-700/10"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
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
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-700 focus:bg-white focus:ring-4 focus:ring-emerald-700/10"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            autoComplete="current-password"
                            required
                        />
                    </span>
                </label>
                <div className="text-right">
                    <Link
                        to="/forgot-password"
                        className="text-sm font-semibold text-emerald-700 hover:text-emerald-900"
                    >
                        Forgot password?
                    </Link>
                </div>
                <button
                    className="group flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-800 px-5 py-3.5 font-bold text-white shadow-lg shadow-emerald-900/15 transition hover:-translate-y-0.5 hover:bg-emerald-900 disabled:cursor-wait disabled:opacity-60"
                    type="submit"
                    disabled={loading}
                >
                    {loading ? "Logging in..." : "Log in to CivicFix"}
                    {!loading && (
                        <FiArrowRight className="transition group-hover:translate-x-1" />
                    )}
                </button>
            </form>
        </AuthLayout>
    );
}

export default Login;
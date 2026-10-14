import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FiArrowLeft, FiKey, FiMail } from "react-icons/fi";
import api from "../api";
import AuthLayout from "../components/AuthLayout";

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function requestReset(event) {
    event.preventDefault();
    setLoading(true);

    try {
      const { data } = await api.post("/api/auth/forgot-password", { email });

      if (data.reset_token) {
        setResetToken(data.reset_token);
        toast.success("Reset token generated. Use it below.");
      } else {
        toast.success(data.message);
      }
    } catch (error) {
      const detail = error.response?.data?.detail;
      toast.error(typeof detail === "string" ? detail : "Could not request password reset.");
    } finally {
      setLoading(false);
    }
  }

  async function resetPassword(event) {
    event.preventDefault();
    setLoading(true);

    try {
      await api.post("/api/auth/reset-password", {
        token: resetToken,
        new_password: newPassword,
      });
      toast.success("Password reset. Please log in.");
      navigate("/login");
    } catch (error) {
      const detail = error.response?.data?.detail;
      toast.error(typeof detail === "string" ? detail : "Could not reset password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title={resetToken ? "Choose a new password" : "Forgot your password?"}
      subtitle={
        resetToken
          ? "Enter your reset token and choose a new password."
          : "Enter the email address connected to your account."
      }
      footer={
        <Link to="/login" className="inline-flex items-center gap-2 font-bold text-emerald-700">
          <FiArrowLeft /> Back to login
        </Link>
      }
    >
      {!resetToken ? (
        <form onSubmit={requestReset} className="space-y-5">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">
              Email address
            </span>
            <span className="relative block">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm outline-none focus:border-emerald-700 focus:bg-white"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
              />
            </span>
          </label>

          <button
            className="w-full rounded-xl bg-emerald-800 px-5 py-3.5 font-bold text-white hover:bg-emerald-900 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Requesting..." : "Request reset"}
          </button>
        </form>
      ) : (
        <form onSubmit={resetPassword} className="space-y-5">
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-900">
            Development mode: reset token is shown here. A deployed app should email this token.
          </div>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">
              Reset token
            </span>
            <span className="relative block">
              <FiKey className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-xs outline-none focus:border-emerald-700"
                value={resetToken}
                onChange={(event) => setResetToken(event.target.value)}
                required
              />
            </span>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">
              New password
            </span>
            <input
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none focus:border-emerald-700 focus:bg-white"
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              minLength={8}
              maxLength={72}
              autoComplete="new-password"
              required
            />
          </label>

          <button
            className="w-full rounded-xl bg-emerald-800 px-5 py-3.5 font-bold text-white hover:bg-emerald-900 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Updating..." : "Reset password"}
          </button>
        </form>
      )}
    </AuthLayout>
  );
}

export default ForgotPassword;
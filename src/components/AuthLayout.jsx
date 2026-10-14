import { Link } from "react-router-dom";
import { FiArrowLeft, FiMapPin } from "react-icons/fi";

function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f2f6f2] p-4">
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-emerald-200/50 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -right-20 h-80 w-80 rounded-full bg-lime-200/40 blur-3xl" />

      <section className="relative w-full max-w-[440px] rounded-[28px] border border-white bg-white p-7 shadow-[0_24px_80px_-30px_rgba(16,61,50,0.28)] sm:p-9">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-800 text-white">
              <FiMapPin size={20} />
            </span>
            <span className="text-lg font-extrabold tracking-tight text-[#173c32]">
              CivicFix
            </span>
          </Link>

          <Link
            to="/"
            aria-label="Back to home"
            className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 text-slate-500 transition hover:border-emerald-700 hover:text-emerald-800"
          >
            <FiArrowLeft />
          </Link>
        </div>

        <div className="mb-7 mt-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
            Your community, connected
          </p>
          <h1 className="mt-2 text-[28px] font-extrabold tracking-tight text-slate-900">
            {title}
          </h1>
          <p className="mt-1.5 text-sm leading-6 text-slate-500">{subtitle}</p>
        </div>

        {children}

        <div className="mt-6 border-t border-slate-100 pt-5 text-center text-sm text-slate-500">
          {footer}
        </div>
      </section>
    </main>
  );
}

export default AuthLayout;
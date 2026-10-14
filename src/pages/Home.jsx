import {FiArrowRight,FiCheckCircle,FiClipboard,FiMapPin,FiShield,FiUsers,
} from "react-icons/fi";

const features = [
  {
    icon: <FiClipboard />,
    title: "Report a problem",
    text: "রাস্তা, street light বা এলাকার অন্য সমস্যা সহজে report করুন।",
  },
  {
    icon: <FiMapPin />,
    title: "Track progress",
    text: "আপনার complaint কোন অবস্থায় আছে তা dashboard-এ দেখুন।",
  },
  {
    icon: <FiUsers />,
    title: "Community powered",
    text: "বাসিন্দা ও city team একসঙ্গে কাজ করে এলাকার উন্নতি করবে।",
  },
];

function App() {
  return (
    <div className="min-h-screen bg-[#f7f8f5] text-[#18332b]">
      <header className="border-b border-emerald-950/10 bg-white">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <a href="/" className="flex items-center gap-2 text-xl font-extrabold">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-700 text-white">
              <FiMapPin size={21} />
            </span>
            CivicFix
          </a>

          <div className="hidden items-center gap-8 text-sm font-medium md:flex">
            <a href="#features" className="hover:text-emerald-700">Features</a>
            <a href="#how-it-works" className="hover:text-emerald-700">How it works</a>
            <a href="#about" className="hover:text-emerald-700">About</a>
          </div>

          <div className="flex items-center gap-3">
            <a href="/login" className="hidden text-sm font-semibold sm:inline">
              Log in
            </a>
            <a
              href="/signup"
              className="rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
            >
              Get started
            </a>
          </div>
        </nav>
      </header>

      <main>
        <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 md:py-24 lg:grid-cols-2 lg:px-8">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-800">
              <FiCheckCircle />
              Better neighborhoods start here
            </div>

            <h1 className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              See a problem?
              <span className="block text-emerald-700">Let’s fix it.</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              CivicFix helps residents report local issues and follow their
              progress—from the first update to the final fix.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-5 py-3 font-semibold text-white transition hover:bg-emerald-800"
              >
                Explore how it works <FiArrowRight />
              </a>
              <a
                href="#features"
                className="rounded-lg border border-slate-300 bg-white px-5 py-3 font-semibold transition hover:border-emerald-700"
              >
                Learn more
              </a>
            </div>

            <div className="mt-10 flex items-center gap-3 text-sm text-slate-600">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-white text-emerald-700 shadow-sm">
                <FiShield />
              </span>
              Transparent updates. Stronger communities.
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-[2rem] bg-emerald-200/50 blur-2xl" />
            <div className="relative overflow-hidden rounded-[2rem] bg-[#174b3b] p-7 text-white shadow-xl sm:p-10">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-emerald-100">Community dashboard</p>
                  <h2 className="mt-2 text-2xl font-bold">Your neighborhood</h2>
                </div>
                <span className="rounded-full bg-white/15 px-3 py-1 text-xs">
                  Live updates
                </span>
              </div>

              <div className="mt-8 space-y-4">
                {[
                  ["Pothole on Green Road", "In progress", "bg-amber-300"],
                  ["Street light not working", "Resolved", "bg-emerald-300"],
                  ["Blocked drainage", "Submitted", "bg-sky-300"],
                ].map(([title, status, dot]) => (
                  <div
                    key={title}
                    className="flex items-center justify-between gap-3 rounded-xl bg-white/10 p-4"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`h-2.5 w-2.5 rounded-full ${dot}`} />
                      <span className="text-sm font-medium">{title}</span>
                    </div>
                    <span className="whitespace-nowrap text-xs text-emerald-100">
                      {status}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-7 grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-white/10 p-4">
                  <p className="text-sm text-emerald-100">Reports submitted</p>
                  <p className="mt-1 text-3xl font-bold">128</p>
                </div>
                <div className="rounded-xl bg-white/10 p-4">
                  <p className="text-sm text-emerald-100">Issues resolved</p>
                  <p className="mt-1 text-3xl font-bold">96</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="bg-white py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="max-w-2xl">
              <p className="font-bold text-emerald-700">WHAT YOU CAN DO</p>
              <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
                A simple way to make a difference
              </h2>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {features.map((feature) => (
                <article
                  key={feature.title}
                  className="rounded-2xl border border-slate-200 bg-[#fbfcfa] p-6"
                >
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-emerald-100 text-xl text-emerald-800">
                    {feature.icon}
                  </span>
                  <h3 className="mt-5 text-xl font-bold">{feature.title}</h3>
                  <p className="mt-2 leading-7 text-slate-600">{feature.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
          <div className="rounded-3xl bg-emerald-50 p-8 sm:p-12">
            <p className="font-bold text-emerald-700">HOW IT WORKS</p>
            <h2 className="mt-3 text-3xl font-extrabold">
              Report it. Track it. Fix it.
            </h2>
            <p className="mt-4 max-w-2xl leading-7 text-slate-600">
              Create an account, submit a report with its location and details,
              then follow status updates from the city team.
            </p>
          </div>
        </section>
      </main>

      <footer id="about" className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-6 text-sm text-slate-500 sm:flex-row sm:justify-between lg:px-8">
          <span>© 2026 CivicFix. Built for better communities.</span>
          <span>Report local issues. Follow every update.</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
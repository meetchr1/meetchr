import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 py-4 sm:py-5 flex items-center justify-between">
          <div>
            <p className="text-sm text-pink-300">MeeTchr</p>
            <p className="text-xs text-slate-400">
              Support system for new teachers
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="px-3 py-2 rounded-lg text-sm border border-slate-700 hover:bg-slate-800"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="px-3 py-2 rounded-lg text-sm bg-pink-600 hover:bg-pink-700"
            >
              Get started
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-10 sm:py-14 grid lg:grid-cols-2 gap-8 sm:gap-10 items-center">
        <div className="space-y-5">
          <p className="inline-flex items-center rounded-full border border-pink-400/40 px-3 py-1 text-xs text-pink-200">
            New product experience for 2026
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold leading-tight">
            One place for daily teacher support, not one more tool to manage.
          </h1>
          <p className="text-slate-300 text-base sm:text-lg max-w-xl">
            MeeTchr combines daily check-ins, AI coaching, peer matching, and
            practical micro-courses into a single flow designed for early-career
            educators.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/portal"
              className="px-4 py-2.5 rounded-lg bg-pink-600 hover:bg-pink-700 text-sm font-medium"
            >
              Open Teacher Portal
            </Link>
            <Link
              href="/coach"
              className="px-4 py-2.5 rounded-lg border border-slate-700 hover:bg-slate-800 text-sm font-medium"
            >
              Try AI Coach
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 sm:p-6 space-y-4">
          <h2 className="text-lg font-semibold">Today in MeeTchr</h2>
          <ul className="space-y-3 text-sm text-slate-300">
            <li className="rounded-lg border border-slate-800 p-3">
              <p className="text-slate-100 font-medium">
                1. Check in your energy
              </p>
              <p>Log heaviness in under 20 seconds and capture what is hard.</p>
            </li>
            <li className="rounded-lg border border-slate-800 p-3">
              <p className="text-slate-100 font-medium">
                2. Get coaching right away
              </p>
              <p>Receive a calm, actionable next step from AI Coach.</p>
            </li>
            <li className="rounded-lg border border-slate-800 p-3">
              <p className="text-slate-100 font-medium">
                3. Match with a real peer
              </p>
              <p>Request targeted help and start a guided micro-session.</p>
            </li>
          </ul>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-2 sm:py-4">
        <div className="flex flex-wrap gap-2 text-xs sm:text-sm">
          {["Portal", "AI Coach", "Peer Help", "Academy", "Admin Analytics"].map(
            (item) => (
              <span
                key={item}
                className="px-2.5 py-1 rounded-full border border-slate-700 text-slate-300"
              >
                {item}
              </span>
            )
          )}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-6">
        <h2 className="text-2xl font-semibold mb-4">Core Product Experience</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              title: "Portal",
              body: "Daily heaviness check-in and quick routing to support.",
            },
            {
              title: "AI Coach",
              body: "Private coaching chat with strict JSON-safe response handling.",
            },
            {
              title: "Peer Help",
              body: "Specialty + availability matching and participant-scoped chat.",
            },
            {
              title: "Academy",
              body: "Micro-courses with enrollment and lesson progress tracking.",
            },
            {
              title: "Admin Analytics",
              body: "Aggregate-only reporting; no access to raw private notes or chats.",
            },
            {
              title: "Privacy by Design",
              body: "Row-level security across profiles, check-ins, conversations, and peer workflows.",
            },
          ].map((item) => (
            <article
              key={item.title}
              className="rounded-xl border border-slate-800 bg-slate-900/50 p-4"
            >
              <h3 className="font-semibold text-slate-100">{item.title}</h3>
              <p className="text-sm text-slate-300 mt-1">{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-10">
        <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 to-slate-900/60 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold">Ready for your first week?</h2>
            <p className="text-slate-300 mt-1 text-sm sm:text-base">
              Start with the Portal and let MeeTchr guide the rest.
            </p>
          </div>
          <Link
            href="/signup"
            className="px-4 py-2.5 rounded-lg bg-pink-600 hover:bg-pink-700 text-sm font-medium"
          >
            Create account
          </Link>
        </div>
      </section>
    </main>
  );
}

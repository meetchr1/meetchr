import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="border-b border-slate-200 bg-white sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:py-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-pink-600">MeeTchr</p>
            <p className="text-xs text-slate-500">
              Support system for new teachers
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="px-3 py-2 rounded-lg text-sm border border-slate-300 hover:bg-slate-100"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="px-3 py-2 rounded-lg text-sm bg-pink-600 text-white hover:bg-pink-700"
            >
              Schedule a demo
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12 sm:py-16 grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
        <div className="space-y-6">
          <p className="inline-flex items-center rounded-full border border-pink-200 bg-pink-50 px-3 py-1 text-xs text-pink-700">
            Evidence-informed teacher mentoring platform
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold leading-tight text-slate-900">
            A full mentoring platform for programs, mentors, and first-year
            teachers.
          </h1>
          <p className="text-slate-600 text-base sm:text-lg max-w-xl">
            MeeTchr improves program operations, relationship quality, and
            educator outcomes through matching, AI-supported coaching, live
            communication tools, and built-in training.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/signup"
              className="px-4 py-2.5 rounded-lg bg-pink-600 hover:bg-pink-700 text-white text-sm font-medium"
            >
              Schedule a demo
            </Link>
            <Link
              href="/portal"
              className="px-4 py-2.5 rounded-lg border border-slate-300 hover:bg-slate-100 text-sm font-medium"
            >
              Explore platform
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Award-ready platform architecture
          </h2>
          <p className="text-sm text-slate-600">
            Built to support institutions, nonprofits, and district programs
            with measurable mentoring impact.
          </p>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-xl border border-slate-200 bg-white p-3">
              <p className="text-xl font-bold text-pink-600">92%</p>
              <p className="text-xs text-slate-500">Platform adoption</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-3">
              <p className="text-xl font-bold text-pink-600">3x</p>
              <p className="text-xs text-slate-500">Lower GPA risk</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-3">
              <p className="text-xl font-bold text-pink-600">87%</p>
              <p className="text-xs text-slate-500">Resource usefulness</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <p className="text-xs uppercase tracking-wide text-slate-500 mb-3">
            Trusted by teacher support programs
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 text-sm">
            {[
              "UMass Boston",
              "Northeastern",
              "Step Up",
              "BBBS",
              "Virginia Tech",
              "USMA",
              "Silver Lining",
              "National Guard Youth",
            ].map((logo) => (
              <div
                key={logo}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-center text-slate-600"
              >
                {logo}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="rounded-2xl border border-slate-200 p-6 sm:p-8 bg-white">
          <h2 className="text-2xl font-semibold mb-2">
            The science behind MeeTchr
          </h2>
          <p className="text-slate-600 mb-4">
            Every core feature, from matching to progress tracking and coach AI,
            is designed to support stronger mentoring relationships and better
            student-facing outcomes.
          </p>
          <blockquote className="border-l-4 border-pink-500 pl-4 text-slate-700">
            &quot;Programs need tools that make evidence-based mentoring easier to
            run at scale. MeeTchr turns proven practices into day-to-day
            workflows.&quot;
          </blockquote>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-2 sm:py-4">
        <div className="flex flex-wrap gap-2 text-xs sm:text-sm text-slate-700">
          {[
            "Portal",
            "Matching Survey",
            "Live Chat",
            "Video Sessions",
            "AI Coach",
            "Peer Help",
            "Academy",
            "Admin Analytics",
          ].map(
            (item) => (
              <span
                key={item}
                className="px-2.5 py-1 rounded-full border border-slate-300 bg-slate-50"
              >
                {item}
              </span>
            )
          )}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-8">
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
              title: "Matching Survey",
              body: "Structured onboarding survey to power better mentor/peer matching.",
            },
            {
              title: "Peer Help",
              body: "Specialty + availability matching and participant-scoped chat.",
            },
            {
              title: "Live Mentorship Hub",
              body: "Real-time chat, video sessions, files, scheduling, and guided prompts.",
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
              className="rounded-xl border border-slate-200 bg-white p-4"
            >
              <h3 className="font-semibold text-slate-900">{item.title}</h3>
              <p className="text-sm text-slate-600 mt-1">{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-semibold mb-4">Program Outcomes</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { value: "92%", label: "Teachers who actively use the platform" },
            { value: "70%", label: "Resource referrals successfully accessed" },
            { value: "87%", label: "Users reporting progress on goals" },
            { value: "94%", label: "Mentors staying engaged month-over-month" },
          ].map((item) => (
            <div key={item.label} className="rounded-xl border border-slate-200 p-5 bg-slate-50">
              <p className="text-3xl font-bold text-pink-600">{item.value}</p>
              <p className="text-sm text-slate-600 mt-1">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-semibold mb-4">What partners say</h2>
        <div className="grid lg:grid-cols-3 gap-4">
          {[
            {
              quote:
                "Engagement is through the roof compared to last year. This changed how we support first-year teachers.",
              by: "Program Director, University Partner",
            },
            {
              quote:
                "I can log in and find everything in one place: goals, chat, resources, and session history.",
              by: "Mentor, K-12 Partner Program",
            },
            {
              quote:
                "The AI summary helps me quickly focus on what the mentee marked as most challenging.",
              by: "Peer Mentor, Higher Ed Program",
            },
          ].map((item) => (
            <article
              key={item.by}
              className="rounded-xl border border-slate-200 bg-white p-5"
            >
              <p className="text-slate-700 text-sm">&quot;{item.quote}&quot;</p>
              <p className="text-xs text-slate-500 mt-3">{item.by}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-900 to-slate-800 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-white">
              Mentor training + platform in one system
            </h2>
            <p className="text-slate-300 mt-1 text-sm sm:text-base">
              Launch quickly with onboarding, mentor academy content, and
              measurement dashboards.
            </p>
          </div>
          <Link
            href="/academy"
            className="px-4 py-2.5 rounded-lg border border-slate-400 text-white hover:bg-slate-700 text-sm font-medium"
          >
            Visit academy
          </Link>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 pb-14">
        <div className="rounded-2xl border border-slate-200 bg-pink-50 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">
              Ready to improve mentoring outcomes?
            </h2>
            <p className="text-slate-600 mt-1 text-sm sm:text-base">
              See how MeeTchr supports program managers, mentors, and mentees.
            </p>
          </div>
          <Link
            href="/signup"
            className="px-4 py-2.5 rounded-lg bg-pink-600 text-white hover:bg-pink-700 text-sm font-medium"
          >
            Schedule a demo
          </Link>
        </div>
      </section>
    </main>
  );
}

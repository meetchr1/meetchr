import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-pink-50 via-white to-coral-50">
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10"></div>

      <div className="container mx-auto px-6 py-20 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-block px-4 py-2 bg-pink-100 text-pink-700 rounded-full text-sm">
              AI-Powered Mentorship Matching
            </div>

            <h1 className="text-5xl lg:text-6xl">
              <span className="bg-gradient-to-r from-pink-600 to-coral-500 bg-clip-text text-transparent">
                MeeTchr
              </span>
            </h1>

            <p className="text-xl lg:text-2xl text-gray-700 leading-relaxed">
              Connect with the perfect teaching partner through
              <span className="text-pink-600"> AI-powered matching</span>. Whether you&apos;re a new teacher seeking guidance or a veteran ready to share wisdom, find
              <span className="text-coral-500"> mentorship that benefits you both</span>.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/survey" className="px-8 py-4 bg-gradient-to-r from-pink-600 to-coral-500 text-white rounded-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group">
                Find a Mentor
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/survey" className="px-8 py-4 bg-white border-2 border-pink-600 text-pink-600 rounded-lg hover:bg-pink-50 transition-colors flex items-center justify-center gap-2 group">
                Become a Mentor
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="flex gap-8 pt-4">
              <div>
                <div className="text-3xl text-pink-600">12K+</div>
                <div className="text-sm text-gray-600">Successful mentorship pairs</div>
              </div>
              <div>
                <div className="text-3xl text-coral-500">4.8/5</div>
                <div className="text-sm text-gray-600">Match satisfaction rating</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1512238972088-8acb84db0771?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFjaGVyJTIwY2xhc3Nyb29tJTIwbWVudG9yfGVufDF8fHx8MTc2ODUxNDIzOXww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Teachers collaborating"
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-900/20 to-transparent"></div>
            </div>

            {/* Floating card */}
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-xl border border-gray-100 max-w-xs">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-100 to-coral-100 rounded-full flex items-center justify-center text-pink-600 text-xl">
                  ✓
                </div>
                <div>
                  <div className="text-sm text-gray-600">Teachers Thriving</div>
                  <div className="text-2xl text-gray-900">Together</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

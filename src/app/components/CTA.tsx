import Link from "next/link";
import { ArrowRight, Heart } from "lucide-react";

export function CTA() {
  return (
    <section className="py-20 bg-gradient-to-br from-navy-900 via-navy-800 to-pink-900 text-white">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl mb-6">
            Ready to Find Your Teaching Partner?
          </h2>
          <p className="text-xl text-gray-300 mb-12">
            Whether you&apos;re a new teacher seeking guidance or a veteran ready to share your
            wisdom and rediscover your passion, MeeTchr makes meaningful connections happen.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-pink-900/30 p-8 rounded-xl border border-pink-500/30 backdrop-blur-sm">
              <h3 className="text-2xl mb-4">For New Teachers</h3>
              <p className="text-gray-300 mb-6">
                Find your ideal mentor who&apos;s been exactly where you are. Get support, save time,
                and actually enjoy teaching again.
              </p>
              <Link href="/survey" className="w-full px-8 py-4 bg-gradient-to-r from-pink-600 to-coral-500 text-white rounded-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group">
                Find Your Mentor
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="bg-coral-900/30 p-8 rounded-xl border border-coral-500/30 backdrop-blur-sm">
              <h3 className="text-2xl mb-4">For Veteran Teachers</h3>
              <p className="text-gray-300 mb-6">
                Share your wisdom with someone who truly appreciates it. Reignite your passion
                and remember why you became a teacher.
              </p>
              <Link href="/survey" className="w-full px-8 py-4 bg-white border-2 border-white text-pink-600 rounded-lg hover:bg-pink-50 transition-colors flex items-center justify-center gap-2 group">
                Become a Mentor
                <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </Link>
            </div>
          </div>

          <p className="text-sm text-gray-400 mb-8">
            Join thousands of teachers already transforming their careers together.
          </p>

          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1752649936344-07bb02d049c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHRlYWNoZXIlMjBpbnNwaXJhdGlvbnxlbnwxfHx8fDE3Njg1MTQyMzl8MA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Inspired teacher"
              className="rounded-2xl shadow-2xl mx-auto max-w-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

import { AlertCircle, Heart, Users } from "lucide-react";

export function Problem() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl mb-6">
            Why <span className="text-pink-600">Great Mentorship Matters</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Teaching can be isolating. New teachers need support. Veteran teachers want meaningful connections.
            Yet random pairings and busy schedules keep teachers from finding their perfect match.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <div className="w-14 h-14 bg-pink-100 rounded-lg flex items-center justify-center mb-6">
              <Heart className="w-7 h-7 text-pink-600" />
            </div>
            <h3 className="text-2xl mb-4">New Teachers Feel Isolated</h3>
            <p className="text-gray-600 mb-4">
              First-year teachers are drowning—juggling lesson plans and classroom chaos without
              the personalized guidance and support they desperately need to succeed.
            </p>
            <div className="text-3xl text-pink-600">44%</div>
            <div className="text-sm text-gray-500">Leave within 5 years</div>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <div className="w-14 h-14 bg-coral-100 rounded-lg flex items-center justify-center mb-6">
              <AlertCircle className="w-7 h-7 text-coral-600" />
            </div>
            <h3 className="text-2xl mb-4">Random Assignments Fail</h3>
            <p className="text-gray-600 mb-4">
              Mentorship programs pair teachers by chance—not by subject, style, or compatibility—
              leading to mismatched relationships that waste everyone&apos;s time.
            </p>
            <div className="text-3xl text-coral-600">73%</div>
            <div className="text-sm text-gray-500">Report poor mentor matches</div>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <div className="w-14 h-14 bg-navy-100 rounded-lg flex items-center justify-center mb-6">
              <Users className="w-7 h-7 text-navy-800" />
            </div>
            <h3 className="text-2xl mb-4">Veterans Seek Meaningful Impact</h3>
            <p className="text-gray-600 mb-4">
              Experienced teachers want to share their hard-earned wisdom and reignite their passion,
              but outdated systems make mentorship feel like a burden instead of a rewarding experience.
            </p>
            <div className="text-3xl text-navy-800">82%</div>
            <div className="text-sm text-gray-500">Want to mentor effectively</div>
          </div>
        </div>
      </div>
    </section>
  );
}

import { Brain, Heart, Sparkles, Users } from "lucide-react";

export function Solution() {
  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl mb-6">
            Perfect Matches, <span className="text-pink-600">Mutual Growth</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            MeeTchr uses AI to match you with your ideal teaching partner—someone who gets you,
            supports you, and grows with you. Mentorship that benefits both partners equally.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center shrink-0">
                <Brain className="w-6 h-6 text-pink-600" />
              </div>
              <div>
                <h3 className="text-2xl mb-2">Intelligent Matching</h3>
                <p className="text-gray-600">
                  Our algorithm finds your ideal teaching partner based on subject, experience, personality,
                  and schedules—creating authentic connections that feel natural from day one.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 bg-coral-100 rounded-lg flex items-center justify-center shrink-0">
                <Heart className="w-6 h-6 text-coral-600" />
              </div>
              <div>
                <h3 className="text-2xl mb-2">Mutual Growth & Fulfillment</h3>
                <p className="text-gray-600">
                  New teachers gain confidence and save hours each week. Veteran teachers rediscover
                  their purpose and remember why they fell in love with teaching. Both partners thrive.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center shrink-0">
                <Sparkles className="w-6 h-6 text-pink-600" />
              </div>
              <div>
                <h3 className="text-2xl mb-2">Conversations That Flow</h3>
                <p className="text-gray-600">
                  No awkward silences or forced meetings. Guided prompts and templates help conversations
                  feel natural while keeping you both on track to reach your goals.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 bg-navy-100 rounded-lg flex items-center justify-center shrink-0">
                <Users className="w-6 h-6 text-navy-800" />
              </div>
              <div>
                <h3 className="text-2xl mb-2">A Thriving Community</h3>
                <p className="text-gray-600">
                  Join a network where teachers at every stage support each other. Share wins,
                  troubleshoot challenges, and build connections that last beyond the school year.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

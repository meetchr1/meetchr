import { Target, MessageCircle, BarChart3, BookOpen, Calendar, Award } from "lucide-react";

export function Features() {
  const features = [
    {
      icon: Target,
      title: "Smart Pairing Algorithm",
      description: "Match with your ideal teaching partner based on subject, personality, teaching style, and mutual goals. Real compatibility, not random assignment.",
      color: "pink"
    },
    {
      icon: MessageCircle,
      title: "Natural Conversations",
      description: "Structured prompts that spark genuine discussion. Both partners know what to talk about and leave each session feeling energized.",
      color: "coral"
    },
    {
      icon: BarChart3,
      title: "Shared Success Tracking",
      description: "New teachers watch their confidence grow. Veteran teachers see their tangible impact. Celebrate every milestone together.",
      color: "navy"
    },
    {
      icon: BookOpen,
      title: "Resources Both Can Use",
      description: "Lesson plans, strategies, and frameworks that mentors love to share and new teachers can implement immediately. Everyone benefits.",
      color: "pink"
    },
    {
      icon: Calendar,
      title: "Flexible Meeting Times",
      description: "Respect both partners' busy lives with smart scheduling that finds times that actually work for both of you.",
      color: "coral"
    },
    {
      icon: Award,
      title: "Recognition for Both",
      description: "Track growth, earn certifications, and showcase your commitment to the teaching community—whether you're learning or leading.",
      color: "navy"
    }
  ];

  const colorMap: Record<string, { bg: string; icon: string }> = {
    pink: { bg: "bg-pink-100", icon: "text-pink-600" },
    coral: { bg: "bg-coral-100", icon: "text-coral-600" },
    navy: { bg: "bg-navy-100", icon: "text-navy-800" }
  };

  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl mb-6">
            Built for <span className="text-pink-600">Both of You</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Every feature designed to make mentorship rewarding, natural, and mutually beneficial.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const colors = colorMap[feature.color];
            const Icon = feature.icon;

            return (
              <div
                key={index}
                className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow"
              >
                <div className={`w-14 h-14 ${colors.bg} rounded-lg flex items-center justify-center mb-6`}>
                  <Icon className={`w-7 h-7 ${colors.icon}`} />
                </div>
                <h3 className="text-2xl mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

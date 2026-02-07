import { Quote } from "lucide-react";

export function Testimonials() {
  const testimonials = [
    {
      quote: "Finding my mentor through MeeTchr changed everything. We connect on everything—same subject, similar struggles, shared wins. Our weekly check-ins keep me grounded and help me become a better teacher every day.",
      author: "Sarah Martinez",
      role: "1st Year Math Teacher",
      location: "Austin, TX",
      type: "mentee"
    },
    {
      quote: "Mentoring through MeeTchr isn't another obligation—it's genuinely fulfilling. I'm matched with teachers who value what I've learned, and watching them thrive reminds me why I love this profession. We both grow.",
      author: "Marcus Williams",
      role: "Veteran English Teacher & Mentor",
      location: "Chicago, IL",
      type: "mentor"
    },
    {
      quote: "My mentor isn't just giving advice—she truly gets the chaos and celebrates my wins with me. She gives me strategies I can actually use tomorrow. I'm staying in teaching because I finally have someone in my corner.",
      author: "David Park",
      role: "2nd Year Science Teacher",
      location: "Portland, OR",
      type: "mentee"
    }
  ];

  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl mb-6">
            Real Connections, <span className="text-coral-500">Real Impact</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            New teachers finding confidence. Veteran teachers rediscovering purpose. Authentic partnerships that transform careers on both sides.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-gray-50 p-8 rounded-xl relative"
            >
              <div className="flex items-center gap-2 mb-4">
                <Quote className="w-10 h-10 text-pink-200" />
                <span className={`text-xs px-3 py-1 rounded-full ${
                  testimonial.type === "mentee"
                    ? "bg-pink-100 text-pink-700"
                    : "bg-coral-100 text-coral-700"
                }`}>
                  {testimonial.type === "mentee" ? "Mentee" : "Mentor"}
                </span>
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <div>
                <div className="text-gray-900 mb-1">{testimonial.author}</div>
                <div className="text-sm text-gray-600">{testimonial.role}</div>
                <div className="text-sm text-gray-500">{testimonial.location}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

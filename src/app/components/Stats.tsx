export function Stats() {
  const stats = [
    { value: "89%", label: "Mentees feel more confident" },
    { value: "94%", label: "Mentors find it rewarding" },
    { value: "3x", label: "Higher retention for mentees" },
    { value: "12K+", label: "Successful mentorship pairs" }
  ];
  
  return (
    <section className="py-20 bg-gradient-to-br from-pink-600 via-coral-500 to-navy-800 text-white">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl mb-6">
            Transforming Careers on Both Sides
          </h2>
          <p className="text-xl text-pink-100 max-w-3xl mx-auto">
            Novice teachers thrive with support. Veteran teachers rediscover purpose. 
            Everyone wins with meaningful mentorship.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-5xl lg:text-6xl mb-3">{stat.value}</div>
              <div className="text-lg text-pink-100">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { CheckCircle, Sparkles } from "lucide-react";

export function Pricing() {
  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl mb-6">
            Simple & <span className="text-pink-600">Free to Start</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join MeeTchr for free and start building meaningful mentorship relationships. 
            Premium features coming soon for those who want even more.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {/* Basic (Free) Card */}
          <div className="bg-gradient-to-br from-pink-50 to-coral-50 p-8 rounded-2xl border-2 border-pink-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-3xl text-gray-900 mb-2">Basic</h3>
                <p className="text-sm text-gray-600">For All Teachers</p>
              </div>
              <div className="text-5xl text-pink-600">Free</div>
            </div>
            
            <p className="text-gray-700 text-lg mb-6">
              Everything you need to find your teaching partner and start thriving together.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-pink-600 shrink-0 mt-1" />
                <span className="text-gray-700">AI-powered mentor matching</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-pink-600 shrink-0 mt-1" />
                <span className="text-gray-700">Unlimited mentorship sessions</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-pink-600 shrink-0 mt-1" />
                <span className="text-gray-700">Guided conversation prompts</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-pink-600 shrink-0 mt-1" />
                <span className="text-gray-700">Smart scheduling & reminders</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-pink-600 shrink-0 mt-1" />
                <span className="text-gray-700">Progress tracking</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-pink-600 shrink-0 mt-1" />
                <span className="text-gray-700">Basic resource library</span>
              </div>
            </div>
            
            <button className="w-full px-8 py-4 bg-gradient-to-r from-pink-600 to-coral-500 text-white rounded-lg hover:shadow-xl transition-all">
              Get Started Free
            </button>
          </div>
          
          {/* Premium (Coming Soon) Card */}
          <div className="bg-gradient-to-br from-navy-50 to-pink-50 p-8 rounded-2xl border-2 border-navy-200 relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-navy-800 text-white px-4 py-1 rounded-full text-sm">
              Coming Soon
            </div>
            
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-3xl text-gray-900 mb-2">Premium</h3>
                <p className="text-sm text-gray-600">Enhanced Features</p>
              </div>
              <div className="text-right">
                <div className="text-3xl text-navy-800">$___</div>
                <div className="text-sm text-gray-500">/month</div>
              </div>
            </div>
            
            <p className="text-gray-700 text-lg mb-6">
              Everything in Basic, plus advanced tools to supercharge your teaching journey.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-gray-400 shrink-0 mt-1" />
                <span className="text-gray-500">All Basic features</span>
              </div>
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-coral-600 shrink-0 mt-1" />
                <span className="text-gray-700">Community forum access</span>
              </div>
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-coral-600 shrink-0 mt-1" />
                <span className="text-gray-700">AI lesson planning assistant</span>
              </div>
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-coral-600 shrink-0 mt-1" />
                <span className="text-gray-700">Premium resource library</span>
              </div>
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-coral-600 shrink-0 mt-1" />
                <span className="text-gray-700">Priority matching</span>
              </div>
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-coral-600 shrink-0 mt-1" />
                <span className="text-gray-700">Advanced analytics & insights</span>
              </div>
            </div>
            
            <button className="w-full px-8 py-4 bg-gray-300 text-gray-600 rounded-lg cursor-not-allowed" disabled>
              Coming Soon
            </button>
          </div>
        </div>
        
        {/* Bottom value prop */}
        <div className="bg-gray-50 p-8 rounded-xl text-center max-w-4xl mx-auto">
          <h3 className="text-2xl mb-4">Free for Everyone, Forever</h3>
          <p className="text-gray-600 text-lg">
            Our mission is to make quality mentorship accessible to all teachers. 
            The Basic plan gives you everything you need to find your teaching partner and thrive together—
            no credit card required, no catches, just meaningful connections.
          </p>
        </div>
      </div>
    </section>
  );
}

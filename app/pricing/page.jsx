import React from 'react';

const Pricing = () => {
  const features = [
    "Unlimited practice sessions",
    "AI-powered interview simulations",
    "Real-time feedback and analysis",
    "Performance tracking dashboard",
    "Industry-specific scenarios",
    "Personalized coaching tips",
    "Progress reports and insights",
    "24/7 access to platform",
    "Mobile-friendly interface",
    "Community support forum"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Simple <span className="text-blue-400">Pricing</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Get started with our platform completely free. No credit card required.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl blur-2xl opacity-20"></div>
            
            <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl border-2 border-purple-500/50 p-12 md:p-16">
              <div className="text-center mb-12">
                <div className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 rounded-full px-6 py-2 text-sm font-semibold mb-6">
                  Limited Time Offer
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-4">Free Forever</h2>
                <div className="flex items-center justify-center gap-3 mb-6">
                  <span className="text-6xl md:text-7xl font-bold">$0</span>
                  <span className="text-2xl text-gray-400">/month</span>
                </div>
                <p className="text-lg text-gray-300">
                  Full access to all features. Start mastering your interview skills today.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-12">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-200">{feature}</span>
                  </div>
                ))}
              </div>

              <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 py-4 rounded-full font-semibold text-lg hover:opacity-90 transition-opacity">
                Get Started Free
              </button>
            </div>
          </div>

          <div className="mt-16 grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-400 mb-2">∞</div>
              <h3 className="text-xl font-semibold mb-2">Unlimited Practice</h3>
              <p className="text-gray-400">No limits on interview sessions</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-400 mb-2">24/7</div>
              <h3 className="text-xl font-semibold mb-2">Always Available</h3>
              <p className="text-gray-400">Practice whenever you need</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-400 mb-2">0</div>
              <h3 className="text-xl font-semibold mb-2">No Hidden Fees</h3>
              <p className="text-gray-400">Completely free, forever</p>
            </div>
          </div>

          <div className="mt-16 bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
            <h3 className="text-2xl font-bold mb-4 text-center">Frequently Asked Questions</h3>
            <div className="space-y-4">
              <details className="group">
                <summary className="cursor-pointer text-lg font-semibold hover:text-purple-400 transition-colors">
                  Is this really free forever?
                </summary>
                <p className="mt-2 text-gray-400 pl-4">
                  Yes! We believe everyone should have access to quality interview preparation. All features are completely free with no time limits.
                </p>
              </details>
              <details className="group">
                <summary className="cursor-pointer text-lg font-semibold hover:text-purple-400 transition-colors">
                  Do I need a credit card to sign up?
                </summary>
                <p className="mt-2 text-gray-400 pl-4">
                  No credit card required. Simply create an account and start practicing immediately.
                </p>
              </details>
              <details className="group">
                <summary className="cursor-pointer text-lg font-semibold hover:text-purple-400 transition-colors">
                  Will there be premium features in the future?
                </summary>
                <p className="mt-2 text-gray-400 pl-4">
                  We're currently focused on providing the best free experience possible. Any future premium features will be entirely optional additions.
                </p>
              </details>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
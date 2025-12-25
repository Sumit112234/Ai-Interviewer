import React from 'react';

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Choose Your Role",
      description: "Select the position and industry you're interviewing for. Our AI customizes questions based on your specific career path.",
      highlight: "Personalized Setup"
    },
    {
      number: "02",
      title: "Start Your Practice Session",
      description: "Jump into a realistic interview environment where our AI interviewer asks relevant questions and responds naturally to your answers.",
      highlight: "Realistic Simulation"
    },
    {
      number: "03",
      title: "Receive Instant Feedback",
      description: "Get detailed analysis on your responses, including communication clarity, content quality, and body language insights.",
      highlight: "Real-Time Analysis"
    },
    {
      number: "04",
      title: "Review & Improve",
      description: "Access your performance dashboard to track progress, identify patterns, and focus on areas that need improvement.",
      highlight: "Continuous Growth"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            How It <span className="text-blue-400">Works</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Four simple steps to interview mastery. Start practicing in minutes.
          </p>
        </div>

        <div className="space-y-16">
          {steps.map((step, index) => (
            <div 
              key={index}
              className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12`}
            >
              <div className="flex-1">
                <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl p-8 md:p-12 relative overflow-hidden">
                  <div className="absolute top-0 right-0 text-9xl font-bold text-white/5">
                    {step.number}
                  </div>
                  <div className="relative z-10">
                    <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-semibold mb-4">
                      {step.highlight}
                    </div>
                    <div className="text-6xl font-bold text-white/30 mb-2">
                      {step.number}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex-1">
                <h3 className="text-3xl font-bold mb-4">{step.title}</h3>
                <p className="text-xl text-gray-300 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-24">
          <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-12 border border-white/10 text-center">
            <h2 className="text-3xl font-bold mb-4">See it in action</h2>
            <p className="text-lg text-gray-300 mb-8">
              Watch how our platform helps you prepare for success
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-4 rounded-full font-semibold text-lg hover:opacity-90 transition-opacity">
                Watch Demo
              </button>
              <button className="bg-white/10 backdrop-blur-sm px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/20 transition-colors border border-white/20">
                Start Free Trial
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
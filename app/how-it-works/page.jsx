// app/how-it-works/page.jsx
'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function HowItWorksPage() {
  const timelineRef = useRef();
  const stepsRef = useRef([]);

  useEffect(() => {
    // Animate timeline line
    gsap.fromTo(
      timelineRef.current,
      { scaleY: 0 },
      {
        scaleY: 1,
        duration: 2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.steps-container',
          start: 'top 30%',
          end: 'bottom 70%',
          scrub: 1,
        },
      }
    );

    // Animate steps
    stepsRef.current.forEach((step, index) => {
      gsap.fromTo(
        step,
        {
          opacity: 0,
          x: index % 2 === 0 ? -50 : 50,
          scale: 0.8,
        },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 0.8,
          delay: index * 0.3,
          scrollTrigger: {
            trigger: step,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const steps = [
    {
      number: '01',
      title: 'Sign Up & Set Goals',
      description: 'Create your free account and tell us about your target role, industry, and experience level.',
      icon: '🎯',
    },
    {
      number: '02',
      title: 'Choose Practice Mode',
      description: 'Select from mock interviews, question banks, or specific skill-building exercises.',
      icon: '🤖',
    },
    {
      number: '03',
      title: 'AI-Powered Interview',
      description: 'Our AI conducts a realistic interview, asking tailored questions and evaluating your responses.',
      icon: '💬',
    },
    {
      number: '04',
      title: 'Get Instant Feedback',
      description: 'Receive detailed analysis on content, delivery, confidence, and areas for improvement.',
      icon: '📊',
    },
    {
      number: '05',
      title: 'Track Progress',
      description: 'Monitor your improvement over time with detailed analytics and personalized recommendations.',
      icon: '📈',
    },
    {
      number: '06',
      title: 'Ace Your Real Interview',
      description: 'Go into your actual interview with confidence, preparation, and proven success.',
      icon: '🏆',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 pt-20 text-white">

              <div className=' pl-16 sm:pl-64'>
                <motion.button
                onClick={() => window.location.href = '/'}
                className="flex items-center gap-2 mb-8 text-gray-300 hover:text-white transition-colors group"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                whileHover={{ x: -5 }}
              >
                <motion.svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  animate={{ x: [0, -3, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </motion.svg>
                <span className="text-lg font-medium">Back to Home</span>
              </motion.button>
              </div>
      <div className="container mx-auto px-6 py-16">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto mb-20"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              How It Works
            </span>
          </h1>
          <p className="text-xl text-gray-300">
            A simple 6-step process to transform your interview skills with AI-powered coaching
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="steps-container relative max-w-6xl mx-auto">
          {/* Vertical Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full">
            <div 
              ref={timelineRef}
              className="w-full h-full bg-gradient-to-b from-blue-500 to-purple-500 origin-top"
              style={{ transformOrigin: 'top' }}
            />
          </div>

          {/* Steps */}
          <div className="space-y-20">
            {steps.map((step, index) => (
              <div
                key={step.number}
                ref={(el) => (stepsRef.current[index] = el)}
                className={`relative flex items-center ${
                  index % 2 === 0 ? 'justify-start' : 'justify-end'
                }`}
              >
                {/* Step Content */}
                <motion.div
                  whileHover={{ 
                    scale: 1.05,
                    transition: { duration: 0.2 }
                  }}
                  className={`w-full md:w-5/12 bg-gray-800 rounded-2xl p-8 border border-gray-700 shadow-2xl ${
                    index % 2 === 0 ? 'md:mr-auto' : 'md:ml-auto'
                  }`}
                >
                  {/* Step Number & Icon */}
                  <div className="flex items-center mb-6">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-lg opacity-50" />
                      <div className="relative bg-gray-900 w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold border-2 border-blue-500">
                        {step.number}
                      </div>
                    </div>
                    <div className="ml-4 text-4xl">{step.icon}</div>
                  </div>

                  <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                  <p className="text-gray-300">{step.description}</p>
                </motion.div>

                {/* Timeline Dot */}
                <div className="absolute left-1/2 transform -translate-x-1/2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 border-4 border-gray-900 shadow-xl" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mt-32 text-center"
        >
          <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl p-12 max-w-4xl mx-auto backdrop-blur-sm border border-white/10">
            <h2 className="text-4xl font-bold mb-6">
              Start Your Journey Today
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              No credit card required. Get instant access to all features.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-10 py-4 rounded-full text-lg font-semibold shadow-2xl hover:shadow-3xl transition-all"
            >
              Get Started Free
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
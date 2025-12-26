// app/pricing/page.jsx
'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';

gsap.registerPlugin(ScrollTrigger);

export default function PricingPage() {
  const cardsRef = useRef([]);
  const floatRefs = useRef([]);

  useEffect(() => {
    // Floating animation for decorative elements
    floatRefs.current.forEach((el, index) => {
      gsap.to(el, {
        y: 20 * (index % 2 === 0 ? 1 : -1),
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: index * 0.5,
      });
    });

    // Card entrance animations
    cardsRef.current.forEach((card, index) => {
      gsap.fromTo(
        card,
        {
          y: 100,
          opacity: 0,
          rotateY: 20,
        },
        {
          y: 0,
          opacity: 1,
          rotateY: 0,
          duration: 1,
          delay: index * 0.2,
          scrollTrigger: {
            trigger: card,
            start: 'top bottom-=100',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });

    // Background particles animation
    const particles = gsap.utils.toArray('.particle');
    particles.forEach((particle, i) => {
      gsap.to(particle, {
        x: 'random(-100, 100)',
        y: 'random(-100, 100)',
        duration: 'random(2, 4)',
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 'random(0, 2)',
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const plans = [
    {
      name: 'Free Forever',
      price: '$0',
      period: '/month',
      description: 'Perfect for getting started',
      features: [
        '5 AI Mock Interviews per month',
        'Basic Feedback & Analysis',
        '100+ Common Questions',
        'Progress Tracking',
        'Email Support',
      ],
      cta: 'Get Started Free',
      popular: false,
      gradient: 'from-gray-500 to-gray-700',
    },
    {
      name: 'Pro',
      price: 'Coming Soon',
      period: '',
      description: 'Most popular for serious job seekers',
      features: [
        'Unlimited AI Mock Interviews',
        'Advanced AI Feedback',
        '1000+ Industry Questions',
        'Video Recording & Analysis',
        'Priority Support',
        'Custom Question Sets',
        'Interview Templates',
        'Career Coaching Tips',
      ],
      cta: 'Coming Soon',
      popular: true,
      gradient: 'from-purple-600 to-purple-800',
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      description: 'For companies and institutions',
      features: [
        'Everything in Pro',
        'Team Management',
        'Custom AI Training',
        'Dedicated Account Manager',
        'API Access',
        'White Label Solutions',
        'Bulk User Onboarding',
        'Advanced Analytics',
      ],
      cta: 'Contact Sales',
      popular: false,
      gradient: 'from-gray-600 to-gray-800',
    },
  ];

  const handleBackToHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-gray-900 pt-20 overflow-hidden">
      {/* Background Particles */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle absolute w-1 h-1 bg-purple-500/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Back to Home Button */}
      <div className="container mx-auto px-6 pt-6 relative z-20">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          onClick={handleBackToHome}
          className="group flex items-center text-gray-300 hover:text-white transition-colors"
        >
          <svg 
            className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </motion.button>
      </div>

      <div className="container mx-auto px-6 py-16 relative z-10">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-500 to-purple-300 bg-clip-text text-transparent">
              Simple, Transparent Pricing
            </span>
          </h1>
          <p className="text-xl text-gray-300">
            <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent font-bold">
              Now it's free for all
            </span>
            <span className="text-gray-400"> - Paid version coming soon!</span>
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              ref={(el) => (cardsRef.current[index] = el)}
              whileHover={{ 
                y: -10,
                transition: { duration: 0.2 }
              }}
              className="relative"
            >
              {plan.popular && (
                <motion.div
                  ref={(el) => (floatRefs.current[index] = el)}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="absolute -top-4 left-1/2 transform -translate-x-1/2"
                >
                  <div className="bg-gradient-to-r from-purple-700 to-pink-700 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg shadow-purple-900/50">
                    COMING SOON
                  </div>
                </motion.div>
              )}

              <div className={`bg-gradient-to-b from-gray-900 to-black rounded-3xl p-8 border-2 ${
                plan.popular ? 'border-purple-600 shadow-2xl shadow-purple-900/30' : 'border-gray-800'
              } h-full flex flex-col backdrop-blur-sm bg-gray-900/50`}>
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <div className="flex items-baseline mb-2">
                    <span className="text-5xl font-bold bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent">
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className="text-gray-400 ml-2">{plan.period}</span>
                    )}
                  </div>
                  <p className="text-gray-400">{plan.description}</p>
                </div>

                <div className="flex-grow mb-8">
                  <ul className="space-y-4">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center">
                        <div className="w-6 h-6 rounded-full bg-purple-900/30 flex items-center justify-center mr-3">
                          <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-auto">
                  <button
                    onClick={plan.name === 'Free Forever' ? handleBackToHome : undefined}
                    className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                      plan.name === 'Free Forever'
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg hover:shadow-xl hover:shadow-purple-900/30 cursor-pointer'
                        : plan.popular
                        ? 'bg-gradient-to-r from-gray-800 to-gray-900 text-gray-400 border border-gray-700 cursor-not-allowed'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700 cursor-pointer'
                    }`}
                    disabled={plan.popular}
                  >
                    {plan.cta}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-3xl font-bold text-center mb-12 text-white">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {[
              {
                q: 'Is there really a free plan?',
                a: 'Yes! Our service is completely free for now. Enjoy unlimited access to all features without any cost.',
              },
              {
                q: 'When will paid plans be available?',
                a: 'We\'re working on advanced features for paid plans. They\'ll be released soon with enhanced capabilities.',
              },
              {
                q: 'Will the free plan always be available?',
                a: 'Yes! The free plan will always remain available with generous features, even after paid plans launch.',
              },
              {
                q: 'How does the AI feedback work?',
                a: 'Our AI analyzes your responses for content, clarity, confidence, and relevance, providing actionable suggestions.',
              },
            ].map((faq, index) => (
              <motion.div
                key={faq.q}
                ref={(el) => (floatRefs.current[3 + index] = el)}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800 hover:border-purple-800/50 transition-colors"
              >
                <h3 className="text-xl font-bold text-white mb-2">{faq.q}</h3>
                <p className="text-gray-400">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-20"
        >
          <div className="bg-gradient-to-r from-gray-900/80 to-purple-900/20 rounded-3xl p-12 max-w-4xl mx-auto border border-gray-800 backdrop-blur-sm">
            <h2 className="text-4xl font-bold text-white mb-6">
              Start Your Journey Today
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of professionals who transformed their interview skills - <span className="text-purple-400">Completely Free!</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleBackToHome}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-10 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl hover:shadow-purple-900/30 transition-all"
              >
                Get Started Free
              </button>
              <button className="border-2 border-purple-600 text-purple-400 px-10 py-4 rounded-full text-lg font-semibold hover:bg-purple-900/20 transition-all">
                Join Waitlist for Pro
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
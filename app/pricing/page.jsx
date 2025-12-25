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
      gradient: 'from-gray-400 to-gray-600',
    },
    {
      name: 'Pro',
      price: '$29',
      period: '/month',
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
      cta: 'Start Free Trial',
      popular: true,
      gradient: 'from-blue-500 to-purple-500',
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
      gradient: 'from-green-500 to-teal-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20 overflow-hidden">
      {/* Background Particles */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle absolute w-1 h-1 bg-blue-200 rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
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
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Simple, Transparent Pricing
            </span>
          </h1>
          <p className="text-xl text-gray-600">
            Start free, upgrade when you're ready. No hidden fees, no surprises.
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
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                    MOST POPULAR
                  </div>
                </motion.div>
              )}

              <div className={`bg-white rounded-3xl p-8 border-2 ${
                plan.popular ? 'border-blue-500 shadow-2xl' : 'border-gray-200'
              } h-full flex flex-col`}>
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{plan.name}</h3>
                  <div className="flex items-baseline mb-2">
                    <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600 ml-2">{plan.period}</span>
                  </div>
                  <p className="text-gray-600">{plan.description}</p>
                </div>

                <div className="flex-grow mb-8">
                  <ul className="space-y-4">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center">
                        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-3">
                          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-auto">
                  <Link href={plan.name === 'Enterprise' ? '/contact' : '/'}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`w-full py-4 rounded-xl font-bold text-lg ${
                        plan.popular
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      } transition-all`}
                    >
                      {plan.cta}
                    </motion.button>
                  </Link>
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
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {[
              {
                q: 'Is there really a free plan?',
                a: 'Yes! Our free plan includes 5 AI mock interviews per month with basic feedback - perfect for getting started.',
              },
              {
                q: 'Can I cancel anytime?',
                a: 'Absolutely. You can cancel your subscription at any time with no hidden fees or penalties.',
              },
              {
                q: 'Do you offer refunds?',
                a: 'We offer a 14-day money-back guarantee for all paid plans if you are not satisfied.',
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
                className="bg-white rounded-xl p-6 shadow-lg border border-gray-200"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-2">{faq.q}</h3>
                <p className="text-gray-600">{faq.a}</p>
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
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-12 max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              Start Your Journey Today
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join 50,000+ professionals who transformed their interview skills
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  Start Free Trial
                </motion.button>
              </Link>
              <Link href="/how-it-works">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border-2 border-blue-600 text-blue-600 px-10 py-4 rounded-full text-lg font-semibold hover:bg-blue-50 transition-all"
                >
                  Book a Demo
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
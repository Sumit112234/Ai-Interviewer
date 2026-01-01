// components/Features.tsx
'use client';
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';

gsap.registerPlugin(ScrollTrigger);

const Features = () => {
  const router = useRouter();
  const headingRef = useRef(null);
  const subtitleRef = useRef(null);
  const cardsRef = useRef([]);
  const ctaRef = useRef(null);

  useEffect(() => {
    // Animate heading on mount
    gsap.fromTo(
      headingRef.current,
      { opacity: 0, y: -50 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
    );

    gsap.fromTo(
      subtitleRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1, delay: 0.3, ease: 'power3.out' }
    );

    // Animate cards on scroll
    cardsRef.current.forEach((card, index) => {
      if (card) {
        gsap.fromTo(
          card,
          { opacity: 0, y: 100, rotateX: -15 },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.8,
            delay: index * 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              end: 'top 65%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    });

    // Animate CTA section
    gsap.fromTo(
      ctaRef.current,
      { opacity: 0, scale: 0.8 },
      {
        opacity: 1,
        scale: 1,
        duration: 1,
        ease: 'back.out(1.4)',
        scrollTrigger: {
          trigger: ctaRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const handleBack = () => {
    router.push('/');
  };
  const features = [
    {
      icon: "🎯",
      title: "AI-Powered Practice",
      description: "Experience realistic interview scenarios powered by advanced AI that adapts to your responses and provides intelligent follow-up questions."
    },
    {
      icon: "⚡",
      title: "Real-Time Feedback",
      description: "Get instant, actionable feedback on your answers, body language, and communication style to improve on the spot."
    },
    {
      icon: "📊",
      title: "Performance Analytics",
      description: "Track your progress with detailed analytics that highlight your strengths and identify areas for improvement over time."
    },
    {
      icon: "🎓",
      title: "Personalized Coaching",
      description: "Receive tailored coaching recommendations based on your unique interview style and career goals."
    },
    {
      icon: "💼",
      title: "Industry-Specific Scenarios",
      description: "Practice with interview questions and scenarios specific to your target industry and role level."
    },
    {
      icon: "🔄",
      title: "Unlimited Practice Sessions",
      description: "Hone your skills with unlimited practice sessions available 24/7, whenever you need to prepare."
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white py-20 px-6 relative overflow-hidden">
      {/* Animated background elements */}
      <Navbar/>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{ top: '10%', left: '10%' }}
        />
        <motion.div
          className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{ bottom: '10%', right: '10%' }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Back Button */}
        {/* <motion.button
          onClick={handleBack}
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
        </motion.button> */}

        <div className="text-center mb-16">
          <h1 ref={headingRef} className="text-5xl md:text-6xl font-bold mb-6">
            Powerful <span className="text-blue-400">Features</span>
          </h1>
          <p ref={subtitleRef} className="text-xl text-gray-300 max-w-3xl mx-auto">
            Everything you need to ace your next interview with confidence and preparation
          </p>
        </div>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              ref={(el) => (cardsRef.current[index] = el)}
              className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:border-purple-500/50 transition-all duration-300 relative group cursor-pointer"
              variants={cardVariants}
              whileHover={{
                scale: 1.05,
                rotateY: 5,
                rotateX: 5,
                transition: { duration: 0.3 },
              }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Glow effect on hover */}
              <motion.div
                className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300"
                style={{ transform: 'translateZ(-10px)' }}
              />

              <motion.div
                className="text-5xl mb-4"
                whileHover={{ scale: 1.2, rotate: 10 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                {feature.icon}
              </motion.div>
              <h3 className="text-2xl font-semibold mb-3 relative z-10">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed relative z-10">{feature.description}</p>

              {/* Animated corner accent */}
              <motion.div
                className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-500/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={{ scale: 0 }}
                whileHover={{ scale: 1 }}
              />
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-20 text-center" ref={ctaRef}>
          <motion.div
            className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-12 max-w-4xl mx-auto relative overflow-hidden"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            {/* Animated shine effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{
                x: ['-200%', '200%'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatDelay: 2,
              }}
              style={{ skewX: -20 }}
            />

            <motion.h2
              className="text-3xl font-bold mb-4 relative z-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Ready to transform your interview skills?
            </motion.h2>
            <motion.p
              className="text-lg text-gray-200 mb-8 relative z-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Join thousands of professionals who have mastered their interviews with our platform
            </motion.p>
            <motion.button
              className="bg-white text-purple-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors relative z-10"
              whileHover={{ scale: 1.05, boxShadow: '0 10px 40px rgba(255,255,255,0.3)' }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Start Practicing Now
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Features;
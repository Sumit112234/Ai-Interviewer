import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform, AnimatePresence, useAnimation } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";





function CtaRocket({ launched, onDone, triggerEffects }) {
  const rocketRef = useRef();
  const { scene } = useGLTF("/models/toy_rocket.glb");
  const { mouse } = useThree();

  useFrame((_, delta) => {
    if (!rocketRef.current) return;

    if (!launched) {
      // Hover rotate (left / right)
      const targetY = mouse.x * 1.2;
      rocketRef.current.rotation.y +=
        (targetY - rocketRef.current.rotation.y) * 0.08;
    } else {
      // Launch straight up
      rocketRef.current.position.y += delta * 9;

      if (rocketRef.current.position.y > 25) {
  onDone();
}
    }
  });

  return (
    <primitive
      ref={rocketRef}
      object={scene}
     scale={3}
position={[0, 0, 0]}
      onClick={triggerEffects}
    />
  );
}


gsap.registerPlugin(ScrollTrigger);

const GetStarted = () => {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const analyticsRef = useRef(null);
const analyticsControls = useAnimation();
const [analyticsPlayed, setAnalyticsPlayed] = useState(false);
  
const [ctaAnimating, setCtaAnimating] = useState(false);
const [rocketLaunched, setRocketLaunched] = useState(false);

  // Transform scroll position to blur and opacity values
  const imageBlur = useTransform(scrollY, [0, 500], [0, 20]);
  const imageOpacity = useTransform(scrollY, [0, 500], [0.6, 0.1]);
  const imageDarkness = useTransform(scrollY, [0, 500], [0, 0.7]);
  
  const aiAnimationRef = useRef(null);
  
  // 3D Button state
  const [buttonHovered, setButtonHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const buttonRef = useRef(null);

  // Track mouse position for 3D tilt effect
  const handleMouseMove = (e) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    setMousePosition({ x, y });
  };


const slides = [
  [
    { title: "AI Dashboard", image: "/assets/slide-photos/slide1.png" },
    { title: "Interview Simulator", image: "/assets/slide-photos/slide2.png" },
    { title: "Performance Analytics", image: "/assets/slide-photos/slide3.png" },
  ],
  [
    { title: "Mock Interviews", image: "/assets/slide-photos/slide4.png" },
    { title: "AI Feedback", image: "/assets/slide-photos/slide5.png" },
    { title: "Skill Insights", image: "/assets/slide-photos/slide6.png" },
  ],
];


useEffect(() => {
  if (!analyticsRef.current || analyticsPlayed) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        analyticsControls.start("visible");
        setAnalyticsPlayed(true);
        observer.disconnect(); // 🔥 run ONCE
      }
    },
    { threshold: 0.35 } // play when ~35% visible
  );

  observer.observe(analyticsRef.current);

  return () => observer.disconnect();
}, [analyticsControls, analyticsPlayed]);


function IDE() {
  const [lang, setLang] = useState("js");
  const [displayed, setDisplayed] = useState("");

  const languages = {
    js: {
      label: "JavaScript",
      file: "index.js",
      code: `// Simple Hello World example

function greet() {
  const message = "Hello, World!";
  console.log(message);
}

greet();

// End of program`
    },
    py: {
      label: "Python",
      file: "main.py",
      code: `# Simple Hello World example

def greet():
    message = "Hello, World!"
    print(message)

greet()

# End of program`
    },
    cpp: {
      label: "C++",
      file: "main.cpp",
      code: `#include <iostream>

void greet() {
    std::cout << "Hello, World!" << std::endl;
}

int main() {
    greet();
    return 0;
}

// End of program`
    },
    java: {
      label: "Java",
      file: "Main.java",
      code: `public class Main {

    static void greet() {
        System.out.println("Hello, World!");
    }

    public static void main(String[] args) {
        greet();
    }
}

// End of program`
    },
    c: {
      label: "C",
      file: "main.c",
      code: `#include <stdio.h>

void greet() {
    printf("Hello, World!\\n");
}

int main() {
    greet();
    return 0;
}

// End of program`
    }
  };

  const active = languages[lang];

  // 🔹 Typing animation
  useEffect(() => {
    let i = 0;
    setDisplayed("");

    const interval = setInterval(() => {
      setDisplayed((prev) => prev + active.code.charAt(i));
      i++;
      if (i >= active.code.length) clearInterval(interval);
    }, 18); // typing speed

    return () => clearInterval(interval);
  }, [lang]);

  return (
    <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-[#0b0f1a] shadow-2xl">

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 bg-[#0f1524] border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-400" />
          <span className="w-3 h-3 rounded-full bg-yellow-400" />
          <span className="w-3 h-3 rounded-full bg-green-400" />
          <span className="ml-4 text-sm text-gray-400 font-mono">
            {active.file}
          </span>
        </div>

        {/* Language Switcher */}
        <div className="flex gap-2">
          {Object.entries(languages).map(([key, l]) => (
            <button
              key={key}
              onClick={() => setLang(key)}
              className={`px-3 py-1 rounded-md text-sm font-mono transition-all ${
                lang === key
                  ? "bg-white/10 text-white"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      {/* Code Area */}
      <div className="relative p-6 sm:p-8 font-mono text-sm sm:text-base text-gray-200 min-h-[320px] whitespace-pre-wrap">

        {displayed}

        {/* Cursor */}
        <span className="inline-block ml-1 w-[2px] h-5 bg-purple-400 animate-pulse align-middle" />

      </div>
    </div>
  );
}



const [currentIndex, setCurrentIndex] = useState(0);

useEffect(() => {
  const interval = setInterval(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, 4000); // pause time

  return () => clearInterval(interval);
}, []);


  // GSAP ScrollTrigger Animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Create timeline with ScrollTrigger
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: aiAnimationRef.current,
          start: "top top",
          end: "+=5000", // Extended to accommodate all pipeline steps
          scrub: 1,
          pin: true,
        }
      });


      timeline.to(".ai-experience-text", { opacity: 0, duration: 0.01 });
      // Phase 1: Zoom and fade background
      timeline.add([
        gsap.to(".ai-container", {
          scale: 1.3,
          duration: 2
        }),
        gsap.to(".ai-background", {
          opacity: 0,
          duration: 2
        })
      ])
      // Phase 2: Peel away outer layers
      .add([
        gsap.to(".ai-layer-top", {
          y: -400,
          opacity: 0,
          duration: 2
        }),
        gsap.to(".ai-layer-left", {
          x: -400,
          opacity: 0,
          duration: 2
        }),
        gsap.to(".ai-layer-right", {
          x: 400,
          opacity: 0,
          duration: 2
        }),
        gsap.to(".ai-layer-bottom", {
          y: 400,
          opacity: 0,
          duration: 2
        })
      ])
      // Phase 3: Reveal inner content

      
      .add([
        gsap.to(".ai-inner-content", {
          opacity: 1,
          scale: 1,
          duration: 2
        }),
        gsap.to(".ai-title", {
          opacity: 1,
          y: 0,
          duration: 2
        }),
        gsap.to(".ai-input", {
          opacity: 1,
          y: 0,
          duration: 2,
          delay: 0.2
        }),
        gsap.to(".ai-button", {
          opacity: 1,
          y: 0,
          duration: 2,
          delay: 0.4
        })
      ])
      
      // ========== MULTI-STEP PIPELINE EXTENSION (DORA AI STYLE) ==========
      // Phase 4: Transition to Pipeline View
      .add([
        gsap.to(".ai-inner-content", {
          opacity: 0,
          scale: 0.95,
          duration: 1.5,
          ease: "power2.out"
        })
      ], "+=0.5")
      
      // Phase 5: Show Pipeline Container
      .add([
        gsap.to(".pipeline-container", {
          opacity: 1,
          scale: 1,
          duration: 2,
          ease: "expo.out"
        }),
        gsap.to(".pipeline-header", {
          opacity: 1,
          y: 0,
          duration: 1.5,
          ease: "power2.out"
        })
      ], "pipelineStart")
      
      // Phase 6: Step 1 - "Analyzing prompt..."
      .add([
        gsap.to(".progress-star", {
          top: "10%",
          duration: 2,
          ease: "power2.out"
        }),
        gsap.to(".step-1", {
          opacity: 1,
          color: "#ffffff",
          duration: 1.5,
          ease: "power2.out"
        }),
        gsap.to(".step-2, .step-3", {
          opacity: 0.3,
          duration: 1.5,
          ease: "power2.out"
        }),
        gsap.to(".preview-1", {
          opacity: 1,
          scale: 1,
          duration: 2,
          ease: "expo.out"
        }),
        gsap.to(".preview-2, .preview-3", {
          opacity: 0,
          scale: 0.95,
          duration: 1
        })
      ], "step1")
      
      // Phase 7: Step 2 - "Crafting designs..."
      .add([
        gsap.to(".progress-star", {
          top: "50%",
          duration: 2,
          ease: "power2.out"
        }),
        gsap.to(".step-2", {
          opacity: 1,
          color: "#ffffff",
          duration: 1.5,
          ease: "power2.out"
        }),
        gsap.to(".step-1, .step-3", {
          opacity: 0.3,
          duration: 1.5,
          ease: "power2.out"
        }),
        gsap.to(".preview-1", {
          opacity: 0,
          scale: 0.95,
          duration: 1
        }),
        gsap.to(".preview-2", {
          opacity: 1,
          scale: 1,
          duration: 2,
          ease: "expo.out"
        }),
        gsap.to(".preview-3", {
          opacity: 0,
          scale: 0.95,
          duration: 1
        })
      ], "step2")
      
      // Phase 8: Step 3 - "Tweak, iterate, publish!"
      .add([
        gsap.to(".progress-star", {
          top: "90%",
          duration: 2,
          ease: "power2.out"
        }),
        gsap.to(".step-3", {
          opacity: 1,
          color: "#ffffff",
          duration: 1.5,
          ease: "power2.out"
        }),
        gsap.to(".step-1, .step-2", {
          opacity: 0.3,
          duration: 1.5,
          ease: "power2.out"
        }),
        gsap.to(".preview-2", {
          opacity: 0,
          scale: 0.95,
          duration: 1
        }),
        gsap.to(".preview-3", {
          opacity: 1,
          scale: 1,
          duration: 2,
          ease: "expo.out"
        })
      ], "step3");
    }, aiAnimationRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0a0a0a] text-white transition-colors duration-300">
      
      {/* Navbar - Hidden */}
      {/* <Navbar /> */}
      
      {/* CSS Animation for Border Line */}
      <style>{`
        @keyframes rotateBorder {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
      
      {/* Hero Background Image with Scroll Animation */}
      <motion.div 
        className="fixed inset-0 z-0 overflow-hidden pointer-events-none"
        style={{ opacity: imageOpacity }}
      >
        <motion.div
          className="absolute inset-0"
          style={{ filter: `blur(${imageBlur}px)` }}
        >
          {/* Stars Background Layer */}
          <div 
            className="absolute inset-0 bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('/assets/stars%20photo.png')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center center',
              opacity: 0.5,
              filter: 'blur(1px)'
            }}
          />

          {/* Roundball Background Image - Large Size */}
          <div 
            className="absolute inset-0 bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('/assets/roundball%20photo.png')`,
              backgroundSize: 'contain',
              backgroundPosition: 'center 30%',
              opacity: 0.8,
              transform: 'scale(1.5)'
            }}
          />
          
          {/* Radial blur vignette effect */}
          <div className="absolute inset-0 bg-gradient-radial from-transparent via-[#0a0a0a]/20 to-[#0a0a0a]/80"></div>
          
          {/* Additional blur edges */}
          <div className="absolute inset-0 backdrop-blur-[1px]">
            <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-[#0a0a0a] to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-[#0a0a0a] to-transparent"></div>
            <div className="absolute left-0 top-0 bottom-0 w-1/4 bg-gradient-to-r from-[#0a0a0a] to-transparent"></div>
            <div className="absolute right-0 top-0 bottom-0 w-1/4 bg-gradient-to-l from-[#0a0a0a] to-transparent"></div>
          </div>
        </motion.div>
        
        {/* Darkness overlay that increases on scroll */}
        <motion.div 
          className="absolute inset-0 bg-[#0a0a0a]"
          style={{ opacity: imageDarkness }}
        />
      </motion.div>

      {/* Ambient Gradient Accents */}
      <div className="fixed inset-0 z-[1] overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[800px] h-[800px] bg-purple-500/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] animate-pulse delay-1000"></div>
      </div>

      {/* ================= HERO ================= */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-6 sm:px-8 lg:px-12">
        <div className="max-w-6xl mx-auto w-full">
          
          {/* Floating Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex mb-8"
          >
            <div className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 backdrop-blur-sm">
              <span className="text-sm font-medium bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                🚀 AI-Powered Interview Platform
              </span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight leading-[1.1] mb-6 sm:mb-8"
          >
            <span className="block text-white">Master Every</span>
            <span className="block bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 bg-clip-text text-transparent">
              Interview
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl lg:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed px-4"
          >
            Transform your interview skills with AI-powered practice sessions, real-time feedback,
            and personalized coaching that adapts to your unique strengths and areas for improvement.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-8 sm:mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-lg mx-auto px-4"
          >
            <button
              onClick={() => navigate("/login")}
              className="group relative w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-500 dark:to-blue-500 text-white font-semibold text-base sm:text-lg shadow-lg shadow-purple-500/25 dark:shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/40 dark:hover:shadow-purple-500/30 transition-all duration-300 hover:scale-105"
            >
              <span className="relative z-10">Start Practicing</span>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400 to-blue-400 opacity-0 group-hover:opacity-100 blur transition-opacity duration-300"></div>
            </button>

            <button className="w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 rounded-full border-2 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold text-base sm:text-lg hover:border-gray-400 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-all duration-300 backdrop-blur-sm">
              Watch Demo
            </button>
          </motion.div>

          {/* Floating Animation Elements */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="mt-20"
          >
            <div className="relative w-full max-w-4xl mx-auto h-[400px]">
              <motion.div
                animate={{ 
                  y: [0, -20, 0],
                  rotate: [0, 5, 0]
                }}
                transition={{ 
                  duration: 6, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute top-0 left-1/4 w-64 h-64 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-3xl backdrop-blur-xl border border-white/10 shadow-2xl"
              ></motion.div>
              <motion.div
                animate={{ 
                  y: [0, 20, 0],
                  rotate: [0, -5, 0]
                }}
                transition={{ 
                  duration: 7, 
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }}
                className="absolute top-20 right-1/4 w-48 h-48 bg-gradient-to-br from-pink-500/10 to-purple-500/10 rounded-3xl backdrop-blur-xl border border-white/10 shadow-2xl"
              ></motion.div>
            </div>
          </motion.div>
        </div>
      </section>



      

      {/* ================= AI LAYER ANIMATION - GSAP ScrollTrigger ================= */}
      <section ref={aiAnimationRef} className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        
        {/* Background Grid Pattern */}
        <div className="ai-background absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-blue-900/30 to-pink-900/30"></div>
          <div className="absolute inset-0" style={{
            backgroundImage: 'repeating-linear-gradient(0deg, #ffffff05 0px, #ffffff05 1px, transparent 1px, transparent 50px), repeating-linear-gradient(90deg, #ffffff05 0px, #ffffff05 1px, transparent 1px, transparent 50px)',
          }}></div>
        </div>

        {/* Main Container */}
        <div className="ai-container relative w-full max-w-4xl h-[500px] sm:h-[600px] md:h-[700px]">
          
          {/* Top Layer */}
          <div className="ai-layer-top absolute top-0 left-1/2 -translate-x-1/2 w-4/5 h-40">
            <div className="h-full bg-gradient-to-b from-purple-600/40 to-transparent backdrop-blur-xl border-t-4 border-purple-500/60 rounded-t-[2rem] shadow-lg shadow-purple-500/20"></div>
          </div>
          
          {/* Left Layer */}
          <div className="ai-layer-left absolute left-0 top-1/4 w-40 h-1/2">
            <div className="h-full bg-gradient-to-r from-blue-600/40 to-transparent backdrop-blur-xl border-l-4 border-blue-500/60 rounded-l-[2rem] shadow-lg shadow-blue-500/20"></div>
          </div>
          
          {/* Right Layer */}
          <div className="ai-layer-right absolute right-0 top-1/4 w-40 h-1/2">
            <div className="h-full bg-gradient-to-l from-pink-600/40 to-transparent backdrop-blur-xl border-r-4 border-pink-500/60 rounded-r-[2rem] shadow-lg shadow-pink-500/20"></div>
          </div>

          {/* Bottom Layer */}
          <div className="ai-layer-bottom absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-40">
            <div className="h-full bg-gradient-to-t from-cyan-600/40 to-transparent backdrop-blur-xl border-b-4 border-cyan-500/60 rounded-b-[2rem] shadow-lg shadow-cyan-500/20"></div>
          </div>

          {/* Center Experience Text (Before Scroll) */}
<div className="ai-experience-text absolute inset-0 flex items-center justify-center z-20">
  <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-wide text-white/90">
    Experience
  </h2>
</div>

          {/* Inner Content Container */}
          <div className="ai-inner-content absolute inset-0 flex items-center justify-center opacity-0 scale-75">
            <div className="relative w-full max-w-2xl mx-4 sm:mx-auto p-6 sm:p-8 md:p-12 bg-gray-900/80 backdrop-blur-2xl rounded-2xl sm:rounded-3xl border border-gray-700/50 shadow-2xl">
              
              {/* Glow Effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-pink-500/20 rounded-[2.5rem] blur-2xl"></div>
              
              {/* Content */}
              <div className="relative">
                {/* Title */}
                <div className="ai-title opacity-0 translate-y-10 mb-6 sm:mb-8">
                  <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3">
                    Prepare with AI
                  </h3>
                  <p className="text-gray-400 text-lg">
                    Upload your resume and get AI-generated interview questions
                  </p>
                </div>

                {/* Input Field */}
                <div className="ai-input opacity-0 translate-y-10 mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    What role are you interviewing for?
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-gray-800/60 border border-gray-700/50 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 mb-4"
                    placeholder="e.g., Software Engineer, Product Manager..."
                  />
                  
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Experience Level</label>
                      <select className="w-full px-4 py-3 bg-gray-800/60 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:border-purple-500/50 transition-all cursor-pointer">
                        <option>Entry Level</option>
                        <option>Mid Level</option>
                        <option>Senior Level</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Interview Type</label>
                      <select className="w-full px-4 py-3 bg-gray-800/60 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:border-purple-500/50 transition-all cursor-pointer">
                        <option>Technical</option>
                        <option>Behavioral</option>
                        <option>System Design</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="ai-button opacity-0 translate-y-10">
                  <button className="w-full py-4 px-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold text-lg shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Start Interview Prep
                  </button>
                  
                  <p className="mt-4 text-center text-sm text-gray-500">
                    Powered by advanced AI models • Get personalized questions
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ========== PIPELINE MULTI-STEP SECTION (DORA AI STYLE) ========== */}
          <div className="pipeline-container absolute inset-0 flex items-center justify-center opacity-0 scale-95">
            <div className="relative w-full max-w-7xl mx-4 sm:mx-6 lg:mx-auto h-auto min-h-[600px] md:h-[700px] flex flex-col lg:flex-row gap-8 md:gap-12 lg:gap-20 py-8 md:py-0">
              
              {/* LEFT SIDE - AI Pipeline Progress */}
              <div className="relative flex-shrink-0 w-full lg:w-[400px] xl:w-[480px]">
                
                {/* Header */}
                <div className="pipeline-header opacity-0 translate-y-4 mb-8 md:mb-12">
                  <p className="text-xs sm:text-sm text-gray-500 uppercase tracking-wider mb-3 md:mb-4">AI Pipeline</p>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
                    Preparing interviews,
                    <br />
                    <span className="bg-gradient-to-r from-orange-400 to-blue-400 bg-clip-text text-transparent">
                      end-to-end.
                    </span>
                  </h2>
                </div>

                {/* Vertical Progress Line Container */}
                <div className="relative h-[300px] sm:h-[350px] md:h-[400px] ml-4 sm:ml-6 md:ml-8">
                  
                  {/* Background Line */}
                  <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-gray-700/30 via-gray-700/50 to-gray-700/30"></div>
                  
                  {/* Glowing Tail - Follows the star */}
                  <div className="progress-star absolute w-8 h-8 -translate-y-1/2" style={{ top: '10%', left: '1px', transform: 'translate(-50%, -50%)' }}>
                    {/* Tail - extends upward from the star */}
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-4 w-[3px] h-[150px] overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-400/40 to-orange-500/80 blur-sm"></div>
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-400/30 to-blue-500/60 blur-md"></div>
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-orange-500"></div>
                    </div>
                    
                    {/* Star Head */}
                    <div className="relative w-full h-full z-10">
                      {/* Outer Glow */}
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-blue-500 rounded-full blur-xl opacity-60 animate-pulse"></div>
                      {/* Core Star */}
                      <div className="absolute inset-2 bg-gradient-to-r from-orange-400 to-blue-400 rounded-full shadow-lg shadow-orange-500/50">
                        <div className="absolute inset-0.5 bg-white rounded-full"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Step Items */}
                  <div className="relative space-y-16 sm:space-y-20 md:space-y-24 pt-4">
                    
                    {/* Step 1 */}
                    <div className="step-1 pl-8 sm:pl-10 md:pl-12 opacity-30 transition-all duration-700">
                      <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">Analyzing prompt...</h3>
                      <p className="text-gray-500 text-xs sm:text-sm">Understanding your interview requirements</p>
                    </div>
                    
                    {/* Step 2 */}
                    <div className="step-2 pl-8 sm:pl-10 md:pl-12 opacity-30 transition-all duration-700">
                      <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">Crafting designs...</h3>
                      <p className="text-gray-500 text-xs sm:text-sm">Generating personalized questions</p>
                    </div>
                    
                    {/* Step 3 */}
                    <div className="step-3 pl-8 sm:pl-10 md:pl-12 opacity-30 transition-all duration-700">
                      <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">Tweak, iterate, publish!</h3>
                      <p className="text-gray-500 text-xs sm:text-sm">Ready for your practice session</p>
                    </div>
                    
                  </div>
                </div>
              </div>
              
              {/* RIGHT SIDE - Dark Editor Frame */}
              <div className="relative flex-1 min-h-[400px] md:min-h-[500px]">
                <div className="relative h-full">
                  
                  {/* Dark Editor Frame Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-3xl border border-gray-800/50 shadow-2xl overflow-hidden">
                    {/* Subtle Inner Glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-blue-500/5"></div>
                  </div>
                  
                  {/* Preview 1 - Glowing Orb/Star (Analyzing) */}
                  <div className="preview-1 absolute inset-0 flex items-center justify-center opacity-0 scale-95 p-4">
                    <div className="text-center">
                      {/* Floating Glowing Orb */}
                      <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 mx-auto mb-8 sm:mb-12">
                        {/* Outer Glow Layers */}
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-blue-500 rounded-full blur-3xl opacity-40 animate-pulse"></div>
                        <div className="absolute inset-4 bg-gradient-to-r from-orange-400 to-blue-400 rounded-full blur-2xl opacity-60"></div>
                        {/* Core Orb */}
                        <div className="absolute inset-8 bg-gradient-to-br from-orange-400 via-amber-400 to-blue-400 rounded-full shadow-2xl shadow-orange-500/50">
                          <div className="absolute inset-1 bg-gradient-to-br from-white/90 to-white/40 rounded-full"></div>
                          {/* Inner Sparkle */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-12 h-12 bg-white rounded-full blur-sm opacity-80"></div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Progress Text */}
                      <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-4">
                        Generating your interview...
                      </h3>
                      <p className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-orange-400 to-blue-400 bg-clip-text text-transparent">
                        42%
                      </p>
                    </div>
                  </div>
                  
                  {/* Preview 2 - Generated Preview (Crafting) */}
                  <div className="preview-2 absolute inset-0 flex items-center justify-center p-4 sm:p-8 md:p-12 opacity-0 scale-95">
                    <div className="relative w-full h-full bg-white rounded-2xl shadow-2xl overflow-hidden">
                      {/* Mock Interview Interface */}
                      <div className="h-full flex flex-col">
                        {/* Header Bar */}
                        <div className="bg-gray-100 border-b border-gray-200 px-6 py-4 flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-red-400"></div>
                          <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                          <div className="w-3 h-3 rounded-full bg-green-400"></div>
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 p-4 sm:p-6 md:p-8 bg-gradient-to-br from-gray-50 to-white">
                          <div className="space-y-3 sm:space-y-4 md:space-y-6">
                            <div className="bg-gradient-to-r from-orange-50 to-blue-50 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 border border-orange-200/50">
                              <p className="text-xs sm:text-sm text-orange-600 font-semibold mb-1 sm:mb-2">Question 1</p>
                              <p className="text-gray-800 text-sm sm:text-base md:text-lg">Tell me about a challenging technical problem you solved...</p>
                            </div>
                            <div className="bg-blue-50/50 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 border border-blue-200/50">
                              <p className="text-xs sm:text-sm text-blue-600 font-semibold mb-1 sm:mb-2">Question 2</p>
                              <p className="text-gray-800 text-sm sm:text-base md:text-lg">How do you handle tight deadlines and pressure?</p>
                            </div>
                            <div className="bg-purple-50/50 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 border border-purple-200/50">
                              <p className="text-xs sm:text-sm text-purple-600 font-semibold mb-1 sm:mb-2">Question 3</p>
                              <p className="text-gray-800 text-sm sm:text-base md:text-lg">Describe your leadership experience...</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Preview 3 - Logo + CTA (Publish) */}
                  <div className="preview-3 absolute inset-0 flex items-center justify-center opacity-0 scale-95 p-4">
                    <div className="text-center">
                      {/* AI Interviewer Logo with Intense Glow */}
                      <div className="relative w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 mx-auto mb-8 sm:mb-12">
                        {/* Outer Glow Pulse */}
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-blue-500 rounded-full blur-3xl opacity-60 animate-pulse"></div>
                        <div className="absolute inset-4 bg-gradient-to-r from-orange-400 to-blue-400 rounded-full blur-2xl opacity-80"></div>
                        {/* Logo Circle */}
                        <div className="absolute inset-8 bg-gradient-to-br from-orange-500 to-blue-500 rounded-full flex items-center justify-center shadow-2xl shadow-orange-500/50">
                          <span className="text-5xl">🎯</span>
                        </div>
                      </div>
                      
                      {/* Brand Text */}
                      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-400 via-amber-400 to-blue-400 bg-clip-text text-transparent mb-4 sm:mb-6">
                        AI Interviewer
                      </h2>
                      <p className="text-base sm:text-lg md:text-xl text-gray-400 mb-6 sm:mb-8">
                        Your interview prep is ready!
                      </p>
                      
                      {/* CTA Button */}
                      <button className="px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 rounded-full bg-gradient-to-r from-orange-500 to-blue-500 text-white font-bold text-sm sm:text-base md:text-lg shadow-2xl shadow-orange-500/30 hover:shadow-3xl hover:scale-105 transition-all duration-300">
                        Start Practicing
                      </button>
                    </div>
                  </div>
                  
                </div>
              </div>
              
            </div>
          </div>

        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="relative z-10 py-16 sm:py-24 md:py-32 px-6 sm:px-8 lg:px-12"
>
        <div className="max-w-7xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-white">
              Revolutionary{" "}
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Features
              </span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto px-4">
              Experience the future of interview preparation with cutting-edge AI technology
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                title: "Smart Question Generation",
                description: "AI analyzes your resume and generates role-specific questions tailored to your experience.",
                gradient: "from-purple-500 to-pink-500",
                icon: "🎯",
                delay: 0
              },
              {
                title: "Real-time Feedback",
                description: "Get instant feedback on your performance with detailed metrics on communication and skills.",
                gradient: "from-blue-500 to-cyan-500",
                icon: "📊",
                delay: 0.2
              },
              {
                title: "AI-Powered Coaching",
                description: "Receive personalized improvement suggestions based on your interview performance.",
                gradient: "from-pink-500 to-orange-500",
                icon: "🧠",
                delay: 0.4
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: feature.delay }}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                className="group relative"
              >
                <div className="relative p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 hover:border-gray-700 transition-all duration-300 h-full shadow-lg hover:shadow-2xl">
                  {/* Gradient Orb */}
                  <div className={`absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br ${feature.gradient} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity duration-300`}></div>
                  
                  {/* Icon */}
                  <motion.div
                    className="text-4xl sm:text-5xl md:text-6xl mb-4 sm:mb-6"
                    animate={{
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      delay: index * 0.5
                    }}
                  >
                    {feature.icon}
                  </motion.div>

                  <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-white">
                    {feature.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Hover Arrow */}
                  <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className={`inline-flex items-center text-sm font-semibold bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent`}>
                      Learn more →
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


     {/* ================= ANALYTICS & INSIGHTS ================= */}
<section
  ref={analyticsRef}
  className="relative z-10 py-16 sm:py-24 md:py-32 px-6 sm:px-8 lg:px-12"
>
  <div className="max-w-7xl mx-auto w-full">

    {/* Title */}
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="text-center mb-20"
    >
      <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white">
        <span className="bg-gradient-to-r from-orange-400 to-blue-400 bg-clip-text text-transparent">
          Analytics & Insights
        </span>
      </h2>
      <p className="text-gray-400 max-w-2xl mx-auto">
        Visualize your progress and performance with real-time analytics.
      </p>
    </motion.div>

    {/* Charts */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

      {/* Line Chart */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        whileHover={{ y: -6, scale: 1.02 }}
        className="bg-gray-900/60 rounded-2xl p-6 border border-gray-800"
      >
        <h3 className="text-lg font-semibold text-white mb-4">
          Performance Over Time
        </h3>

        <svg viewBox="0 0 320 180" className="w-full h-64">
          <rect width="320" height="180" rx="16" fill="#18181b" />

          <motion.polyline
  variants={{
    hidden: { pathLength: 0 },
    visible: { pathLength: 1 },
  }}
  initial="hidden"
  animate={analyticsControls}
  transition={{ duration: 1.6, ease: "easeInOut" }}
  fill="none"
  stroke="#818cf8"
  strokeWidth="4"
  points="20,150 60,120 100,100 140,80 180,90 220,60 260,40 300,60"
/>

          <circle cx="300" cy="60" r="6" fill="#fbbf24" />
        </svg>

        <p className="mt-4 text-sm text-gray-400 text-center">
          Track improvement after each session.
        </p>
      </motion.div>

      {/* Bar Chart */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        whileHover={{ y: -6, scale: 1.02 }}
        className="bg-gray-900/60 rounded-2xl p-6 border border-gray-800"
      >
        <h3 className="text-lg font-semibold text-white mb-4">
          Skill Breakdown
        </h3>

        <svg viewBox="0 0 320 180" className="w-full h-64">
          <rect width="320" height="180" rx="16" fill="#18181b" />

      {[
  { x: 40, h: 70, c: "#f472b6" },
  { x: 90, h: 100, c: "#60a5fa" },
  { x: 140, h: 50, c: "#fbbf24" },
  { x: 190, h: 90, c: "#34d399" },
  { x: 240, h: 120, c: "#a78bfa" },
].map((bar, i) => (
  <motion.rect
    key={i}
    x={bar.x}
    width="32"
    rx="6"
    fill={bar.c}
    variants={{
      hidden: { height: 0, y: 150 },
      visible: { height: bar.h, y: 150 - bar.h },
    }}
    initial="hidden"
    animate={analyticsControls}
    transition={{
      duration: 0.8,
      delay: 0.3 + i * 0.15,
      ease: "easeOut",
    }}
  />
))}

        </svg>

        <p className="mt-4 text-sm text-gray-400 text-center">
          Identify strengths and focus areas.
        </p>
      </motion.div>
    </div>

    {/* Stats */}
    <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
      {[
        { label: "Avg. Score", value: "92%", color: "text-blue-400" },
        { label: "Improvement", value: "+37%", color: "text-orange-400" },
        { label: "Sessions", value: "8", color: "text-green-400" },
      ].map((stat, i) => (
      <motion.div
  variants={{
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
  }}
  initial="hidden"
  animate={analyticsControls}
  transition={{ duration: 0.6, delay: 0.9 + i * 0.15 }}
>
          <div className={`text-3xl font-bold mb-2 ${stat.color}`}>
            {stat.value}
          </div>
          <div className="text-gray-300 font-medium">
            {stat.label}
          </div>
        </motion.div>
      ))}
    </div>

  </div>
</section>


{/* ================= LIVE AI EXPERIENCES ================= */}
<section className="relative w-full flex flex-col justify-center py-40">

  {/* ================= TITLE ================= */}
  <div className="relative z-10 text-center mb-24 px-6">
    <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
      Live AI Experiences
    </h2>
    <p className="text-gray-400 text-xl md:text-2xl max-w-3xl mx-auto">
      Watch AI-powered experiences evolve automatically
    </p>
  </div>

  {/* ================= CARDS AREA (NO BOX) ================= */}
  <div
    className="relative w-full flex justify-center"
    style={{
      WebkitMaskImage: `
        radial-gradient(
          ellipse at center,
          black 35%,
          rgba(0,0,0,0.8) 55%,
          rgba(0,0,0,0.4) 70%,
          transparent 100%
        )
      `,
      maskImage: `
        radial-gradient(
          ellipse at center,
          black 35%,
          rgba(0,0,0,0.8) 55%,
          rgba(0,0,0,0.4) 70%,
          transparent 100%
        )
      `,
    }}
  >

    <AnimatePresence mode="wait">
      <motion.div
        key={currentIndex}
        className="flex items-center justify-center gap-20 px-20"
        initial={{ y: 80, opacity: 0, scale: 0.96 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 80, opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.9, ease: "easeInOut" }}
      >
        {slides[currentIndex].map((card, index) => (
          <motion.div
            key={index}
            whileHover={{ y: -14, scale: 1.03 }}
            className="relative
                       w-[360px] md:w-[440px] lg:w-[480px]
                       h-[460px] md:h-[540px] lg:h-[580px]
                       rounded-[2.75rem]
                       overflow-hidden
                       bg-white/5 backdrop-blur-xl
                       border border-white/10
                       shadow-[0_60px_160px_rgba(0,0,0,0.7)]"
          >
            <div
              className="absolute inset-0 bg-cover bg-center scale-105"
              style={{ backgroundImage: `url(${card.image})` }}
            />
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute bottom-10 left-10 right-10">
              <h3 className="text-white text-2xl font-semibold">
                {card.title}
              </h3>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </AnimatePresence>

  </div>
</section>


{/* ================= MULTI-LANGUAGE AI IDE ================= */}
<section className="relative z-10 py-32 px-6 sm:px-8">
  <div className="max-w-7xl mx-auto">

    {/* Title */}
    <div className="text-center mb-16">
      <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
        Multi-Language AI IDE
      </h2>
      <p className="text-gray-400 text-lg sm:text-xl max-w-3xl mx-auto">
        Our AI writes code across multiple compilers in real time
      </p>
    </div>

    {/* IDE Wrapper */}
    <div className="relative max-w-5xl mx-auto">

      {/* Soft glow */}
      <div className="absolute -inset-6 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-pink-500/20 blur-3xl rounded-3xl pointer-events-none" />

      <IDE />
    </div>

  </div>
</section>






      {/* ================= HOW IT WORKS ================= */}
      <section className="relative z-10 py-16 sm:py-24 md:py-32 px-6 sm:px-8 lg:px-12">
        <div className="max-w-5xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-white">
              How it works
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-400 px-4">
              Three simple steps to ace your next interview
            </p>
          </motion.div>

          <div className="space-y-6 sm:space-y-8 md:space-y-12">
            {[
              {
                number: "01",
                text: "Upload your resume and specify your target role.",
                gradient: "from-purple-500 to-pink-500"
              },
              {
                number: "02",
                text: "Practice with AI-generated questions and get real-time feedback.",
                gradient: "from-blue-500 to-cyan-500"
              },
              {
                number: "03",
                text: "Review your performance analytics and improve continuously.",
                gradient: "from-pink-500 to-orange-500"
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="group flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 md:gap-8 p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-gray-900/30 backdrop-blur-xl border border-gray-800 hover:border-gray-700 transition-all duration-300 hover:shadow-xl"
              >
                <div className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-lg`}>
                  <span className="text-xl sm:text-2xl font-bold text-white">{step.number}</span>
                </div>
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200 font-medium group-hover:text-white transition-colors duration-300">
                  {step.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>





      {/* ================= FINAL CTA ================= */}
      <AnimatePresence mode="wait">
  {!ctaAnimating && (
    <motion.section
      key="cta"
      className="relative z-10 py-16 sm:py-24 md:py-32 lg:py-40 px-6 sm:px-8 lg:px-12"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85 }}
      transition={{ duration: 0.5 }}
    >
        <div className="max-w-5xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative text-center p-8 sm:p-12 md:p-16 rounded-3xl sm:rounded-[3rem] bg-gradient-to-br from-purple-500/20 via-blue-500/20 to-pink-500/20 backdrop-blur-xl border border-purple-500/30 overflow-hidden"
          >
            {/* Animated Background */}
            <div className="absolute inset-0 -z-10">
              <div className="absolute top-0 left-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-[100px] animate-pulse"></div>
              <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-[100px] animate-pulse delay-1000"></div>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-white">
              Start your journey{" "}
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                today
              </span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-400 mb-8 sm:mb-12 max-w-2xl mx-auto px-4">
              Join thousands of professionals who transformed their careers with AI-powered interview prep.
            </p>

            {/* 3D Interactive Button with Glow */}
            <div className="relative inline-block perspective-1000 w-full sm:w-auto">
              {/* Large Section Glow - Full Background */}
              <motion.div
                className="absolute -inset-[150px] sm:-inset-[200px] md:-inset-[300px] rounded-full blur-[100px] sm:blur-[150px] md:blur-[200px] opacity-0 pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, rgba(59, 130, 246, 0.6) 0%, rgba(147, 51, 234, 0.4) 30%, rgba(249, 115, 22, 0.3) 50%, transparent 70%)',
                }}
                animate={{
                  opacity: buttonHovered ? 0.9 : 0,
                  scale: buttonHovered ? 1.4 : 0.8,
                }}
                transition={{
                  duration: 0.8,
                  ease: "easeOut"
                }}
              />
              
              {/* Stars Background Image - Appears on Hover & Moves with Tilt */}
              <motion.div
                className="absolute -inset-[120px] sm:-inset-[180px] md:-inset-[250px] rounded-full opacity-0 pointer-events-none overflow-hidden"
                style={{
                  backgroundImage: `url('/assets/stars%20photo.png')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  mixBlendMode: 'screen',
                }}
                animate={{
                  opacity: buttonHovered ? 0.7 : 0,
                  scale: buttonHovered ? 1.2 : 0.9,
                  x: buttonHovered ? mousePosition.x * 30 : 0,
                  y: buttonHovered ? mousePosition.y * 20 : 0,
                  rotate: buttonHovered ? mousePosition.x * 15 : 0,
                }}
                transition={{
                  duration: 1,
                  ease: "easeOut"
                }}
              />
              
              {/* Glowing Backdrop - Appears on Hover */}
              <motion.div
                className="absolute -inset-6 sm:-inset-8 md:-inset-12 rounded-full blur-2xl sm:blur-3xl opacity-0 pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, rgba(249, 115, 22, 0.5) 0%, rgba(59, 130, 246, 0.4) 50%, transparent 70%)',
                  scale: 1.8,
                }}
                animate={{
                  opacity: buttonHovered ? 1 : 0,
                  scale: buttonHovered ? 2.5 : 1.8,
                }}
                transition={{
                  duration: 0.6,
                  ease: "easeOut"
                }}
              />
              
              {/* Main Button */}
              <motion.button
                ref={buttonRef}
                onMouseEnter={() => setButtonHovered(true)}
                onMouseLeave={() => {
                  setButtonHovered(false);
                  setMousePosition({ x: 0, y: 0 });
                }}
                onMouseMove={handleMouseMove}
                onClick={() => {
  setCtaAnimating(true);
  setRocketLaunched(false);
}}
                className="relative w-full sm:w-auto px-8 sm:px-12 md:px-16 lg:px-20 py-4 sm:py-5 md:py-6 lg:py-8 rounded-full font-bold text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-white overflow-hidden group"
                style={{
                  background: 'linear-gradient(135deg, #f97316 0%, #3b82f6 100%)',
                  boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 10px 30px rgba(0, 0, 0, 0.3)',
                  transformStyle: 'preserve-3d',
                }}
                animate={{
                  rotateX: buttonHovered ? mousePosition.y * -10 : 0,
                  rotateY: buttonHovered ? mousePosition.x * 10 : 0,
                  translateY: buttonHovered ? -8 : 0,
                }}
                transition={{
                  type: "spring",
                  stiffness: 150,
                  damping: 20,
                  mass: 0.5
                }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Animated Border Line - Always Moves Around Edges Like Meteor */}
                <div 
                  className="absolute -inset-[2px] rounded-full pointer-events-none"
                >
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: 'conic-gradient(from 0deg, transparent 0deg, transparent 330deg, rgba(249, 115, 22, 0.3) 340deg, rgba(249, 115, 22, 0.8) 350deg, rgba(96, 165, 250, 1) 355deg, rgba(249, 115, 22, 0.8) 360deg, rgba(249, 115, 22, 0.3) 10deg, transparent 20deg)',
                      animation: 'rotateBorder 3s linear infinite',
                      filter: 'blur(1px)',
                    }}
                  />
                  {/* Inner mask to create border effect */}
                  <div className="absolute inset-[2px] rounded-full" style={{
                    background: 'linear-gradient(135deg, #f97316 0%, #3b82f6 100%)',
                  }} />
                </div>
                
                {/* Gradient Shift on Hover */}
                <motion.div
                  className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100"
                  style={{
                    background: 'linear-gradient(135deg, #fb923c 0%, #60a5fa 100%)',
                  }}
                  transition={{ duration: 0.4 }}
                />
                
                {/* Inner Highlight */}
                <div 
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.15) 0%, transparent 50%)',
                  }}
                />
                
                {/* Button Content */}
                <span className="relative z-10 flex items-center justify-center gap-2 sm:gap-3 md:gap-4">
                  <span className="hidden sm:inline">Start Practicing for Free</span>
                  <span className="sm:hidden">Start Practicing</span>
                  <motion.svg 
                    className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                    strokeWidth={2.5}
                    animate={{
                      x: buttonHovered ? 6 : 0
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      damping: 15
                    }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </motion.svg>
                </span>
              </motion.button>
            </div>
          </motion.div>
        </div>
          </motion.section>
  )}
</AnimatePresence>

{ctaAnimating && (
  <motion.div
    className="relative z-20 px-0"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3 }}
  >
    <div className="relative w-full h-screen overflow-visible">

      {/* ⭐ STARS */}
      {rocketLaunched && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 14 }).map((_, i) => (
            <motion.img
              key={i}
              src="/assets/star logo.png"
              className="absolute w-20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                filter: "drop-shadow(0 0 40px white)",
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 1, 0], scale: [0.7, 1.3, 0.9] }}
              transition={{ duration: 2 }}
            />
          ))}
        </div>
      )}

      {/* 🚀 FULLSCREEN CANVAS */}
      <Canvas
        style={{ width: "100%", height: "100%" }}
        camera={{ position: [0, 1.5, 4], fov: 35 }}
        gl={{ alpha: true }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 10, 5]} intensity={2} />

        <CtaRocket
          launched={rocketLaunched}
          triggerEffects={() => {
            if (!rocketLaunched) setRocketLaunched(true);
          }}
          onDone={() => {
  setRocketLaunched(false);
  setCtaAnimating(false);

  // ⏳ small delay feels more premium
  setTimeout(() => {
  navigate("/test-image");
}, 20);
}}
        />
      </Canvas>


      {/* 📝 ROCKET INSTRUCTION TEXT */}
{!rocketLaunched && (
  <motion.div
    className="absolute left-[40%] bottom-[250px] -translate-x-1/2 z-30 text-center pointer-events-none"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: [0, -6, 0] }}
    transition={{
      opacity: { duration: 0.6 },
      y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
    }}
  >
    <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-white mb-2 tracking-wide">
      Get started on your journey
    </h3>

    <p className="text-sm sm:text-base text-gray-400 flex items-center justify-center gap-2">
      <span className="animate-pulse">👆</span>
      Click the rocket to continue
    </p>
  </motion.div>
)}

      {/* ⚪ TRAIL */}
      {rocketLaunched && (
        <motion.div
          className="absolute left-1/2 bottom-0 -translate-x-1/2 w-24 h-screen pointer-events-none"
          animate={{ opacity: [0.8, 0.3, 0] }}
          transition={{ duration: 0.4, repeat: Infinity }}
          style={{
            background:
              "linear-gradient(to top, rgba(255,255,255,0.9), transparent)",
            filter: "blur(35px)",
          }}
        />
      )}
    </div>
  </motion.div>
)}




      {/* Footer */}
      <Footer />
    </div>
  );
};

export default GetStarted;

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const GsapDemo = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Timeline with ScrollTrigger
      let timeline = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=2000",
          scrub: 1,
          pin: true,
          markers: true, // Shows scroll markers for debugging
        }
      });

      // Phase 1: Zoom in and fade background
      timeline.add([
        gsap.to(".ai-box", {
          scale: 1.5,
          duration: 2
        }),
        gsap.to(".background-layer", {
          opacity: 0,
          duration: 2
        })
      ])
      // Phase 2: Remove outer layers
      .add([
        gsap.to(".outer-layer-top", {
          y: -300,
          opacity: 0,
          duration: 2
        }),
        gsap.to(".outer-layer-left", {
          x: -300,
          opacity: 0,
          duration: 2
        }),
        gsap.to(".outer-layer-right", {
          x: 300,
          opacity: 0,
          duration: 2
        })
      ])
      // Phase 3: Reveal inner content
      .add([
        gsap.to(".inner-content", {
          opacity: 1,
          scale: 1,
          duration: 2
        }),
        gsap.to(".title", {
          opacity: 1,
          y: 0,
          duration: 2
        })
      ]);
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white">
      {/* Header/Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            GSAP Demo
          </div>
          <nav className="flex gap-8">
            <a href="/" className="hover:text-purple-400 transition-colors">Home</a>
            <a href="#" className="hover:text-purple-400 transition-colors">About</a>
            <a href="#" className="hover:text-purple-400 transition-colors">Contact</a>
          </nav>
        </div>
      </header>

      {/* Intro Section */}
      <section className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-4xl">
          <h1 className="text-6xl md:text-8xl font-bold mb-6">
            GSAP ScrollTrigger
            <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Layer Animation
            </span>
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            Scroll down to see the building layers peel away and reveal the inner content
          </p>
          <div className="text-gray-500 animate-bounce">↓ Scroll Down ↓</div>
        </div>
      </section>

      {/* Main Animation Section */}
      <section ref={containerRef} className="relative min-h-screen flex items-center justify-center">
        {/* Background City Pattern */}
        <div className="background-layer absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-pink-900/20"></div>
          <div className="absolute inset-0" style={{
            backgroundImage: 'repeating-linear-gradient(0deg, #ffffff05 0px, #ffffff05 1px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, #ffffff05 0px, #ffffff05 1px, transparent 1px, transparent 40px)',
          }}></div>
        </div>

        {/* Main AI Box Container */}
        <div className="ai-box relative w-full max-w-4xl h-[600px]">
          
          {/* Outer Layer Top */}
          <div className="outer-layer-top absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-gradient-to-b from-purple-600/30 to-transparent backdrop-blur-xl border-t-2 border-purple-500/50 rounded-t-3xl"></div>
          
          {/* Outer Layer Left */}
          <div className="outer-layer-left absolute left-0 top-1/4 w-32 h-1/2 bg-gradient-to-r from-blue-600/30 to-transparent backdrop-blur-xl border-l-2 border-blue-500/50 rounded-l-3xl"></div>
          
          {/* Outer Layer Right */}
          <div className="outer-layer-right absolute right-0 top-1/4 w-32 h-1/2 bg-gradient-to-l from-pink-600/30 to-transparent backdrop-blur-xl border-r-2 border-pink-500/50 rounded-r-3xl"></div>

          {/* Inner Content Container */}
          <div className="inner-content absolute inset-0 flex items-center justify-center opacity-0 scale-75">
            <div className="relative w-full max-w-2xl mx-auto p-12 bg-gray-900/80 backdrop-blur-2xl rounded-3xl border border-gray-700/50 shadow-2xl">
              
              {/* Animated Title */}
              <div className="title opacity-0 translate-y-10 mb-8">
                <h2 className="text-4xl font-bold text-white mb-3">
                  AI Content Generator
                </h2>
                <p className="text-gray-400 text-lg">
                  Transform your ideas into reality with AI
                </p>
              </div>

              {/* Input Field */}
              <div className="mb-6">
                <textarea
                  placeholder="Describe what you want to create..."
                  rows="4"
                  className="w-full px-4 py-3 bg-gray-800/60 border border-gray-700/50 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 resize-none"
                />
              </div>

              {/* Action Button */}
              <button className="w-full py-4 px-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold text-lg shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300 hover:scale-105">
                Generate with AI
              </button>

              {/* Feature Pills */}
              <div className="mt-6 flex flex-wrap gap-2 justify-center">
                <span className="px-3 py-1 text-xs rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Fast Generation
                </span>
                <span className="px-3 py-1 text-xs rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  High Quality
                </span>
                <span className="px-3 py-1 text-xs rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30">
                  AI Powered
                </span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Content After Animation */}
      <section className="min-h-screen flex items-center justify-center px-6 relative">
        <div className="max-w-4xl">
          <h2 className="text-5xl font-bold mb-6">Keep Scrolling</h2>
          <p className="text-xl text-gray-400 leading-relaxed mb-8">
            The animation above uses GSAP ScrollTrigger to create a smooth, scroll-based
            layer-peeling effect. Each layer animates out in sequence as you scroll, revealing
            the inner content.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-gray-900/50 rounded-2xl border border-gray-800">
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="text-xl font-bold mb-2">Pinned Scroll</h3>
              <p className="text-gray-400">Section stays fixed while content animates</p>
            </div>
            <div className="p-6 bg-gray-900/50 rounded-2xl border border-gray-800">
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="text-xl font-bold mb-2">Smooth Scrub</h3>
              <p className="text-gray-400">Animations tied directly to scroll position</p>
            </div>
            <div className="p-6 bg-gray-900/50 rounded-2xl border border-gray-800">
              <div className="text-3xl mb-3">🎨</div>
              <h3 className="text-xl font-bold mb-2">Layered Effect</h3>
              <p className="text-gray-400">Multiple elements animate in sequence</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GsapDemo;

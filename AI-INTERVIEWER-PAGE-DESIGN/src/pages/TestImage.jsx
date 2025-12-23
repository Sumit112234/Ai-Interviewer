import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";

/* ================= CONFIG ================= */
const STAR_COUNT = 16;

/* ================= ROCKET ================= */
function RocketModel({ launched, onExit }) {
  const rocketRef = useRef();
  const { scene } = useGLTF("/models/toy_rocket.glb");
  const { mouse } = useThree();

  useFrame((_, delta) => {
    if (!rocketRef.current) return;

    if (!launched) {
      // Hover rotate
      const targetY = mouse.x * 1.1;
      rocketRef.current.rotation.y +=
        (targetY - rocketRef.current.rotation.y) * 0.08;
    } else {
      // Launch up
      rocketRef.current.position.y += delta * 8;

      if (rocketRef.current.position.y > 10) {
        onExit();
      }
    }
  });

  return (
    <primitive
      ref={rocketRef}
      object={scene}
      scale={3.6} // 🔥 BIGGER rocket
      position={[0, -1.5, 0]}
    />
  );
}

/* ================= MAIN ================= */
export default function TestImage() {
  const [launched, setLaunched] = useState(false);
  const [showCards, setShowCards] = useState(false);

  const reset = () => {
    setLaunched(false);
    setShowCards(false);
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden text-white bg-black">

      {/* 🌌 BACKGROUND */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/assets/roundball photo.png')",
        }}
      />

      {/* ⭐ STARS */}
      <AnimatePresence>
        {launched && (
          <div className="absolute inset-0 z-20 pointer-events-none">
            {Array.from({ length: STAR_COUNT }).map((_, i) => {
              const x = Math.random() * 100;
              const y = Math.random() * 100;
              const size = 50 + Math.random() * 60;

              return (
                <motion.img
                  key={i}
                  src="/assets/star logo.png"
                  className="absolute"
                  style={{
                    left: `${x}vw`,
                    top: `${y}vh`,
                    width: size,
                    filter:
                      "drop-shadow(0 0 45px rgba(255,255,255,0.9))",
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: [0, 1, 0.6],
                    scale: [0.6, 1.2, 1],
                    rotate: Math.random() * 360,
                  }}
                  transition={{
                    duration: 2,
                    delay: Math.random() * 0.4,
                  }}
                />
              );
            })}
          </div>
        )}
      </AnimatePresence>

      {/* 💡 GLOW FLASH */}
      <AnimatePresence>
        {showCards && (
          <motion.div
            className="absolute inset-0 z-30 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            style={{
              background:
                "radial-gradient(circle at center, rgba(255,255,255,0.35), rgba(0,0,0,0.85))",
            }}
          />
        )}
      </AnimatePresence>

      {/* 🚀 3D ROCKET */}
      {!showCards && (
        <div
          className="absolute inset-0 z-40"
          onClick={() => !launched && setLaunched(true)}
        >
          <Canvas camera={{ position: [0, 2, 7], fov: 45 }}>
            <ambientLight intensity={0.6} />
            <directionalLight position={[5, 10, 5]} intensity={1.6} />
            <pointLight position={[0, -2, 3]} intensity={2} />

            <RocketModel
              launched={launched}
              onExit={() => setShowCards(true)}
            />
          </Canvas>
        </div>
      )}

      {/* ⚪ WHITE TRAIL (FOLLOWS ROCKET) */}
      <AnimatePresence>
        {launched && !showCards && (
          <motion.div
            className="absolute left-1/2 bottom-0 z-35 -translate-x-1/2 w-10 h-full pointer-events-none"
            animate={{ opacity: [0.6, 0.2, 0] }}
            transition={{ duration: 0.6, repeat: Infinity }}
            style={{
              background:
                "linear-gradient(to top, rgba(255,255,255,0.9), transparent)",
              filter: "blur(22px)",
            }}
          />
        )}
      </AnimatePresence>

      {/* 🃏 CARDS */}
      <AnimatePresence>
        {showCards && (
          <motion.div
            className="absolute inset-0 z-50 flex items-center justify-center gap-10 px-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {[
              {
                img: "/assets/slide-photos/slide5.png",
                title: "Creative AI",
              },
              {
                img: "/assets/slide-photos/slide6.png",
                title: "Smart Automation",
              },
              {
                img: "/assets/slide-photos/slide4.png",
                title: "Future Tech",
              },
            ].map((card, i) => (
              <motion.div
                key={i}
                initial={{ y: 80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: i * 0.25 }}
                className="bg-black/40 backdrop-blur-xl rounded-2xl p-5 w-72 shadow-[0_0_60px_rgba(255,255,255,0.3)]"
              >
                <img
                  src={card.img}
                  className="rounded-xl mb-4 glossy"
                />
                <h3 className="text-xl font-bold text-center">
                  {card.title}
                </h3>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🔁 RETRO BUTTON */}
      {showCards && (
        <div className="absolute bottom-10 w-full flex justify-center z-60">
          <motion.button
            onClick={reset}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="px-10 py-4 text-lg font-bold rounded-full bg-gradient-to-r from-white to-gray-300 text-black shadow-[0_0_40px_rgba(255,255,255,0.9)]"
          >
            Replay Launch
          </motion.button>
        </div>
      )}

      {/* 👆 HINT */}
      {!launched && !showCards && (
        <div className="absolute bottom-10 w-full text-center z-50 pointer-events-none">
          <p className="text-sm text-gray-400">
            Move cursor to rotate • Click rocket to launch
          </p>
        </div>
      )}
    </div>
  );
}
























// import { motion, useMotionValue, useTransform } from "framer-motion";
// import { useState, useEffect } from "react";

// const TestImage = () => {
//   const [currentContainer, setCurrentContainer] = useState(1);
//   const [scrollProgress, setScrollProgress] = useState(0);
//   const progressScaleX = useMotionValue(0);

//   // Animations based on scroll progress for Container 1
//   const titleOpacity = scrollProgress < 0.2 ? scrollProgress / 0.2 : 1;
//   const titleScale = 1 + (scrollProgress * 0.3); // Grows as bar fills
//   const titleRotate = scrollProgress * 360; // Rotates full circle
  
//   const subtitleColor = scrollProgress < 0.5 
//     ? `rgb(${239 - scrollProgress * 360}, ${68 + scrollProgress * 130}, ${68 + scrollProgress * 178})`
//     : `rgb(59, 130, 246)`;
  
//   const instructionY = 50 - (scrollProgress * 50); // Slides up
//   const instructionOpacity = scrollProgress > 0.3 ? (scrollProgress - 0.3) / 0.7 : 0;

//   useEffect(() => {
//     let scrollAccumulator = scrollProgress * 50; // Initialize from current progress
//     const scrollThreshold = 50; // Number of scroll events to fill bar

//     const handleWheel = (e) => {
//       e.preventDefault();
      
//       // Accumulate scroll (bidirectional)
//       if (e.deltaY > 0) {
//         // Scrolling down
//         scrollAccumulator += Math.abs(e.deltaY) / 100;
//       } else {
//         // Scrolling up
//         scrollAccumulator -= Math.abs(e.deltaY) / 100;
//       }
      
//       // Check boundaries for container changes
//       if (scrollAccumulator >= scrollThreshold && currentContainer < 5) {
//         // Move to next container
//         setCurrentContainer(currentContainer + 1);
//         scrollAccumulator = 0;
//       } else if (scrollAccumulator <= 0 && currentContainer > 1) {
//         // Move to previous container
//         setCurrentContainer(currentContainer - 1);
//         scrollAccumulator = scrollThreshold;
//       } else {
//         // Stay in current container, clamp progress
//         scrollAccumulator = Math.max(0, Math.min(scrollAccumulator, scrollThreshold));
//       }
      
//       const progress = scrollAccumulator / scrollThreshold;
//       setScrollProgress(progress);
//       progressScaleX.set(progress);
//     };

//     window.addEventListener('wheel', handleWheel, { passive: false });
    
//     return () => {
//       window.removeEventListener('wheel', handleWheel);
//     };
//   }, [currentContainer, progressScaleX, scrollProgress]);

//   const containers = [
//     { id: 1, bg: "bg-red-900/20", border: "border-red-500", color: "Red" },
//     { id: 2, bg: "bg-orange-900/20", border: "border-orange-500", color: "Orange" },
//     { id: 3, bg: "bg-yellow-900/20", border: "border-yellow-500", color: "Yellow" },
//     { id: 4, bg: "bg-green-900/20", border: "border-green-500", color: "Green" },
//     { id: 5, bg: "bg-blue-900/20", border: "border-blue-500", color: "Blue" },
//   ];

//   const current = containers[currentContainer - 1];

//   return (
//     <div className="bg-[#0a0a0a] text-white h-screen overflow-hidden">
//       {/* Fixed Progress Bar at Top */}
//       <div className="fixed top-0 left-0 right-0 h-3 bg-gray-800 z-50">
//         <motion.div 
//           className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 origin-left"
//           style={{ scaleX: progressScaleX }}
//         />
//       </div>

//       {/* Debug Info */}
//       <div className="fixed top-5 left-4 text-sm bg-black/80 p-4 rounded z-40">
//         <p className="text-yellow-400 font-bold">Container {currentContainer} / 5</p>
//         <p className="text-green-400 text-xs">Progress: {Math.round(scrollProgress * 100)}%</p>
//         <p className="text-cyan-400 text-xs mt-2">Scroll to fill bar!</p>
//       </div>

//       {/* Current Container - Fixed in place with smooth fade transition */}
//       <motion.div 
//         key={currentContainer}
//         initial={{ opacity: 0, scale: 0.95, y: 20 }}
//         animate={{ opacity: 1, scale: 1, y: 0 }}
//         exit={{ opacity: 0, scale: 1.05, y: -20 }}
//         transition={{ 
//           duration: 1.2, 
//           ease: [0.22, 1, 0.36, 1] // Custom easing for smooth feel
//         }}
//         className={`h-screen flex items-center justify-center ${current.bg} border-4 ${current.border}`}
//       >
//         <div className="text-center">
//           {currentContainer === 1 ? (
//             // Animated content for Container 1
//             <>
//               <motion.h2 
//                 style={{
//                   opacity: titleOpacity,
//                   scale: titleScale,
//                   rotate: titleRotate
//                 }}
//                 className="text-8xl font-bold mb-4"
//               >
//                 Container {currentContainer}
//               </motion.h2>
//               <motion.p 
//                 style={{ color: subtitleColor }}
//                 className="text-2xl font-semibold"
//               >
//                 {current.color}
//               </motion.p>
//               <motion.p 
//                 style={{
//                   y: instructionY,
//                   opacity: instructionOpacity
//                 }}
//                 className="text-lg text-gray-500 mt-4"
//               >
//                 Scroll down to fill the bar
//               </motion.p>
              
//               {/* Progress-based decorative elements */}
//               <motion.div
//                 style={{
//                   scale: scrollProgress * 2,
//                   opacity: scrollProgress * 0.5
//                 }}
//                 className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-pink-500/10 blur-3xl"
//               />
//             </>
//           ) : (
//             // Static content for other containers
//             <>
//               <motion.h2 
//                 initial={{ opacity: 0, y: 30 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.3, duration: 0.8 }}
//                 className="text-8xl font-bold mb-4"
//               >
//                 Container {currentContainer}
//               </motion.h2>
//               <motion.p 
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ delay: 0.5, duration: 0.8 }}
//                 className="text-2xl text-gray-400"
//               >
//                 {current.color}
//               </motion.p>
//               <motion.p 
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ delay: 0.7, duration: 0.8 }}
//                 className="text-lg text-gray-500 mt-4"
//               >
//                 Scroll down to fill the bar
//               </motion.p>
//             </>
//           )}
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// export default TestImage;



// import { useEffect, useRef } from "react";
// import gsap from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";

// gsap.registerPlugin(ScrollTrigger);

// export default function ScrollLockExample() {
//   const pinRef = useRef(null);
//   const boxRef = useRef(null);

//   useEffect(() => {
//     ScrollTrigger.create({
//       trigger: pinRef.current,
//       start: "top top",
//       end: "+=3000",          // 🔑 scroll distance
//       pin: true,
//       scrub: true,
//       anticipatePin: 1,
//     });

//     gsap.timeline({
//       scrollTrigger: {
//         trigger: pinRef.current,
//         start: "top top",
//         end: "+=3000",
//         scrub: true,
//       },
//     })
//     .fromTo(boxRef.current, { scale: 0.8 }, { scale: 1 })
//     .from(boxRef.current.querySelector("h2"), { opacity: 0, y: 40 })
//     .from(boxRef.current.querySelector("p"), { opacity: 0, y: 20 });
//   }, []);

//   return (
//     <div className="bg-black text-white">

//       {/* BEFORE */}
//       <section className="h-screen flex items-center justify-center">
//         <h1 className="text-6xl">Scroll Down</h1>
//       </section>

//       {/* PINNED SCENE */}
//       <section
//         ref={pinRef}
//         className="relative min-h-[3000px]"   // 🔑 CRITICAL
//       >
//         <div className="h-screen flex items-center justify-center">
//           <div
//             ref={boxRef}
//             className="bg-gray-900/80 border border-white/10 rounded-3xl p-16 text-center"
//           >
//             <h2 className="text-4xl font-bold mb-4">Create with AI</h2>
//             <p className="text-gray-400">
//               Scroll completes, then page continues
//             </p>
//           </div>
//         </div>
//       </section>

//       {/* AFTER (this MUST exist) */}
//       <section className="h-screen flex items-center justify-center">
//         <h1 className="text-6xl">Next Section</h1>
//       </section>

//     </div>
//   );
// }

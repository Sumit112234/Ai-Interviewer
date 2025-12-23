import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Images should be in public/slide-photos/
const images = [
  "/slide-photos/slide1.jpg",
  "/slide-photos/slide2.jpg",
  "/slide-photos/slide3.jpg",
  "/slide-photos/slide4.jpg",
  "/slide-photos/slide5.jpg"
];

const CARD_HEIGHT = 420;
const CARD_GAP = 32;
const AUTO_ADVANCE = 4000;

export default function ShowcaseSection() {
  const [active, setActive] = useState(0);
  const timeoutRef = useRef();

  // Auto-advance cards
  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setActive((prev) => (prev + 1) % images.length);
    }, AUTO_ADVANCE);
    return () => clearTimeout(timeoutRef.current);
  }, [active]);

  // Card positions: -1 (above), 0 (center), 1 (below)
  const getCardState = (idx) => {
    if (idx === active) return 0;
    if ((idx + 1) % images.length === active) return -1;
    if ((idx - 1 + images.length) % images.length === active) return 1;
    return null;
  };

  return (
    <section className="relative z-10 py-24 px-4 sm:px-8 flex flex-col items-center bg-gradient-to-b from-[#10101a] via-[#0a0a0a] to-[#181825]">
      {/* Background gradient and subtle particles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-radial from-[#23234a]/60 via-[#0a0a0a]/80 to-[#0a0a0a]" />
        {/* Minimal stars/particles */}
        <div className="absolute inset-0">
          {[...Array(18)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white/10 blur-[2px]"
              style={{
                width: 4 + Math.random() * 4,
                height: 4 + Math.random() * 4,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: 0.2 + Math.random() * 0.3
              }}
            />
          ))}
        </div>
      </div>
      <div className="relative flex flex-col items-center min-h-[600px] h-[600px] w-full max-w-xl mx-auto" style={{ perspective: 1800 }}>
        <AnimatePresence initial={false}>
          {images.map((src, idx) => {
            const state = getCardState(idx);
            if (state === null) return null;
            // Card animation logic
            let y = 0, scale = 1, zIndex = 10, opacity = 1, blur = 0;
            if (state === -1) {
              y = -CARD_HEIGHT / 1.7;
              scale = 0.92;
              zIndex = 5;
              opacity = 0.6;
              blur = 2;
            } else if (state === 1) {
              y = CARD_HEIGHT / 1.7;
              scale = 0.92;
              zIndex = 5;
              opacity = 0.6;
              blur = 2;
            }
            return (
              <motion.div
                key={src}
                initial={{
                  y: state === 1 ? 80 : state === -1 ? -80 : 0,
                  scale: state === 0 ? 0.95 : 0.9,
                  opacity: 0.2
                }}
                animate={{
                  y,
                  scale,
                  opacity,
                  filter: `blur(${blur}px)`,
                  zIndex
                }}
                exit={{
                  y: state === 1 ? 120 : state === -1 ? -120 : 0,
                  scale: 0.85,
                  opacity: 0,
                  filter: "blur(8px)"
                }}
                transition={{
                  duration: 1.2,
                  ease: "expo.out"
                }}
                className={`absolute left-1/2 -translate-x-1/2 w-full max-w-lg select-none pointer-events-none ${state === 0 ? "pointer-events-auto" : ""}`}
                style={{
                  height: CARD_HEIGHT,
                  boxShadow: state === 0
                    ? "0 8px 48px 0 rgba(80,80,120,0.25), 0 0 0 2px rgba(255,255,255,0.08)"
                    : "0 2px 16px 0 rgba(80,80,120,0.10)",
                  zIndex
                }}
                whileHover={state === 0 ? { scale: 1.025, y: -10, boxShadow: "0 12px 64px 0 rgba(80,80,120,0.32), 0 0 0 3px rgba(255,255,255,0.12)" } : {}}
              >
                <div
                  className="relative w-full h-full rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-2xl border border-white/10 shadow-2xl"
                  style={{
                    background: "rgba(30,32,40,0.55)",
                    boxShadow: state === 0
                      ? "0 8px 48px 0 rgba(80,80,120,0.25), 0 0 0 2px rgba(255,255,255,0.08)"
                      : "0 2px 16px 0 rgba(80,80,120,0.10)",
                  }}
                >
                  {/* Glow edge */}
                  <div className="absolute inset-0 rounded-[2.5rem] pointer-events-none" style={{
                    boxShadow: state === 0
                      ? "0 0 32px 8px rgba(120,180,255,0.12), 0 0 0 2px rgba(255,255,255,0.10)"
                      : "0 0 16px 2px rgba(120,180,255,0.06)"
                  }} />
                  {/* Inner highlight */}
                  <div className="absolute inset-0 rounded-[2.5rem] pointer-events-none" style={{
                    background: "radial-gradient(ellipse at 60% 0%,rgba(255,255,255,0.10) 0%,transparent 80%)"
                  }} />
                  {/* Card content: website preview image */}
                  <img
                    src={src}
                    alt="Showcase preview"
                    className="w-full h-full object-cover object-top rounded-[2.5rem]"
                    draggable={false}
                    style={{ userSelect: "none" }}
                  />
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
      {/* Headline and description */}
      <div className="relative z-10 mt-16 text-center">
        <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
          Premium AI Website Showcase
        </h2>
        <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto">
          Experience next-level, glassy, animated previews — inspired by Dora AI. Smooth, cinematic, and elegant.
        </p>
      </div>
    </section>
  );
}

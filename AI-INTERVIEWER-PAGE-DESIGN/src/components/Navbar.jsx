import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Navbar = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Features", path: "#features" },
    { name: "How it Works", path: "#how-it-works" },
    { name: "Pricing", path: "#pricing" },
  ];

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 w-[95%] max-w-6xl mx-auto"
    >
      {/* Pill-shaped Navbar Container */}
      <div className="relative w-full">
        {/* Glow Effect */}
        <div className="absolute -inset-[1px] bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-pink-500/20 rounded-full blur-sm"></div>
        
        {/* Main Navbar */}
        <div className="relative bg-gray-900/40 backdrop-blur-xl border border-gray-800/50 rounded-full px-6 py-3 shadow-2xl">
          <div className="grid grid-cols-3 items-center w-full gap-4">
            
            {/* Logo - Left Side */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 cursor-pointer justify-start"
              onClick={() => navigate("/")}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                <span className="text-lg">🎯</span>
              </div>
              <span className="text-white font-bold text-lg hidden sm:block">AI Interviewer</span>
            </motion.div>

            {/* Desktop Navigation Links - Center */}
            <div className="hidden lg:flex items-center justify-center gap-8">
              {navLinks.map((link, index) => (
                <motion.a
                  key={index}
                  href={link.path}
                  whileHover={{ scale: 1.05 }}
                  className="text-gray-300 hover:text-white transition-colors duration-300 text-sm font-medium"
                >
                  {link.name}
                </motion.a>
              ))}
            </div>

            {/* CTA Buttons - Right Side */}
            <div className="flex items-center gap-3 justify-end">
              <button
                onClick={() => navigate("/login")}
                className="hidden sm:block px-5 py-2 text-gray-300 hover:text-white transition-colors duration-300 text-sm font-medium"
              >
                Sign In
              </button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/login")}
                className="px-6 py-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold text-sm shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300"
              >
                Get Started
              </motion.button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden text-white p-2"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {isMobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:hidden mt-4 pt-4 border-t border-gray-800/50"
            >
              <div className="flex flex-col gap-3">
                {navLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.path}
                    className="text-gray-300 hover:text-white transition-colors duration-300 text-sm font-medium py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;

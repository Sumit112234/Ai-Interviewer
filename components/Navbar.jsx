"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { getUser, logout } from "@/app/context/auth";

const Navbar = () => {

  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  
    const [user, setUser] = useState(null)
  
    useEffect(() => {
      async function fetchUser() {
        const userData = await getUser()
        setUser(userData?.user || null)
        console.log({userData})
      }
      fetchUser()
    },[])

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show navbar when scrolling up or at the top
      if (currentScrollY < lastScrollY || currentScrollY < 10) {
        setIsVisible(true);
      } 
      // Hide navbar when scrolling down
      else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
        setIsMobileMenuOpen(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Features", path: "features" },
    { name: "How it Works", path: "how-it-works" },
    { name: "Pricing", path: "pricing" },
  ];

  const handleNavClick = (path) => {
    console.log("Navigate to:", path);
    router.push(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ 
        y: isVisible ? 0 : -100, 
        opacity: isVisible ? 1 : 0 
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed top-2 sm:top-4 left-1/2 transform -translate-x-1/2 z-50 w-[96%] sm:w-[95%] max-w-7xl px-2 sm:px-0"
    >
      {/* Pill-shaped Navbar Container */}
      <div className="relative w-full">
        {/* Glow Effect */}
        <div className="absolute -inset-[1px] bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-pink-500/20 sm:rounded-full blur-sm"></div>
        
        {/* Main Navbar */}
        <div className="relative bg-gray-900/40 backdrop-blur-xl border border-gray-800/50 sm:rounded-full px-3 sm:px-6 py-2.5 sm:py-3 shadow-2xl">
          <div className="flex items-center justify-between w-full gap-2 sm:gap-4">
            
            {/* Logo - Left Side */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-1.5 sm:gap-2 cursor-pointer flex-shrink-0"
              onClick={() => handleNavClick("/")}
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                <span className="text-base sm:text-lg">🎯</span>
              </div>
              <span className="text-white font-bold text-sm sm:text-lg hidden xs:block">
                AI Interviewer
              </span>
            </motion.div>

            {/* Desktop Navigation Links - Center */}
            <div className="hidden lg:flex items-center justify-center gap-6 xl:gap-8">
              {navLinks.map((link, index) => (
                <motion.a
                  key={index}
                  href={link.path}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-gray-300 hover:text-white transition-colors duration-300 text-sm font-medium whitespace-nowrap"
                >
                  {link.name}
                </motion.a>
              ))}
            </div>

            {/* CTA Buttons - Right Side */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (!user) {
                    handleNavClick("/login");
                  } else {
                    logout(); 
                    setUser(null);
                    router.push("/");
                  }
                }}
                className={`px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-white font-semibold text-xs sm:text-sm shadow-lg transition-all duration-300 whitespace-nowrap
                  ${
                    user
                      ? "bg-red-600 hover:bg-red-700 shadow-red-500/30"
                      : "bg-green-600 hover:bg-green-700 shadow-green-500/30"
                  }`}
              >
                {user ? "Log Out" : "Sign In"}
              </motion.button>

              {/* <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleNavClick("/login")}
                className="px-4 sm:px-6 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300 whitespace-nowrap"
              >
                Get Started
              </motion.button> */}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden text-white p-1.5 sm:p-2 hover:bg-gray-800/50 rounded-full transition-colors"
                aria-label="Toggle menu"
              >
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6"
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
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="lg:hidden overflow-hidden "
              >
                <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-800/50">
                  <div className="flex flex-col gap-1">
                    {navLinks.map((link, index) => (
                      <motion.a
                        key={index}
                        href={link.path}
                        whileTap={{ scale: 0.98 }}
                        className="text-gray-300 hover:text-white hover:bg-gray-800/30 transition-all duration-300 text-sm font-medium py-2.5 px-3 rounded-md"
                        onClick={() => handleNavClick(link.path)}
                      >
                        {link.name}
                      </motion.a>
                    ))}
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleNavClick("/login")}
                      className="md:hidden text-left text-gray-300 hover:text-white hover:bg-gray-800/30 transition-all duration-300 text-sm font-medium py-2.5 px-3 rounded-lg mt-1"
                    >
                      Sign In
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
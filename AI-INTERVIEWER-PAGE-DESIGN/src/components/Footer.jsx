import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  const footerLinks = {
    Product: [
      { name: "Features", path: "#features" },
      { name: "Pricing", path: "#pricing" },
      { name: "Security", path: "#security" },
      { name: "Roadmap", path: "#roadmap" },
    ],
    Company: [
      { name: "About", path: "#about" },
      { name: "Blog", path: "#blog" },
      { name: "Careers", path: "#careers" },
      { name: "Contact", path: "#contact" },
    ],
    Resources: [
      { name: "Documentation", path: "#docs" },
      { name: "Help Center", path: "#help" },
      { name: "Community", path: "#community" },
      { name: "Status", path: "#status" },
    ],
    Legal: [
      { name: "Privacy", path: "#privacy" },
      { name: "Terms", path: "#terms" },
      { name: "Cookie Policy", path: "#cookies" },
      { name: "Licenses", path: "#licenses" },
    ],
  };

  const socialLinks = [
    { name: "Twitter", icon: "𝕏", url: "#" },
    { name: "GitHub", icon: "⚡", url: "#" },
    { name: "LinkedIn", icon: "💼", url: "#" },
    { name: "Discord", icon: "💬", url: "#" },
  ];

  return (
    <footer className="relative z-10 bg-gradient-to-b from-[#0a0a0a] to-black border-t border-gray-800/50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12 sm:py-16">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-12">
          
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                <span className="text-2xl">🎯</span>
              </div>
              <span className="text-white font-bold text-xl">AI Interviewer</span>
            </div>
            <p className="text-gray-400 text-sm mb-6 max-w-sm">
              Transform your interview skills with AI-powered practice sessions, real-time feedback, and personalized coaching.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  className="w-10 h-10 rounded-full bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50 hover:border-gray-600/50 flex items-center justify-center transition-all duration-300 group"
                  aria-label={social.name}
                >
                  <span className="text-lg group-hover:scale-110 transition-transform duration-300">
                    {social.icon}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([category, links], index) => (
            <div key={index}>
              <h3 className="text-white font-semibold mb-4 text-sm">{category}</h3>
              <ul className="space-y-3">
                {links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={link.path}
                      className="text-gray-400 hover:text-white transition-colors duration-300 text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-gray-800/50 pt-8 mb-8">
          <div className="max-w-md">
            <h3 className="text-white font-semibold mb-2 text-lg">Stay Updated</h3>
            <p className="text-gray-400 text-sm mb-4">
              Get the latest updates on new features and interview tips.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-full text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 text-sm"
              />
              <button className="px-6 py-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold text-sm shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300 hover:scale-105">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © 2025 AI Interviewer. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#privacy" className="text-gray-500 hover:text-gray-400 transition-colors duration-300 text-sm">
              Privacy Policy
            </a>
            <a href="#terms" className="text-gray-500 hover:text-gray-400 transition-colors duration-300 text-sm">
              Terms of Service
            </a>
            <a href="#cookies" className="text-gray-500 hover:text-gray-400 transition-colors duration-300 text-sm">
              Cookie Settings
            </a>
          </div>
        </div>
      </div>

      {/* Ambient Gradient */}
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
    </footer>
  );
};

export default Footer;

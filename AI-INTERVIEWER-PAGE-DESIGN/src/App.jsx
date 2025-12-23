import { Routes, Route } from "react-router-dom";
import { UserRegisterProvider } from "./context/UserRegisterContext";
import { Toaster } from "react-hot-toast";
import { ParallaxProvider } from 'react-scroll-parallax';

import ErrorBoundary from "./ErrorBoundary";
import GetStarted from "./pages/getstarted.jsx";
import TestImage from "./pages/TestImage.jsx";
import GsapDemo from "./pages/GsapDemo.jsx";

function App() {
  return (
    <>
      {/* Toast notifications */}
      <Toaster position="top-right" />

      {/* Parallax Provider - enables parallax effects throughout the app */}
      <ParallaxProvider>
        {/* Global context provider */}
        <UserRegisterProvider>
          <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-black text-black dark:text-gray-100">
            
            {/* ✅ Main Content Area */}
            <div className="flex-1 flex flex-col overflow-y-auto">
              <ErrorBoundary>
                <Routes>
                  <Route path="/" element={<GetStarted />} />
                  <Route path="/test-image" element={<TestImage />} />
                  <Route path="/gsap-demo" element={<GsapDemo />} />
                  {/* Add more routes here when you have more pages */}
                </Routes>
              </ErrorBoundary>
            </div>
          </div>
        </UserRegisterProvider>
      </ParallaxProvider>
    </>
  );
}

export default App;

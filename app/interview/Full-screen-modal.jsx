import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AlertCircle, Maximize2, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function InterviewMode({showModal,setShowModal, violationCounter}) {
  
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');
  const router = useRouter();

  // console.log("Rendering Fullscreen Modal, isFullscreen:", isFullscreen, " showModal:", showModal, "violationCounter:", violationCounter?.current  );
  

  // Check if already in fullscreen
  const checkFullscreen = useCallback(() => {
    return !!(
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement
    );
  }, []);

  // Enter fullscreen
  const enterFullscreen = useCallback(async () => {

     console.log("entering fullscreen from children...");
    try {
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        await elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) {
        await elem.webkitRequestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        await elem.mozRequestFullScreen();
      } else if (elem.msRequestFullscreen) {
        await elem.msRequestFullscreen();
      }
      setIsFullscreen(true);
      setShowModal(false);
      setInterviewStarted(true);
    } catch (err) {
      console.error('Error entering fullscreen:', err);
      setWarningMessage('Please allow fullscreen mode to continue');
    }
  }, []);

  // Exit fullscreen
  const exitFullscreen = useCallback(() => {
     console.log("Exiting fullscreen from childern...");
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
    setIsFullscreen(false);
  }, []);

  // Handle go back
  const handleGoBack = () => {
    if (isFullscreen) {
      exitFullscreen();
    }
    window.history.back();
  };

  const checkViolation = () => {
    if(violationCounter.current >= 2)
    {
      setWarningMessage('You have exited fullscreen mode multiple times. The interview will now end.');
      exitFullscreen();
      // alert('Interview ended due to multiple fullscreen violations.');
      setTimeout(() => {
        router.replace("/report")
      }, 3300);

     return true;
    }
    return false;
   
  }
  // Prevent context menu (right-click)
  useEffect(() => {
    const preventContextMenu = (e) => {
      if (interviewStarted) {
        e.preventDefault();
        return false;
      }
    };

    document.addEventListener('contextmenu', preventContextMenu);
    return () => document.removeEventListener('contextmenu', preventContextMenu);
  }, [interviewStarted]);

  // Prevent keyboard shortcuts
  useEffect(() => {
    const preventKeyboardShortcuts = (e) => {
      if (!interviewStarted) return;

      // Prevent F-keys (F1-F12)
      if (e.key.startsWith('F') && e.key.length <= 3) {
        e.preventDefault();
        return false;
      }

      // Prevent Ctrl/Cmd combinations
      if (e.ctrlKey || e.metaKey) {
        // Prevent common shortcuts
        const blockedKeys = ['c', 'v', 'x', 'a', 's', 'p', 'u', 'shift', 'i', 'j', 'k'];
        if (blockedKeys.includes(e.key.toLowerCase())) {
          e.preventDefault();
          return false;
        }
        
        if(e.key.toLowerCase() === 'r') {

          let confirmReload = window.confirm("Reloading the page will exit the interview. Do you want to proceed?");
          if (confirmReload) {
            exitFullscreen();
            window.location.reload();
          }
          else{
            e.preventDefault();
          }
          
          return false;
        }

        // Prevent Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C (dev tools)
        if (e.shiftKey && ['i', 'j', 'c', 'k'].includes(e.key.toLowerCase())) {
          e.preventDefault();
          return false;
        }
      }

      // Prevent Alt combinations
      if (e.altKey) {
        e.preventDefault();
        return false;
      }

      // Prevent specific keys
      const blockedStandaloneKeys = ['F12', 'PrintScreen', 'ContextMenu'];
      if (blockedStandaloneKeys.includes(e.key)) {
        e.preventDefault();
        return false;
      }
    };

    document.addEventListener('keydown', preventKeyboardShortcuts);
    return () => document.removeEventListener('keydown', preventKeyboardShortcuts);
  }, [interviewStarted]);

  // Detect fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isNowFullscreen = checkFullscreen();
      setIsFullscreen(isNowFullscreen);
      
      // If user exits fullscreen during interview, show modal
      if (!checkViolation() && !isNowFullscreen && interviewStarted) {
        violationCounter.current += 1
        setShowModal(true);
        setWarningMessage(`You exited fullscreen mode ${violationCounter.current} times. Please return to fullscreen to continue.`);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
    };
  }, [interviewStarted, checkFullscreen]);

  // Detect tab visibility changes
  useEffect(() => {

   const handleVisibilityChange = () => {

      if (!checkViolation() && document.hidden && interviewStarted && isFullscreen) {
        violationCounter.current += 1
        setShowModal(true);
        setWarningMessage('Tab switching detected! Please return to the interview.');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [interviewStarted, isFullscreen]);

  // Detect window blur (user switching windows)
  useEffect(() => {
    const handleBlur = () => {
      
      if (!checkViolation() && interviewStarted && isFullscreen) {
        setShowModal(true);
        violationCounter.current += 1
        setWarningMessage('Window focus lost! Please stay in the interview window.');
      }
    };

    window.addEventListener('blur', handleBlur);
    return () => window.removeEventListener('blur', handleBlur);
  }, [interviewStarted, isFullscreen]);

  // Handle clicks outside modal to reopen it
  const handleScreenClick = (e) => {
    if (!isFullscreen  && !showModal) {
      setShowModal(true);
    }
  };

  // Handle modal close attempt
  const handleCloseModal = (e) => {
    e.stopPropagation();
    if (!isFullscreen) {
      setShowModal(false);
      setWarningMessage('You must enter fullscreen mode to continue.');
    }
  };

  // Handle submit button (demo)
  const handleSubmit = () => {
    if (window.confirm('Are you sure you want to submit the interview?')) {
      exitFullscreen();
      alert('Interview submitted successfully!');
      window.history.back();
    }
  };

  if(!showModal) return null

  return (

    <>

       <div className='relative z-50 '>


      <div className="fixed inset-0 bg-black/80 flex items-center justify-center  p-4">
          <div 
            className="bg-gradient-to-b from-gray-900 to-black border-2 border-blue-700 rounded-2xl shadow-2xl max-w-md w-full p-8 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            {!interviewStarted && (
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 text-purple-400 hover:text-purple-300 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}

            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-800 to-purple-800 rounded-full flex items-center justify-center shadow-lg">
                <Maximize2 className="w-10 h-10 text-white" />
              </div>
            </div>

            {/* Title */}
            <h2 className="text-3xl font-bold text-center mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Full Screen Required
            </h2>

            {/* Warning message */}
            {warningMessage && (
              <div className="mb-6 p-4 bg-gradient-to-r from-purple-900/50 to-blue-900/50 border border-purple-700 rounded-xl">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-purple-400 mr-3 flex-shrink-0" />
                  <p className="text-sm text-purple-200 font-medium">{warningMessage}</p>
                </div>
              </div>
            )}

            {/* Instructions */}
            <div className="mb-8 space-y-4">
              <p className="text-blue-200 text-center text-lg">
                This interview requires full screen mode for security and focus.
              </p>
              
              <div className="bg-gradient-to-r from-gray-800/50 to-blue-900/30 rounded-xl p-5 border border-blue-800/50">
                <p className="font-bold text-blue-300 mb-3 text-lg">Important Instructions:</p>
                <ul className="space-y-2.5">
                  <li className="flex items-center text-gray-300">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    <span>You cannot exit until you click Submit</span>
                  </li>
                  <li className="flex items-center text-gray-300">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    <span>Tab switching is not allowed</span>
                  </li>
                  <li className="flex items-center text-gray-300">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    <span>Right-click is disabled</span>
                  </li>
                  <li className="flex items-center text-gray-300">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    <span>Keyboard shortcuts are blocked</span>
                  </li>
                  <li className="flex items-center text-gray-300">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    <span>Developer tools are restricted</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleGoBack}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-gray-800 to-gray-900 border border-blue-800 rounded-xl text-blue-200 hover:from-gray-700 hover:to-gray-800 transition-all duration-300 flex items-center justify-center gap-3 font-bold text-lg hover:border-blue-600"
              >
                <ArrowLeft className="w-5 h-5" />
                Go Back
              </button>
              <button
                onClick={enterFullscreen}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-700 to-purple-700 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 flex items-center justify-center gap-3 font-bold text-lg shadow-lg hover:shadow-blue-500/25"
              >
                <Maximize2 className="w-5 h-5" />
                Enter Fullscreen
              </button>
            </div>
          </div>
        </div>

        </div>
    
  

    </>
  );
}

  // <div 
  //     className="bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative"
  //     onClick={handleScreenClick}
  //   >
  //     {/* Modal */}
  //     {showModal && (
  //       <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
  //         <div 
  //           className="bg-gradient-to-b from-gray-900 to-black border-2 border-blue-700 rounded-2xl shadow-2xl max-w-md w-full p-8 relative"
  //           onClick={(e) => e.stopPropagation()}
  //         >
  //           {/* Close button */}
  //           {!interviewStarted && (
  //             <button
  //               onClick={handleCloseModal}
  //               className="absolute top-4 right-4 text-purple-400 hover:text-purple-300 transition-colors"
  //             >
  //               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  //               </svg>
  //             </button>
  //           )}

  //           {/* Icon */}
  //           <div className="flex justify-center mb-6">
  //             <div className="w-20 h-20 bg-gradient-to-br from-blue-800 to-purple-800 rounded-full flex items-center justify-center shadow-lg">
  //               <Maximize2 className="w-10 h-10 text-white" />
  //             </div>
  //           </div>

  //           {/* Title */}
  //           <h2 className="text-3xl font-bold text-center mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
  //             Full Screen Required
  //           </h2>

  //           {/* Warning message */}
  //           {warningMessage && (
  //             <div className="mb-6 p-4 bg-gradient-to-r from-purple-900/50 to-blue-900/50 border border-purple-700 rounded-xl">
  //               <div className="flex items-center">
  //                 <AlertCircle className="w-5 h-5 text-purple-400 mr-3 flex-shrink-0" />
  //                 <p className="text-sm text-purple-200 font-medium">{warningMessage}</p>
  //               </div>
  //             </div>
  //           )}

  //           {/* Instructions */}
  //           <div className="mb-8 space-y-4">
  //             <p className="text-blue-200 text-center text-lg">
  //               This interview requires full screen mode for security and focus.
  //             </p>
              
  //             <div className="bg-gradient-to-r from-gray-800/50 to-blue-900/30 rounded-xl p-5 border border-blue-800/50">
  //               <p className="font-bold text-blue-300 mb-3 text-lg">Important Instructions:</p>
  //               <ul className="space-y-2.5">
  //                 <li className="flex items-center text-gray-300">
  //                   <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
  //                   <span>You cannot exit until you click Submit</span>
  //                 </li>
  //                 <li className="flex items-center text-gray-300">
  //                   <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
  //                   <span>Tab switching is not allowed</span>
  //                 </li>
  //                 <li className="flex items-center text-gray-300">
  //                   <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
  //                   <span>Right-click is disabled</span>
  //                 </li>
  //                 <li className="flex items-center text-gray-300">
  //                   <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
  //                   <span>Keyboard shortcuts are blocked</span>
  //                 </li>
  //                 <li className="flex items-center text-gray-300">
  //                   <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
  //                   <span>Developer tools are restricted</span>
  //                 </li>
  //               </ul>
  //             </div>
  //           </div>

  //           {/* Buttons */}
  //           <div className="flex gap-4">
  //             <button
  //               onClick={handleGoBack}
  //               className="flex-1 px-6 py-4 bg-gradient-to-r from-gray-800 to-gray-900 border border-blue-800 rounded-xl text-blue-200 hover:from-gray-700 hover:to-gray-800 transition-all duration-300 flex items-center justify-center gap-3 font-bold text-lg hover:border-blue-600"
  //             >
  //               <ArrowLeft className="w-5 h-5" />
  //               Go Back
  //             </button>
  //             <button
  //               onClick={enterFullscreen}
  //               className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-700 to-purple-700 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 flex items-center justify-center gap-3 font-bold text-lg shadow-lg hover:shadow-blue-500/25"
  //             >
  //               <Maximize2 className="w-5 h-5" />
  //               Enter Fullscreen
  //             </button>
  //           </div>
  //         </div>
  //       </div>
  //     )}

      {/* Interview Content */}
      {/* <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-blue-800 rounded-2xl shadow-2xl p-10">
          <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Interview Session
          </h1>
          
          <div className="space-y-8">
            <div>
              <label className="block text-lg font-semibold text-blue-300 mb-3">
                Question 1: Tell us about yourself
              </label>
              <textarea
                className="w-full px-5 py-4 bg-gray-800/50 border-2 border-blue-700/50 rounded-xl text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:outline-none transition-all"
                rows="5"
                placeholder="Type your answer here..."
                disabled={!isFullscreen}
              />
            </div>

            <div>
              <label className="block text-lg font-semibold text-blue-300 mb-3">
                Question 2: What are your strengths?
              </label>
              <textarea
                className="w-full px-5 py-4 bg-gray-800/50 border-2 border-blue-700/50 rounded-xl text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:outline-none transition-all"
                rows="5"
                placeholder="Type your answer here..."
                disabled={!isFullscreen}
              />
            </div>

            <div>
              <label className="block text-lg font-semibold text-blue-300 mb-3">
                Question 3: Why do you want this position?
              </label>
              <textarea
                className="w-full px-5 py-4 bg-gray-800/50 border-2 border-blue-700/50 rounded-xl text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:outline-none transition-all"
                rows="5"
                placeholder="Type your answer here..."
                disabled={!isFullscreen}
              />
            </div>

            <div className="flex justify-between items-center pt-8 border-t border-blue-800/50">
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-3 ${isFullscreen ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}></div>
                <p className="text-gray-300 font-medium">
                  {isFullscreen ? '✓ Fullscreen mode active - Secure' : '⚠ Fullscreen required for input'}
                </p>
              </div>
              <button
                onClick={handleSubmit}
                disabled={!isFullscreen}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-500 hover:to-purple-500 disabled:from-gray-800 disabled:to-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed transition-all duration-300 font-bold text-lg shadow-lg disabled:shadow-none"
              >
                Submit Interview
              </button>
            </div>
          </div>
        </div>
      </div> */}
    {/* </div> */}
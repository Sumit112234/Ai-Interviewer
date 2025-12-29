import React, { useState, useEffect } from 'react';
import { Clock, AlertCircle } from 'lucide-react';

const InterviewTimer = ({ resetTime,initialSeconds = -1, onTimesUp, isInterviewStarted }) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isWarning, setIsWarning] = useState(false);
  const [isCritical, setIsCritical] = useState(false);

  console.log('InterviewTimer rendered with initialSeconds:', initialSeconds);

  useEffect(() => {
    setSeconds(initialSeconds);
     setIsWarning(false);
      setIsCritical(false);
  }, [resetTime]);

  useEffect(() => {
    // Warning state when 30 seconds or less
    setIsWarning(seconds <= 30 && seconds > 10);
    // Critical state when 10 seconds or less
    setIsCritical(seconds <= 10 && seconds > 0);

    if (seconds === 0 && isInterviewStarted) {
      onTimesUp?.();
      return;
    }

    const timer = setInterval(() => {
      setSeconds(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds]);

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return {
      minutes: mins,
      seconds: secs,
      display: `${mins}:${secs.toString().padStart(2, '0')}`
    };
  };

  const time = formatTime(seconds);
  
  if (initialSeconds < 0) {
    return null; // Don't render if no timer is set
  } 
  const progress = (seconds / initialSeconds) * 100;

  return (
    <div className={`
      relative flex items-center gap-2 px-4 py-2 rounded-lg border backdrop-blur-sm
      transition-all duration-300
      ${isCritical ? 'bg-red-500/20 border-red-500/50 animate-pulse' : 
        isWarning ? 'bg-yellow-500/20 border-yellow-500/50' : 
        'bg-white/10 border-white/20'}
    `}>
      {/* Progress bar background */}
      <div className="absolute inset-0 overflow-hidden rounded-lg">
        <div 
          className={`
            h-full transition-all duration-1000 ease-linear
            ${isCritical ? 'bg-red-500/30' : 
              isWarning ? 'bg-yellow-500/30' : 
              'bg-blue-500/30'}
          `}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center gap-2">
        {isCritical ? (
          <AlertCircle className={`h-4 w-4 text-red-400 animate-bounce`} />
        ) : (
          <Clock className={`h-4 w-4 ${isWarning ? 'text-yellow-400' : 'text-white'}`} />
        )}
        
        <div className="flex items-baseline gap-1">
          <span className={`
            font-mono text-lg font-bold
            ${isCritical ? 'text-red-300' : 
              isWarning ? 'text-yellow-300' : 
              'text-white'}
          `}>
            {time.display}
          </span>
          <span className={`
            text-xs
            ${isCritical ? 'text-red-400' : 
              isWarning ? 'text-yellow-400' : 
              'text-white/70'}
          `}>
            left
          </span>
        </div>
      </div>

      {/* Pulse effect for critical state */}
      {isCritical && (
        <div className="absolute inset-0 rounded-lg border-2 border-red-500 animate-ping opacity-75" />
      )}
    </div>
  );
};

// Demo Component
const interviewTimerr = () => {
  const [timerSeconds, setTimerSeconds] = useState(190);
  const [key, setKey] = useState(0);

  const handleTimesUp = () => {
    alert('Time is up!');
    console.log('Timer completed - calling timesUp function');
  };

  const resetTimer = (seconds) => {
    setTimerSeconds(seconds);
    setKey(prev => prev + 1); // Force remount
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-white mb-8">Interview Timer Demo</h1>
        
        {/* Header Example */}
        <header className="border-b border-white/10 bg-black/20 backdrop-blur-md rounded-lg">
          <div className="container mx-auto px-4 py-3">
            <div className="flex justify-between items-center">
              <button className="text-white hover:bg-white/10 px-4 py-2 rounded transition-all duration-200">
                ← Exit Interview
              </button>

              <div className="flex items-center space-x-4">
                {/* Your existing components here */}
                <div className="text-white/70 text-sm">Question 3 of 5</div>
                
                {/* Timer Component */}
                <InterviewTimerr 
                  key={key}
                  initialSeconds={timerSeconds} 
                  onTimesUp={handleTimesUp}
                />
              </div>
            </div>
          </div>
        </header>

        {/* Controls */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold text-white mb-4">Test Different Times</h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => resetTimer(190)}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition"
            >
              3:10 (190s)
            </button>
            <button
              onClick={() => resetTimer(60)}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition"
            >
              1:00 (60s)
            </button>
            <button
              onClick={() => resetTimer(30)}
              className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition"
            >
              0:30 (Warning)
            </button>
            <button
              onClick={() => resetTimer(10)}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
            >
              0:10 (Critical)
            </button>
            <button
              onClick={() => resetTimer(5)}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
            >
              0:05 (Final)
            </button>
          </div>
        </div>

        {/* Features */}
        <div className="bg-white/5 backdrop-blur-md rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Features</h2>
          <ul className="text-white/80 space-y-2 list-disc list-inside">
            <li>Displays time in MM:SS format (e.g., 3:10 for 190 seconds)</li>
            <li>Animated progress bar showing remaining time</li>
            <li>Warning state (yellow) at 30 seconds or less</li>
            <li>Critical state (red) with pulse animation at 10 seconds or less</li>
            <li>Calls <code className="bg-white/10 px-2 py-1 rounded">onTimesUp</code> function when timer reaches zero</li>
            <li>Smooth transitions and real-time countdown</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default InterviewTimer;
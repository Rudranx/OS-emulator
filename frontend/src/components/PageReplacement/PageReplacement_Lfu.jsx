import React, { useState, useEffect, useRef } from 'react';

const LFUPageReplacement = () => {
  const [pageSequence, setPageSequence] = useState([6, 7, 8, 9, 6, 7, 1, 6, 7, 8, 9, 1, 7, 9, 6]);
  const [inputSequence, setInputSequence] = useState("6, 7, 8, 9, 6, 7, 1, 6, 7, 8, 9, 1, 7, 9, 6");
  const [frameCount, setFrameCount] = useState(3);
  const [currentStep, setCurrentStep] = useState(-1);
  const [animationSpeed, setAnimationSpeed] = useState('normal');
  const [isRunning, setIsRunning] = useState(false);
  const [replacementHistory, setReplacementHistory] = useState([]);
  const animationRef = useRef(null);

  const speedValues = {
    slow: 1500,
    normal: 800,
    fast: 300
  };

  const processStep = (step) => {
    if (step >= pageSequence.length) {
      setIsRunning(false);
      return;
    }

    const page = pageSequence[step];
    const newHistory = [...replacementHistory];
    
    // Current state from previous step or initialize new state
    const prevState = step > 0 ? {...newHistory[step - 1]} : {
      frames: Array(frameCount).fill(null),
      frequencies: {},
      lastUsed: {}
    };
    
    // Create deep copies to avoid reference issues
    const currentFrames = [...prevState.frames];
    const frequencies = {...prevState.frequencies};
    const lastUsed = {...prevState.lastUsed};
    
    let pageFault = false;

    // Check if page is already in frames
    const pageIndex = currentFrames.indexOf(page);
    
    if (pageIndex === -1) {
      // Page Fault
      pageFault = true;
      
      // Look for empty frame first
      const emptyIndex = currentFrames.indexOf(null);
      
      if (emptyIndex !== -1) {
        // Empty frame available
        currentFrames[emptyIndex] = page;
        frequencies[page] = 1;
        lastUsed[page] = step;
      } else {
        // All frames are full, need to find victim using LFU policy
        let minFreq = Infinity;
        let victimIndex = -1;
        let oldestAccess = Infinity;
        
        // Find frame with minimum frequency
        // If tie, use LRU as tie-breaker
        for (let i = 0; i < currentFrames.length; i++) {
          const framePageId = currentFrames[i];
          const freq = frequencies[framePageId];
          
          if (freq < minFreq || (freq === minFreq && lastUsed[framePageId] < oldestAccess)) {
            minFreq = freq;
            victimIndex = i;
            oldestAccess = lastUsed[framePageId];
          }
        }
        
        // Replace victim page
        const victimPage = currentFrames[victimIndex];
        delete frequencies[victimPage]; // Remove frequency of replaced page
        delete lastUsed[victimPage];   // Remove last used of replaced page
        
        // Add new page
        currentFrames[victimIndex] = page;
        frequencies[page] = 1;
        lastUsed[page] = step;
      }
    } else {
      // Page Hit - just update frequency and last used time
      frequencies[page]++;
      lastUsed[page] = step;
    }

    // Record this step in history
    newHistory[step] = {
      page,
      frames: [...currentFrames],
      pageFault,
      frequencies: {...frequencies},
      lastUsed: {...lastUsed}
    };

    setReplacementHistory(newHistory);
    setCurrentStep(step);
  };

  useEffect(() => {
    if (isRunning && currentStep < pageSequence.length - 1) {
      animationRef.current = setTimeout(() => {
        processStep(currentStep + 1);
      }, speedValues[animationSpeed]);

      return () => clearTimeout(animationRef.current);
    }
  }, [isRunning, currentStep, pageSequence.length, animationSpeed]);

  const startAnimation = () => {
    if (currentStep >= pageSequence.length - 1) {
      setCurrentStep(-1);
      setReplacementHistory([]);
      setTimeout(() => {
        setIsRunning(true);
        processStep(0);
      }, 100);
    } else {
      setIsRunning(true);
      processStep(currentStep + 1);
    }
  };

  const stopAnimation = () => {
    setIsRunning(false);
    clearTimeout(animationRef.current);
  };

  const resetAnimation = () => {
    setIsRunning(false);
    clearTimeout(animationRef.current);
    setCurrentStep(-1);
    setReplacementHistory([]);
  };

  const handleSequenceChange = (e) => {
    setInputSequence(e.target.value);
  };

  const applySequence = () => {
    const newSequence = inputSequence
      .split(',')
      .map(num => parseInt(num.trim()))
      .filter(num => !isNaN(num));

    if (newSequence.length > 0) {
      setPageSequence(newSequence);
      resetAnimation();
    } else {
      alert("Please enter valid numbers separated by commas");
    }
  };

  const handleFrameCountChange = (e) => {
    const count = parseInt(e.target.value);
    setFrameCount(count > 0 ? count : 1);
    resetAnimation();
  };

  // Calculate hit/miss stats
  const totalRequests = replacementHistory.length;
  const totalFaults = replacementHistory.filter(item => item.pageFault).length;
  const faultRate = totalRequests > 0 ? (totalFaults / totalRequests) * 100 : 0;
  const hitRate = totalRequests > 0 ? 100 - faultRate : 0;

  return (
    <div className="p-6 max-w-4xl mx-auto text-white bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-center">LFU Page Replacement Algorithm</h1>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1">Page Reference Sequence</label>
          <div className="flex">
            <input 
              type="text" 
              value={inputSequence} 
              onChange={handleSequenceChange}
              className="flex-grow p-2 bg-gray-800 border border-gray-600 rounded-l"
            />
            <button 
              onClick={applySequence}
              className="px-4 py-2 bg-blue-600 text-white rounded-r"
            >Apply</button>
          </div>
        </div>
        <div>
          <label className="block mb-1">Number of Frames</label>
          <input 
            type="number" 
            value={frameCount} 
            onChange={handleFrameCountChange}
            min="1"
            className="w-full p-2 bg-gray-800 border border-gray-600 rounded"
          />
        </div>
      </div>

      <div className="mb-6">
        <label className="block mb-1">Animation Speed</label>
        <div className="flex space-x-4">
          {['slow', 'normal', 'fast'].map(speed => (
            <button
              key={speed}
              onClick={() => setAnimationSpeed(speed)}
              className={`px-4 py-2 rounded ${animationSpeed === speed 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-gray-300'}`}
            >
              {speed.charAt(0).toUpperCase() + speed.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6 flex space-x-4">
        <button
          onClick={startAnimation}
          disabled={isRunning}
          className={`px-4 py-2 rounded bg-green-600 text-white ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {currentStep === -1 ? 'Start' : 'Resume'}
        </button>
        <button
          onClick={stopAnimation}
          disabled={!isRunning}
          className={`px-4 py-2 rounded bg-red-600 text-white ${!isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Stop
        </button>
        <button
          onClick={resetAnimation}
          className="px-4 py-2 bg-gray-600 text-white rounded"
        >
          Reset
        </button>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Memory Frames</h2>
        <div className="flex space-x-2 mb-4">
          {Array(frameCount).fill(null).map((_, idx) => (
            <div key={idx} className="p-2 w-20 text-center border border-gray-700 rounded bg-gray-800">
              Frame {idx + 1}
            </div>
          ))}
        </div>
        <div className="flex space-x-2">
          {currentStep >= 0 && replacementHistory[currentStep]?.frames.map((frame, idx) => (
            <div 
              key={idx} 
              className={`p-2 w-20 text-center border rounded ${
                frame === null 
                  ? 'bg-gray-700 border-gray-600' 
                  : frame === replacementHistory[currentStep].page
                    ? replacementHistory[currentStep].pageFault
                      ? 'bg-green-700 border-green-500' 
                      : 'bg-blue-600 border-blue-400'
                    : 'bg-blue-800 border-blue-600'
              }`}
            >
              {frame !== null ? (
                <>
                  <div className="text-lg font-bold">{frame}</div>
                  {replacementHistory[currentStep].frequencies && (
                    <div className="text-xs mt-1">
                      Count: {replacementHistory[currentStep].frequencies[frame]}
                    </div>
                  )}
                </>
              ) : '-'}
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-3">Page Request History</h2>
        <div className="border border-gray-700 rounded overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-800">
                <th className="py-2 px-4 border-b text-left">Step</th>
                <th className="py-2 px-4 border-b text-left">Page</th>
                <th className="py-2 px-4 border-b text-left">Memory State</th>
                <th className="py-2 px-4 border-b text-left">Frequency Counts</th>
                <th className="py-2 px-4 border-b text-left">Page Fault</th>
              </tr>
            </thead>
            <tbody>
              {replacementHistory.map((item, idx) => (
                <tr 
                  key={idx} 
                  className={idx === currentStep ? 'bg-yellow-900' : 'hover:bg-gray-800'}
                >
                  <td className="py-2 px-4 border-b">{idx + 1}</td>
                  <td className="py-2 px-4 border-b">{item.page}</td>
                  <td className="py-2 px-4 border-b">
                    <div className="flex space-x-2">
                      {item.frames.map((frame, frameIdx) => (
                        <div 
                          key={frameIdx} 
                          className={`px-2 py-1 text-center rounded ${
                            frame === null 
                              ? 'bg-gray-700' 
                              : frame === item.page && item.pageFault 
                                ? 'bg-green-700 border border-green-500' 
                                : 'bg-blue-700 border-blue-500'
                          }`}
                        >
                          {frame !== null ? frame : '-'}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="py-2 px-4 border-b">
                    {item.frames.map((frame, i) => (
                      frame !== null && (
                        <span key={i} className="mr-2">
                          {frame}: {item.frequencies[frame]}
                        </span>
                      )
                    ))}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {item.pageFault ? (
                      <span className="text-red-400 font-medium">Miss</span>
                    ) : (
                      <span className="text-green-400 font-medium">Hit</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {replacementHistory.length > 0 && (
          <div className="mt-4 p-4 bg-gray-800 rounded">
            <p className="font-medium">
              Total Page Faults: {totalFaults} ({faultRate.toFixed(2)}%)
            </p>
            <p className="font-medium">
              Total Page Hits: {totalRequests - totalFaults} ({hitRate.toFixed(2)}%)
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LFUPageReplacement;
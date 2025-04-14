import React, { useState, useEffect, useRef } from 'react';

const SecondChancePageReplacement = () => {
  const [pageSequence, setPageSequence] = useState([2, 5, 10, 1, 2, 2, 6, 9, 1, 2, 10, 2, 6, 1, 2, 1, 6, 9, 5, 1]);
  const [inputSequence, setInputSequence] = useState("2, 5, 10, 1, 2, 2, 6, 9, 1, 2, 10, 2, 6, 1, 2, 1, 6, 9, 5, 1");
  const [frameCount, setFrameCount] = useState(3);
  const [currentStep, setCurrentStep] = useState(-1);
  const [animationSpeed, setAnimationSpeed] = useState('normal');
  const [isRunning, setIsRunning] = useState(false);
  const [replacementHistory, setReplacementHistory] = useState([]);
  const [frames, setFrames] = useState(Array(3).fill(null));
  const [referenceBits, setReferenceBits] = useState(Array(3).fill(0));
  const [pointer, setPointer] = useState(0);
  const [newFrameIndex, setNewFrameIndex] = useState(null);
  const animationRef = useRef(null);

  const speedValues = {
    slow: 1500,
    normal: 800,
    fast: 300
  };

  useEffect(() => {
    resetAnimation();
  }, [frameCount]);

  const processStep = (step) => {
    if (step >= pageSequence.length) {
      setIsRunning(false);
      return;
    }

    const page = pageSequence[step];
    let newFrames = [...frames];
    let newRefBits = [...referenceBits];
    let newPointer = pointer;
    let pageFault = false;
    let newFrameIdx = null;

    const pageIndex = newFrames.indexOf(page);
    
    if (pageIndex !== -1) {
      // Page hit - set reference bit to 1
      newRefBits[pageIndex] = 1;
    } else {
      // Page fault
      pageFault = true;
      const emptyIndex = newFrames.findIndex(frame => frame === null);
      
      if (emptyIndex !== -1) {
        // Fill empty frame first
        newFrameIdx = emptyIndex;
        newFrames[emptyIndex] = page;
        newRefBits[emptyIndex] = 0;  // Initialize reference bit to 0 for new page
      } else {
        // Apply Second Chance algorithm
        // Find the first frame with reference bit 0
        let victimFound = false;
        let initialPointer = newPointer;
        
        do {
          if (newRefBits[newPointer] === 0) {
            // Found a victim with reference bit 0
            newFrameIdx = newPointer;
            newFrames[newPointer] = page;
            newRefBits[newPointer] = 0;  // Initialize reference bit to 0 for new page
            victimFound = true;
            // Move pointer to next position for future replacements
            newPointer = (newPointer + 1) % frameCount;
            break;
          } else {
            // Give second chance - reset reference bit to 0
            newRefBits[newPointer] = 0;
            // Move pointer to next position
            newPointer = (newPointer + 1) % frameCount;
          }
        } while (newPointer !== initialPointer && !victimFound);
        
        // If all frames had reference bit 1 and were given second chance,
        // we'll replace the current pointer position (which now has ref bit 0)
        if (!victimFound) {
          newFrameIdx = newPointer;
          newFrames[newPointer] = page;
          newRefBits[newPointer] = 0;  // Initialize reference bit to 0 for new page
          newPointer = (newPointer + 1) % frameCount;
        }
      }
    }

    const newHistory = [...replacementHistory];
    newHistory[step] = {
      page,
      frames: [...newFrames],
      referenceBits: [...newRefBits],
      pointer: newPointer,
      pageFault,
      newFrameIndex: newFrameIdx
    };

    setFrames(newFrames);
    setReferenceBits(newRefBits);
    setPointer(newPointer);
    setReplacementHistory(newHistory);
    setCurrentStep(step);
    setNewFrameIndex(newFrameIdx);
  };

  useEffect(() => {
    if (isRunning && currentStep < pageSequence.length - 1) {
      animationRef.current = setTimeout(() => {
        processStep(currentStep + 1);
      }, speedValues[animationSpeed]);
      return () => clearTimeout(animationRef.current);
    }
  }, [isRunning, currentStep, animationSpeed]);

  const startAnimation = () => {
    if (currentStep >= pageSequence.length - 1) {
      setCurrentStep(-1);
      setReplacementHistory([]);
      setFrames(Array(frameCount).fill(null));
      setReferenceBits(Array(frameCount).fill(0));
      setPointer(0);
      setNewFrameIndex(null);
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
    setFrames(Array(frameCount).fill(null));
    setReferenceBits(Array(frameCount).fill(0));
    setPointer(0);
    setNewFrameIndex(null);
  };

  const handleSequenceChange = (e) => setInputSequence(e.target.value);

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
  };

  const getFrameColor = (index) => {
    if (currentStep >= 0 && replacementHistory[currentStep]) {
      const currentHistory = replacementHistory[currentStep];
      if (index === currentHistory.newFrameIndex) {
        return "border-green-500 bg-green-700";
      }
    }
    
    if (pointer === index) {
      return "border-yellow-400 bg-gray-800";
    }
    
    return frames[index] !== null ? "border-blue-500 bg-gray-800" : "border-gray-700 bg-gray-800";
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-gray-900 text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Second Chance Page Replacement</h1>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block mb-1">Page Reference Sequence</label>
          <div className="flex">
            <input
              type="text"
              value={inputSequence}
              onChange={handleSequenceChange}
              className="flex-grow p-2 rounded-l bg-gray-800 border border-gray-600 text-white"
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
            className="w-full p-2 rounded bg-gray-800 border border-gray-600 text-white"
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
              className={`px-4 py-2 rounded ${animationSpeed === speed ? 'bg-blue-600' : 'bg-gray-700'}`}
            >
              {speed.charAt(0).toUpperCase() + speed.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="flex space-x-4 mb-6">
        <button
          onClick={startAnimation}
          disabled={isRunning}
          className="px-4 py-2 rounded bg-green-600 text-white disabled:opacity-50"
        >
          {currentStep === -1 ? 'Start' : 'Resume'}
        </button>
        <button
          onClick={stopAnimation}
          disabled={!isRunning}
          className="px-4 py-2 rounded bg-red-600 text-white disabled:opacity-50"
        >
          Stop
        </button>
        <button
          onClick={resetAnimation}
          className="px-4 py-2 rounded bg-gray-600 text-white"
        >
          Reset
        </button>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Memory Frames</h2>
        <div className="flex space-x-4">
          {frames.map((frame, idx) => (
            <div
              key={idx}
              className={`p-2 w-28 text-center border rounded-xl shadow-md transition-all duration-300 ${getFrameColor(idx)}`}
            >
              <div className="text-lg font-semibold">
                {frame !== null ? frame : '-'}
              </div>
              <div className="text-sm text-gray-400">Ref: {referenceBits[idx]}</div>
              {pointer === idx && (
                <div className="mt-1 text-yellow-300 text-xs font-bold">← Pointer</div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-3">Page Request History</h2>
        <div className="overflow-x-auto border rounded border-gray-700">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-800">
              <tr>
                <th className="p-2 text-left">Step</th>
                <th className="p-2 text-left">Page</th>
                <th className="p-2 text-left">Frames</th>
                <th className="p-2 text-left">Ref Bits</th>
                <th className="p-2 text-left">Pointer</th>
                <th className="p-2 text-left">Page Fault</th>
              </tr>
            </thead>
            <tbody>
              {replacementHistory.map((item, idx) => (
                <tr key={idx} className={idx === currentStep ? 'bg-yellow-700' : 'bg-gray-900'}>
                  <td className="p-2">{idx + 1}</td>
                  <td className="p-2">{item.page}</td>
                  <td className="p-2">
                    <div className="flex space-x-1">
                      {item.frames.map((f, i) => (
                        <span 
                          key={i} 
                          className={`px-2 py-1 rounded border ${i === item.newFrameIndex ? 'bg-green-700 border-green-500' : f !== null ? 'bg-blue-700 border-blue-500' : 'bg-gray-800 border-gray-700'}`}
                        >
                          {f !== null ? f : '-'}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-2">{item.referenceBits.join(', ')}</td>
                  <td className="p-2">{item.pointer}</td>
                  <td className="p-2">
                    {item.pageFault ? <span className="text-red-400">Miss</span> : <span className="text-green-400">Hit</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {replacementHistory.length > 0 && (
          <div className="mt-4 p-4 bg-gray-800 rounded">
            <p>Total Page Faults: {replacementHistory.filter(item => item.pageFault).length}</p>
            <p>Page Fault Rate: {((replacementHistory.filter(item => item.pageFault).length / replacementHistory.length) * 100).toFixed(2)}%</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SecondChancePageReplacement;
import React, { useState, useEffect, useRef } from 'react';

const OptimalPageReplacement = () => {
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

  const findOptimalPage = (frames, sequence, currentIndex) => {
    let farthest = -1;
    let pageToReplace = -1;

    for (let i = 0; i < frames.length; i++) {
      let j;
      for (j = currentIndex + 1; j < sequence.length; j++) {
        if (frames[i] === sequence[j]) {
          if (j > farthest) {
            farthest = j;
            pageToReplace = i;
          }
          break;
        }
      }
      if (j === sequence.length) {
        return i;
      }
    }

    return pageToReplace === -1 ? 0 : pageToReplace;
  };

  const processStep = (step) => {
    if (step >= pageSequence.length) {
      setIsRunning(false);
      return;
    }

    const page = pageSequence[step];
    const newHistory = [...replacementHistory];
    const currentFrames = step > 0 ? [...newHistory[step - 1].frames] : Array(frameCount).fill(null);
    let pageFault = false;

    if (!currentFrames.includes(page)) {
      pageFault = true;
      const emptyFrameIndex = currentFrames.indexOf(null);
      if (emptyFrameIndex !== -1) {
        currentFrames[emptyFrameIndex] = page;
      } else {
        const replaceIndex = findOptimalPage(currentFrames, pageSequence, step);
        currentFrames[replaceIndex] = page;
      }
    }

    newHistory[step] = {
      page,
      frames: [...currentFrames],
      pageFault
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

  return (
    <div className="bg-gray-900 min-h-screen text-white p-10">
      <div className="max-w-5xl mx-auto space-y-10">
        <h1 className="text-3xl font-bold text-blue-400">Optimal Page Replacement Algorithm</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 text-gray-300">Page Reference Sequence</label>
            <div className="flex">
              <input
                type="text"
                value={inputSequence}
                onChange={handleSequenceChange}
                className="flex-grow p-3 bg-gray-800 border border-gray-700 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={applySequence}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 transition rounded-r text-white"
              >
                Apply
              </button>
            </div>
          </div>

          <div>
            <label className="block mb-2 text-gray-300">Number of Frames</label>
            <input
              type="number"
              value={frameCount}
              onChange={handleFrameCountChange}
              min="1"
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block mb-2 text-gray-300">Animation Speed</label>
          <div className="flex space-x-4">
            {['slow', 'normal', 'fast'].map(speed => (
              <button
                key={speed}
                onClick={() => setAnimationSpeed(speed)}
                className={`px-4 py-2 rounded font-medium transition ${
                  animationSpeed === speed
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {speed.charAt(0).toUpperCase() + speed.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={startAnimation}
            disabled={isRunning}
            className={`px-5 py-2 font-semibold rounded bg-green-600 hover:bg-green-500 transition ${
              isRunning && 'opacity-50 cursor-not-allowed'
            }`}
          >
            {currentStep === -1 ? 'Start' : 'Resume'}
          </button>
          <button
            onClick={stopAnimation}
            disabled={!isRunning}
            className={`px-5 py-2 font-semibold rounded bg-red-600 hover:bg-red-500 transition ${
              !isRunning && 'opacity-50 cursor-not-allowed'
            }`}
          >
            Stop
          </button>
          <button
            onClick={resetAnimation}
            className="px-5 py-2 font-semibold rounded bg-gray-600 hover:bg-gray-500 transition"
          >
            Reset
          </button>
        </div>

        <div>
          <h2 className="text-xl font-bold text-blue-300 mb-4">Memory Frames</h2>
          <div className="flex space-x-4 mb-4">
            {Array(frameCount).fill(null).map((_, idx) => (
              <div key={idx} className="p-3 w-20 text-center bg-gray-800 border border-gray-600 rounded">
                Frame {idx + 1}
              </div>
            ))}
          </div>
          <div className="flex space-x-4">
            {currentStep >= 0 &&
              replacementHistory[currentStep]?.frames.map((frame, idx) => (
                <div
                  key={idx}
                  className={`p-3 w-20 text-center rounded transition duration-300 ${
                    frame === null
                      ? 'bg-gray-700 border border-gray-600'
                      : 'bg-blue-800 text-blue-200 border border-blue-400'
                  }`}
                >
                  {frame !== null ? frame : '-'}
                </div>
              ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-blue-300 mb-4">Page Request History</h2>
          <div className="border border-gray-700 rounded overflow-hidden">
            <table className="min-w-full table-auto">
              <thead className="bg-gray-800 text-gray-300">
                <tr>
                  <th className="py-2 px-4 border-b border-gray-600 text-left">Step</th>
                  <th className="py-2 px-4 border-b border-gray-600 text-left">Page</th>
                  <th className="py-2 px-4 border-b border-gray-600 text-left">Memory State</th>
                  <th className="py-2 px-4 border-b border-gray-600 text-left">Page Fault</th>
                </tr>
              </thead>
              <tbody>
                {replacementHistory.map((item, idx) => (
                  <tr
                    key={idx}
                    className={`transition duration-200 ${
                      idx === currentStep ? 'bg-yellow-500/20' : 'hover:bg-gray-700'
                    }`}
                  >
                    <td className="py-2 px-4 border-b border-gray-700">{idx + 1}</td>
                    <td className="py-2 px-4 border-b border-gray-700">{item.page}</td>
                    <td className="py-2 px-4 border-b border-gray-700">
                      <div className="flex space-x-2">
                        {item.frames.map((frame, frameIdx) => (
                          <div
                            key={frameIdx}
                            className={`px-2 py-1 rounded text-center text-sm ${
                              frame === null
                                ? 'bg-gray-700'
                                : frame === item.page && item.pageFault
                                  ? 'bg-green-700 border border-green-400'
                                  : 'bg-blue-700 border border-blue-500'
                            }`}
                          >
                            {frame !== null ? frame : '-'}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="py-2 px-4 border-b border-gray-700">
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
            <div className="mt-6 p-4 bg-gray-800 rounded border border-gray-700">
              <p className="font-medium text-white">
                Total Page Faults: {replacementHistory.filter(item => item.pageFault).length}
              </p>
              <p className="font-medium text-white">
                Page Fault Rate:{' '}
                {(
                  (replacementHistory.filter(item => item.pageFault).length / replacementHistory.length) *
                  100
                ).toFixed(2)}
                %
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OptimalPageReplacement;

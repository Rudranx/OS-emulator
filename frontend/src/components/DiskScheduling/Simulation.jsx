import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaHome, FaPlay, FaPause, FaRedo } from 'react-icons/fa';
import Select from 'react-select';

const Simulation = ({ algorithm, onBackClick, onHomeClick }) => {
  const [requests, setRequests] = useState([]);
  const [initialPosition, setInitialPosition] = useState(50);
  const [newRequest, setNewRequest] = useState('');
  const [maxTrack, setMaxTrack] = useState(199);
  const [results, setResults] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [simulationSpeed, setSimulationSpeed] = useState(1000); // ms per step
  const [simulationInterval, setSimulationInterval] = useState(null);
  const [sequence, setSequence] = useState([]);
  const [totalSeekTime, setTotalSeekTime] = useState(0);
  const [direction, setDirection] = useState('right'); // Add direction state
  const [currentPosition, setCurrentPosition] = useState(initialPosition);
  const [stepMovement, setStepMovement] = useState(0);
  const [totalMovement, setTotalMovement] = useState(0);

  useEffect(() => {
    resetSimulation();
  }, [algorithm]);

  useEffect(() => {
    return () => {
      if (simulationInterval) {
        clearInterval(simulationInterval);
      }
    };
  }, [simulationInterval]);

  const resetSimulation = () => {
    if (simulationInterval) {
      clearInterval(simulationInterval);
      setSimulationInterval(null);
    }
    setRequests([]);
    setInitialPosition(50);
    setResults(null);
    setIsSimulating(false);
    setIsPaused(false);
    setCurrentStep(0);
    setSequence([]);
    setTotalSeekTime(0);
    setCurrentPosition(initialPosition);
    setStepMovement(0);
    setTotalMovement(0);
    setDirection('right');
  };

  const calculateSequence = () => {
    let seq = [];
    let total = 0;
    let current = initialPosition;

    const calculateSeekTime = (sequence) => {
      let seekTime = 0;
      let pos = initialPosition;
      for (const nextPos of sequence) {
        seekTime += Math.abs(nextPos - pos);
        pos = nextPos;
      }
      return seekTime;
    };

    switch (algorithm.id) {
      case 'fcfs':
        seq = [...requests];
        total = calculateSeekTime(seq);
        break;

      case 'sstf':
        const remaining = [...requests];
        current = initialPosition;
        while (remaining.length > 0) {
          const closest = remaining.reduce((prev, curr) => {
            return Math.abs(curr - current) < Math.abs(prev - current) ? curr : prev;
          });
          seq.push(closest);
          current = closest;
          remaining.splice(remaining.indexOf(closest), 1);
        }
        total = calculateSeekTime(seq);
        break;

        case 'scan':
          const scanSorted = [...requests].sort((a, b) => a - b);
          if (direction === 'right') {
            const greater = scanSorted.filter(x => x >= initialPosition);
            const lesser = scanSorted.filter(x => x < initialPosition);
            // Always move to maxTrack when going right
            seq = [...greater];
            if (greater.length === 0 || Math.max(...greater) < maxTrack) {
              seq.push(maxTrack);
            }
            // Then reverse direction and handle lesser values
            if (lesser.length > 0) {
              seq = [...seq, ...lesser.reverse()];
            }
          } else {
            const lesser = scanSorted.filter(x => x <= initialPosition).sort((a, b) => b - a); // Sort in reverse
            const greater = scanSorted.filter(x => x > initialPosition);
            // Always move to 0 when going left
            seq = [...lesser];
            if (lesser.length === 0 || Math.min(...lesser) > 0) {
              seq.push(0);
            }
            // Then reverse direction and handle greater values
            if (greater.length > 0) {
              seq = [...seq, ...greater];
            }
          }
          total = calculateSeekTime(seq);
          break;
        
        case 'cscan':
          const cscanSorted = [...requests].sort((a, b) => a - b);
          if (direction === 'right') {
            const greater = cscanSorted.filter(x => x >= initialPosition);
            const lesser = cscanSorted.filter(x => x < initialPosition);
            // Move right to the end, then jump to start
            seq = [...greater];
            // Always include maxTrack when going right
            if (greater.length === 0 || Math.max(...greater) < maxTrack) {
              seq.push(maxTrack);
            }
            // Always go to 0 after maxTrack
            seq.push(0);
            // Then handle lesser values
            if (lesser.length > 0) {
              seq = [...seq, ...lesser];
            }
          } else {
            const lesser = cscanSorted.filter(x => x < initialPosition).sort((a, b) => b - a); // Sort in reverse
            const greater = cscanSorted.filter(x => x >= initialPosition).sort((a, b) => b - a); // Sort in reverse
            // Move left to the start, then jump to end
            seq = [...lesser];
            // Always include 0 when going left
            if (lesser.length === 0 || Math.min(...lesser) > 0) {
              seq.push(0);
            }
            // Always go to maxTrack after 0
            seq.push(maxTrack);
            // Then handle greater values in descending order
            if (greater.length > 0) {
              seq = [...seq, ...greater];
            }
          }
          total = calculateSeekTime(seq);
          break;

          case 'look':
    const lookSorted = [...requests].sort((a, b) => a - b);
    if (direction === 'right') {
        const greater = lookSorted.filter(x => x > initialPosition);
        const lesser = lookSorted.filter(x => x <= initialPosition);
        seq = greater.length > 0 ? [...greater, ...lesser.reverse()] : [...lesser.reverse()];
    } else { // left direction
        const lesser = lookSorted.filter(x => x < initialPosition).reverse();
        const greater = lookSorted.filter(x => x >= initialPosition);
        seq = lesser.length > 0 ? [...lesser, ...greater] : [...greater];
    }
    total = calculateSeekTime(seq);
    break;
        
            case 'clook':
              const clookSorted = [...requests].sort((a, b) => a - b);
              if (direction === 'right') {
                  const greater = clookSorted.filter(x => x > initialPosition);
                  const lesser = clookSorted.filter(x => x <= initialPosition);
                  seq = greater.length > 0 ? [...greater, ...lesser] : [...lesser];
              } else { // left direction
                  const lesser = clookSorted.filter(x => x < initialPosition).reverse();
                  const greater = clookSorted.filter(x => x >= initialPosition).reverse();
                  seq = lesser.length > 0 ? [...lesser, ...greater] : [...greater];
              }
              total = calculateSeekTime(seq);
              break;

      default:
        seq = [...requests];
        total = calculateSeekTime(seq);
    }

    setSequence(seq);
    setTotalSeekTime(total);
    return seq;
  };

  const startSimulation = () => {
    if (isPaused) {
      setIsPaused(false);
      continueSimulation();
      return;
    }

    setIsSimulating(true);
    const seq = calculateSequence();
    let step = 0;
    let lastPosition = initialPosition;
    setCurrentPosition(initialPosition);
    setTotalMovement(0);
    setStepMovement(0);

    const interval = setInterval(() => {
      if (step >= seq.length) {
        clearInterval(interval);
        setIsSimulating(false);
        setIsPaused(false);
        return;
      }

      setCurrentStep(step);
      const movement = Math.abs(seq[step] - lastPosition);
      setStepMovement(movement);
      setTotalMovement(prev => prev + movement);
      setCurrentPosition(seq[step]);
      lastPosition = seq[step];
      step++;
    }, simulationSpeed);

    setSimulationInterval(interval);
  };

  const handleAddRequest = () => {
    const value = parseInt(newRequest);
    if (!isNaN(value) && value >= 0 && value <= maxTrack && !requests.includes(value)) {
      setRequests([...requests, value]);
      setNewRequest('');
    }
  };

  const handleRandomRequests = () => {
    const count = 8;
    const newRequests = [];
    while (newRequests.length < count) {
      const randomRequest = Math.floor(Math.random() * (maxTrack + 1));
      if (!newRequests.includes(randomRequest) && randomRequest !== initialPosition) {
        newRequests.push(randomRequest);
      }
    }
    setRequests(newRequests);
  };

  const pauseSimulation = () => {
    if (simulationInterval) {
      clearInterval(simulationInterval);
      setSimulationInterval(null);
    }
    setIsPaused(true);
  };

  const continueSimulation = () => {
    const seq = sequence;
    let step = currentStep;

    const interval = setInterval(() => {
      if (step >= seq.length) {
        clearInterval(interval);
        setIsSimulating(false);
        setIsPaused(false);
        return;
      }

      setCurrentStep(step);
      const movement = Math.abs(currentPosition - seq[step]);
      setStepMovement(movement);
      setTotalMovement(prev => prev + movement);
      setCurrentPosition(seq[step]);
      step++;
    }, simulationSpeed);

    setSimulationInterval(interval);
  };

  const handleRemoveRequest = (index) => {
    setRequests(requests.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{algorithm.name} Simulation</h2>
          <p className="text-gray-600 mt-1">{algorithm.description}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onBackClick}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
          >
            Back
          </button>
          <button
            onClick={onHomeClick}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            <FaHome className="inline mr-2" />
            Home
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Configuration</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Initial Head Position (0-{maxTrack})
              </label>
              <input
                type="number"
                value={initialPosition}
                onChange={(e) => setInitialPosition(Number(e.target.value))}
                className="w-full p-2 border rounded"
                min="0"
                max={maxTrack}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Direction
              </label>
              <Select
                value={{ value: direction, label: direction.toUpperCase() }}
                onChange={(option) => setDirection(option.value)}
                options={[
                  { value: 'right', label: 'RIGHT' },
                  { value: 'left', label: 'LEFT' }
                ]}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Add Request (0-{maxTrack})
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={newRequest}
                  onChange={(e) => setNewRequest(e.target.value)}
                  className="flex-1 p-2 border rounded"
                  min="0"
                  max={maxTrack}
                />
                <button
                  onClick={handleAddRequest}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Add
                </button>
                <button
                  onClick={handleRandomRequests}
                  className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
                >
                  Random
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Request Queue</h4>
            <div className="flex flex-wrap gap-2">
              {requests.map((req, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full flex items-center gap-2"
                >
                  {req}
                  <button
                    onClick={() => handleRemoveRequest(index)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Simulation Controls</h3>
          <div className="space-y-4">
            <div className="flex gap-2">
              {!isSimulating ? (
                <button
                  onClick={startSimulation}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center gap-2"
                  disabled={requests.length === 0}
                >
                  <FaPlay />
                  Start
                </button>
              ) : (
                <>
                  <button
                    onClick={isPaused ? continueSimulation : pauseSimulation}
                    className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 flex items-center gap-2"
                  >
                    {isPaused ? <FaPlay /> : <FaPause />}
                    {isPaused ? 'Continue' : 'Pause'}
                  </button>
                </>
              )}
              <button
                onClick={resetSimulation}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 flex items-center gap-2"
              >
                <FaRedo />
                Reset
              </button>
            </div>

            {sequence.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Results</h4>
                <div className="space-y-2">
                  <p>Total Seek Time: {totalSeekTime}</p>
                  <p>Current Position: {currentPosition}</p>
                  <p>Step Movement: {stepMovement}</p>
                  <p>Total Movement: {totalMovement}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Visualization Area */}
      <div className="mt-6 bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Visualization</h3>
        <div className="relative h-[300px] w-full border rounded bg-white">
          {/* Track visualization */}
          <div className="absolute left-0 right-0 top-1/2 h-1 bg-gray-300" />
          
          {/* Request points */}
          {requests.map((req, index) => (
            <div
              key={index}
              className="absolute w-2 h-2 bg-blue-500 rounded-full transform -translate-x-1 -translate-y-1"
              style={{
                left: `${(req / maxTrack) * 100}%`,
                top: '50%',
              }}
            />
          ))}
          
          {/* Current head position */}
          <motion.div
            className="absolute w-4 h-4 bg-red-500 rounded-full transform -translate-x-2 -translate-y-2"
            style={{
              left: `${(currentPosition / maxTrack) * 100}%`,
              top: '50%',
            }}
            animate={{
              left: `${(currentPosition / maxTrack) * 100}%`,
            }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    </div>
  );
};

export default Simulation;

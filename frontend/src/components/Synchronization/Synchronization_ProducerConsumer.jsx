import React, { useEffect, useState, useRef } from "react";
import { Play, Pause, RefreshCw, Plus, Minus } from "lucide-react";

const ProducerConsumers = () => {
  const [bufferSize, setBufferSize] = useState(5);
  const [queue, setQueue] = useState([]);
  const [producers, setProducers] = useState(1);
  const [consumers, setConsumers] = useState(1);
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({ produced: 0, consumed: 0 });
  const [running, setRunning] = useState(true);
  const [speed, setSpeed] = useState(1);

  const bufferLockRef = useRef(false);
  const itemId = useRef(1);
  const intervalsRef = useRef([]);

  const addLog = (message) => {
    setLogs((prevLogs) => [{
      message,
      time: new Date().toLocaleTimeString()
    }, ...prevLogs.slice(0, 9)]);
  };

  const produce = (producer) => {
    if (bufferLockRef.current) return;
    bufferLockRef.current = true;

    setQueue((prevQueue) => {
      if (prevQueue.length < bufferSize) {
        const item = { id: itemId.current++, producer };
        addLog(`Producer ${producer} produced item ${item.id}`);
        setStats((prev) => ({ ...prev, produced: prev.produced + 1 }));
        return [...prevQueue, item];
      } else {
        addLog(`Producer ${producer} tried to produce but buffer full`);
        return prevQueue;
      }
    });

    bufferLockRef.current = false;
  };

  const consume = (consumer) => {
    if (bufferLockRef.current) return;
    bufferLockRef.current = true;
  
    setQueue((prevQueue) => {
      if (prevQueue.length > 0) {
        const randomIndex = Math.floor(Math.random() * prevQueue.length);
        const item = prevQueue[randomIndex];
  
        const newQueue = [...prevQueue.slice(0, randomIndex), ...prevQueue.slice(randomIndex + 1)];
        
        addLog(`Consumer ${consumer} consumed item ${item.id}`);
        setStats((prev) => ({ ...prev, consumed: prev.consumed + 1 }));
        return newQueue;
      } else {
        addLog(`Consumer ${consumer} tried to consume but buffer empty`);
        return prevQueue;
      }
    });
  
    bufferLockRef.current = false;
  };

  const resetSimulation = () => {
    setRunning(false);
    setQueue([]);
    setLogs([{ message: "Simulation initialized", time: new Date().toLocaleTimeString() }]);
    setStats({ produced: 0, consumed: 0 });
    itemId.current = 1;
  };

  useEffect(() => {
    if (!running) {
      intervalsRef.current.forEach(clearInterval);
      intervalsRef.current = [];
      return;
    }

    intervalsRef.current.forEach(clearInterval);
    intervalsRef.current = [];

    for (let i = 1; i <= producers; i++) {
      const interval = setInterval(() => produce(i), (1000 + Math.random() * 5000) / speed);
      intervalsRef.current.push(interval);
    }

    for (let i = 1; i <= consumers; i++) {
      const interval = setInterval(() => consume(i), (1200 + Math.random() * 5000) / speed);
      intervalsRef.current.push(interval);
    }

    return () => {
      intervalsRef.current.forEach(clearInterval);
      intervalsRef.current = [];
    };
  }, [producers, consumers, bufferSize, running, speed]);

  const getProducerColor = (id) => {
    const colors = [
      'bg-purple-500', 'bg-blue-500', 'bg-teal-500', 
      'bg-green-500', 'bg-indigo-500', 'bg-pink-500'
    ];
    return colors[(id - 1) % colors.length];
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-r from-blue-100 to-purple-100 p-8">
      <div className="w-full max-w-4xl mx-auto p-6 rounded-xl bg-gradient-to-r from-blue-100 to-purple-100">
        <div className="flex flex-col items-center space-y-8">
          {/* Header with proper styling */}
          <div className="w-full text-center mb-4">
            <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text pb-2">
              Producer-Consumer Simulator
            </h1>
            <div className="h-1 w-40 mx-auto bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></div>
          </div>
          
          {/* Controls */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button 
              onClick={() => setRunning(!running)} 
              className={`flex items-center px-4 py-2 ${running ? 'bg-orange-500' : 'bg-blue-500'} text-white rounded-full hover:opacity-90 transition-opacity shadow-md`}
            >
              {running ? <><Pause size={16} className="mr-2" /> Pause</> : <><Play size={16} className="mr-2" /> Start</>}
            </button>
            
            <button 
              onClick={resetSimulation} 
              className="flex items-center px-4 py-2 bg-purple-500 text-white rounded-full hover:opacity-90 transition-opacity shadow-md"
            >
              <RefreshCw size={16} className="mr-2" /> Reset
            </button>
            
            <div className="flex items-center space-x-2">
              <span>Speed:</span>
              <input 
                type="range" 
                min="0.5" 
                max="3" 
                step="0.5" 
                value={speed} 
                onChange={(e) => setSpeed(parseFloat(e.target.value))} 
                className="w-24"
              />
              <span>{speed}x</span>
            </div>
          </div>

          {/* Settings Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            <div className="flex flex-col items-center p-4 bg-white bg-opacity-70 rounded-xl shadow-md">
              <h3 className="font-bold text-purple-600 mb-2">Buffer Size</h3>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setBufferSize(Math.max(1, bufferSize - 1))}
                  className="bg-purple-500 text-white p-1 rounded-full shadow-md"
                >
                  <Minus size={16} />
                </button>
                <span className="text-xl font-bold w-8 text-center">{bufferSize}</span>
                <button 
                  onClick={() => setBufferSize(bufferSize + 1)}
                  className="bg-purple-500 text-white p-1 rounded-full shadow-md"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
            
            <div className="flex flex-col items-center p-4 bg-white bg-opacity-70 rounded-xl shadow-md">
              <h3 className="font-bold text-blue-600 mb-2">Producers</h3>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setProducers(Math.max(1, producers - 1))}
                  className="bg-blue-500 text-white p-1 rounded-full shadow-md"
                >
                  <Minus size={16} />
                </button>
                <span className="text-xl font-bold w-8 text-center">{producers}</span>
                <button 
                  onClick={() => setProducers(producers + 1)}
                  className="bg-blue-500 text-white p-1 rounded-full shadow-md"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
            
            <div className="flex flex-col items-center p-4 bg-white bg-opacity-70 rounded-xl shadow-md">
              <h3 className="font-bold text-teal-600 mb-2">Consumers</h3>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setConsumers(Math.max(1, consumers - 1))}
                  className="bg-teal-500 text-white p-1 rounded-full shadow-md"
                >
                  <Minus size={16} />
                </button>
                <span className="text-xl font-bold w-8 text-center">{consumers}</span>
                <button 
                  onClick={() => setConsumers(consumers + 1)}
                  className="bg-teal-500 text-white p-1 rounded-full shadow-md"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </div>
          
          {/* Visualization Container */}
          <div className="w-full flex flex-col items-center space-y-6">
            {/* Producer visualization */}
            <div className="w-4/5 flex flex-wrap items-center justify-center gap-4 pb-4">
              <h3 className="w-full text-center font-bold text-blue-600 mb-2">Producers</h3>
              <div className="flex flex-wrap justify-center gap-3">
                {Array.from({ length: producers }).map((_, i) => (
                  <div 
                    key={`producer-${i+1}`}
                    className={`${getProducerColor(i+1)} w-14 h-14 rounded-full flex items-center justify-center text-white font-bold shadow-md`}
                  >
                    P{i+1}
                  </div>
                ))}
              </div>
              {/* Arrows pointing down */}
              <div className="w-full flex justify-center">
                <div className="w-0 h-0 border-l-8 border-r-8 border-t-12 border-solid border-l-transparent border-r-transparent border-t-blue-500"></div>
              </div>
            </div>
            
            {/* Rectangular Buffer visualization */}
            <div className="w-4/5 border-4 border-purple-300 rounded-xl p-6 shadow-lg bg-gradient-to-r from-amber-100 to-orange-100">
              <div className="flex flex-col items-center">
                <h3 className="text-xl font-bold text-center mb-4 text-amber-800">Buffer ({queue.length}/{bufferSize})</h3>
                
                <div className="grid grid-cols-5 gap-4 w-full max-w-4xl mx-auto">
                  {Array.from({ length: bufferSize }).map((_, index) => {
                    const itemAtPosition = index < queue.length ? queue[index] : null;
                    
                    return (
                      <div 
                        key={`slot-${index}`}
                        className={`aspect-square rounded-lg flex items-center justify-center shadow-md transition-colors duration-300 ${
                          itemAtPosition ? getProducerColor(itemAtPosition.producer) : 'bg-gray-200'
                        }`}
                      >
                        {itemAtPosition ? (
                          <span className="text-lg text-white font-bold">{itemAtPosition.id}</span>
                        ) : (
                          <span className="text-gray-400">Empty</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            
            {/* Consumer visualization */}
            <div className="w-4/5 flex flex-wrap items-center justify-center gap-4 pt-4">
              {/* Arrows pointing down */}
              <div className="w-full flex justify-center">
                <div className="w-0 h-0 border-l-8 border-r-8 border-t-12 border-solid border-l-transparent border-r-transparent border-t-teal-500" style={{ transform: 'rotate(180deg)' }}></div>
              </div>
              <h3 className="w-full text-center font-bold text-teal-600 mb-2">Consumers</h3>
              <div className="flex flex-wrap justify-center gap-3">
                {Array.from({ length: consumers }).map((_, i) => (
                  <div 
                    key={`consumer-${i+1}`}
                    className="bg-teal-500 w-14 h-14 rounded-full flex items-center justify-center text-white font-bold shadow-md"
                  >
                    C{i+1}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Legend */}
          <div className="flex flex-wrap justify-center gap-6 bg-white bg-opacity-70 p-3 rounded-full shadow-md">
            <div className="flex items-center">
              <div className="w-6 h-6 bg-blue-500 mr-2 rounded-full shadow-sm"></div>
              <span>Producer</span>
            </div>
            <div className="flex items-center">
              <div className="w-6 h-6 bg-teal-500 mr-2 rounded-full shadow-sm"></div>
              <span>Consumer</span>
            </div>
            <div className="flex items-center">
              <div className="w-6 h-6 bg-purple-500 mr-2 rounded-full shadow-sm"></div>
              <span>Buffer Item</span>
            </div>
            <div className="flex items-center">
              <div className="w-6 h-6 bg-gray-200 mr-2 rounded-full shadow-sm"></div>
              <span>Empty Slot</span>
            </div>
          </div>
          
          {/* Statistics and logs */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Stats */}
            <div className="border-2 border-purple-200 rounded-lg p-4 bg-white bg-opacity-80 shadow-md">
              <h3 className="font-bold mb-2 text-purple-600">Statistics</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center py-1 border-b border-purple-100">
                  <span className="font-medium">Items Produced:</span>
                  <span className="bg-blue-100 px-2 py-1 rounded-lg">{stats.produced}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-purple-100">
                  <span className="font-medium">Items Consumed:</span>
                  <span className="bg-teal-100 px-2 py-1 rounded-lg">{stats.consumed}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-purple-100">
                  <span className="font-medium">Current Buffer Size:</span>
                  <span className="bg-purple-100 px-2 py-1 rounded-lg">{queue.length}/{bufferSize}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-purple-100">
                  <span className="font-medium">Buffer Usage:</span>
                  <div className="w-32 bg-gray-200 rounded-full h-4">
                    <div className="bg-purple-500 h-4 rounded-full" style={{ width: `${(queue.length / bufferSize) * 100}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Logs */}
            <div className="border-2 border-blue-200 rounded-lg p-4 bg-white bg-opacity-80 shadow-md">
              <h3 className="font-bold mb-2 text-blue-600">Activity Log</h3>
              <div className="h-60 overflow-y-auto flex flex-col">
                {logs.length === 0 ? (
                  <p className="text-gray-500 italic">No activity recorded yet</p>
                ) : (
                  logs.map((log, index) => (
                    <div key={`log-${index}`} className="text-sm py-1 border-b border-gray-100 last:border-b-0">
                      <span className="text-gray-500 text-xs">{log.time}</span>: {log.message}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProducerConsumers;
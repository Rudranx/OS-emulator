import React, { useState, useEffect } from 'react';
import { Pause, Play, RefreshCw, Plus, Minus, FileText, Edit } from 'lucide-react';

const ReaderWriter = () => {
  const [numReaders, setNumReaders] = useState(3);
  const [numWriters, setNumWriters] = useState(2);
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [logs, setLogs] = useState([]);
  const [readerPriority, setReaderPriority] = useState(true);
  const [database, setDatabase] = useState({
    content: "Initial database content",
    version: 1,
    activeReaders: 0,
    activeWriter: null,
    waitingReaders: [],
    waitingWriters: [],
    readerStats: Array(3).fill(0),
    writerStats: Array(2).fill(0),
    lastUpdateTime: new Date().toLocaleTimeString(),
    busyReaders: [],  // Track readers currently reading
    busyWriters: []   // Track writers currently writing
  });

  // Initialize
  useEffect(() => {
    resetSimulation();
  }, [numReaders, numWriters]);

  const resetSimulation = () => {
    setRunning(false);
    setDatabase({
      content: "Initial database content",
      version: 1,
      activeReaders: 0,
      activeWriter: null,
      waitingReaders: [],
      waitingWriters: [],
      readerStats: Array(numReaders).fill(0),
      writerStats: Array(numWriters).fill(0),
      lastUpdateTime: new Date().toLocaleTimeString(),
      busyReaders: [],
      busyWriters: []
    });
    setLogs([{ message: "Simulation initialized", time: new Date().toLocaleTimeString() }]);
  };

  const addLog = (message) => {
    setLogs(currentLogs => {
      const newLogs = [
        { message, time: new Date().toLocaleTimeString() },
        ...currentLogs
      ].slice(0, 15);
      return newLogs;
    });
  };

  // Main simulation loop
  // Main simulation loop
useEffect(() => {
  if (!running) return;
  
  const timer = setInterval(() => {
    setDatabase(db => {
      const newDb = { ...db };
      
      // Process any active writer finishing
      if (newDb.activeWriter !== null) {
        if (Math.random() < 0.3) { // 30% chance to finish
          // Update content
          newDb.content = `Content updated by Writer ${newDb.activeWriter} at ${new Date().toLocaleTimeString()}`;
          newDb.version++;
          newDb.lastUpdateTime = new Date().toLocaleTimeString();
          
          // Update stats
          const newWriterStats = [...newDb.writerStats];
          newWriterStats[newDb.activeWriter] += 1;
          newDb.writerStats = newWriterStats;
          
          // Remove from busy writers
          newDb.busyWriters = newDb.busyWriters.filter(w => w !== newDb.activeWriter);
          
          addLog(`Writer ${newDb.activeWriter} finished writing. Database at version ${newDb.version}`);
          newDb.activeWriter = null;
        }
      }
      
      // Process any active readers finishing
      if (newDb.activeReaders > 0) {
        const readersToFinish = Math.min(
          Math.floor(Math.random() * newDb.activeReaders * 0.3) + (Math.random() < 0.1 ? 1 : 0),
          newDb.activeReaders
        );
        
        if (readersToFinish > 0) {
          // Create a copy of busyReaders to modify
          const updatedBusyReaders = [...newDb.busyReaders];
          
          // Remove random readers from busy list
          for (let i = 0; i < readersToFinish; i++) {
            if (updatedBusyReaders.length > 0) {
              const idx = Math.floor(Math.random() * updatedBusyReaders.length);
              updatedBusyReaders.splice(idx, 1);
            }
          }
          
          newDb.busyReaders = updatedBusyReaders;
          newDb.activeReaders = updatedBusyReaders.length;
          addLog(`${readersToFinish} readers finished reading. ${newDb.activeReaders} still reading.`);
        }
      }
      
      // Process waiting queue if no active writer
      if (newDb.activeWriter === null) {
        const shouldProcessWriters = !readerPriority || 
                                    (newDb.waitingWriters.length > 0 && Math.random() < 0.5);
        
        if (shouldProcessWriters && newDb.waitingWriters.length > 0 && newDb.activeReaders === 0) {
          // Start next writer
          const nextWriter = newDb.waitingWriters.shift();
          newDb.activeWriter = nextWriter;
          newDb.busyWriters.push(nextWriter);
          addLog(`Writer ${nextWriter} started writing.`);
        } else if (newDb.waitingReaders.length > 0) {
          // Start readers (max 2 at a time)
          const readersToStart = Math.min(newDb.waitingReaders.length, 2);
          const newReaders = newDb.waitingReaders.splice(0, readersToStart);
          
          newDb.activeReaders += newReaders.length;
          newDb.busyReaders = [...newDb.busyReaders, ...newReaders];
          
          // Update stats for each new reader
          const newReaderStats = [...newDb.readerStats];
          newReaders.forEach(reader => {
            newReaderStats[reader] += 1;
          });
          newDb.readerStats = newReaderStats;
          
          addLog(`${newReaders.length} readers started reading. Total readers: ${newDb.activeReaders}`);
        }
      }
      
      // Generate new requests only from available processes
      const allProcesses = [
        ...newDb.busyReaders,
        ...newDb.busyWriters,
        ...newDb.waitingReaders,
        ...newDb.waitingWriters
      ];
      
      // Available readers not currently busy or waiting
      const availableReaders = Array(numReaders).fill().map((_, i) => i)
        .filter(r => !allProcesses.includes(r));
      
      // Available writers not currently busy or waiting  
      const availableWriters = Array(numWriters).fill().map((_, i) => i)
        .filter(w => !allProcesses.includes(w));
      
      // Generate new reader requests
      if (availableReaders.length > 0 && Math.random() < 0.15) {
        const reader = availableReaders[Math.floor(Math.random() * availableReaders.length)];
        if (newDb.waitingReaders.length < numReaders * 2) {
          newDb.waitingReaders.push(reader);
          addLog(`Reader ${reader} requested access.`);
        }
      }
      
      // Generate new writer requests
      if (availableWriters.length > 0 && Math.random() < 0.15) {
        const writer = availableWriters[Math.floor(Math.random() * availableWriters.length)];
        if (newDb.waitingWriters.length < numWriters) {
          newDb.waitingWriters.push(writer);
          addLog(`Writer ${writer} requested access.`);
        }
      }
      
      return newDb;
    });
  }, 1000 / speed);
  
  return () => clearInterval(timer);
}, [running, speed, numReaders, numWriters, readerPriority]);
  return (
    <div className="min-h-screen w-full bg-gradient-to-r from-blue-100 to-purple-100 p-8">
      <div className="w-full max-w-4xl mx-auto p-6 rounded-xl bg-gradient-to-r from-blue-100 to-purple-100 ">
        <div className="flex flex-col items-center space-y-6">
          {/* Header */}
          <div className="w-full text-center mb-4">
            <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text pb-2">
              Reader-Writer Problem
            </h1>
            <div className="h-1 w-40 mx-auto bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
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
            
            <div className="flex items-center space-x-2">
              <span>Priority:</span>
              <button 
                onClick={() => setReaderPriority(true)} 
                className={`px-3 py-1 rounded-full ${readerPriority ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200'}`}
              >
                Readers
              </button>
              <button 
                onClick={() => setReaderPriority(false)} 
                className={`px-3 py-1 rounded-full ${!readerPriority ? 'bg-green-600 text-white shadow-md' : 'bg-gray-200'}`}
              >
                Writers
              </button>
            </div>
          </div>
          
          <div className="flex w-full justify-center gap-8">
            {/* Reader controls */}
            <div className="flex items-center space-x-2 bg-blue-100 px-4 py-2 rounded-full shadow-md">
              <span className="text-blue-700 font-medium">Readers:</span>
              <button 
                onClick={() => setNumReaders(Math.max(1, numReaders - 1))}
                className="p-1 bg-blue-200 rounded-full hover:bg-blue-300 text-blue-700"
                disabled={numReaders <= 1}
              >
                <Minus size={16} />
              </button>
              <span className="w-6 text-center font-bold text-blue-700">{numReaders}</span>
              <button 
                onClick={() => setNumReaders(Math.min(5, numReaders + 1))}
                className="p-1 bg-blue-200 rounded-full hover:bg-blue-300 text-blue-700"
                disabled={numReaders >= 5}
              >
                <Plus size={16} />
              </button>
            </div>
            
            {/* Writer controls */}
            <div className="flex items-center space-x-2 bg-green-100 px-4 py-2 rounded-full shadow-md">
              <span className="text-green-700 font-medium">Writers:</span>
              <button 
                onClick={() => setNumWriters(Math.max(1, numWriters - 1))}
                className="p-1 bg-green-200 rounded-full hover:bg-green-300 text-green-700"
                disabled={numWriters <= 1}
              >
                <Minus size={16} />
              </button>
              <span className="w-6 text-center font-bold text-green-700">{numWriters}</span>
              <button 
                onClick={() => setNumWriters(Math.min(5, numWriters + 1))}
                className="p-1 bg-green-200 rounded-full hover:bg-green-300 text-green-700"
                disabled={numWriters >= 5}
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
          
          {/* Visualization */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left side - Database and access visualization */}
            <div className="flex flex-col gap-4">
              {/* Database */}
              <div className="border-2 border-purple-200 rounded-lg p-4 bg-white bg-opacity-80 shadow-md">
                <h3 className="font-semibold flex items-center mb-2 text-purple-600">
                  <FileText size={16} className="mr-2" /> Database (v{database.version})
                </h3>
                <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 border border-purple-200 rounded min-h-16 shadow-inner">
                  {database.content}
                </div>
                <div className="text-sm text-purple-600 mt-2">
                  Last updated: {database.lastUpdateTime}
                </div>
              </div>
              
              {/* Current Access */}
              <div className="border-2 border-blue-200 rounded-lg p-4 bg-white bg-opacity-80 shadow-md">
                <h3 className="font-semibold mb-3 text-blue-600">Current Access</h3>
                
                {/* Active readers */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2 text-blue-700">Active Readers: {database.activeReaders}</h4>
                  <div className="flex flex-wrap gap-2">
                    {database.busyReaders.length > 0 ? (
                      database.busyReaders.map((reader, i) => (
                        <div key={`active-reader-${i}`} className="px-3 py-1 bg-blue-100 border border-blue-300 rounded-full shadow-sm">
                          <FileText size={14} className="inline mr-1" /> Reader {reader}
                        </div>
                      ))
                    ) : (
                      <span className="text-gray-400">No active readers</span>
                    )}
                  </div>
                </div>
                
                {/* Active writer */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2 text-green-700">Active Writer:</h4>
                  <div className="flex">
                    {database.activeWriter !== null ? (
                      <div className="px-3 py-1 bg-green-100 border border-green-300 rounded-full shadow-sm">
                        <Edit size={14} className="inline mr-1" /> Writer {database.activeWriter}
                      </div>
                    ) : (
                      <span className="text-gray-400">No active writer</span>
                    )}
                  </div>
                </div>
                
                {/* Waiting */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2 text-blue-700">Waiting Readers:</h4>
                    <div className="flex flex-wrap gap-1">
                      {database.waitingReaders.length > 0 ? (
                        database.waitingReaders.map((reader, i) => (
                          <div key={`waiting-reader-${i}`} className="px-2 py-1 bg-blue-50 border border-blue-200 rounded-full text-sm shadow-sm">
                            R{reader}
                          </div>
                        ))
                      ) : (
                        <span className="text-gray-400">None waiting</span>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2 text-green-700">Waiting Writers:</h4>
                    <div className="flex flex-wrap gap-1">
                      {database.waitingWriters.length > 0 ? (
                        database.waitingWriters.map((writer, i) => (
                          <div key={`waiting-writer-${i}`} className="px-2 py-1 bg-green-50 border border-green-200 rounded-full text-sm shadow-sm">
                            W{writer}
                          </div>
                        ))
                      ) : (
                        <span className="text-gray-400">None waiting</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right side - Statistics and log */}
            <div className="flex flex-col gap-4">
              {/* Statistics */}
              <div className="border-2 border-purple-200 rounded-lg p-4 bg-white bg-opacity-80 shadow-md">
                <h3 className="font-semibold mb-3 text-purple-600">Statistics</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  {/* Reader stats */}
                  <div>
                    <h4 className="text-sm font-medium mb-2 text-blue-700">Reader Access Count:</h4>
                    <div className="space-y-1">
                      {database.readerStats.map((count, i) => (
                        <div key={`reader-stat-${i}`} className="flex justify-between text-sm py-1 border-b border-blue-100">
                          <span>Reader {i}:</span>
                          <span className="font-medium bg-blue-100 px-2 py-1 rounded-lg">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Writer stats */}
                  <div>
                    <h4 className="text-sm font-medium mb-2 text-green-700">Writer Access Count:</h4>
                    <div className="space-y-1">
                      {database.writerStats.map((count, i) => (
                        <div key={`writer-stat-${i}`} className="flex justify-between text-sm py-1 border-b border-green-100">
                          <span>Writer {i}:</span>
                          <span className="font-medium bg-green-100 px-2 py-1 rounded-lg">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 pt-3 border-t border-purple-200">
                  <div className="text-sm">
                    <span className="font-medium text-purple-600">Database versions:</span> {database.version}
                  </div>
                  <div className="text-sm mt-1">
                    <span className="font-medium text-purple-600">Priority mode:</span> {readerPriority ? 
                      <span className="bg-blue-100 px-2 py-1 rounded-lg text-blue-700">Reader Priority</span> : 
                      <span className="bg-green-100 px-2 py-1 rounded-lg text-green-700">Writer Priority</span>}
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
                      <div key={`log-${index}`} className="text-sm py-1 border-b border-blue-100 last:border-b-0">
                        <span className="text-blue-500 text-xs">{log.time}</span>: {log.message}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Legend */}
          <div className="flex flex-wrap justify-center gap-6 bg-white bg-opacity-70 p-3 rounded-full shadow-md">
            <div className="flex items-center">
              <div className="w-6 h-6 bg-blue-500 mr-2 rounded-full shadow-sm"></div>
              <span>Reader</span>
            </div>
            <div className="flex items-center">
              <div className="w-6 h-6 bg-green-500 mr-2 rounded-full shadow-sm"></div>
              <span>Writer</span>
            </div>
            <div className="flex items-center">
              <div className="w-6 h-6 bg-purple-500 mr-2 rounded-full shadow-sm"></div>
              <span>Database</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReaderWriter;
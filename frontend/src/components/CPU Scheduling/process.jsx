import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProcessScheduler() {
  const [processes, setProcesses] = useState([
    { id: 1, name: "P1", arrivalTime: 0, burstTime: 10, priority: 2, color: "#FF5733", remainingTime: 10 },
    { id: 2, name: "P2", arrivalTime: 1, burstTime: 4, priority: 1, color: "#33FF57", remainingTime: 4 },
    { id: 3, name: "P3", arrivalTime: 2, burstTime: 2, priority: 3, color: "#3357FF", remainingTime: 2 },
    { id: 4, name: "P4", arrivalTime: 3, burstTime: 6, priority: 4, color: "#F3FF33", remainingTime: 6 },
  ]);
  
  const [newProcess, setNewProcess] = useState({
    name: "",
    arrivalTime: 0,
    burstTime: 1,
    priority: 1,
  });
  
  const [algorithm, setAlgorithm] = useState("fcfs");
  const [timeQuantum, setTimeQuantum] = useState(2);
  const [isPreemptive, setIsPreemptive] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [ganttChart, setGanttChart] = useState([]);
  const [completionInfo, setCompletionInfo] = useState([]);
  const [simulationComplete, setSimulationComplete] = useState(false);
  const [activeProcess, setActiveProcess] = useState(null);
  const [timeMarker, setTimeMarker] = useState(0);
  
  const ganttChartRef = useRef(null);
  
  const colors = [
    "#FF5733", "#33FF57", "#3357FF", "#F3FF33", 
    "#FF33F3", "#33FFF3", "#F333FF", "#C70039",
    "#900C3F", "#581845", "#FFC300", "#DAF7A6"
  ];
  
  const addProcess = () => {
    if (newProcess.name && newProcess.burstTime > 0) {
      const newId = processes.length > 0 ? Math.max(...processes.map(p => p.id)) + 1 : 1;
      const processColor = colors[newId % colors.length];
      
      const newProcessObj = {
        id: newId,
        name: newProcess.name,
        arrivalTime: newProcess.arrivalTime,
        burstTime: newProcess.burstTime,
        priority: newProcess.priority,
        color: processColor,
        remainingTime: newProcess.burstTime,
        isNew: true
      };
      
      setProcesses(prev => [...prev, newProcessObj]);
      
      setTimeout(() => {
        setProcesses(prev => 
          prev.map(p => p.id === newId ? { ...p, isNew: false } : p)
        );
      }, 500);
      
      setNewProcess({
        name: "",
        arrivalTime: 0,
        burstTime: 1,
        priority: 1
      });
    }
  };
  
  const removeProcess = (id) => {
    setProcesses(prev => 
      prev.map(p => p.id === id ? { ...p, isRemoving: true } : p)
    );
    
    setTimeout(() => {
      setProcesses(prev => prev.filter(p => p.id !== id));
    }, 300);
  };
  
  const resetSimulation = () => {
    setCurrentTime(0);
    setTimeMarker(0);
    setGanttChart([]);
    setIsRunning(false);
    setSimulationComplete(false);
    setCompletionInfo([]);
    setActiveProcess(null);
    setProcesses(processes.map(p => ({
      ...p,
      remainingTime: p.burstTime
    })));
  };
  
  const startSimulation = () => {
    resetSimulation();
    setIsRunning(true);
  };
  
  const stopSimulation = () => {
    setIsRunning(false);
  };
  
  useEffect(() => {
    if (ganttChartRef.current && ganttChart.length > 0) {
      ganttChartRef.current.scrollLeft = ganttChartRef.current.scrollWidth;
    }
  }, [ganttChart]);
  
  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        setTimeMarker(prev => {
          if (prev < currentTime) return prev + 0.1;
          return currentTime;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isRunning, currentTime]);
  
  useEffect(() => {
    let timer;
    
    if (isRunning && !simulationComplete) {
      timer = setTimeout(() => {
        const result = runSchedulingStep();
        if (result.complete) {
          setSimulationComplete(true);
          setIsRunning(false);
          setActiveProcess(null);
        }
        setCurrentTime(prev => prev + 1);
      }, speed);
    }
    
    return () => clearTimeout(timer);
  }, [isRunning, currentTime, processes, algorithm, isPreemptive, timeQuantum]);
  
  const runSchedulingStep = () => {
    const currentProcesses = JSON.parse(JSON.stringify(processes));
    
    const arrivedProcesses = currentProcesses.filter(p => p.arrivalTime <= currentTime && p.remainingTime > 0);
    
    if (arrivedProcesses.length === 0) {
      const allComplete = currentProcesses.every(p => p.remainingTime === 0);
      
      if (!allComplete) {
        setActiveProcess(null);
        setGanttChart(prev => {
          if (prev.length > 0 && prev[prev.length - 1].processId === "idle") {
            const updatedChart = [...prev];
            updatedChart[updatedChart.length - 1].endTime = currentTime + 1;
            return updatedChart;
          } else {
            return [...prev, {
              processId: "idle",
              startTime: currentTime,
              endTime: currentTime + 1,
              color: "#CCCCCC"
            }];
          }
        });
        return { complete: false };
      }
      
      return { complete: true };
    }
    
    let selectedProcess;
    
    switch (algorithm) {
      case "fcfs":
        selectedProcess = arrivedProcesses.sort((a, b) => a.arrivalTime - b.arrivalTime)[0];
        break;
        
      case "sjf":
        if (isPreemptive) {
          selectedProcess = arrivedProcesses.sort((a, b) => a.remainingTime - b.remainingTime)[0];
        } else {
          const lastProcess = ganttChart.length > 0 ? ganttChart[ganttChart.length - 1] : null;
          
          if (lastProcess && 
              lastProcess.endTime === currentTime && 
              arrivedProcesses.find(p => p.id.toString() === lastProcess.processId && p.remainingTime > 0)) {
            selectedProcess = arrivedProcesses.find(p => p.id.toString() === lastProcess.processId);
          } else {
            selectedProcess = arrivedProcesses.sort((a, b) => a.remainingTime - b.remainingTime)[0];
          }
        }
        break;
        
      case "priority":
        if (isPreemptive) {
          selectedProcess = arrivedProcesses.sort((a, b) => a.priority - b.priority)[0];
        } else {
          const lastProcess = ganttChart.length > 0 ? ganttChart[ganttChart.length - 1] : null;
          
          if (lastProcess && 
              lastProcess.endTime === currentTime && 
              arrivedProcesses.find(p => p.id.toString() === lastProcess.processId && p.remainingTime > 0)) {
            selectedProcess = arrivedProcesses.find(p => p.id.toString() === lastProcess.processId);
          } else {
            selectedProcess = arrivedProcesses.sort((a, b) => a.priority - b.priority)[0];
          }
        }
        break;
        
      case "rr":
        const lastProcess = ganttChart.length > 0 ? ganttChart[ganttChart.length - 1] : null;
        
        if (lastProcess && lastProcess.endTime === currentTime) {
          const prevProcessId = lastProcess.processId;
          const timeDifference = lastProcess.endTime - lastProcess.startTime;
          
          if (prevProcessId !== "idle" && timeDifference < timeQuantum) {
            const prevProcess = arrivedProcesses.find(p => p.id.toString() === prevProcessId);
            if (prevProcess && prevProcess.remainingTime > 0) {
              selectedProcess = prevProcess;
              break;
            }
          }
          
          const prevProcessIndex = arrivedProcesses.findIndex(p => p.id.toString() === prevProcessId);
          if (prevProcessIndex !== -1 && arrivedProcesses.length > 1) {
            selectedProcess = arrivedProcesses[(prevProcessIndex + 1) % arrivedProcesses.length];
          } else {
            selectedProcess = arrivedProcesses[0];
          }
        } else {
          selectedProcess = arrivedProcesses[0];
        }
        break;
        
      default:
        selectedProcess = arrivedProcesses[0];
    }
    
    setActiveProcess(selectedProcess.id);
    
    setGanttChart(prev => {
      const lastEntry = prev.length > 0 ? prev[prev.length - 1] : null;
      
      if (lastEntry && lastEntry.processId === selectedProcess.id.toString() && lastEntry.endTime === currentTime) {
        const updatedChart = [...prev];
        updatedChart[updatedChart.length - 1].endTime = currentTime + 1;
        return updatedChart;
      } else {
        return [...prev, {
          processId: selectedProcess.id.toString(),
          processName: selectedProcess.name,
          startTime: currentTime,
          endTime: currentTime + 1,
          color: selectedProcess.color
        }];
      }
    });
    
    setProcesses(prev => {
      return prev.map(p => {
        if (p.id === selectedProcess.id) {
          const newRemainingTime = p.remainingTime - 1;
          
          if (newRemainingTime === 0) {
            setCompletionInfo(prev => [
              ...prev,
              {
                id: p.id,
                name: p.name,
                completionTime: currentTime + 1,
                turnaroundTime: (currentTime + 1) - p.arrivalTime,
                waitingTime: (currentTime + 1) - p.arrivalTime - p.burstTime,
                isNew: true
              }
            ]);
            
            setTimeout(() => {
              setCompletionInfo(prev => 
                prev.map(info => info.id === p.id ? { ...info, isNew: false } : info)
              );
            }, 500);
          }
          
          return { ...p, remainingTime: newRemainingTime };
        }
        return p;
      });
    });
    
    const updatedProcesses = processes.map(p => {
      if (p.id === selectedProcess.id) {
        return { ...p, remainingTime: p.remainingTime - 1 };
      }
      return p;
    });
    
    const allComplete = updatedProcesses.every(p => p.remainingTime === 0 || (p.arrivalTime > currentTime && p.remainingTime === p.burstTime));
    
    return { complete: allComplete };
  };
  
  const calculateAverages = () => {
    if (completionInfo.length === 0) return { avgTurnaround: 0, avgWaiting: 0 };
    
    const totalTurnaround = completionInfo.reduce((sum, p) => sum + p.turnaroundTime, 0);
    const totalWaiting = completionInfo.reduce((sum, p) => sum + p.waitingTime, 0);
    
    return {
      avgTurnaround: (totalTurnaround / completionInfo.length).toFixed(2),
      avgWaiting: (totalWaiting / completionInfo.length).toFixed(2)
    };
  };
  
  const { avgTurnaround, avgWaiting } = calculateAverages();
  
  function getContrastColor(hexColor) {
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    
    return brightness > 125 ? '#000000' : '#FFFFFF';
  }
  
  return (
    <div className="p-6 max-w-6xl mx-auto bg-white rounded-lg shadow-lg">
      <motion.h1 
        className="text-3xl font-bold mb-6 text-center text-blue-800"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Process Scheduling Visualizer
      </motion.h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <motion.div 
          className="bg-gray-50 p-4 rounded-lg shadow"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h2 className="text-xl font-semibold mb-4">Add Process</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium">Process Name</label>
              <input
                type="text"
                value={newProcess.name}
                onChange={(e) => setNewProcess({...newProcess, name: e.target.value})}
                className="mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all"
                placeholder="e.g., P5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Arrival Time</label>
              <input
                type="number"
                min="0"
                value={newProcess.arrivalTime}
                onChange={(e) => setNewProcess({...newProcess, arrivalTime: parseInt(e.target.value) || 0})}
                className="mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Burst Time</label>
              <input
                type="number"
                min="1"
                value={newProcess.burstTime}
                onChange={(e) => setNewProcess({...newProcess, burstTime: parseInt(e.target.value) || 1})}
                className="mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Priority (lower value = higher priority)</label>
              <input
                type="number"
                min="1"
                value={newProcess.priority}
                onChange={(e) => setNewProcess({...newProcess, priority: parseInt(e.target.value) || 1})}
                className="mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all"
              />
            </div>
            <motion.button
              onClick={addProcess}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors w-full"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Add Process
            </motion.button>
          </div>
        </motion.div>
        
        <motion.div 
          className="bg-gray-50 p-4 rounded-lg shadow"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-xl font-semibold mb-4">Scheduling Settings</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium">Algorithm</label>
              <select
                value={algorithm}
                onChange={(e) => setAlgorithm(e.target.value)}
                className="mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all"
              >
                <option value="fcfs">First Come First Served (FCFS)</option>
                <option value="sjf">Shortest Job First (SJF)</option>
                <option value="priority">Priority Scheduling</option>
                <option value="rr">Round Robin</option>
              </select>
            </div>
            
            {algorithm !== "fcfs" && algorithm !== "rr" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <label className="block text-sm font-medium">Execution Mode</label>
                <select
                  value={isPreemptive.toString()}
                  onChange={(e) => setIsPreemptive(e.target.value === "true")}
                  className="mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all"
                >
                  <option value="false">Non-Preemptive</option>
                  <option value="true">Preemptive</option>
                </select>
              </motion.div>
            )}
            
            {algorithm === "rr" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <label className="block text-sm font-medium">Time Quantum</label>
                <input
                  type="number"
                  min="1"
                  value={timeQuantum}
                  onChange={(e) => setTimeQuantum(parseInt(e.target.value) || 1)}
                  className="mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all"
                />
              </motion.div>
            )}
            
            <div>
              <label className="block text-sm font-medium">Simulation Speed (ms)</label>
              <input
                type="range"
                min="100"
                max="2000"
                step="100"
                value={speed}
                onChange={(e) => setSpeed(parseInt(e.target.value))}
                className="mt-1 w-full"
              />
              <div className="text-sm text-gray-500 text-center">{speed}ms</div>
            </div>
            
            <div className="flex space-x-2">
              <motion.button
                onClick={startSimulation}
                disabled={isRunning || processes.length === 0}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-400 flex-1"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Start
              </motion.button>
              <motion.button
                onClick={stopSimulation}
                disabled={!isRunning}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors disabled:bg-gray-400 flex-1"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Stop
              </motion.button>
              <motion.button
                onClick={resetSimulation}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors flex-1"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Reset
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
      
      <motion.div 
        className="bg-gray-50 p-4 rounded-lg mb-6 shadow"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h2 className="text-xl font-semibold mb-4">Processes</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Name</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Arrival Time</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Burst Time</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Priority</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Remaining Time</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <AnimatePresence>
                {processes.map((process) => (
                  <motion.tr 
                    key={process.id}
                    initial={process.isNew ? { opacity: 0, y: 20 } : { opacity: 1 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0, 
                      backgroundColor: process.id === activeProcess ? `${process.color}20` : 'transparent' 
                    }}
                    exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                    transition={{ duration: 0.3 }}
                    className="transition-colors duration-300"
                  >
                    <td className="px-4 py-2">
                      <div className="flex items-center">
                        <motion.div 
                          className="w-4 h-4 mr-2 rounded-sm"
                          style={{ backgroundColor: process.color }}
                          animate={{ 
                            scale: process.id === activeProcess ? [1, 1.2, 1] : 1,
                            boxShadow: process.id === activeProcess ? 
                              '0 0 8px rgba(0, 0, 0, 0.3)' : '0 0 0px rgba(0, 0, 0, 0)'
                          }}
                          transition={{ duration: 0.5, repeat: process.id === activeProcess ? Infinity : 0, repeatDelay: 0.2 }}
                        ></motion.div>
                        {process.name}
                      </div>
                    </td>
                    <td className="px-4 py-2">{process.arrivalTime}</td>
                    <td className="px-4 py-2">{process.burstTime}</td>
                    <td className="px-4 py-2">{process.priority}</td>
                    <td className="px-4 py-2">
                      <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                        <motion.div 
                          className="h-2.5 rounded-full" 
                          style={{ backgroundColor: process.color }}
                          initial={{ width: `${(process.remainingTime / process.burstTime) * 100}%` }}
                          animate={{ width: `${(process.remainingTime / process.burstTime) * 100}%` }}
                          transition={{ duration: 0.3 }}
                        ></motion.div>
                      </div>
                      <motion.div 
                        className="text-xs mt-1 text-right"
                        animate={{ fontWeight: process.id === activeProcess ? "bold" : "normal" }}
                      >
                        {process.remainingTime}/{process.burstTime}
                      </motion.div>
                    </td>
                    <td className="px-4 py-2">
                      <motion.button 
                        onClick={() => removeProcess(process.id)}
                        className="text-red-600 hover:text-red-800"
                        disabled={isRunning}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        Remove
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </motion.div>
      
      <motion.div 
        className="bg-gray-50 p-4 rounded-lg mb-6 shadow"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h2 className="text-xl font-semibold mb-4">Gantt Chart</h2>
        <motion.div 
          className="mb-2 text-lg font-medium flex items-center"
        >
          Current Time: 
          <motion.span
            className="ml-2 px-2 py-1 bg-blue-100 rounded"
            animate={{ 
              scale: isRunning ? [1, 1.05, 1] : 1,
              backgroundColor: isRunning ? ['#EFF6FF', '#DBEAFE', '#EFF6FF'] : '#EFF6FF'
            }}
            transition={{ duration: 1, repeat: isRunning ? Infinity : 0 }}
          >
            {currentTime}
          </motion.span>
        </motion.div>
        <div 
          ref={ganttChartRef}
          className="relative h-20 flex border border-gray-300 overflow-x-auto rounded-md shadow-inner bg-gray-100"
        >
          <AnimatePresence>
            {ganttChart.map((item, index) => (
              <motion.div 
                key={index}
                className="h-full text-xs flex flex-col justify-between items-center border-r border-gray-300 relative overflow-hidden"
                initial={{ width: 0, opacity: 0 }}
                animate={{ 
                  width: `${50 * (item.endTime - item.startTime)}px`,
                  opacity: 1
                }}
                transition={{ duration: 0.3 }}
                style={{ 
                  backgroundColor: item.color,
                  color: item.processId === "idle" ? "#000" : getContrastColor(item.color)
                }}
              >
                <div className="pt-2 font-medium text-sm">
                  {item.processId === "idle" ? "Idle" : item.processName}
                </div>
                <div className="pb-2">{item.startTime} - {item.endTime}</div>
                
                {isRunning && item.endTime > currentTime && (
                  <motion.div 
                    className="absolute inset-0 opacity-20"
                    style={{ 
                      background: `repeating-linear-gradient(45deg, ${
                        item.processId === "idle" ? "#888" : "#fff"
                      }, transparent 10px, transparent 20px)`
                    }}
                    animate={{ 
                      backgroundPosition: ["0px 0px", "20px 20px"]
                    }}
                    transition={{ 
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
      
      {completionInfo.length > 0 && (
        <motion.div 
          className="bg-gray-50 p-4 rounded-lg shadow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h2 className="text-xl font-semibold mb-4">Completion Statistics</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Process</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Completion Time</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Turnaround Time</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Waiting Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <AnimatePresence>
                  {completionInfo.map((info) => (
                    <motion.tr 
                      key={info.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <td className="px-4 py-2">{info.name}</td>
                      <td className="px-4 py-2">{info.completionTime}</td>
                      <td className="px-4 py-2">{info.turnaroundTime}</td>
                      <td className="px-4 py-2">{info.waitingTime}</td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-lg">
            <p>Average Turnaround Time: {avgTurnaround}</p>
            <p>Average Waiting Time: {avgWaiting}</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
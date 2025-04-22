import { useState, useEffect } from 'react';
import { LineChart, BarChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Activity, Cpu, Database, HardDrive, Layers } from 'lucide-react';

export default function ResourceMonitor() {
  const [systemData, setSystemData] = useState({
    cpuUsage: generateInitialCpuData(),
    memoryMapping: generateInitialMemoryData(),
    threadCount: generateInitialThreadData(),
    interruptData: generateInitialInterruptData(),
    diskIO: generateInitialDiskData()
  });
  
  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemData({
        cpuUsage: updateCpuData(systemData.cpuUsage),
        memoryMapping: updateMemoryData(systemData.memoryMapping),
        threadCount: updateThreadData(systemData.threadCount),
        interruptData: updateInterruptData(systemData.interruptData),
        diskIO: updateDiskData(systemData.diskIO)
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [systemData]);

  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Resource Monitor</h1>
        <div className="flex items-center space-x-2">
          <span className="text-green-500 animate-pulse">●</span>
          <span>Live</span>
        </div>
      </header>
      
      <div className="grid grid-cols-2 gap-6">
        {/* CPU Usage Panel */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center mb-4">
            <Cpu className="mr-2 text-blue-500" />
            <h2 className="text-lg font-semibold">CPU Usage (Per Process)</h2>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={systemData.cpuUsage}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis label={{ value: 'Usage %', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="usage" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Memory Mapping Panel */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center mb-4">
            <Layers className="mr-2 text-purple-500" />
            <h2 className="text-lg font-semibold">Memory Mapping (Virtual to Physical)</h2>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={systemData.memoryMapping}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" />
                <Tooltip />
                <Legend />
                <Bar dataKey="virtual" fill="#8b5cf6" />
                <Bar dataKey="physical" fill="#a78bfa" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Threads per Process Panel */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center mb-4">
            <Activity className="mr-2 text-red-500" />
            <h2 className="text-lg font-semibold">Threads per Process</h2>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={systemData.threadCount}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="chrome" stroke="#f59e0b" strokeWidth={2} />
                <Line type="monotone" dataKey="system" stroke="#10b981" strokeWidth={2} />
                <Line type="monotone" dataKey="ide" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Interrupt Frequency Monitor */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center mb-4">
            <Database className="mr-2 text-yellow-500" />
            <h2 className="text-lg font-semibold">Interrupt Frequency</h2>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={systemData.interruptData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="hardware" stroke="#ef4444" strokeWidth={2} />
                <Line type="monotone" dataKey="software" stroke="#6366f1" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Disk I/O Panel */}
        <div className="col-span-2 bg-white p-4 rounded-lg shadow">
          <div className="flex items-center mb-4">
            <HardDrive className="mr-2 text-green-500" />
            <h2 className="text-lg font-semibold">Disk Queue & I/O Wait Time</h2>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={systemData.diskIO}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="queue" stroke="#8884d8" strokeWidth={2} />
                <Line yAxisId="right" type="monotone" dataKey="waitTime" stroke="#82ca9d" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <footer className="mt-6 text-center text-gray-500 text-sm">
        <p>Last updated: {new Date().toLocaleTimeString()}</p>
      </footer>
    </div>
  );
}

// Data generation functions
function generateInitialCpuData() {
  return [
    { name: 'chrome.exe', usage: 35 },
    { name: 'system', usage: 12 },
    { name: 'ide.exe', usage: 28 },
    { name: 'node.exe', usage: 18 },
    { name: 'browser.exe', usage: 22 }
  ];
}

function updateCpuData(prevData) {
  return prevData.map(item => ({
    ...item,
    usage: Math.max(5, Math.min(95, item.usage + (Math.random() * 10 - 5)))
  }));
}

function generateInitialMemoryData() {
  return [
    { name: 'chrome.exe', virtual: 1200, physical: 480 },
    { name: 'system', virtual: 850, physical: 320 },
    { name: 'ide.exe', virtual: 1600, physical: 520 },
    { name: 'node.exe', virtual: 750, physical: 300 }
  ];
}

function updateMemoryData(prevData) {
  return prevData.map(item => ({
    ...item,
    virtual: Math.max(100, item.virtual + (Math.random() * 50 - 25)),
    physical: Math.max(50, item.physical + (Math.random() * 30 - 15))
  }));
}

function generateInitialThreadData() {
  const times = Array.from({ length: 10 }, (_, i) => i);
  return times.map(time => ({
    time,
    chrome: Math.floor(Math.random() * 20) + 40,
    system: Math.floor(Math.random() * 15) + 30,
    ide: Math.floor(Math.random() * 10) + 20
  }));
}

function updateThreadData(prevData) {
  const newPoint = {
    time: prevData[prevData.length - 1].time + 1,
    chrome: Math.max(30, Math.min(80, prevData[prevData.length - 1].chrome + (Math.random() * 10 - 5))),
    system: Math.max(20, Math.min(60, prevData[prevData.length - 1].system + (Math.random() * 8 - 4))),
    ide: Math.max(15, Math.min(40, prevData[prevData.length - 1].ide + (Math.random() * 6 - 3)))
  };
  return [...prevData.slice(1), newPoint];
}

function generateInitialInterruptData() {
  const times = Array.from({ length: 10 }, (_, i) => i);
  return times.map(time => ({
    time,
    hardware: Math.floor(Math.random() * 200) + 800,
    software: Math.floor(Math.random() * 300) + 1200
  }));
}

function updateInterruptData(prevData) {
  const newPoint = {
    time: prevData[prevData.length - 1].time + 1,
    hardware: Math.max(600, Math.min(1200, prevData[prevData.length - 1].hardware + (Math.random() * 100 - 50))),
    software: Math.max(900, Math.min(1800, prevData[prevData.length - 1].software + (Math.random() * 150 - 75)))
  };
  return [...prevData.slice(1), newPoint];
}

function generateInitialDiskData() {
  const times = Array.from({ length: 10 }, (_, i) => i);
  return times.map(time => ({
    time,
    queue: Math.floor(Math.random() * 4) + 1,
    waitTime: Math.floor(Math.random() * 10) + 5
  }));
}

function updateDiskData(prevData) {
  const newPoint = {
    time: prevData[prevData.length - 1].time + 1,
    queue: Math.max(0, Math.min(10, prevData[prevData.length - 1].queue + (Math.random() * 2 - 1))),
    waitTime: Math.max(1, Math.min(20, prevData[prevData.length - 1].waitTime + (Math.random() * 3 - 1.5)))
  };
  return [...prevData.slice(1), newPoint];
}
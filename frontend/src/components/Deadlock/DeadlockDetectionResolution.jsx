import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import ForceGraph2D from 'react-force-graph-2d';

// Add RAG data structure
const createRAG = (processes, resources) => {
  return {
    nodes: [
      ...Array(processes).fill().map((_, i) => ({
        id: `P${i + 1}`,
        type: 'process',
        color: '#4ECDC4',
        size: 20,
        x: Math.cos(2 * Math.PI * i / processes) * 200 + 400,
        y: Math.sin(2 * Math.PI * i / processes) * 200 + 200
      })),
      ...Array(resources).fill().map((_, i) => ({
        id: `R${i + 1}`,
        type: 'resource',
        color: '#FF6B6B',
        size: 15,
        x: Math.cos(2 * Math.PI * i / resources) * 100 + 400,
        y: Math.sin(2 * Math.PI * i / resources) * 100 + 200
      }))
    ],
    links: []
  };
};

const DeadlockDetectionResolution = ({ title, description, onReady }) => {
  // Configuration state
  const [isConfigured, setIsConfigured] = useState(false);
  const [numProcesses, setNumProcesses] = useState(4);
  const [numResources, setNumResources] = useState(3);
  
  // Matrix state
  const [allocationMatrix, setAllocationMatrix] = useState([]);
  const [requestMatrix, setRequestMatrix] = useState([]);
  const [availableResources, setAvailableResources] = useState([]);
  const [totalResources, setTotalResources] = useState([]);
  
  // Detection and Resolution state
  const [deadlockedProcesses, setDeadlockedProcesses] = useState([]);
  const [detectionHistory, setDetectionHistory] = useState([]);
  const [resolutionSteps, setResolutionSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isResolving, setIsResolving] = useState(false);
  const [showResolutionAnimation, setShowResolutionAnimation] = useState(false);

  const [deadlockDetected, setDeadlockDetected] = useState(false);
  const [waitForGraph, setWaitForGraph] = useState([]);
  const [selectedProcessForTermination, setSelectedProcessForTermination] = useState(null);
  const [simulationStep, setSimulationStep] = useState(0);
  const [explanationText, setExplanationText] = useState('Welcome to the Deadlock Detection and Resolution Simulation. Start by detecting if there\'s a deadlock in the system.');
  const [historyLog, setHistoryLog] = useState([]);
  const historyEndRef = useRef(null);
  const [autoResolve, setAutoResolve] = useState(false);
  // Add a state to control auto-scrolling behavior
  const [autoScroll, setAutoScroll] = useState(false);
  
  // Add a state for showing/hiding the tutorial
  const [showTutorial, setShowTutorial] = useState(true);
  // Add a state for the current tutorial step
  const [tutorialStep, setTutorialStep] = useState(0);

  // Add color constants
  const RESOURCE_COLORS = {
    A: '#FF6B6B',  // Red
    B: '#4ECDC4',  // Teal
    C: '#FFD166',  // Yellow
    D: '#95A5A6',  // Gray
    E: '#3498DB',  // Blue
    F: '#2ECC71',  // Green
    G: '#F1C40F',  // Yellow
    H: '#E74C3C'   // Red
  };

  const [ragData, setRagData] = useState(null);
  const [showRAG, setShowRAG] = useState(false);
  const [ragDeadlockDetected, setRagDeadlockDetected] = useState(false);

  useEffect(() => {
    if (onReady) {
      onReady();
    }
  }, [onReady]);

  // Initialize matrices when dimensions change
  useEffect(() => {
    const initMatrix = (rows, cols, defaultValue = 0) => 
      Array(rows).fill().map(() => Array(cols).fill(defaultValue));

    setAllocationMatrix(initMatrix(numProcesses, numResources));
    setRequestMatrix(initMatrix(numProcesses, numResources));
    setAvailableResources(Array(numResources).fill(0));
    setTotalResources(Array(numResources).fill(3)); // Default total resources
  }, [numProcesses, numResources]);

  // Initialize RAG when dimensions change
  useEffect(() => {
    if (numProcesses && numResources) {
      setRagData(createRAG(numProcesses, numResources));
    }
  }, [numProcesses, numResources]);

  // Update RAG links when matrices change
  useEffect(() => {
    if (!ragData || !allocationMatrix.length || !requestMatrix.length) return;

    const newLinks = [];
    
    // Add allocation links (from resources to processes)
    allocationMatrix.forEach((row, i) => {
      row.forEach((amount, j) => {
        if (amount > 0) {
          newLinks.push({
            source: `R${j + 1}`,
            target: `P${i + 1}`,
            type: 'allocation',
            value: amount,
            color: '#4ECDC4',
            curvature: 0.2
          });
        }
      });
    });

    // Add request links (from processes to resources)
    requestMatrix.forEach((row, i) => {
      row.forEach((amount, j) => {
        if (amount > 0) {
          newLinks.push({
            source: `P${i + 1}`,
            target: `R${j + 1}`,
            type: 'request',
            value: amount,
            color: '#FF6B6B',
            curvature: -0.2
          });
        }
      });
    });

    setRagData(prev => ({
      ...prev,
      links: newLinks
    }));
  }, [allocationMatrix, requestMatrix]);

  // Handle matrix cell changes
  const handleMatrixChange = (matrix, setMatrix, row, col, value) => {
    const newMatrix = matrix.map((r, i) => 
      i === row ? r.map((c, j) => j === col ? parseInt(value) || 0 : c) : r
    );
    setMatrix(newMatrix);
  };

  // Handle resource changes
  const handleResourceChange = (index, value, isTotal = false) => {
    if (isTotal) {
      const newTotal = [...totalResources];
      newTotal[index] = parseInt(value) || 0;
      setTotalResources(newTotal);
    } else {
      const newAvailable = [...availableResources];
      newAvailable[index] = parseInt(value) || 0;
      setAvailableResources(newAvailable);
    }
  };

  // Validate configuration
  const validateConfiguration = () => {
    // Check if total resources are sufficient
    for (let j = 0; j < numResources; j++) {
      let totalAllocated = allocationMatrix.reduce((sum, row) => sum + row[j], 0);
      if (totalAllocated > totalResources[j]) {
        return `Resource ${j + 1} allocation exceeds total available resources`;
      }
    }
    return null;
  };

  // Initialize simulation
  const initializeSimulation = () => {
    const error = validateConfiguration();
    if (error) {
      alert(error);
      return;
    }

    // Calculate initial available resources
    const newAvailable = totalResources.map((total, idx) => {
      const allocated = allocationMatrix.reduce((sum, row) => sum + row[idx], 0);
      return total - allocated;
    });
    setAvailableResources(newAvailable);
    setIsConfigured(true);
    setDetectionHistory([]);
    setDeadlockedProcesses([]);
    setResolutionSteps([]);
    setCurrentStep(0);
  };

  // Detect deadlocks
  const detectDeadlocks = () => {
    const work = [...availableResources];
    const finish = Array(numProcesses).fill(false);
    const history = [];

    // First pass: mark processes that can finish
    let changed;
    do {
      changed = false;
      for (let i = 0; i < numProcesses; i++) {
        if (!finish[i]) {
          let canFinish = true;
          for (let j = 0; j < numResources; j++) {
            if (requestMatrix[i][j] > work[j]) {
              canFinish = false;
              break;
            }
          }

          if (canFinish) {
            finish[i] = true;
            changed = true;
            // Add resources back to work
            for (let j = 0; j < numResources; j++) {
              work[j] += allocationMatrix[i][j];
            }
            history.push({
              step: history.length + 1,
              process: i,
              work: [...work],
              finish: [...finish],
              request: requestMatrix[i],
              allocation: allocationMatrix[i]
            });
          }
        }
      }
    } while (changed);

    const deadlocked = finish.map((f, i) => !f ? i : -1).filter(i => i !== -1);
    setDeadlockedProcesses(deadlocked);
    setDetectionHistory(history);

    if (deadlocked.length > 0) {
      generateResolutionSteps(deadlocked);
    }
  };

  // Generate resolution steps
  const generateResolutionSteps = (deadlocked) => {
    const steps = [];
    const remainingProcesses = [...deadlocked];
    const releasedResources = [...availableResources];
    const processStates = allocationMatrix.map((allocation, idx) => ({
      id: idx,
      allocation: [...allocation],
      isDeadlocked: deadlocked.includes(idx)
    }));

    while (remainingProcesses.length > 0) {
      // Find process with minimum allocated resources to terminate
      let selectedProcess = remainingProcesses.reduce((min, curr) => {
        const totalAllocated = allocationMatrix[curr].reduce((sum, val) => sum + val, 0);
        const minAllocated = allocationMatrix[min].reduce((sum, val) => sum + val, 0);
        return totalAllocated < minAllocated ? curr : min;
      }, remainingProcesses[0]);

      const resourcesReleased = [...allocationMatrix[selectedProcess]];
      const newAvailable = releasedResources.map((r, i) => r + resourcesReleased[i]);

      // Update process states
      processStates[selectedProcess].isTerminated = true;
      processStates[selectedProcess].allocation = Array(numResources).fill(0);

      steps.push({
        processId: selectedProcess,
        resourcesReleased,
        availableAfter: [...newAvailable],
        remainingDeadlocked: remainingProcesses.filter(p => p !== selectedProcess),
        processStates: processStates.map(p => ({ ...p }))
      });

      // Update state for next iteration
      remainingProcesses.splice(remainingProcesses.indexOf(selectedProcess), 1);
      for (let i = 0; i < numResources; i++) {
        releasedResources[i] = newAvailable[i];
      }
    }

    setResolutionSteps(steps);
  };

  // Start resolution
  const startResolution = () => {
    setIsResolving(true);
    setShowResolutionAnimation(true);
    setCurrentStep(0);
  };

  // Move to next step
  const nextResolutionStep = () => {
    if (currentStep < resolutionSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsResolving(false);
    }
  };

  // Reset simulation
  const resetSimulation = () => {
    setIsConfigured(false);
    setDeadlockedProcesses([]);
    setDetectionHistory([]);
    setResolutionSteps([]);
    setCurrentStep(0);
    setIsResolving(false);
    setShowResolutionAnimation(false);
  };

  // Render matrix input
  const renderMatrixInput = (matrix, setMatrix, title, readOnly = false) => (
    <div className="mb-6">
      <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-3">{title}</h4>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b">Process</th>
              {Array(numResources).fill().map((_, i) => (
                <th key={i} className="px-4 py-2 border-b">Resource {i + 1}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrix.map((row, i) => (
              <tr key={i}>
                <td className="px-4 py-2 border-b font-medium">P{i + 1}</td>
                {row.map((cell, j) => (
                  <td key={j} className="px-4 py-2 border-b">
                    <input
                      type="number"
                      min="0"
                      value={cell}
                      onChange={(e) => handleMatrixChange(matrix, setMatrix, i, j, e.target.value)}
                      className="w-16 px-2 py-1 border rounded"
                      readOnly={readOnly}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Render resource configuration
  const renderResourceConfig = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <div>
        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Total Resources</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {totalResources.map((value, i) => (
            <div key={i} className="p-4 rounded-lg" style={{ backgroundColor: RESOURCE_COLORS[String.fromCharCode(65 + i)] + '20' }}>
              <div className="flex items-center mb-2">
                <div 
                  className="w-4 h-4 rounded-full mr-2"
                  style={{ backgroundColor: RESOURCE_COLORS[String.fromCharCode(65 + i)] }}
                ></div>
                <span className="font-medium">Resource {String.fromCharCode(65 + i)}</span>
              </div>
              <input
                type="number"
                min="0"
                value={value}
                onChange={(e) => handleResourceChange(i, e.target.value, true)}
                className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800"
              />
            </div>
          ))}
        </div>
      </div>
      <div>
        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Available Resources</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {availableResources.map((value, i) => (
            <div key={i} className="p-4 rounded-lg" style={{ backgroundColor: RESOURCE_COLORS[String.fromCharCode(65 + i)] + '20' }}>
              <div className="flex items-center mb-2">
                <div 
                  className="w-4 h-4 rounded-full mr-2"
                  style={{ backgroundColor: RESOURCE_COLORS[String.fromCharCode(65 + i)] }}
                ></div>
                <span className="font-medium">Resource {String.fromCharCode(65 + i)}</span>
              </div>
              <div className="px-3 py-2 bg-white dark:bg-gray-800 rounded-md font-medium text-center">
                {value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Render detection history
  const renderDetectionHistory = () => (
    <div className="mb-6">
      <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Detection Process</h4>
      <div className="space-y-4">
        {detectionHistory.map((step, i) => (
          <div key={i} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border-l-4 border-blue-500">
            <p className="text-lg font-medium mb-2">
              Step {step.step}: Checking Process P{step.process + 1}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="font-medium text-sm mb-1">Request Vector:</p>
                <div className="flex flex-wrap gap-2">
                  {step.request.map((req, j) => (
                    <span key={j} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 rounded">
                      R{j + 1}: {req}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="font-medium text-sm mb-1">Available Resources:</p>
                <div className="flex flex-wrap gap-2">
                  {step.work.map((w, j) => (
                    <span key={j} className="px-2 py-1 bg-green-100 dark:bg-green-900 rounded">
                      R{j + 1}: {w}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-3">
              <p className="font-medium text-sm mb-1">Current Allocation:</p>
              <div className="flex flex-wrap gap-2">
                {step.allocation.map((alloc, j) => (
                  <span key={j} className="px-2 py-1 bg-purple-100 dark:bg-purple-900 rounded">
                    R{j + 1}: {alloc}
                  </span>
                ))}
              </div>
            </div>
            <p className="mt-3 text-green-600 dark:text-green-400">
              ✓ Process can complete because all requested resources are available
            </p>
          </div>
        ))}
      </div>
    </div>
  );

  // Render resolution visualization
  const renderResolutionVisualization = () => {
    if (!showResolutionAnimation) return null;

    const step = resolutionSteps[currentStep];
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg shadow-lg p-6">
          <h4 className="text-xl font-medium text-blue-900 dark:text-blue-100 mb-4">
            Resolution Step {currentStep + 1} of {resolutionSteps.length}
          </h4>

          {/* Resolution Explanation */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6">
            <h5 className="text-lg font-medium mb-3">What's happening in this step?</h5>
            <p className="text-gray-700 dark:text-gray-300">
              We are resolving the deadlock by terminating Process P{step.processId + 1}. This process
              was chosen because it has the least amount of allocated resources, minimizing the impact
              of termination.
            </p>
          </div>
          
          {/* Process States Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {step.processStates.map((process) => (
              <div
                key={process.id}
                className={`rounded-lg p-4 transform transition-all duration-300 ${
                  process.isTerminated
                    ? 'bg-red-100 dark:bg-red-900/20 scale-95'
                    : process.isDeadlocked
                    ? 'bg-yellow-100 dark:bg-yellow-900/20'
                    : 'bg-green-100 dark:bg-green-900/20'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-lg">P{process.id + 1}</span>
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    process.isTerminated
                      ? 'bg-red-200 text-red-800'
                      : process.isDeadlocked
                      ? 'bg-yellow-200 text-yellow-800'
                      : 'bg-green-200 text-green-800'
                  }`}>
                    {process.isTerminated ? 'Terminated' : process.isDeadlocked ? 'Deadlocked' : 'Running'}
                  </span>
                </div>
                
                <div className="space-y-2">
                  {process.allocation.map((amount, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: RESOURCE_COLORS[String.fromCharCode(65 + i)] }}
                        ></div>
                        <span>Resource {String.fromCharCode(65 + i)}</span>
                      </div>
                      <span className="font-medium">{amount}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Resource Changes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
              <h6 className="font-medium mb-3">Resources Being Released</h6>
              <div className="grid grid-cols-2 gap-3">
                {step.resourcesReleased.map((amount, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-lg"
                       style={{ backgroundColor: RESOURCE_COLORS[String.fromCharCode(65 + i)] + '20' }}>
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: RESOURCE_COLORS[String.fromCharCode(65 + i)] }}
                      ></div>
                      <span>R{String.fromCharCode(65 + i)}</span>
                    </div>
                    <span className="font-medium">+{amount}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
              <h6 className="font-medium mb-3">New Available Resources</h6>
              <div className="grid grid-cols-2 gap-3">
                {step.availableAfter.map((amount, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-lg"
                       style={{ backgroundColor: RESOURCE_COLORS[String.fromCharCode(65 + i)] + '20' }}>
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: RESOURCE_COLORS[String.fromCharCode(65 + i)] }}
                      ></div>
                      <span>R{String.fromCharCode(65 + i)}</span>
                    </div>
                    <span className="font-medium">{amount}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Progress and Controls */}
          <div className="mt-6">
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span>Progress</span>
                <span>{Math.round(((currentStep + 1) / resolutionSteps.length) * 100)}%</span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                <div 
                  className="h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / resolutionSteps.length) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <button
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={nextResolutionStep}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-md hover:from-blue-600 hover:to-purple-600"
              >
                {currentStep < resolutionSteps.length - 1 ? 'Next Step' : 'Finish'}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  // Detect deadlock using RAG
  const detectRAGDeadlock = () => {
    const work = [...availableResources];
    const finish = Array(numProcesses).fill(false);
    let found;

    do {
      found = false;
      for (let i = 0; i < numProcesses; i++) {
        if (!finish[i]) {
          let canComplete = true;
          
          // Check if process can complete with available resources
          for (let j = 0; j < numResources; j++) {
            if (requestMatrix[i][j] > work[j]) {
              canComplete = false;
              break;
            }
          }
          
          if (canComplete) {
            // Process can complete, release its resources
            for (let j = 0; j < numResources; j++) {
              work[j] += allocationMatrix[i][j];
            }
            finish[i] = true;
            found = true;
          }
        }
      }
    } while (found);

    // Check if any process is unfinished
    const deadlock = finish.some(f => !f);
    setRagDeadlockDetected(deadlock);
    return deadlock;
  };

  // Render RAG visualization
  const renderRAG = () => (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h4 className="text-lg font-medium text-gray-900 dark:text-white">Resource Allocation Graph</h4>
          <div className="flex items-center mt-2 space-x-4">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-[#4ECDC4] mr-2"></div>
              <span className="text-sm">Process Node</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-[#FF6B6B] mr-2"></div>
              <span className="text-sm">Resource Node</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-0.5 bg-[#4ECDC4] mr-2"></div>
              <span className="text-sm">Allocation</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-0.5 bg-[#FF6B6B] mr-2"></div>
              <span className="text-sm">Request</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => setShowRAG(!showRAG)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {showRAG ? 'Hide RAG' : 'Show RAG'}
        </button>
      </div>
      
      {showRAG && ragData && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 h-[500px] border border-gray-200 dark:border-gray-700">
          <ForceGraph2D
            graphData={ragData}
            nodeLabel="id"
            linkLabel={link => `${link.value}`}
            linkDirectionalArrowLength={6}
            linkDirectionalArrowRelPos={0.5}
            linkCurvature={link => link.curvature}
            linkColor={link => link.color}
            nodeColor={node => node.color}
            nodeRelSize={6}
            width={800}
            height={500}
            backgroundColor="transparent"
            linkWidth={2}
            d3AlphaDecay={0.1}
            d3VelocityDecay={0.1}
            cooldownTime={2000}
            nodeCanvasObject={(node, ctx, globalScale) => {
              const label = node.id;
              const fontSize = 14/globalScale;
              ctx.font = `${fontSize}px Sans-Serif`;
              ctx.fillStyle = node.color;
              ctx.beginPath();
              ctx.arc(node.x, node.y, node.size/globalScale, 0, 2 * Math.PI);
              ctx.fill();
              ctx.fillStyle = node.type === 'process' ? '#fff' : '#000';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillText(label, node.x, node.y);
            }}
            linkCanvasObjectMode={() => "after"}
            linkCanvasObject={(link, ctx, globalScale) => {
              const start = link.source;
              const end = link.target;
              const textPos = Object.assign({}, start);
              textPos.x = start.x + (end.x - start.x) * 0.5;
              textPos.y = start.y + (end.y - start.y) * 0.5;
              
              const relLink = { x: end.x - start.x, y: end.y - start.y };
              const textAngle = Math.atan2(relLink.y, relLink.x);
              
              ctx.font = `${12/globalScale}px Sans-Serif`;
              ctx.fillStyle = link.color;
              ctx.save();
              ctx.translate(textPos.x, textPos.y);
              ctx.rotate(textAngle);
              ctx.textAlign = 'center';
              ctx.textBaseline = 'bottom';
              ctx.fillText(link.value, 0, -2);
              ctx.restore();
            }}
            enableNodeDrag={false}
            enableZoomInteraction={false}
            enablePanInteraction={false}
          />
        </div>
      )}

      {ragDeadlockDetected && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <h5 className="text-lg font-medium text-red-900 dark:text-red-100 mb-2">
            Deadlock Detected in RAG!
          </h5>
          <p className="text-red-800 dark:text-red-200">
            The Resource Allocation Graph shows a cycle, indicating a deadlock in the system.
            Look for cycles where processes are waiting for resources held by other processes in the cycle.
          </p>
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{title}</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">{description}</p>

      {/* Configuration Section */}
      {!isConfigured ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Number of Processes
              </label>
              <input
                type="number"
                min="2"
                max="10"
                value={numProcesses}
                onChange={(e) => setNumProcesses(parseInt(e.target.value) || 2)}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Number of Resources
              </label>
              <input
                type="number"
                min="1"
                max="8"
                value={numResources}
                onChange={(e) => setNumResources(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
          </div>

          {renderResourceConfig()}
          {renderMatrixInput(allocationMatrix, setAllocationMatrix, "Allocation Matrix")}
          {renderMatrixInput(requestMatrix, setRequestMatrix, "Request Matrix")}

          <div className="flex justify-end">
            <button
              onClick={initializeSimulation}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Initialize Simulation
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Add RAG visualization */}
          {renderRAG()}

          {/* Simulation Interface */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {renderMatrixInput(allocationMatrix, setAllocationMatrix, "Current Allocation Matrix", true)}
            {renderMatrixInput(requestMatrix, setRequestMatrix, "Request Matrix", true)}
          </div>

          {renderResourceConfig()}

          {deadlockedProcesses.length > 0 && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <h4 className="text-lg font-medium text-red-900 dark:text-red-100 mb-2">
                Deadlock Detected!
              </h4>
              <p className="text-red-800 dark:text-red-200">
                Deadlocked Processes: {deadlockedProcesses.map(p => `P${p + 1}`).join(', ')}
              </p>
              {!isResolving && (
                <button
                  onClick={startResolution}
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Start Resolution
                </button>
              )}
            </div>
          )}

          {renderDetectionHistory()}
          {renderResolutionVisualization()}

          <div className="flex space-x-4">
            <button
              onClick={detectDeadlocks}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center"
              disabled={isResolving}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Detect Deadlocks
            </button>
            <button
              onClick={resetSimulation}
              className="px-6 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors duration-200 flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reset Simulation
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeadlockDetectionResolution; 
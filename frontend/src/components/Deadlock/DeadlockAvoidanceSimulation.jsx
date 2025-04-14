import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const DeadlockAvoidanceSimulation = ({ title, description, onReady }) => {
  // Configuration state
  const [isConfigured, setIsConfigured] = useState(false);
  const [numProcesses, setNumProcesses] = useState(4);
  const [numResources, setNumResources] = useState(3);
  const [resourceConfigs, setResourceConfigs] = useState([]);
  const [processConfigs, setProcessConfigs] = useState([]);
  
  // Resources - each with a name, total instances, and currently available instances
  const [resources, setResources] = useState([]);
  
  // Processes - each with max claim, current allocation, and remaining need
  const [processes, setProcesses] = useState([]);

  const [pendingResourceRequest, setPendingResourceRequest] = useState(null);
  const [selectedProcess, setSelectedProcess] = useState(null);
  const [selectedResource, setSelectedResource] = useState(null);
  const [requestAmount, setRequestAmount] = useState(1);
  const [explanationText, setExplanationText] = useState('Welcome to the Banker\'s Algorithm Simulation. First, configure your system parameters.');
  const [safeSequence, setSafeSequence] = useState([]);
  const [showSafeSequence, setShowSafeSequence] = useState(false);
  const [historyLog, setHistoryLog] = useState([]);
  const historyEndRef = useRef(null);
  
  // Add a state for showing/hiding the tutorial
  const [showTutorial, setShowTutorial] = useState(true);
  // Add a state for the current tutorial step
  const [tutorialStep, setTutorialStep] = useState(0);
  // Add state to control auto-scrolling behavior
  const [autoScroll, setAutoScroll] = useState(false);
  // Add state to track if we're showing the safety visualization
  const [showSafetyVisualization, setShowSafetyVisualization] = useState(false);

  // Add new state for batch allocation
  const [showBatchAllocation, setShowBatchAllocation] = useState(false);
  const [batchAllocations, setBatchAllocations] = useState([]);

  useEffect(() => {
    if (onReady) {
      onReady();
    }
  }, [onReady]);

  // Initialize resource configurations when numResources changes
  useEffect(() => {
    const colors = ['#FF6B6B', '#4ECDC4', '#FFD166', '#95A5A6', '#E74C3C', '#3498DB', '#2ECC71', '#F1C40F'];
    const newResourceConfigs = Array(numResources).fill().map((_, index) => ({
      id: index,
      name: `Resource ${String.fromCharCode(65 + index)}`,
      total: 10,
      available: 10,
      color: colors[index % colors.length]
    }));
    setResourceConfigs(newResourceConfigs);
  }, [numResources]);

  // Initialize process configurations when numProcesses changes
  useEffect(() => {
    const newProcessConfigs = Array(numProcesses).fill().map((_, index) => {
      const maxClaim = Array(numResources).fill(5);
      const allocation = Array(numResources).fill(0);
      return {
        id: index,
        name: `Process ${index + 1}`,
        maxClaim: maxClaim,
        allocation: allocation,
        need: maxClaim.map((claim, idx) => claim - allocation[idx]) // Calculate need based on maxClaim - allocation
      };
    });
    setProcessConfigs(newProcessConfigs);
  }, [numProcesses, numResources]);

  // Initialize batch allocations when processes or resources change
  useEffect(() => {
    const newBatchAllocations = Array(numProcesses).fill().map(() => 
      Array(numResources).fill(0)
    );
    setBatchAllocations(newBatchAllocations);
  }, [numProcesses, numResources]);

  // Handle resource configuration changes
  const handleResourceConfigChange = (index, field, value) => {
    const newConfigs = [...resourceConfigs];
    newConfigs[index] = {
      ...newConfigs[index],
      [field]: parseInt(value) || 0
    };
    setResourceConfigs(newConfigs);
  };

  // Handle process configuration changes
  const handleProcessConfigChange = (processIndex, resourceIndex, field, value) => {
    const newConfigs = [...processConfigs];
    const parsedValue = parseInt(value) || 0;
    
    if (field === 'maxClaim') {
      newConfigs[processIndex] = {
        ...newConfigs[processIndex],
        maxClaim: newConfigs[processIndex].maxClaim.map((val, idx) => 
          idx === resourceIndex ? parsedValue : val
        ),
        // Recalculate need when maxClaim changes
        need: newConfigs[processIndex].maxClaim.map((val, idx) => 
          idx === resourceIndex ? parsedValue - newConfigs[processIndex].allocation[idx] : val - newConfigs[processIndex].allocation[idx]
        )
      };
    }
    setProcessConfigs(newConfigs);
  };

  // Handle batch allocation changes
  const handleBatchAllocationChange = (processIndex, resourceIndex, value) => {
    const newAllocations = [...batchAllocations];
    newAllocations[processIndex][resourceIndex] = parseInt(value) || 0;
    setBatchAllocations(newAllocations);
  };

  // Initialize simulation with user configuration
  const initializeSimulation = () => {
    // Validate configurations
    const totalResources = resourceConfigs.reduce((sum, res) => sum + res.total, 0);
    const totalClaims = processConfigs.reduce((sum, proc) => 
      sum + proc.maxClaim.reduce((pSum, claim) => pSum + claim, 0), 0
    );

    if (totalClaims > totalResources) {
      setExplanationText('Error: Total maximum claims cannot exceed total available resources.');
      return;
    }

    // Set up resources
    setResources(resourceConfigs.map(config => ({
      ...config,
      available: config.total
    })));

    // Set up processes with correct need calculation
    setProcesses(processConfigs.map(config => ({
      ...config,
      state: 'waiting',
      nextRequest: null,
      isPending: false,
      isSafe: true,
      need: config.maxClaim.map((claim, idx) => claim - config.allocation[idx]) // Ensure need is correctly calculated
    })));

    setIsConfigured(true);
    setExplanationText('System configured successfully. You can now start making resource requests.');
    setHistoryLog(prevLog => [...prevLog, { 
      message: `System initialized with ${numProcesses} processes and ${numResources} resources.`, 
      type: 'info' 
    }]);
  };

  // Reset the simulation
  const resetSimulation = () => {
    setIsConfigured(false);
    setResources([]);
    setProcesses([]);
    setSelectedProcess(null);
    setSelectedResource(null);
    setRequestAmount(1);
    setPendingResourceRequest(null);
    setExplanationText('Simulation reset. Please configure the system parameters.');
    setSafeSequence([]);
    setShowSafeSequence(false);
    setShowSafetyVisualization(false);
    setHistoryLog(prevLog => [...prevLog, { message: 'Simulation has been reset.', type: 'info' }]);
  };

  useEffect(() => {
    // Only scroll the history log container if autoScroll is enabled
    if (autoScroll && historyEndRef.current) {
      const historyContainer = document.querySelector('.history-log-container');
      if (historyContainer) {
        historyContainer.scrollTop = historyContainer.scrollHeight;
      }
    }
  }, [historyLog, autoScroll]);

  // Function to manually scroll to the latest log entry
  const scrollToLatestLog = () => {
    if (historyEndRef.current) {
      // Use scrollIntoView with a specific container instead of the whole page
      const historyContainer = document.querySelector('.history-log-container');
      if (historyContainer) {
        historyContainer.scrollTop = historyContainer.scrollHeight;
      }
    }
  };

  // Handle process selection
  const handleProcessSelect = (process) => {
    setSelectedProcess(process);
    setSelectedResource(null);
    setRequestAmount(1);
  };

  // Handle resource selection
  const handleResourceSelect = (resource) => {
    if (!selectedProcess) return;
    setSelectedResource(resource);
    // Set default amount to 1 or max of what the process needs, whichever is less
    const maxNeed = selectedProcess.need[resource.id];
    setRequestAmount(Math.min(1, maxNeed));
  };

  // Update request amount
  const handleRequestAmountChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0) {
      setRequestAmount(value);
    }
  };

  // Check if a request is safe using the Banker's Algorithm
  const isSafeState = (tempProcesses, tempResources) => {
    // Create copies for the algorithm
    const work = [...tempResources.map(r => r.available)];
    const finish = tempProcesses.map(() => false);
    let safeSeq = [];

    // Find a process that can finish with available resources
    let foundOne = true;
    while (foundOne) {
      foundOne = false;
      for (let i = 0; i < tempProcesses.length; i++) {
        if (!finish[i]) {
          // Check if all needs can be satisfied with available resources
          let canAllocate = true;
          for (let j = 0; j < work.length; j++) {
            if (tempProcesses[i].need[j] > work[j]) {
              canAllocate = false;
              break;
            }
          }

          if (canAllocate) {
            // This process can complete, add its resources back to available
            for (let j = 0; j < work.length; j++) {
              work[j] += tempProcesses[i].allocation[j];
            }
            finish[i] = true;
            foundOne = true;
            safeSeq.push(tempProcesses[i].id);
          }
        }
      }
    }

    // If all processes can finish, the state is safe
    const isSafe = finish.every(f => f);
    if (isSafe) {
      setSafeSequence(safeSeq);
    }
    return isSafe;
  };

  // Process a resource request
  const processRequest = () => {
    if (!selectedProcess || !selectedResource || requestAmount <= 0) {
      setExplanationText('Please select a process, a resource, and specify a valid amount.');
      return;
    }

    // Check if request exceeds max claim
    if (requestAmount > selectedProcess.need[selectedResource.id]) {
      setExplanationText(`Error: Request exceeds the process's maximum claim for this resource.`);
      setHistoryLog(prevLog => [...prevLog, { 
        message: `Request denied: Process ${selectedProcess.name} tried to request ${requestAmount} units of ${selectedResource.name}, exceeding its maximum claim.`, 
        type: 'warning' 
      }]);
      return;
    }

    // Check if enough resources are available
    if (requestAmount > selectedResource.available) {
      setExplanationText(`Error: Not enough resources available. Request denied.`);
      setHistoryLog(prevLog => [...prevLog, { 
        message: `Request denied: Not enough ${selectedResource.name} available (${selectedResource.available} available, ${requestAmount} requested).`, 
        type: 'warning' 
      }]);
      return;
    }

    // Create temporary state to check if the allocation would be safe
    const tempProcesses = JSON.parse(JSON.stringify(processes));
    const tempResources = JSON.parse(JSON.stringify(resources));
    
    const processIndex = tempProcesses.findIndex(p => p.id === selectedProcess.id);
    const resourceIndex = tempResources.findIndex(r => r.id === selectedResource.id);
    
    // Allocate resources temporarily
    tempResources[resourceIndex].available -= requestAmount;
    tempProcesses[processIndex].allocation[selectedResource.id] += requestAmount;
    tempProcesses[processIndex].need[selectedResource.id] -= requestAmount;
    
    // Check if this state is safe
    const safe = isSafeState(tempProcesses, tempResources);
    
    if (safe) {
      // Apply the changes
      const newProcesses = [...processes];
      const newResources = [...resources];
      
      newResources[resourceIndex].available -= requestAmount;
      newProcesses[processIndex].allocation[selectedResource.id] += requestAmount;
      newProcesses[processIndex].need[selectedResource.id] -= requestAmount;
      
      setResources(newResources);
      setProcesses(newProcesses);
      
      const logMessage = `Process ${selectedProcess.name} was granted ${requestAmount} units of ${selectedResource.name}. System remains in a safe state.`;
      setHistoryLog(prevLog => [...prevLog, { message: logMessage, type: 'success' }]);
      setExplanationText(`Request granted. The system remains in a safe state with safe sequence: ${safeSequence.map(id => 'P'+(id+1)).join(' → ')}`);
      setShowSafeSequence(true);
      setShowSafetyVisualization(true);
    } else {
      const logMessage = `Process ${selectedProcess.name} was denied ${requestAmount} units of ${selectedResource.name}. Request would lead to an unsafe state.`;
      setHistoryLog(prevLog => [...prevLog, { message: logMessage, type: 'danger' }]);
      setExplanationText('Request denied. Allocating these resources would lead to a potential deadlock (unsafe state).');
    }
    
    // Reset selections
    setSelectedProcess(null);
    setSelectedResource(null);
    setRequestAmount(1);
  };

  // Release all resources from a process
  const releaseAllResources = (process) => {
    const processIndex = processes.findIndex(p => p.id === process.id);
    if (processIndex === -1) return;
    
    const newProcesses = [...processes];
    const newResources = [...resources];
    
    // Return all allocated resources to available
    for (let i = 0; i < resources.length; i++) {
      const allocatedAmount = processes[processIndex].allocation[i];
      if (allocatedAmount > 0) {
        newResources[i].available += allocatedAmount;
        newProcesses[processIndex].allocation[i] = 0;
        newProcesses[processIndex].need[i] = newProcesses[processIndex].maxClaim[i];
      }
    }
    
    setProcesses(newProcesses);
    setResources(newResources);
    
    const logMessage = `All resources held by ${process.name} have been released.`;
    setHistoryLog(prevLog => [...prevLog, { message: logMessage, type: 'info' }]);
    setExplanationText(logMessage);
  };
  
  // Tutorial content
  const tutorialSteps = [
    {
      title: "What is Deadlock Avoidance?",
      content: "Deadlock avoidance is a strategy used by operating systems to prevent deadlocks by carefully managing resource allocations. Unlike deadlock detection, which identifies deadlocks after they occur, avoidance prevents them from happening in the first place."
    },
    {
      title: "The Banker's Algorithm",
      content: "The Banker's Algorithm is a deadlock avoidance algorithm that determines whether granting a resource request will lead to an unsafe state (potential deadlock). It requires knowing in advance:\n• The maximum number of resources each process may request\n• The current allocation of resources to each process\n• The available resources in the system"
    },
    {
      title: "Safe vs. Unsafe States",
      content: "A state is considered 'safe' if there exists at least one sequence of resource allocations that allows all processes to complete. An 'unsafe' state doesn't guarantee a deadlock will occur, but it makes deadlock possible. The Banker's Algorithm only grants requests that keep the system in a safe state."
    },
    {
      title: "How to Use This Simulation",
      content: "1. Select a process that wants to request resources\n2. Select which resource type to request\n3. Specify the amount of resources to request\n4. Click 'Process Request' to evaluate if the request can be safely granted\n5. If granted, the resource will be allocated and the system state updated\n6. If denied, it means the request would lead to an unsafe state\n7. You can release resources from processes at any time"
    }
  ];

  // Render the tutorial overlay
  const renderTutorial = () => {
    if (!showTutorial) return null;
    
    return (
      <motion.div 
        className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full p-6 shadow-xl">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {tutorialSteps[tutorialStep].title}
          </h3>
          <div className="text-gray-700 dark:text-gray-300 mb-6 whitespace-pre-line">
            {tutorialSteps[tutorialStep].content}
          </div>
          
          <div className="flex justify-between">
            <button 
              onClick={() => tutorialStep > 0 ? setTutorialStep(tutorialStep - 1) : setShowTutorial(false)}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              {tutorialStep > 0 ? 'Previous' : 'Skip Tutorial'}
            </button>
            
            <button 
              onClick={() => {
                if (tutorialStep < tutorialSteps.length - 1) {
                  setTutorialStep(tutorialStep + 1);
                } else {
                  setShowTutorial(false);
                }
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {tutorialStep < tutorialSteps.length - 1 ? 'Next' : 'Start Simulation'}
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  // Add a help button to show the tutorial again
  const renderHelpButton = () => {
    if (showTutorial) return null;
    
    return (
      <button
        onClick={() => {
          setShowTutorial(true);
          setTutorialStep(0);
        }}
        className="absolute top-2 right-2 p-2 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800"
        title="Show Tutorial"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
        </svg>
      </button>
    );
  };

  // Render a visual representation of the safe sequence
  const renderSafeSequence = () => {
    if (!showSafeSequence || safeSequence.length === 0) return null;
    
    return (
      <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
        <h4 className="text-base font-semibold text-green-800 dark:text-green-300 mb-2">Safe Execution Sequence Found:</h4>
        <div className="flex flex-wrap items-center justify-center">
          {safeSequence.map((processId, index) => (
            <React.Fragment key={processId}>
              <div className="bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 px-3 py-2 rounded-lg font-medium">
                {processes.find(p => p.id === processId)?.name || `Process ${processId+1}`}
              </div>
              {index < safeSequence.length - 1 && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mx-2 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              )}
            </React.Fragment>
          ))}
        </div>
        <p className="text-sm text-green-600 dark:text-green-400 mt-2 text-center">
          This sequence guarantees that all processes can complete without deadlock.
        </p>
      </div>
    );
  };

  // Render a visual representation of the bankers algorithm calculation
  const renderSafetyCalculation = () => {
    if (!showSafetyVisualization) return null;
    
    return (
      <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
        <h4 className="text-base font-semibold text-blue-800 dark:text-blue-300 mb-2">Banker's Algorithm Safety Check</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-2 border-b">Step</th>
                <th className="px-4 py-2 border-b">Available Resources</th>
                <th className="px-4 py-2 border-b">Process</th>
                <th className="px-4 py-2 border-b">Need</th>
                <th className="px-4 py-2 border-b">Can Complete?</th>
                <th className="px-4 py-2 border-b">Resources Released</th>
              </tr>
            </thead>
            <tbody>
              {safeSequence.map((processId, index) => {
                const process = processes.find(p => p.id === processId);
                const availableAtStep = [...resources.map(r => r.available)];
                
                // Calculate available resources at this step
                for (let i = 0; i < index; i++) {
                  const prevProcessId = safeSequence[i];
                  const prevProcess = processes.find(p => p.id === prevProcessId);
                  
                  prevProcess.allocation.forEach((alloc, resourceIdx) => {
                    availableAtStep[resourceIdx] += alloc;
                  });
                }
                
                return (
                  <tr key={processId} className="border-b border-gray-200 dark:border-gray-700">
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">
                      {availableAtStep.map((avail, idx) => (
                        <span key={idx} className="inline-flex items-center mr-2">
                          <span className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: resources[idx].color }}></span>
                          <span>{avail}</span>
                        </span>
                      ))}
                    </td>
                    <td className="px-4 py-2 font-medium">{process.name}</td>
                    <td className="px-4 py-2">
                      {process.need.map((need, idx) => (
                        <span key={idx} className="inline-flex items-center mr-2">
                          <span className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: resources[idx].color }}></span>
                          <span>{need}</span>
                        </span>
                      ))}
                    </td>
                    <td className="px-4 py-2 text-green-600 dark:text-green-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </td>
                    <td className="px-4 py-2">
                      {process.allocation.map((alloc, idx) => (
                        <span key={idx} className="inline-flex items-center mr-2">
                          <span className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: resources[idx].color }}></span>
                          <span>{alloc}</span>
                        </span>
                      ))}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">
          This table shows the step-by-step execution of the Banker's Algorithm to find a safe sequence.
        </p>
      </div>
    );
  };

  // Render the configuration panel
  const renderConfigurationPanel = () => {
    if (isConfigured) return null;

    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">System Configuration</h3>
        
        {/* Basic Parameters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Number of Processes
            </label>
            <input
              type="number"
              min="1"
              max="8"
              value={numProcesses}
              onChange={(e) => setNumProcesses(parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Number of Resource Types
            </label>
            <input
              type="number"
              min="1"
              max="8"
              value={numResources}
              onChange={(e) => setNumResources(parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        {/* Resource Configuration */}
        <div className="mb-6">
          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Resource Configuration</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {resourceConfigs.map((resource, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <div
                    className="w-4 h-4 rounded-full mr-2"
                    style={{ backgroundColor: resource.color }}
                  ></div>
                  <span className="font-medium text-gray-900 dark:text-white">{resource.name}</span>
                </div>
                <div className="space-y-2">
                  <div>
                    <label className="block text-sm text-gray-600 dark:text-gray-400">Total Instances</label>
                    <input
                      type="number"
                      min="1"
                      value={resource.total}
                      onChange={(e) => handleResourceConfigChange(index, 'total', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Process Configuration */}
        <div className="mb-6">
          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Process Configuration</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-500 dark:text-gray-300">Process</th>
                  {resourceConfigs.map((resource, idx) => (
                    <th key={idx} className="px-4 py-2 border-b text-left text-sm font-medium text-gray-500 dark:text-gray-300">
                      {resource.name} Max Claim
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {processConfigs.map((process, processIdx) => (
                  <tr key={processIdx} className="border-b border-gray-200 dark:border-gray-700">
                    <td className="px-4 py-2 text-sm font-medium text-gray-900 dark:text-white">
                      {process.name}
                    </td>
                    {process.maxClaim.map((claim, resourceIdx) => (
                      <td key={resourceIdx} className="px-4 py-2">
                        <input
                          type="number"
                          min="0"
                          max={resourceConfigs[resourceIdx].total}
                          value={claim}
                          onChange={(e) => handleProcessConfigChange(processIdx, resourceIdx, 'maxClaim', e.target.value)}
                          className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Initialize Button */}
        <div className="flex justify-end">
          <button
            onClick={initializeSimulation}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Initialize Simulation
          </button>
        </div>
      </div>
    );
  };

  // Process batch allocation request
  const processBatchAllocation = () => {
    // Create temporary state to check if allocation would be safe
    const tempProcesses = JSON.parse(JSON.stringify(processes));
    const tempResources = JSON.parse(JSON.stringify(resources));

    // Check if requested allocations exceed available resources
    for (let r = 0; r < numResources; r++) {
      const totalRequested = batchAllocations.reduce((sum, proc) => sum + proc[r], 0);
      if (totalRequested > resources[r].total) {
        setExplanationText(`Error: Total requested ${resources[r].name} (${totalRequested}) exceeds available resources (${resources[r].total})`);
        return;
      }
    }

    // Apply the allocations to temporary state
    for (let p = 0; p < numProcesses; p++) {
      for (let r = 0; r < numResources; r++) {
        tempProcesses[p].allocation[r] = batchAllocations[p][r];
        tempProcesses[p].need[r] = tempProcesses[p].maxClaim[r] - batchAllocations[p][r];
        tempResources[r].available = tempResources[r].total - batchAllocations[p][r];
      }
    }

    // Check if this state would be safe
    const safe = isSafeState(tempProcesses, tempResources);

    if (safe) {
      // Apply the changes
      setProcesses(tempProcesses);
      setResources(tempResources);
      setShowBatchAllocation(false);
      setExplanationText(`Batch allocation successful. The system remains in a safe state with safe sequence: ${safeSequence.map(id => 'P'+(id+1)).join(' → ')}`);
      setHistoryLog(prevLog => [...prevLog, { 
        message: 'Batch allocation completed successfully. System is in a safe state.', 
        type: 'success' 
      }]);
      setShowSafeSequence(true);
      setShowSafetyVisualization(true);
    } else {
      setExplanationText('Error: The requested allocation would lead to an unsafe state (potential deadlock).');
      setHistoryLog(prevLog => [...prevLog, { 
        message: 'Batch allocation denied: Would lead to unsafe state.', 
        type: 'danger' 
      }]);
    }
  };

  // Render batch allocation interface
  const renderBatchAllocationPanel = () => {
    if (!showBatchAllocation) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Batch Resource Allocation</h3>
          
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-2 border-b">Process</th>
                  {resources.map((resource) => (
                    <th key={resource.id} className="px-4 py-2 border-b">
                      <div className="flex items-center justify-center space-x-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: resource.color }}
                        ></div>
                        <span>{resource.name}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {processes.map((process, processIdx) => (
                  <tr key={process.id} className="border-b">
                    <td className="px-4 py-2 font-medium">{process.name}</td>
                    {resources.map((resource, resourceIdx) => (
                      <td key={resource.id} className="px-4 py-2">
                        <input
                          type="number"
                          min="0"
                          max={Math.min(process.maxClaim[resourceIdx], resource.total)}
                          value={batchAllocations[processIdx][resourceIdx]}
                          onChange={(e) => handleBatchAllocationChange(processIdx, resourceIdx, e.target.value)}
                          className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Max: {Math.min(process.maxClaim[resourceIdx], resource.total)}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={() => setShowBatchAllocation(false)}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={processBatchAllocation}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Apply Allocations
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
      {renderTutorial()}
      {renderHelpButton()}
      {renderBatchAllocationPanel()}
      
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{title}</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">{description}</p>

      {/* Configuration Panel */}
      {renderConfigurationPanel()}

      {/* Only show the simulation interface if configured */}
      {isConfigured && (
        <>
          {/* Add Batch Allocation Button */}
          <div className="mb-6">
            <button
              onClick={() => setShowBatchAllocation(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Open Batch Allocation
            </button>
          </div>

          {/* Instructional Panel */}
          <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-300 mb-2">How to operate this simulation</h3>
            <ol className="list-decimal pl-5 text-blue-800 dark:text-blue-200 space-y-2">
              <li>Select a <strong>process</strong> from the process table that needs resources</li>
              <li>Select a <strong>resource type</strong> from the available resources section</li>
              <li>Specify the <strong>amount</strong> of that resource the process needs</li>
              <li>Click <strong>Process Request</strong> to check if it can be granted safely</li>
              <li>If the request is granted, you'll see the system state update and a safe sequence will be shown</li>
              <li>If the request is denied, it would have led to an unsafe state (potential deadlock)</li>
              <li>You can <strong>Release Resources</strong> from a process to free them up for other processes</li>
              <li>Use <strong>Reset Simulation</strong> to start over with the initial state</li>
            </ol>
          </div>

          {/* Explanation Panel - Dynamic content based on simulation state */}
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Current Status: 
              <span className="ml-2 text-blue-600 dark:text-blue-400">
                {selectedProcess ? `Configuring request for ${selectedProcess.name}` : 'Ready for resource requests'}
              </span>
            </h3>
            <p className="text-gray-700 dark:text-gray-300">{explanationText}</p>
            
            {/* Safe Sequence Visualization */}
            {renderSafeSequence()}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Available Resources Panel */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Available Resources</h3>
              <div className="space-y-3">
                {resources.map((resource) => (
                  <div
                    key={resource.id}
                    className={`flex items-center p-3 rounded-lg transition-colors cursor-pointer ${
                      selectedResource && selectedResource.id === resource.id 
                        ? 'bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-800' 
                        : 'bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                    onClick={() => handleResourceSelect(resource)}
                  >
                    <div
                      className="w-4 h-4 rounded-full mr-2"
                      style={{ backgroundColor: resource.color }}
                    ></div>
                    <span className="flex-grow text-gray-700 dark:text-gray-300">{resource.name}</span>
                    <div className="text-right">
                      <span className="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-800 dark:text-gray-200">
                        {resource.available} / {resource.total} available
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                <p>Click on a resource to select it for a request. The Banker's Algorithm will check if allocating it keeps the system in a safe state.</p>
              </div>
            </div>

            {/* Request Configuration Panel */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Configure Resource Request</h3>
              
              {selectedProcess && selectedResource ? (
                <div className="space-y-4">
                  <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/30">
                    <p className="text-blue-800 dark:text-blue-200 mb-1">
                      Request <span className="font-medium">{selectedResource.name}</span> for <span className="font-medium">{selectedProcess.name}</span>
                    </p>
                    <div className="flex items-center mt-3">
                      <label className="mr-3 text-blue-700 dark:text-blue-300">Amount:</label>
                      <input
                        type="number"
                        min="1"
                        max={Math.min(selectedProcess.need[selectedResource.id], selectedResource.available)}
                        value={requestAmount}
                        onChange={handleRequestAmountChange}
                        className="w-16 px-2 py-1 border border-blue-300 dark:border-blue-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                      <span className="ml-2 text-sm text-blue-600 dark:text-blue-400">
                        (Max: {Math.min(selectedProcess.need[selectedResource.id], selectedResource.available)})
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-4">
                      <button
                        onClick={processRequest}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        Process Request
                      </button>
                      
                      <button
                        onClick={() => {
                          setSelectedProcess(null);
                          setSelectedResource(null);
                        }}
                        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Request Context</h4>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Need</p>
                        <p className="font-medium text-gray-800 dark:text-gray-200">{selectedProcess.need[selectedResource.id]}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Allocated</p>
                        <p className="font-medium text-gray-800 dark:text-gray-200">{selectedProcess.allocation[selectedResource.id]}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Available</p>
                        <p className="font-medium text-gray-800 dark:text-gray-200">{selectedResource.available}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-40 flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <p className="text-gray-500 dark:text-gray-400 text-center">
                    {selectedProcess 
                      ? "Select a resource type to request" 
                      : "Select a process from the process table below"}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Process Table - Enhanced with better formatting and more information */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Process Table</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Process</th>
                    <th className="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Max Claim
                      <div className="font-normal text-xs text-gray-400">Maximum resources needed</div>
                    </th>
                    <th className="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Allocation
                      <div className="font-normal text-xs text-gray-400">Current resources held</div>
                    </th>
                    <th className="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Need
                      <div className="font-normal text-xs text-gray-400">Resources still needed</div>
                    </th>
                    <th className="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {processes.map((process) => (
                    <tr 
                      key={process.id} 
                      className={`hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${
                        selectedProcess && selectedProcess.id === process.id ? 'bg-blue-50 dark:bg-blue-900' : ''
                      }`}
                      onClick={() => handleProcessSelect(process)}
                    >
                      <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">
                        {process.name}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex space-x-2">
                          {resources.map((resource, idx) => (
                            <div key={idx} className="flex items-center">
                              <div 
                                className="w-3 h-3 rounded-full mr-1" 
                                style={{ backgroundColor: resource.color }}
                              ></div>
                              <span>{process.maxClaim[idx]}</span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex space-x-2">
                          {resources.map((resource, idx) => (
                            <div key={idx} className="flex items-center">
                              <div 
                                className="w-3 h-3 rounded-full mr-1" 
                                style={{ backgroundColor: resource.color }}
                              ></div>
                              <span>{process.allocation[idx]}</span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex space-x-2">
                          {resources.map((resource, idx) => (
                            <div key={idx} className="flex items-center">
                              <div 
                                className="w-3 h-3 rounded-full mr-1" 
                                style={{ backgroundColor: resource.color }}
                              ></div>
                              <span>{process.need[idx]}</span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent row selection
                            releaseAllResources(process);
                          }}
                          className="text-sm px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                          disabled={!process.allocation.some(alloc => alloc > 0)}
                        >
                          Release Resources
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Safety Calculation Visualization */}
          {renderSafetyCalculation()}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mb-6">
            <button
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              onClick={resetSimulation}
            >
              Reset Simulation
            </button>
            
            <button
              className={`px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                showSafetyVisualization
                  ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              onClick={() => setShowSafetyVisualization(!showSafetyVisualization)}
              disabled={!showSafetyVisualization}
            >
              {showSafetyVisualization ? 'Hide' : 'Show'} Safety Calculation
            </button>
          </div>

          {/* History Log */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <span>Simulation History</span>
              <div className="flex items-center space-x-2">
                <label className="flex items-center text-sm">
                  <input 
                    type="checkbox" 
                    checked={autoScroll} 
                    onChange={() => setAutoScroll(!autoScroll)}
                    className="mr-2 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  Auto-scroll
                </label>
                <button 
                  onClick={scrollToLatestLog}
                  className="p-1 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                  title="Scroll to latest log"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </button>
              </div>
            </h3>
            <div className="p-4 max-h-40 overflow-y-auto history-log-container">
              {historyLog.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">No events yet. Start making resource requests.</p>
              ) : (
                <ul className="space-y-2">
                  {historyLog.map((log, index) => (
                    <li 
                      key={index}
                      className={`text-sm py-1 px-2 rounded ${
                        log.type === 'danger' ? 'bg-red-50 text-red-800 dark:bg-red-900 dark:text-red-200' :
                        log.type === 'warning' ? 'bg-yellow-50 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                        log.type === 'success' ? 'bg-green-50 text-green-800 dark:bg-green-900 dark:text-green-200' :
                        'bg-blue-50 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                      }`}
                    >
                      {log.message}
                    </li>
                  ))}
                  <div ref={historyEndRef} />
                </ul>
              )}
            </div>
          </div>
          
          {/* Educational Content - Additional explanations about deadlock avoidance */}
          <div className="mt-8 bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Understanding Deadlock Avoidance with Banker's Algorithm
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">Key Concepts</h4>
                <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300 space-y-2">
                  <li><strong>Maximum Claim:</strong> The maximum amount of each resource that a process may request during its lifetime</li>
                  <li><strong>Current Allocation:</strong> Resources currently held by each process</li>
                  <li><strong>Need:</strong> Additional resources a process may still request (Max Claim - Allocation)</li>
                  <li><strong>Available Resources:</strong> Resources not currently allocated to any process</li>
                  <li><strong>Safe State:</strong> A state where a sequence exists to satisfy all processes' maximum needs</li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">How Banker's Algorithm Works</h4>
                <ol className="list-decimal pl-5 text-gray-700 dark:text-gray-300 space-y-2">
                  <li>When a process requests resources, the system pretends to allocate them</li>
                  <li>The algorithm checks if the resulting state is safe by trying to find a sequence where:
                    <ul className="list-disc pl-5 mt-1">
                      <li>Each process can get all its maximum resources</li>
                      <li>When a process finishes, it releases all its resources</li>
                    </ul>
                  </li>
                  <li>If a safe sequence exists, the request is granted</li>
                  <li>If no safe sequence exists, the process must wait</li>
                </ol>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">Pros and Cons of Banker's Algorithm</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                  <h5 className="font-medium text-gray-900 dark:text-white">Advantages</h5>
                  <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-400 mt-2">
                    <li>Prevents deadlocks before they occur</li>
                    <li>Allows more concurrent resource usage than deadlock prevention</li>
                    <li>No need to preempt or rollback processes</li>
                  </ul>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                  <h5 className="font-medium text-gray-900 dark:text-white">Limitations</h5>
                  <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-400 mt-2">
                    <li>Requires knowing maximum resource needs in advance</li>
                    <li>Assumes a fixed number of processes and resources</li>
                    <li>Can lead to resource underutilization (being too cautious)</li>
                    <li>Computational overhead for checking safety</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DeadlockAvoidanceSimulation; 
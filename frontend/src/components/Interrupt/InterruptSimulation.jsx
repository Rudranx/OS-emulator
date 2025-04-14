import React, { useState, useEffect } from "react";
import { 
  AlertCircle, 
  Clock, 
  HardDrive, 
  Database, 
  PlayCircle, 
  PauseCircle, 
  Pause, 
  ChevronLeft, 
  ChevronRight, 
  Info 
} from "lucide-react";

// Interrupt Simulation Component
const InterruptSimulation = () => {
  const [cpuState, setCpuState] = useState("Running Normal Process...");
  const [registerState, setRegisterState] = useState("PC: 0x1000 | User Mode");
  const [interruptType, setInterruptType] = useState(null);
  const [animationStep, setAnimationStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showIVT, setShowIVT] = useState(false);
  const [showMemory, setShowMemory] = useState(false);
  const [showDetailedTab, setShowDetailedTab] = useState(null);

  // Memory Blocks Configuration
  const memoryBlocks = [
    { 
      id: "ivt", 
      label: "Interrupt Vectors", 
      color: "#ef4444",
      content: "0x0000-0x03FF: Interrupt Vector Table",
      details: "Stores pointers to Interrupt Service Routines (ISRs). Each entry points to an ISR address."
    }, 
    { 
      id: "system", 
      label: "System Memory", 
      color: "#4b5563",
      content: "0x0400-0x7FFF: Kernel & Drivers",
      details: "Contains kernel code, drivers, and system services. Accessible only in kernel mode."
    }, 
    { 
      id: "user", 
      label: "User Memory", 
      color: "#3b82f6",
      content: "0x8000-0xEFFF: Applications",
      details: "Holds application code, data, and stack. Restricted to user mode."
    }, 
    { 
      id: "free", 
      label: "Free Space", 
      color: "#d1d5db",
      content: "0xF000-0xFFFF: Unallocated",
      details: "Available for dynamic memory allocation by the operating system."
    },
  ];

  // Interrupt Vector Table (IVT) Configuration with Hardware/Software distinction
  const ivt = {
    "Keyboard": { 
      handler: "Keyboard ISR", 
      address: "0x0042", 
      vector: 2, 
      type: "Hardware", 
      details: "Hardware interrupt triggered by key press/release events." 
    },
    "Timer": { 
      handler: "Timer ISR", 
      address: "0x0086", 
      vector: 8, 
      type: "Hardware", 
      details: "Hardware interrupt for system timing and scheduling." 
    },
    "Disk": { 
      handler: "Disk ISR", 
      address: "0x00C4", 
      vector: 13, 
      type: "Hardware", 
      details: "Hardware interrupt for disk I/O completion." 
    },
    "System Call": { 
      handler: "System Call ISR", 
      address: "0x00F8", 
      vector: 21, 
      type: "Software", 
      details: "Software interrupt invoked by applications for kernel services." 
    },
  };

  // Reset state when no interrupt is active
  useEffect(() => {
    if (!interruptType) {
      setAnimationStep(0);
      setShowIVT(false);
      setShowMemory(false);
      setCpuState("Running Normal Process...");
      setRegisterState("PC: 0x1000 | User Mode");
      setIsPaused(false);
    }
  }, [interruptType]);

  // Handle animation steps
  useEffect(() => {
    if (!interruptType || isPaused) return;

    const steps = [
      { 
        cpu: `Interrupt Detected: ${interruptType} (${ivt[interruptType].type})`, 
        reg: "PC: Paused | Switching to Kernel Mode", 
        action: () => {
          setShowMemory(true);
          setShowIVT(true);
        }
      },
      { 
        cpu: "Transferring to Interrupt Vector...", 
        reg: `PC: 0x0000 + ${ivt[interruptType].vector} * 4`, 
        action: () => {}
      },
      { 
        cpu: `Executing ${ivt[interruptType].handler}...`, 
        reg: `PC: ${ivt[interruptType].address} | Kernel Mode`, 
        action: () => {}
      },
      { 
        cpu: "Resuming Normal Process...", 
        reg: "PC: 0x1000 | Back to User Mode", 
        action: () => {
          setShowMemory(false);
          setShowIVT(false);
          setTimeout(() => setInterruptType(null), 2000);
        }
      },
    ];

    if (animationStep < steps.length) {
      const { cpu, reg, action } = steps[animationStep];
      setCpuState(cpu);
      setRegisterState(reg);
      action();
      const timer = setTimeout(() => setAnimationStep(animationStep + 1), 2000);
      return () => clearTimeout(timer);
    }
  }, [interruptType, animationStep, isPaused]);

  // Trigger an interrupt
  const triggerInterrupt = (type) => {
    setInterruptType(type);
    setAnimationStep(0);
    setIsPaused(false);
  };

  // Toggle pause/resume animation
  const pauseAnimation = () => setIsPaused(!isPaused);

  // Navigate to previous animation step
  const goToPreviousStep = () => {
    if (animationStep > 0) {
      setIsPaused(true);
      setAnimationStep(animationStep - 1);
      const prevStates = [
        { cpu: "Running Normal Process...", reg: "PC: 0x1000 | User Mode" },
        { cpu: `Interrupt Detected: ${interruptType} (${ivt[interruptType].type})`, reg: "PC: Paused | Switching to Kernel Mode" },
        { cpu: "Transferring to Interrupt Vector...", reg: `PC: 0x0000 + ${ivt[interruptType].vector} * 4` },
        { cpu: `Executing ${ivt[interruptType].handler}...`, reg: `PC: ${ivt[interruptType].address} | Kernel Mode` },
      ];
      setCpuState(prevStates[animationStep - 1].cpu);
      setRegisterState(prevStates[animationStep - 1].reg);
      if (animationStep <= 1) {
        setShowMemory(false);
        setShowIVT(false);
      } else if (animationStep === 2) {
        setShowIVT(true);
      }
    }
  };

  // Navigate to next animation step
  const goToNextStep = () => {
    if (animationStep < 4 && interruptType) {
      setIsPaused(true);
      setAnimationStep(animationStep + 1);
      const nextStates = [
        { cpu: `Interrupt Detected: ${interruptType} (${ivt[interruptType].type})`, reg: "PC: Paused | Switching to Kernel Mode" },
        { cpu: "Transferring to Interrupt Vector...", reg: `PC: 0x0000 + ${ivt[interruptType].vector} * 4` },
        { cpu: `Executing ${ivt[interruptType].handler}...`, reg: `PC: ${ivt[interruptType].address} | Kernel Mode` },
        { cpu: "Resuming Normal Process...", reg: "PC: 0x1000 | Back to User Mode" },
      ];
      setCpuState(nextStates[animationStep].cpu);
      setRegisterState(nextStates[animationStep].reg);

      if (animationStep === 0) {
        setShowMemory(true);
        setShowIVT(true);
      } else if (animationStep === 3) {
        setTimeout(() => {
          setShowMemory(false);
          setShowIVT(false);
        }, 2000);
      }
    }
  };

  // Get background color based on animation step
  const getStepBackground = () => {
    if (!interruptType) return "bg-emerald-100";
    switch (animationStep) {
      case 0: return "bg-red-100"; // Interrupt Detection
      case 1: return "bg-yellow-100"; // Vector Transfer
      case 2: return "bg-purple-100"; // ISR Execution
      case 3: return "bg-emerald-100"; // Process Resumption
      default: return "bg-emerald-100";
    }
  };

  // Style for interrupt buttons
  const getInterruptButtonStyle = (color) => ({
    backgroundColor: color,
    opacity: interruptType ? 0.5 : 1,
    pointerEvents: interruptType ? "none" : "auto",
  });

  // Interrupt button configurations with hardware/software distinction
  const interruptButtons = [
    { type: "Keyboard", color: "#dc2626", icon: <AlertCircle size={24} />, label: "Keyboard (Hardware)", typeLabel: "Hardware" },
    { type: "Timer", color: "#ea580c", icon: <Clock size={24} />, label: "Timer (Hardware)", typeLabel: "Hardware" },
    { type: "Disk", color: "#9333ea", icon: <HardDrive size={24} />, label: "Disk (Hardware)", typeLabel: "Hardware" },
    { type: "System Call", color: "#2563eb", icon: <Database size={24} />, label: "System Call (Software)", typeLabel: "Software" },
  ];

  // Toggle detailed view tab
  const toggleDetailTab = (tabName) => {
    setShowDetailedTab(showDetailedTab === tabName ? null : tabName);
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-lg max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">CPU Interrupt Simulation</h2>

      <div className="grid grid-cols-12 gap-4">
        {/* Left Column: Controls and CPU State */}
        <div className="col-span-12 md:col-span-4 flex flex-col gap-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {interruptButtons.map(({ type, color, icon, label, typeLabel }) => (
              <button
                key={type}
                onClick={() => triggerInterrupt(type)}
                className="px-3 py-2 rounded-lg text-white shadow-sm flex items-center gap-2 text-sm transition-colors"
                style={getInterruptButtonStyle(color)}
                disabled={interruptType !== null}
                title={`${label} - ${typeLabel} Interrupt`}
              >
                {icon}
                {label.split(' (')[0]} <span className="text-xs">({typeLabel})</span>
              </button>
            ))}
          </div>

          {interruptType && (
            <div className="flex gap-2 justify-center">
              <button
                onClick={goToPreviousStep}
                className="px-3 py-2 bg-gray-600 text-white rounded-lg shadow-sm flex items-center gap-2 text-sm transition-colors"
                disabled={animationStep === 0}
              >
                <ChevronLeft size={20} />
                Prev
              </button>
              <button
                onClick={pauseAnimation}
                className={`px-3 py-2 ${isPaused ? 'bg-emerald-600' : 'bg-yellow-500'} text-white rounded-lg shadow-sm flex items-center gap-2 text-sm transition-colors`}
              >
                {isPaused ? <PlayCircle size={20} /> : <Pause size={20} />}
                {isPaused ? "Resume" : "Pause"}
              </button>
              <button
                onClick={goToNextStep}
                className="px-3 py-2 bg-gray-600 text-white rounded-lg shadow-sm flex items-center gap-2 text-sm transition-colors"
                disabled={animationStep === 4}
              >
                Next
                <ChevronRight size={20} />
              </button>
            </div>
          )}

          <div className="border-2 border-gray-300 rounded-xl shadow-md overflow-hidden">
            <div className="bg-gray-800 text-white p-3 text-lg font-bold flex justify-between items-center">
              CPU Core
              {interruptType ? <PauseCircle size={24} /> : <PlayCircle size={24} />}
            </div>
            <div className={`p-3 ${getStepBackground()} flex flex-col items-center transition-all duration-500`}>
              <div className={`text-base font-medium mb-2 text-center ${interruptType ? 'text-red-600' : 'text-green-600'}`}>
                {cpuState}
              </div>
              <div className="font-mono text-sm bg-gray-900 text-emerald-400 p-2 rounded-lg w-full text-center">
                {registerState}
              </div>
            </div>
          </div>
        </div>

        {/* Middle Column: Memory and IVT */}
        <div className="col-span-12 md:col-span-5 flex flex-col gap-4">
          <div className={`border-2 border-gray-300 rounded-xl shadow-md overflow-hidden ${showMemory ? 'opacity-100' : 'opacity-50'} transition-opacity duration-500`}>
            <div className="bg-gray-800 text-white p-2 text-base font-bold">Memory Map</div>
            <div className="p-3 bg-white">
              <div className="flex flex-col gap-2">
                {memoryBlocks.map((block) => (
                  <div
                    key={block.id}
                    className={`rounded-lg shadow-sm text-sm overflow-hidden ${block.id === "user" && !interruptType ? 'border-2 border-green-400' : ''} ${block.id === "system" && interruptType && animationStep > 0 ? 'border-2 border-purple-400' : ''}`}
                  >
                    <div 
                      style={{ backgroundColor: block.color }}
                      className="p-2 text-white flex justify-between items-center"
                    >
                      <span className="font-medium">{block.label}</span>
                      {block.id === "user" && !interruptType && (
                        <span className="bg-green-400 text-black p-1 rounded-md text-xs">
                          Current Process
                        </span>
                      )}
                      {block.id === "system" && interruptType && animationStep > 0 && (
                        <span className="bg-purple-400 text-black p-1 rounded-md text-xs">
                          ISR Loaded
                        </span>
                      )}
                    </div>
                    <div className="bg-gray-50 p-2 text-xs text-gray-700 font-mono border-t border-gray-200">
                      {block.content}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={`border-2 border-gray-300 rounded-xl shadow-md overflow-hidden ${showIVT ? 'opacity-100' : 'opacity-50'} transition-opacity duration-500`}>
            <div className="bg-gray-800 text-white p-2 text-base font-bold">Interrupt Vector Table</div>
            <div className="p-2 bg-white">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 text-left">Vector</th>
                    <th className="p-2 text-left">Type</th>
                    <th className="p-2 text-left">Category</th>
                    <th className="p-2 text-left">Address</th>
                    <th className="p-2 text-left">Handler</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(ivt).map(([type, details]) => (
                    <tr
                      key={type}
                      className={`border-b border-gray-200 ${type === interruptType && showIVT ? 'bg-yellow-100' : ''} hover:bg-gray-100`}
                    >
                      <td className="p-2">{details.vector}</td>
                      <td className="p-2">{type}</td>
                      <td className="p-2"><span className={`px-2 py-1 rounded-full text-xs ${details.type === "Hardware" ? "bg-blue-200 text-blue-800" : "bg-green-200 text-green-800"}`}>{details.type}</span></td>
                      <td className="p-2 font-mono">{details.address}</td>
                      <td className="p-2">{details.handler}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Explanation */}
        <div className="col-span-12 md:col-span-3 flex flex-col gap-4">
          <div className="border-2 border-gray-300 rounded-xl shadow-md overflow-hidden">
            <div className="bg-gray-800 text-white p-2 text-base font-bold">
              {interruptType ? "Current Step" : "Interrupt Overview"}
            </div>
            <div className="p-3 bg-gray-100 text-sm leading-relaxed">
              {interruptType ? (
                [
                  "CPU detects interrupt and switches to kernel mode.",
                  "Locates ISR address in the Interrupt Vector Table.",
                  "Executes the appropriate Interrupt Service Routine.",
                  "Resumes the normal process in user mode.",
                ][animationStep]
              ) : (
                "Interrupts allow the CPU to handle urgent events. Hardware interrupts are triggered by devices, while software interrupts are initiated by programs for kernel services."
              )}
            </div>
          </div>

          <div className="border-2 border-gray-300 rounded-xl p-3 bg-white shadow-sm text-sm">
            <strong>Memory Map Key:</strong>
            <ul className="mt-2 space-y-1 text-gray-600">
              <li><span className="text-red-600 font-medium">IVT:</span> Interrupt handlers</li>
              <li><span className="text-gray-700 font-medium">System:</span> Kernel space</li>
              <li><span className="text-blue-600 font-medium">User:</span> Application space</li>
              <li><span className="text-gray-500 font-medium">Free:</span> Unallocated memory</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-600 border-2 border-gray-300 rounded-xl p-3 bg-white shadow-sm">
        <strong>Step Colors:</strong>
        <div className="grid grid-cols-4 gap-2 mt-2">
          <div><span className="text-red-600">●</span> Interrupt Detection</div>
          <div><span className="text-yellow-500">●</span> Vector Lookup</div>
          <div><span className="text-purple-600">●</span> ISR Execution</div>
          <div><span className="text-green-600">●</span> Process Resumption</div>
        </div>
      </div>

      {/* Detailed Information Section */}
      <div className="mt-8 border-t-2 border-gray-300 pt-4">
        <h3 className="text-xl font-bold text-center mb-4 text-gray-800">Detailed Technical Info</h3>

        <div className="flex flex-wrap gap-2 justify-center mb-4">
          <button 
            onClick={() => toggleDetailTab('memory')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${showDetailedTab === 'memory' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            <HardDrive size={16} />
            Memory
          </button>
          <button 
            onClick={() => toggleDetailTab('interrupts')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${showDetailedTab === 'interrupts' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            <AlertCircle size={16} />
            Interrupts
          </button>
          <button 
            onClick={() => toggleDetailTab('process')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${showDetailedTab === 'process' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            <Info size={16} />
            Process
          </button>
        </div>

        {showDetailedTab === 'memory' && (
          <div className="bg-white border-2 border-gray-300 rounded-xl p-4 shadow-md">
            <h4 className="text-lg font-bold mb-3">Memory Details</h4>
            {memoryBlocks.map((block) => (
              <div key={block.id} className="mb-4">
                <h5 className="font-bold text-md">{block.label}</h5>
                <p className="text-sm text-gray-700">{block.details}</p>
              </div>
            ))}
          </div>
        )}

        {showDetailedTab === 'interrupts' && (
          <div className="bg-white border-2 border-gray-300 rounded-xl p-4 shadow-md">
            <h4 className="text-lg font-bold mb-3">Interrupt Types</h4>
            {Object.entries(ivt).map(([type, details]) => (
              <div key={type} className="mb-4">
                <h5 className="font-bold text-md">{type} Interrupt ({details.type})</h5>
                <p className="text-sm text-gray-700">{details.details}</p>
              </div>
            ))}
            <div className="mt-4 bg-gray-100 p-3 rounded-lg text-sm">
              <strong>Difference:</strong> Hardware interrupts are generated by physical devices (e.g., keyboard, timer), while software interrupts are triggered by software (e.g., system calls) to request kernel services.
            </div>
          </div>
        )}

        {showDetailedTab === 'process' && (
          <div className="bg-white border-2 border-gray-300 rounded-xl p-4 shadow-md">
            <h4 className="text-lg font-bold mb-3">Interrupt Handling</h4>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
              <li>Detect interrupt, save state, switch to kernel mode.</li>
              <li>Look up ISR address in the Interrupt Vector Table.</li>
              <li>Execute the ISR to handle the event (hardware or software).</li>
              <li>Restore state, send EOI, resume user mode.</li>
            </ol>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterruptSimulation;
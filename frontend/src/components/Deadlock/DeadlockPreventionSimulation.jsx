import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const DeadlockPreventionSimulation = ({ title, description, onReady }) => {
  const [activeStrategy, setActiveStrategy] = useState('mutual_exclusion');
  const [activeExampleIndex, setActiveExampleIndex] = useState(0);
  const [animationRunning, setAnimationRunning] = useState(false);
  const [explanationText, setExplanationText] = useState('Select a prevention strategy to see how it works.');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [showLearnMore, setShowLearnMore] = useState(false);

  useEffect(() => {
    if (onReady) {
      onReady();
    }
  }, [onReady]);

  const strategies = [
    {
      id: 'mutual_exclusion',
      name: 'Mutual Exclusion',
      description: 'Prevent mutual exclusion by using shareable resources that don\'t require exclusive access.',
      learnMore: `Mutual exclusion is one of the four necessary conditions for deadlock. By making resources shareable,
                 we eliminate the need for exclusive access, thus preventing deadlock. This is particularly useful for:
                 - Read-only resources like configuration files
                 - Resources that can be virtualized
                 - Resources that can be spooled`,
      examples: [
        {
          title: 'Read-Only Resources',
          description: 'Some resources, like read-only files, can be shared by multiple processes simultaneously without conflict.',
          steps: [
            { text: 'Multiple processes request access to a read-only resource', delay: 3000 },
            { text: 'All processes can access the resource concurrently', delay: 3000 },
            { text: 'No deadlock occurs because mutual exclusion is eliminated', delay: 3000 },
            { text: 'Each process can read the data without interfering with others', delay: 3000 },
            { text: 'This approach is perfect for shared configuration or data files', delay: 3000 }
          ]
        },
        {
          title: 'Virtual Resources',
          description: 'Using virtual copies of resources allows multiple processes to operate on their own instances.',
          steps: [
            { text: 'System creates virtual copies of a resource for each process', delay: 3000 },
            { text: 'Each process works with its own copy independently', delay: 3000 },
            { text: 'Changes are merged back if needed using synchronization', delay: 3000 },
            { text: 'No competition for the same resource means no deadlock', delay: 3000 },
            { text: 'This is commonly used in virtual memory and printer spooling', delay: 3000 }
          ]
        }
      ]
    },
    {
      id: 'hold_and_wait',
      name: 'Hold and Wait',
      description: 'Prevent processes from holding resources while waiting for others by requiring all resources to be requested at once.',
      examples: [
        {
          title: 'All-or-Nothing Resource Allocation',
          description: 'Processes must request all needed resources at the beginning and will only proceed if all are available.',
          steps: [
            { text: 'Process requests all resources it will need upfront', delay: 1000 },
            { text: 'If all resources are available, they\'re allocated; otherwise, the process waits', delay: 1000 },
            { text: 'No process holds some resources while waiting for others', delay: 1000 },
            { text: 'Deadlock is prevented as the hold-and-wait condition is eliminated', delay: 1000 }
          ]
        },
        {
          title: 'Resource Release Policy',
          description: 'Processes must release all current resources before requesting new ones.',
          steps: [
            { text: 'Process acquires initial resources', delay: 1000 },
            { text: 'When more resources are needed, it releases all current resources', delay: 1000 },
            { text: 'It then requests both the original and new resources together', delay: 1000 },
            { text: 'This ensures no process is holding resources while waiting', delay: 1000 }
          ]
        }
      ]
    },
    {
      id: 'no_preemption',
      name: 'No Preemption',
      description: 'Allow the system to forcibly take resources away from processes when needed by others.',
      examples: [
        {
          title: 'Resource Preemption',
          description: 'If a process is waiting for resources held by lower-priority processes, those resources can be preempted.',
          steps: [
            { text: 'Process A holds Resource 1 and requests Resource 2', delay: 1000 },
            { text: 'Process B holds Resource 2 and requests Resource 1', delay: 1000 },
            { text: 'Potential deadlock detected - system preempts Resource 2 from Process B', delay: 1000 },
            { text: 'Resource 2 is allocated to Process A, which can now complete', delay: 1000 },
            { text: 'Process A releases all resources, which can then be allocated to Process B', delay: 1000 }
          ]
        },
        {
          title: 'Rollback Strategy',
          description: 'When a process is blocked from getting a resource, it releases all held resources and tries again later.',
          steps: [
            { text: 'Process A acquires Resource 1', delay: 1000 },
            { text: 'Process A requests Resource 2, which is unavailable', delay: 1000 },
            { text: 'Instead of waiting, Process A releases Resource 1 and rolls back', delay: 1000 },
            { text: 'Process A will try to acquire both resources again later', delay: 1000 },
            { text: 'This prevents the no-preemption condition for deadlock', delay: 1000 }
          ]
        }
      ]
    },
    {
      id: 'circular_wait',
      name: 'Circular Wait',
      description: 'Prevent circular dependencies by imposing a total ordering of resources that all processes must follow.',
      examples: [
        {
          title: 'Resource Hierarchy',
          description: 'All resources are numbered, and processes must request resources in ascending order.',
          steps: [
            { text: 'Resources are assigned numerical IDs: R1 = 1, R2 = 2, etc.', delay: 1000 },
            { text: 'Process A needs both R1 and R2, must request R1 first, then R2', delay: 1000 },
            { text: 'Process B also needs both resources, must also follow the same order', delay: 1000 },
            { text: 'This ordering prevents circular wait, as all processes request in the same direction', delay: 1000 }
          ]
        },
        {
          title: 'Resource Classes',
          description: 'Resources are grouped into classes, and processes must acquire resources in class order.',
          steps: [
            { text: 'Resources are grouped: Class A (files), Class B (printers), Class C (network)', delay: 1000 },
            { text: 'Processes must request all Class A resources before any Class B resources', delay: 1000 },
            { text: 'Two processes cannot create a circular dependency because of this ordering', delay: 1000 },
            { text: 'The circular wait condition is eliminated, preventing deadlock', delay: 1000 }
          ]
        }
      ]
    }
  ];

  const currentStrategy = strategies.find(s => s.id === activeStrategy);
  const currentExample = currentStrategy?.examples[activeExampleIndex];

  const selectStrategy = (strategyId) => {
    setActiveStrategy(strategyId);
    setActiveExampleIndex(0);
    setAnimationRunning(false);
    setCurrentStepIndex(0);
    setShowLearnMore(false);
    setExplanationText(`Examining ${strategies.find(s => s.id === strategyId).name} prevention strategy.`);
  };

  const selectExample = (index) => {
    setActiveExampleIndex(index);
    setAnimationRunning(false);
    setCurrentStepIndex(0);
    setExplanationText(`Example: ${currentStrategy.examples[index].title}`);
  };

  const runAnimation = async () => {
    if (!currentExample || animationRunning) return;
    
    setAnimationRunning(true);
    setCurrentStepIndex(0);
    
    for (let i = 0; i < currentExample.steps.length; i++) {
      setCurrentStepIndex(i);
      setExplanationText(currentExample.steps[i].text);
      // Wait for the specified delay, adjusted by animation speed
      await new Promise(resolve => setTimeout(resolve, currentExample.steps[i].delay / animationSpeed));
    }
    
    setAnimationRunning(false);
  };

  const stopAnimation = () => {
    setAnimationRunning(false);
    setCurrentStepIndex(0);
    setExplanationText(`Example: ${currentExample.title}`);
  };

  const renderResourceIcons = (strategy, animate) => {
    switch (strategy.id) {
      case 'mutual_exclusion':
        return (
          <div className="flex justify-center items-center h-64">
            <div className="relative">
              {/* Resource access zone indicator */}
              <motion.div
                className="absolute w-48 h-48 rounded-full border-4 border-dashed border-blue-200"
                style={{
                  top: '-88px',
                  left: '-88px',
                }}
                animate={animate ? {
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.6, 0.3],
                } : {}}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                }}
              />
              
              {/* Processes accessing the resource */}
              {[0, 1, 2, 3].map(i => {
                const angle = (i * Math.PI/2);
                const radius = animate ? 80 : 60;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                
                return (
                  <motion.div
                    key={i}
                    className="w-12 h-12 bg-green-400 rounded-full flex items-center justify-center absolute z-20 shadow-lg"
                    initial={{ x: 0, y: 0, opacity: 0 }}
                    animate={{ 
                      x: x, 
                      y: y,
                      opacity: 1,
                      scale: animate ? [1, 1.1, 1] : 1
                    }}
                    transition={{ 
                      duration: 2,
                      delay: i * 0.8,
                      repeat: animate ? Infinity : 0,
                      repeatDelay: 1
                    }}
                  >
                    <span className="text-white font-bold text-lg">P{i+1}</span>
                    {animate && (
                      <>
                        {/* Data flow indicator */}
                        <motion.div
                          className="absolute w-full h-full rounded-full border-2 border-green-300"
                          animate={{ 
                            scale: [1, 2],
                            opacity: [0.8, 0]
                          }}
                          transition={{ 
                            duration: 1.5,
                            repeat: Infinity,
                            delay: i * 0.2
                          }}
                        />
                        {/* Connection line to resource */}
                        <motion.div
                          className="absolute w-1 bg-green-200"
                          style={{
                            height: '40px',
                            transformOrigin: 'center bottom',
                            transform: `rotate(${angle}rad)`,
                            left: '50%',
                            top: '50%'
                          }}
                          animate={{
                            opacity: [0.3, 0.7, 0.3]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: i * 0.2
                          }}
                        />
                      </>
                    )}
                  </motion.div>
                );
              })}
              
              {/* Central shared resource */}
              <motion.div 
                className="w-20 h-20 bg-blue-500 rounded-lg flex items-center justify-center z-10 relative shadow-lg"
                animate={animate ? {
                  scale: [1, 1.1, 1],
                  boxShadow: [
                    '0 4px 6px rgba(0, 0, 0, 0.1)',
                    '0 8px 12px rgba(0, 0, 0, 0.2)',
                    '0 4px 6px rgba(0, 0, 0, 0.1)'
                  ]
                } : {}}
                transition={{
                  duration: 2,
                  repeat: Infinity
                }}
              >
                <div className="text-center">
                  <span className="text-white font-bold text-xl">R</span>
                  <div className="text-xs text-blue-100">Shared</div>
                </div>
              </motion.div>
            </div>
          </div>
        );
      
      case 'hold_and_wait':
        return (
          <div className="flex justify-center items-center h-64">
            <div className="relative w-96">
              {/* Resources */}
              <div className="flex justify-center space-x-16 mb-16">
                {[1, 2, 3].map(i => (
                  <motion.div
                    key={i}
                    className="relative"
                  >
                    <motion.div
                      className="w-16 h-16 rounded-lg flex items-center justify-center shadow-lg"
                      style={{ backgroundColor: `hsl(${i * 60}, 70%, 60%)` }}
                      animate={animate ? {
                        y: [0, -10, 0],
                        scale: [1, 1.1, 1],
                        boxShadow: [
                          '0 4px 6px rgba(0, 0, 0, 0.1)',
                          '0 8px 12px rgba(0, 0, 0, 0.2)',
                          '0 4px 6px rgba(0, 0, 0, 0.1)'
                        ]
                      } : {}}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.3
                      }}
                    >
                      <div className="text-center">
                        <span className="text-white font-bold text-xl">R{i}</span>
                        <div className="text-xs text-white opacity-80">Resource</div>
                      </div>
                    </motion.div>
                    {animate && (
                      <motion.div
                        className="absolute -bottom-6 left-1/2 transform -translate-x-1/2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <div className="text-xs text-gray-500">Locked</div>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
              
              {/* Process */}
              <div className="flex justify-center">
                <motion.div
                  className="relative"
                >
                  <motion.div
                    className="w-20 h-20 bg-purple-500 rounded-full flex items-center justify-center shadow-lg"
                    animate={animate ? {
                      scale: [1, 1.1, 1],
                      boxShadow: [
                        '0 4px 6px rgba(0, 0, 0, 0.1)',
                        '0 8px 12px rgba(0, 0, 0, 0.2)',
                        '0 4px 6px rgba(0, 0, 0, 0.1)'
                      ]
                    } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <div className="text-center">
                      <span className="text-white font-bold text-xl">P1</span>
                      <div className="text-xs text-purple-100">Process</div>
                    </div>
                  </motion.div>
                  {animate && (
                    <>
                      {/* Resource request arrows */}
                      {[1, 2, 3].map((_, index) => (
                        <motion.div
                          key={index}
                          className="absolute w-1 h-24 bg-purple-300 origin-bottom"
                          style={{
                            top: '-88px',
                            left: '50%',
                            transform: `translateX(-50%) rotate(${(index - 1) * 30}deg)`
                          }}
                          initial={{ scaleY: 0, opacity: 0 }}
                          animate={{ 
                            scaleY: [0, 1, 1, 0],
                            opacity: [0, 0.8, 0.8, 0]
                          }}
                          transition={{
                            duration: 3,
                            delay: index * 1,
                            repeat: Infinity,
                            repeatDelay: 2
                          }}
                        />
                      ))}
                      <motion.div
                        className="absolute -top-8 left-1/2 transform -translate-x-1/2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <div className="text-sm text-purple-600 font-medium">Requesting All</div>
                      </motion.div>
                    </>
                  )}
                </motion.div>
              </div>
            </div>
          </div>
        );
      
      case 'no_preemption':
        return (
          <div className="flex justify-center items-center h-80">
            <div className="relative w-full max-w-lg">
              {/* Process status indicators */}
              <div className="absolute -top-4 left-4 right-4 flex justify-between">
                <div className="text-center">
                  <div className="text-sm font-medium text-red-600 mb-2">Process A</div>
                  <motion.div
                    className="px-3 py-1 bg-red-100 rounded text-xs"
                    animate={animate ? {
                      opacity: [1, 0.5, 1],
                      scale: [1, 1.05, 1]
                    } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    Needs R2
                  </motion.div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium text-blue-600 mb-2">Process B</div>
                  <motion.div
                    className="px-3 py-1 bg-blue-100 rounded text-xs"
                    animate={animate ? {
                      opacity: [1, 0.5, 1],
                      scale: [1, 1.05, 1]
                    } : {}}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  >
                    Needs R1
                  </motion.div>
                </div>
              </div>

              {/* Process A and its resources */}
              <div className="absolute left-16 top-24">
                <motion.div
                  className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center shadow-lg"
                  animate={animate ? { 
                    scale: [1, 1.1, 1],
                    boxShadow: [
                      '0 4px 6px rgba(0, 0, 0, 0.1)',
                      '0 8px 12px rgba(0, 0, 0, 0.2)',
                      '0 4px 6px rgba(0, 0, 0, 0.1)'
                    ]
                  } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="text-center">
                    <span className="text-white font-bold text-xl">A</span>
                    <div className="text-xs text-red-200">Higher Priority</div>
                  </div>
                </motion.div>
              </div>
              
              {/* Process B and its resources */}
              <div className="absolute right-16 top-24">
                <motion.div
                  className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center shadow-lg"
                  animate={animate ? { 
                    scale: [1, 1.1, 1],
                    boxShadow: [
                      '0 4px 6px rgba(0, 0, 0, 0.1)',
                      '0 8px 12px rgba(0, 0, 0, 0.2)',
                      '0 4px 6px rgba(0, 0, 0, 0.1)'
                    ]
                  } : {}}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                >
                  <div className="text-center">
                    <span className="text-white font-bold text-xl">B</span>
                    <div className="text-xs text-blue-200">Lower Priority</div>
                  </div>
                </motion.div>
              </div>
              
              {/* Resources */}
              <div className="absolute bottom-8 left-0 right-0 flex justify-around items-center">
                {/* Resource 1 */}
                <div className="text-center relative" style={{ left: '25%' }}>
                  <motion.div
                    className="w-14 h-14 bg-yellow-400 rounded-lg flex items-center justify-center shadow-lg mb-2"
                    animate={animate ? {
                      x: [0, 120, 0],
                      scale: [1, 1.1, 1],
                      boxShadow: [
                        '0 4px 6px rgba(0, 0, 0, 0.1)',
                        '0 8px 12px rgba(0, 0, 0, 0.2)',
                        '0 4px 6px rgba(0, 0, 0, 0.1)'
                      ]
                    } : {}}
                    transition={{ 
                      duration: 4,
                      repeat: Infinity,
                      times: [0, 0.5, 1]
                    }}
                  >
                    <div className="text-center">
                      <span className="text-white font-bold text-lg">R1</span>
                      <div className="text-xs text-yellow-100">Held by A</div>
                    </div>
                  </motion.div>
                </div>

                {/* Resource 2 */}
                <div className="text-center relative" style={{ right: '25%' }}>
                  <motion.div
                    className="w-14 h-14 bg-green-400 rounded-lg flex items-center justify-center shadow-lg mb-2"
                    animate={animate ? {
                      x: [0, -120, 0],
                      scale: [1, 1.1, 1],
                      boxShadow: [
                        '0 4px 6px rgba(0, 0, 0, 0.1)',
                        '0 8px 12px rgba(0, 0, 0, 0.2)',
                        '0 4px 6px rgba(0, 0, 0, 0.1)'
                      ]
                    } : {}}
                    transition={{ 
                      duration: 4,
                      repeat: Infinity,
                      times: [0, 0.5, 1],
                      delay: 2
                    }}
                  >
                    <div className="text-center">
                      <span className="text-white font-bold text-lg">R2</span>
                      <div className="text-xs text-green-100">Held by B</div>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Preemption indicator */}
              {animate && (
                <motion.div
                  className="absolute left-1/2 top-1/2 transform -translate-x-1/2 translate-y-4"
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: [0, 1, 1, 0],
                    y: [-20, 0, 0, 20]
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    times: [0.3, 0.4, 0.6, 0.7]
                  }}
                >
                  <div className="text-purple-600 font-medium text-sm bg-purple-100 px-3 py-1 rounded-full shadow-sm">
                    Preemption
                  </div>
                </motion.div>
              )}

              {/* Resource transfer arrows */}
              {animate && (
                <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
                  <motion.path
                    d="M160,140 C200,120 280,120 320,140"
                    stroke="#9333ea"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray="4"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: [0, 1, 1, 0] }}
                    transition={{ 
                      duration: 4,
                      repeat: Infinity,
                      times: [0.3, 0.4, 0.6, 0.7]
                    }}
                  />
                </svg>
              )}
            </div>
          </div>
        );
      
      case 'circular_wait':
        return (
          <div className="flex justify-center items-center h-96">
            <div className="relative w-full max-w-2xl">
              {/* Resource hierarchy visualization */}
              <div className="flex justify-between px-20 mb-12 relative">
                {[1, 2, 3].map((priority) => (
                  <motion.div
                    key={priority}
                    className={`w-24 h-24 rounded-lg flex items-center justify-center shadow-lg ${
                      priority === 1 ? 'bg-blue-500' :
                      priority === 2 ? 'bg-green-500' :
                      'bg-purple-500'
                    }`}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ 
                      opacity: 1,
                      y: 0,
                      scale: animate ? [1, 1.05, 1] : 1
                    }}
                    transition={{
                      duration: 1,
                      delay: priority * 0.2,
                      scale: {
                        repeat: Infinity,
                        duration: 2
                      }
                    }}
                  >
                    <div className="text-center">
                      <span className="text-white font-bold text-2xl">R{priority}</span>
                      <div className="text-sm text-white mt-1">Priority {priority}</div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Process animations */}
              <div className="relative h-48 mb-8">
                {/* Correct process (following order) */}
                <motion.div
                  className="absolute left-20"
                  initial={{ x: 0 }}
                  animate={animate ? {
                    x: [0, 180, 360, 360, 180, 0],
                    y: [0, 0, 0, 0, 0, 0]
                  } : {}}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    times: [0, 0.2, 0.4, 0.6, 0.8, 1]
                  }}
                >
                  <div className="w-20 h-20 bg-green-400 rounded-full flex items-center justify-center shadow-lg">
                    <div className="text-center">
                      <span className="text-white font-bold text-xl">P1</span>
                      <div className="text-sm text-white">Correct</div>
                    </div>
                  </div>
                  {animate && (
                    <motion.div
                      className="mt-3 px-4 py-2 bg-green-100 rounded-full text-sm text-green-700 text-center whitespace-nowrap"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      Following Order
                    </motion.div>
                  )}
                </motion.div>

                {/* Incorrect process (violating order) */}
                <motion.div
                  className="absolute right-20"
                  initial={{ x: 0 }}
                  animate={animate ? {
                    x: [0, -180, -180],
                    y: [0, 0, 0]
                  } : {}}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    times: [0, 0.4, 1]
                  }}
                >
                  <div className="w-20 h-20 bg-red-400 rounded-full flex items-center justify-center shadow-lg">
                    <div className="text-center">
                      <span className="text-white font-bold text-xl">P2</span>
                      <div className="text-sm text-white">Incorrect</div>
                    </div>
                  </div>
                  {animate && (
                    <motion.div
                      className="mt-3 px-4 py-2 bg-red-100 rounded-full text-sm text-red-700 text-center whitespace-nowrap"
                      initial={{ opacity: 0 }}
                      animate={{ 
                        opacity: [0, 1, 1, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity
                      }}
                    >
                      Wrong Order!
                    </motion.div>
                  )}
                </motion.div>
              </div>

              {/* Direction arrows */}
              <svg className="absolute top-8 left-0 w-full h-24" style={{ pointerEvents: 'none' }}>
                <defs>
                  <marker
                    id="arrowhead"
                    markerWidth="10"
                    markerHeight="7"
                    refX="9"
                    refY="3.5"
                    orient="auto"
                  >
                    <polygon
                      points="0 0, 10 3.5, 0 7"
                      fill="#4B5563"
                    />
                  </marker>
                </defs>
                <motion.line
                  x1="30%"
                  y1="30"
                  x2="50%"
                  y2="30"
                  stroke="#4B5563"
                  strokeWidth="2"
                  markerEnd="url(#arrowhead)"
                  strokeDasharray="4"
                  initial={{ pathLength: 0 }}
                  animate={animate ? { pathLength: 1 } : {}}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                <motion.line
                  x1="50%"
                  y1="30"
                  x2="70%"
                  y2="30"
                  stroke="#4B5563"
                  strokeWidth="2"
                  markerEnd="url(#arrowhead)"
                  strokeDasharray="4"
                  initial={{ pathLength: 0 }}
                  animate={animate ? { pathLength: 1 } : {}}
                  transition={{ duration: 1, delay: 0.5, repeat: Infinity }}
                />
              </svg>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  const renderLegend = (strategy) => {
    const legends = {
      mutual_exclusion: [
        { color: 'bg-blue-500', label: 'Shared Resource (R)' },
        { color: 'bg-green-400', label: 'Process (P1-P4)' },
        { color: 'border-2 border-green-300', label: 'Resource Access' }
      ],
      hold_and_wait: [
        { color: 'bg-purple-500', label: 'Process' },
        { color: 'bg-yellow-400', label: 'Resource 1' },
        { color: 'bg-green-400', label: 'Resource 2' },
        { color: 'bg-orange-400', label: 'Resource 3' },
        { color: 'border-2 border-purple-300', label: 'Resource Request' }
      ],
      no_preemption: [
        { color: 'bg-red-500', label: 'Process A' },
        { color: 'bg-blue-500', label: 'Process B' },
        { color: 'bg-yellow-400', label: 'Resource 1' },
        { color: 'bg-green-400', label: 'Resource 2' },
        { color: 'text-purple-600', label: 'Preemption Action' }
      ],
      circular_wait: [
        { color: 'bg-indigo-500', label: 'Process' },
        { color: 'bg-blue-500', label: 'Resources (R1-R5)' },
        { color: 'border-2 border-indigo-300', label: 'Resource Hierarchy' }
      ]
    };

    return (
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold mb-2">Legend:</h4>
        <div className="flex flex-wrap gap-4">
          {legends[strategy.id].map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className={`w-6 h-6 ${item.color} rounded flex items-center justify-center`}></div>
              <span className="text-sm text-gray-600">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderStepDetails = (step, index, totalSteps) => {
    return (
      <div className="p-4 bg-white rounded-lg shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
            index === currentStepIndex ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}>
            {index + 1}
          </div>
          <span className={`font-medium ${
            index === currentStepIndex ? 'text-blue-500' : 'text-gray-600'
          }`}>
            {step.text}
          </span>
        </div>
        {step.explanation && (
          <p className="ml-8 text-sm text-gray-500">{step.explanation}</p>
        )}
      </div>
    );
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <p className="text-gray-600 mb-6">{description}</p>

      {/* Strategy Selection */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Choose a Prevention Strategy:</h3>
        <div className="flex flex-wrap gap-2">
          {strategies.map(strategy => (
            <button
              key={strategy.id}
              onClick={() => selectStrategy(strategy.id)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeStrategy === strategy.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {strategy.name}
            </button>
          ))}
        </div>
      </div>

      {/* Current Strategy Info */}
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold mb-2">{currentStrategy.name}</h3>
            <p className="text-gray-600">{currentStrategy.description}</p>
          </div>
          <button
            onClick={() => setShowLearnMore(!showLearnMore)}
            className="text-blue-500 hover:text-blue-700 flex items-center gap-1"
          >
            {showLearnMore ? 'Show Less' : 'Learn More'}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {showLearnMore ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              )}
            </svg>
          </button>
        </div>
        {showLearnMore && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold mb-2">How it works:</h4>
            <p className="text-gray-700 whitespace-pre-line">{currentStrategy.learnMore}</p>
          </div>
        )}
      </div>

      {/* Example Selection */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Examples:</h3>
        <div className="flex gap-2">
          {currentStrategy.examples.map((example, index) => (
            <button
              key={index}
              onClick={() => selectExample(index)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeExampleIndex === index
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {example.title}
            </button>
          ))}
        </div>
        {currentExample && (
          <p className="mt-2 text-gray-600">{currentExample.description}</p>
        )}
      </div>

      {/* Visualization Area */}
      <div className="border rounded-lg p-4 mb-4">
        <h3 className="text-lg font-semibold mb-4">Visualization:</h3>
        <div className="min-h-[300px] flex flex-col items-center">
          {renderResourceIcons(currentStrategy, animationRunning)}
          {renderLegend(currentStrategy)}
        </div>
      </div>

      {/* Steps and Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-lg font-semibold mb-3">Steps:</h3>
          <div className="space-y-2">
            {currentExample?.steps.map((step, index) => 
              renderStepDetails(step, index, currentExample.steps.length)
            )}
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-3">Animation Controls:</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <button
                onClick={animationRunning ? stopAnimation : runAnimation}
                className={`px-6 py-2 rounded-lg ${
                  animationRunning
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-green-500 hover:bg-green-600'
                } text-white transition-colors flex items-center gap-2`}
              >
                {animationRunning ? (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Stop
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Start Animation
                  </>
                )}
              </button>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Speed:</span>
                <select
                  value={animationSpeed}
                  onChange={(e) => setAnimationSpeed(Number(e.target.value))}
                  className="px-2 py-1 border rounded"
                >
                  <option value={0.25}>0.25x (Very Slow)</option>
                  <option value={0.5}>0.5x (Slow)</option>
                  <option value={0.75}>0.75x (Medium)</option>
                  <option value={1}>1x (Normal)</option>
                </select>
              </div>
            </div>

            {/* Progress Indicator */}
            {currentExample && (
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">
                    Step {currentStepIndex + 1} of {currentExample.steps.length}
                  </span>
                  <span className="text-sm text-gray-600">
                    {Math.round((currentStepIndex / (currentExample.steps.length - 1)) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${(currentStepIndex / (currentExample.steps.length - 1)) * 100}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Current Step Explanation */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
        <h4 className="font-semibold mb-2">Current Step Explanation:</h4>
        <p className="text-gray-700">{explanationText}</p>
      </div>
    </div>
  );
};

export default DeadlockPreventionSimulation;
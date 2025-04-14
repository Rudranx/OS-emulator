import React, { useState, useEffect } from 'react';
import { Tab } from '@headlessui/react';
import { motion } from 'framer-motion';
import { 
  DeadlockAvoidanceSimulation, 
  DeadlockDetectionResolution, 
  DeadlockPreventionSimulation
} from '../components/Deadlock';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const DeadlockSimulationPage = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [simulationsReady, setSimulationsReady] = useState({
    deadlockPrevention: false,
    deadlockAvoidance: false,
    deadlockDetection: false
  });

  const handleSimulationReady = (simulation) => {
    setSimulationsReady(prev => ({
      ...prev,
      [simulation]: true
    }));
  };

  const allReady = Object.values(simulationsReady).every(ready => ready);

  const simulationTabs = [
    {
      id: 'deadlock-prevention',
      title: 'Deadlock Prevention',
      description: 'Learn strategies to prevent deadlocks by eliminating one of the four necessary conditions.',
      component: <DeadlockPreventionSimulation 
        title="Deadlock Prevention Strategies" 
        description="Prevent deadlocks by eliminating one of the four necessary conditions: mutual exclusion, hold and wait, no preemption, or circular wait."
        onReady={() => handleSimulationReady('deadlockPrevention')}
      />
    },
    {
      id: 'deadlock-avoidance',
      title: 'Deadlock Avoidance',
      description: 'Explore how the Banker\'s Algorithm works to avoid deadlocks by ensuring the system stays in a safe state.',
      component: <DeadlockAvoidanceSimulation 
        title="Banker's Algorithm for Deadlock Avoidance" 
        description="See how the Banker's Algorithm works to avoid deadlocks by only granting resource requests that keep the system in a safe state."
        onReady={() => handleSimulationReady('deadlockAvoidance')}
      />
    },
    {
      id: 'deadlock-detection',
      title: 'Deadlock Detection & Resolution',
      description: 'Detect deadlocks using resource allocation graphs and learn recovery techniques.',
      component: <DeadlockDetectionResolution 
        title="Deadlock Detection and Resolution" 
        description="This simulation demonstrates how to detect deadlocks and resolve them through process termination or resource preemption."
        onReady={() => handleSimulationReady('deadlockDetection')}
      />
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Deadlock Simulations
        </h1>
        <p className="mt-2 text-xl text-gray-600 dark:text-gray-400">
          Explore different aspects of deadlocks in operating systems through interactive simulations
        </p>
      </motion.div>

      <div className="w-full">
        <Tab.Group onChange={setSelectedTab}>
          <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
            {simulationTabs.map((tab) => (
              <Tab
                key={tab.id}
                className={({ selected }) =>
                  classNames(
                    'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                    'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                    selected
                      ? 'bg-white dark:bg-gray-800 text-blue-700 dark:text-blue-400 shadow'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-white/[0.12] hover:text-blue-600'
                  )
                }
              >
                {tab.title}
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels className="mt-6">
            {simulationTabs.map((tab, idx) => (
              <Tab.Panel
                key={tab.id}
                className={classNames(
                  'rounded-xl bg-white dark:bg-gray-800 p-3',
                  'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none'
                )}
              >
                <div className="mb-4 bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {tab.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    {tab.description}
                  </p>
                </div>
                
                {/* Simulation Component */}
                {tab.component}
                
                {/* Educational content specific to each simulation type */}
                <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                  <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                    Learning Resources: {tab.title}
                  </h2>
                  <hr className="my-4 border-gray-200 dark:border-gray-700" />
                  
                  {idx === 0 && (
                    <div>
                      <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">Resource Allocation Fundamentals</h3>
                      <p className="text-gray-700 dark:text-gray-300 mb-4">
                        Resource allocation is the process of assigning available resources to processes. The OS must ensure efficient allocation
                        while preventing conflicts and potential deadlocks.
                      </p>
                      <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">Key Concepts:</h3>
                      <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300">
                        <li><strong>Resource Types:</strong> Hardware (CPU, memory, I/O devices) and software (files, semaphores).</li>
                        <li><strong>Allocation Policies:</strong> First-come-first-served, priority-based, or resource reservation.</li>
                        <li><strong>Resource Utilization:</strong> Balancing resource usage to maximize system throughput.</li>
                        <li><strong>Request and Release:</strong> Processes request resources before use and release after completion.</li>
                      </ul>
                    </div>
                  )}
                  
                  {idx === 1 && (
                    <div>
                      <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">Deadlock Prevention Strategies</h3>
                      <p className="text-gray-700 dark:text-gray-300 mb-4">
                        Prevention strategies eliminate one of the four necessary conditions for deadlock to occur: mutual exclusion,
                        hold and wait, no preemption, and circular wait.
                      </p>
                      <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">Strategy Details:</h3>
                      <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300">
                        <li><strong>Eliminating Mutual Exclusion:</strong> Use sharable resources when possible.</li>
                        <li><strong>Eliminating Hold and Wait:</strong> Request all resources before execution or release current resources when requesting new ones.</li>
                        <li><strong>Allowing Preemption:</strong> Resources can be taken away from processes when needed by others.</li>
                        <li><strong>Eliminating Circular Wait:</strong> Impose a total ordering on resource types and request in ascending order.</li>
                      </ul>
                    </div>
                  )}
                  
                  {idx === 2 && (
                    <div>
                      <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">Banker's Algorithm for Deadlock Avoidance</h3>
                      <p className="text-gray-700 dark:text-gray-300 mb-4">
                        The Banker's Algorithm is a deadlock avoidance approach that decides whether to allocate resources based on
                        maintaining the system in a safe state. It requires knowing the maximum resource needs of all processes in advance.
                      </p>
                      <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">How It Works:</h3>
                      <ol className="list-decimal pl-5 text-gray-700 dark:text-gray-300">
                        <li>The system tracks available resources, maximum claims, current allocations, and remaining needs.</li>
                        <li>When a resource request is made, the system simulates granting it.</li>
                        <li>The system checks if this new state is safe by determining if there exists a sequence to execute all processes.</li>
                        <li>If safe, the request is granted; if unsafe, the process must wait.</li>
                      </ol>
                    </div>
                  )}
                  
                  {idx === 3 && (
                    <div>
                      <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">Deadlock Detection and Resolution</h3>
                      <p className="text-gray-700 dark:text-gray-300 mb-4">
                        Detection involves identifying when a deadlock has occurred, typically using resource allocation graphs or algorithms
                        similar to the Banker's Algorithm. Resolution requires breaking the deadlock through recovery methods.
                      </p>
                      <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">Recovery Techniques:</h3>
                      <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300">
                        <li><strong>Process Termination:</strong> Abort one or more deadlocked processes to break the cycle.</li>
                        <li><strong>Resource Preemption:</strong> Take resources from processes and give them to others.</li>
                        <li><strong>Rollback:</strong> Return processes to a safe state using checkpoints.</li>
                        <li><strong>Priority-based Resolution:</strong> Terminate or preempt based on process priorities or resource costs.</li>
                      </ul>
                    </div>
                  )}
                </div>
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
};

export default DeadlockSimulationPage; 
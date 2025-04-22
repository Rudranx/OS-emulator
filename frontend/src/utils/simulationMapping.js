import * as Simulations from '../components/simulations';

export const simulationStructure = {
  booting: {
    component: Simulations.BootingSimulation,
    title: 'System Booting',
    description: 'Learn about the system boot process and its various stages including BIOS/UEFI, bootloader, and kernel initialization',
    topics: ['Operating Systems', 'System Boot', 'BIOS/UEFI', 'Bootloader', 'Kernel'],
    subSimulations: {
      overview: {
        component: Simulations.BootingSimulation,
        title: 'Overview',
        description: 'Introduction to the system booting process and its stages'
      },
      resource_monitor: {
        component: Simulations.ResourceMonitor,
        title: 'Resource Monitor',
        description: 'Monitor system resources and performance metrics in real-time',
        topics: ['Operating Systems', 'Performance Monitoring', 'Resource Management']
        }
    }
  },
  system_calls: {
    component: Simulations.SystemCallsSimulation,
    title: 'System Calls',
    description: 'Learn about different types of system calls and their implementations',
    topics: ['Operating Systems', 'System Calls', 'Kernel Interface'],
    subSimulations: {
      overview: {
        component: Simulations.SystemCallsSimulation,
        title: 'Overview',
        description: 'Introduction to system calls and their role in operating systems'
      },
      file_management: {
        component: Simulations.SystemCallsFileManagement,
        title: 'File Management',
        description: 'Explore system calls for file operations and management'
      },
      process_management: {
        component: Simulations.SystemCallsProcessManagement,
        title: 'Process Management',
        description: 'Study system calls related to process creation and control'
      },
      memory_management: {
        component: Simulations.SystemCallsMemoryManagement,
        title: 'Memory Management',
        description: 'Learn about memory allocation and management system calls'
      },
      ipc: {
        component: Simulations.SystemCallsIPC,
        title: 'Inter-Process Communication',
        description: 'Understand system calls for process communication and synchronization'
      }
    }
  },
  cpu_scheduling: {
    component: Simulations.CpuSchedulingSimulation,
    title: 'CPU Scheduling',
    description: 'Learn about different CPU scheduling algorithms including FCFS, SJF, Priority, and Round Robin',
    topics: ['Operating Systems', 'Process Management', 'Scheduling'],
    subSimulations: {
      main: {
        component: Simulations.CpuSchedulingSimulation,
        title: 'CPU Scheduling Algorithms',
        description: 'Interactive simulation of various CPU scheduling algorithms including First Come First Served (FCFS), Shortest Job First (SJF), Priority Scheduling, and Round Robin (RR)'
      }
    }
  },
  rtos: {
    component: Simulations.RTOSSimulation,
    title: 'Real-Time Operating System',
    description: 'Explore real-time scheduling algorithms used in RTOS including Rate Monotonic Scheduling (RMS) and Earliest Deadline First (EDF)',
    topics: ['Operating Systems', 'Real-Time Systems', 'Scheduling'],
    subSimulations: {
      overview: {
        component: Simulations.RTOSSimulation,
        title: 'Overview',
        description: 'Introduction to real-time operating systems and scheduling algorithms'
      },
      rms: {
        component: Simulations.RTOS_RMS,
        title: 'Rate Monotonic Scheduling',
        description: 'Fixed-priority preemptive scheduling algorithm for periodic tasks'
      },
      edf: {
        component: Simulations.RTOS_EDF,
        title: 'Earliest Deadline First',
        description: 'Dynamic-priority scheduling algorithm based on task deadlines'
      }
    }
  },
  process_sync: {
    component: Simulations.SynchronizationSimulation,
    title: 'Process Synchronization',
    description: 'Learn about process synchronization problems and solutions',
    topics: ['Process Management', 'Operating Systems', 'Synchronization'],
    subSimulations: {
      overview: {
        component: Simulations.SynchronizationSimulation,
        title: 'Overview',
        description: 'Introduction to process synchronization concepts and problems'
      },
      dining_philosophers: {
        component: Simulations.SynchronizationDiningPhilosopher,
        title: 'Dining Philosophers',
        description: 'Classic dining philosophers problem'
      },
      producer_consumer: {
        component: Simulations.SynchronizationProducerConsumer,
        title: 'Producer Consumer',
        description: 'Producer-Consumer synchronization'
      },
      readers_writers: {
        component: Simulations.SynchronizationReadersWriters,
        title: 'Readers Writers',
        description: 'Readers-Writers problem solution'
      },
      sleeping_barber: {
        component: Simulations.SynchronizationBarber,
        title: 'Sleeping Barber',
        description: 'Classic sleeping barber synchronization problem'
      }
    }
  },
  interrupt: {
    component: Simulations.InterruptSimulation,
    title: 'Interrupt Handling',
    description: 'Understand how operating systems handle interrupts and manage interrupt processing',
    topics: ['Operating Systems', 'Interrupt Handling', 'Process Management'],
    subSimulations: {
      main: {
        component: Simulations.InterruptSimulation,
        title: 'Interrupt Simulation',
        description: 'Interactive simulation of interrupt handling and processing mechanisms'
      }
    }
  },
  deadlock: {
    component: Simulations.DeadlockSimulationPage,
    title: 'Deadlock',
    description: 'Understand deadlock concepts and prevention',
    topics: ['Process Management', 'Operating Systems', 'Deadlock'],
    subSimulations: {
      detection: {
        component: Simulations.DeadlockDetection,
        title: 'Deadlock Detection',
        description: 'Learn about deadlock detection methods'
      },
      prevention: {
        component: Simulations.DeadlockPrevention,
        title: 'Deadlock Prevention',
        description: 'Study deadlock prevention techniques'
      },
      avoidance: {
        component: Simulations.DeadlockAvoidance,
        title: 'Deadlock Avoidance',
        description: 'Explore deadlock avoidance strategies'
      }
    }
  },
  memory_allocation: {
    component: Simulations.MemoryAllocationSimulation,
    title: 'Memory Allocation (MFT/MVT)',
    description: 'Learn about different memory allocation strategies and memory management techniques',
    topics: ['Operating Systems', 'Memory Management', 'Resource Allocation'],
    subSimulations: {
      main: {
        component: Simulations.MemoryAllocationSimulation,
        title: 'Memory Allocation Simulator',
        description: 'Interactive simulation of memory allocation algorithms including First-Fit, Best-Fit, and Worst-Fit'
      }
    }
  },
  page_replacement: {
    component: Simulations.PageReplacementOverview,
    title: 'Page Replacement',
    description: 'Study various page replacement algorithms',
    topics: ['Memory Management', 'Operating Systems', 'Page Replacement'],
    subSimulations: {
      overview: {
        component: Simulations.PageReplacementOverview,
        title: 'Overview',
        description: 'Introduction to page replacement algorithms and concepts'
      },
      fifo: {
        component: Simulations.PageReplacementFifo,
        title: 'FIFO',
        description: 'First In First Out page replacement'
      },
      lru: {
        component: Simulations.PageReplacementLru,
        title: 'LRU',
        description: 'Least Recently Used replacement strategy'
      },
      optimal: {
        component: Simulations.PageReplacementOptimal,
        title: 'Optimal',
        description: 'Optimal page replacement algorithm'
      },
      lfu: {
        component: Simulations.PageReplacementLfu,
        title: 'LFU',
        description: 'Least Frequently Used replacement'
      },
      sc: {
        component: Simulations.PageReplacementSc,
        title: 'Second Chance',
        description: 'Second Chance (Clock) algorithm'
      },
      random: {
        component: Simulations.PageReplacementRandom,
        title: 'Random',
        description: 'Random page replacement strategy'
      }
    }
  },
  file_allocation: {
    component: Simulations.FileAllocationSimulation,
    title: 'File Allocation Methods',
    description: 'Learn about different methods of allocating files on disk storage',
    topics: ['File Systems', 'Operating Systems', 'Storage Management'],
    subSimulations: {
      main: {
        component: Simulations.FileAllocationSimulation,
        title: 'File Allocation Simulation',
        description: 'Interactive simulation of contiguous, linked, and indexed file allocation methods'
      }
    }
  },
  disk_scheduling: {
    component: Simulations.DiskSchedulingSimulation,
    title: 'Disk Scheduling',
    description: 'Learn about different disk scheduling algorithms and their performance characteristics',
    topics: ['Operating Systems', 'Disk Management', 'I/O Scheduling'],
    subSimulations: {
      main: {
        component: Simulations.DiskSchedulingSimulation,
        title: 'Overview',
        description: 'Introduction to disk scheduling algorithms'
      },
      fcfs: {
        component: Simulations.DiskSchedulingSimulation,
        title: 'First Come First Served (FCFS)',
        description: 'The simplest disk scheduling algorithm that services requests in the order they arrive'
      },
      sstf: {
        component: Simulations.DiskSchedulingSimulation,
        title: 'Shortest Seek Time First (SSTF)',
        description: 'Services the request that requires the least head movement from the current position'
      },
      scan: {
        component: Simulations.DiskSchedulingSimulation,
        title: 'SCAN (Elevator)',
        description: 'The disk arm moves in one direction servicing requests until it reaches the end, then reverses direction'
      },
      cscan: {
        component: Simulations.DiskSchedulingSimulation,
        title: 'Circular SCAN (C-SCAN)',
        description: 'Similar to SCAN, but returns to the beginning without servicing requests on the return trip'
      },
      look: {
        component: Simulations.DiskSchedulingSimulation,
        title: 'LOOK',
        description: 'Similar to SCAN, but the arm only goes as far as the last request in each direction'
      },
      clook: {
        component: Simulations.DiskSchedulingSimulation,
        title: 'C-LOOK',
        description: 'Similar to C-SCAN, but only goes as far as the last request before returning to the beginning'
      }
    }
  },
  hierarchical_file: {
    component: Simulations.HierarchicalFileSimulation,
    title: 'Hierarchical File Organization',
    description: 'Explore how files and directories are organized in a hierarchical structure',
    topics: ['File Systems', 'Operating Systems', 'Directory Structure'],
    subSimulations: {
      main: {
        component: Simulations.HierarchicalFileSimulation,
        title: 'File System Hierarchy',
        description: 'Interactive simulation of hierarchical file system organization'
      }
    }
  },
  
};

export const getSimulation = (simulationId, subSimulationId) => {
  const simulation = simulationStructure[simulationId];
  if (!simulation) return null;
  
  if (subSimulationId) {
    const subSimulation = simulation.subSimulations[subSimulationId];
    return subSimulation ? subSimulation.component : null;
  }
  
  return simulation.component;
};

export const getSimulationInfo = (simulationId, subSimulationId) => {
  const simulation = simulationStructure[simulationId];
  if (!simulation) return null;
  
  if (subSimulationId) {
    const subSimulation = simulation.subSimulations[subSimulationId];
    return subSimulation ? {
      ...subSimulation,
      id: subSimulationId,
      parentTitle: simulation.title,
      parentId: simulationId,
      topics: simulation.topics || []
    } : null;
  }
  
  return {
    ...simulation,
    id: simulationId,
    topics: simulation.topics || [],
    subSimulations: Object.entries(simulation.subSimulations || {}).map(([id, subSim]) => ({
      ...subSim,
      id
    }))
  };
};

export const getAllSimulations = () => {
  return Object.entries(simulationStructure).map(([id, sim]) => ({
    id,
    title: sim.title,
    description: sim.description,
    topics: sim.topics || [],
    component: sim.component,
    subSimulations: Object.entries(sim.subSimulations || {}).map(([subId, subSim]) => ({
      id: subId,
      parentId: id,
      ...subSim
    }))
  }));
}; 
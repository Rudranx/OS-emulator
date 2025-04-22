// CPU Scheduling Simulations
export { default as CpuSchedulingSimulation } from '../CPU Scheduling/process';



// Page Replacement Simulations
export { default as PageReplacementOverview } from '../PageReplacement/PageReplacementSimulation';
export { default as PageReplacementFifo } from '../PageReplacement/PageReplacement_Fifo';
export { default as PageReplacementLru } from '../PageReplacement/PageReplacement_Lru';
export { default as PageReplacementOptimal } from '../PageReplacement/PageReplacement_Optimal';
export { default as PageReplacementLfu } from '../PageReplacement/PageReplacement_Lfu';
export { default as PageReplacementSc } from '../PageReplacement/PageReplacement_Sc';
export { default as PageReplacementRandom } from '../PageReplacement/PageReplacement_Random';

// Process Synchronization Simulations
export { default as SynchronizationSimulation } from '../Synchronization/SynchronizationSimulation';
export { default as SynchronizationDiningPhilosopher } from '../Synchronization/Synchronization_DiningPhilosopher';
export { default as SynchronizationProducerConsumer } from '../Synchronization/Synchronization_ProducerConsumer';
export { default as SynchronizationReadersWriters } from '../Synchronization/Synchronization_ReadersWriters';
export { default as SynchronizationBarber } from '../Synchronization/Synchronization_barber';

// Deadlock Simulations
export { 
  DeadlockAvoidanceSimulation as DeadlockSimulationPage,
  DeadlockDetectionResolution as DeadlockDetection,
  DeadlockPreventionSimulation as DeadlockPrevention,
  DeadlockAvoidanceSimulation as DeadlockAvoidance
} from '../Deadlock';

// System Calls Simulations
export { default as SystemCallsSimulation } from '../SystemCalls/SystemCallsSimulation';
export { default as SystemCallsFileManagement } from '../SystemCalls/SystemCalls_FileManagement';
export { default as SystemCallsProcessManagement } from '../SystemCalls/SystemCalls_ProcessManagement';
export { default as SystemCallsMemoryManagement } from '../SystemCalls/SystemCalls_MemoryManagement';
export { default as SystemCallsIPC } from '../SystemCalls/SystemCalls_InterProcessCommunication';

// Hierarchical File Organization Simulation
export { default as HierarchicalFileSimulation } from '../HierarchicalFile/HierarchicalFileOrganisationSimulation';

// File Allocation Simulation
export { default as FileAllocationSimulation } from '../File Allocation/file_allocation';

// Interrupt Simulation
export { default as InterruptSimulation } from '../Interrupt/InterruptSimulation';

// Memory Allocation Simulation
export { default as MemoryAllocationSimulation } from '../MemoryAllocation/MemoryAllocationSimulator';

// Disk Scheduling Simulation
export { default as DiskSchedulingSimulation } from '../DiskScheduling/Disk_Scheduling';


export { default as PageReplacementMain } from '../PageReplacement/PageReplacementSimulation';
export { default as ProcessSyncMain } from '../Synchronization/SynchronizationSimulation';
export { DeadlockAvoidanceSimulation as DeadlockMain } from '../Deadlock';
export { default as SystemCallsMain } from '../SystemCalls/SystemCallsSimulation';
export { default as HierarchicalFileMain } from '../HierarchicalFile/HierarchicalFileOrganisationSimulation';
export { default as FileAllocationMain } from '../File Allocation/file_allocation';
export { default as InterruptMain } from '../Interrupt/InterruptSimulation';
export { default as MemoryAllocationMain } from '../MemoryAllocation/MemoryAllocationSimulator';
export { default as DiskSchedulingMain } from '../DiskScheduling/Disk_Scheduling';

// Booting Simulations
export { default as BootingSimulation } from '../Booting/Booting';
export { default as ResourceMonitor } from '../Booting/ResourceMonitor';

// RTOS Simulations
export { default as RTOSSimulation } from '../RTOS/RTOSSimulation';
export { default as RTOS_RMS } from '../RTOS/RTOS_RMS';
export { default as RTOS_EDF } from '../RTOS/RTOS_EDF'; 
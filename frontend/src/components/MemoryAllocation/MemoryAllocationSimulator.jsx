import React, { useState, useEffect } from 'react';
// import './App.css';

const MemoryAllocationSimulator = () => {
  const [memorySize, setMemorySize] = useState(1000);
  const [blocks, setBlocks] = useState([
    { id: 1, size: 200, allocated: false, processId: null },
    { id: 2, size: 300, allocated: false, processId: null },
    { id: 3, size: 150, allocated: false, processId: null },
    { id: 4, size: 350, allocated: false, processId: null },
  ]);
  
  const [processes, setProcesses] = useState([
    { id: 1, size: 100, allocated: false, blockId: null },
    { id: 2, size: 250, allocated: false, blockId: null },
    { id: 3, size: 150, allocated: false, blockId: null },
  ]);
  
  const [newProcess, setNewProcess] = useState({ id: 4, size: 0 });
  const [algorithm, setAlgorithm] = useState('firstFit');
  const [memoryType, setMemoryType] = useState('contiguous');
  const [message, setMessage] = useState('');
  
  // Initialize MVT memory with proper size (0 to memorySize-1)
  const [mvtMemory, setMvtMemory] = useState([
    { id: 1, start: 0, end: memorySize - 1, free: true, processId: null }
  ]);
  
  const [mftPartitions, setMftPartitions] = useState([
    { id: 1, size: 200, processId: null, allocated: false },
    { id: 2, size: 300, processId: null, allocated: false },
    { id: 3, size: 500, processId: null, allocated: false },
  ]);
  
  // Auto-clear messages after 5 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);
  
  // Reset memory allocations
  const resetMemory = () => {
    if (memoryType === 'contiguous') {
      setBlocks(blocks.map(block => ({
        ...block,
        allocated: false,
        processId: null
      })));
      
      setProcesses(processes.map(process => ({
        ...process,
        allocated: false,
        blockId: null
      })));
    } else if (memoryType === 'mvt') {
      setMvtMemory([{ id: 1, start: 0, end: memorySize - 1, free: true, processId: null }]);
    } else if (memoryType === 'mft') {
      setMftPartitions(mftPartitions.map(partition => ({
        ...partition,
        allocated: false,
        processId: null
      })));
    }
    
    setProcesses(processes.map(process => ({
      ...process,
      allocated: false,
      blockId: null
    })));
    
    setMessage('Memory reset successfully.');
  };
  
  // Add new process
  const addProcess = () => {
    if (newProcess.size <= 0) {
      setMessage('Process size must be greater than 0.');
      return;
    }
    
    const maxId = Math.max(...processes.map(p => p.id), 0);
    const processToAdd = {
      id: maxId + 1,
      size: parseInt(newProcess.size),
      allocated: false,
      blockId: null
    };
    
    setProcesses([...processes, processToAdd]);
    setNewProcess({ id: maxId + 2, size: 0 });
    setMessage(`New process with ID ${processToAdd.id} and size ${processToAdd.size} added.`);
  };
  
  // Remove a process
  const removeProcess = (processId) => {
    // Find and deallocate memory if needed
    const process = processes.find(p => p.id === processId);
    
    if (process && process.allocated) {
      if (memoryType === 'contiguous') {
        // Deallocate from contiguous memory
        setBlocks(blocks.map(block => 
          block.processId === processId ? { ...block, allocated: false, processId: null } : block
        ));
      } else if (memoryType === 'mvt') {
        // Deallocate from MVT
        setMvtMemory(mvtMemory.map(segment => 
          segment.processId === processId ? { ...segment, free: true, processId: null } : segment
        ));
        
        // Merge adjacent free segments
        setTimeout(() => mergeFreeSegments(), 0);
      } else if (memoryType === 'mft') {
        // Deallocate from MFT
        setMftPartitions(mftPartitions.map(partition => 
          partition.processId === processId ? { ...partition, allocated: false, processId: null } : partition
        ));
      }
    }
    
    // Remove the process
    setProcesses(processes.filter(p => p.id !== processId));
    setMessage(`Process ${processId} removed successfully.`);
  };
  
  // First Fit Algorithm
  const firstFit = (processId) => {
    const process = processes.find(p => p.id === processId);
    if (!process) return false;
    
    for (let i = 0; i < blocks.length; i++) {
      if (!blocks[i].allocated && blocks[i].size >= process.size) {
        // Allocate this block
        const updatedBlocks = [...blocks];
        updatedBlocks[i] = { ...blocks[i], allocated: true, processId: process.id };
        setBlocks(updatedBlocks);
        
        // Update process
        const updatedProcesses = processes.map(p => 
          p.id === process.id ? { ...p, allocated: true, blockId: blocks[i].id } : p
        );
        setProcesses(updatedProcesses);
        setMessage(`Process ${process.id} allocated to Block ${blocks[i].id} using First Fit.`);
        return true;
      }
    }
    
    setMessage(`Cannot allocate Process ${process.id} using First Fit. No suitable block available.`);
    return false;
  };
  
  // Best Fit Algorithm
  const bestFit = (processId) => {
    const process = processes.find(p => p.id === processId);
    if (!process) return false;
    
    let bestBlockIndex = -1;
    let bestBlockSize = Infinity;
    
    for (let i = 0; i < blocks.length; i++) {
      if (!blocks[i].allocated && blocks[i].size >= process.size) {
        if (blocks[i].size < bestBlockSize) {
          bestBlockIndex = i;
          bestBlockSize = blocks[i].size;
        }
      }
    }
    
    if (bestBlockIndex !== -1) {
      // Allocate best block
      const updatedBlocks = [...blocks];
      updatedBlocks[bestBlockIndex] = { 
        ...blocks[bestBlockIndex], 
        allocated: true, 
        processId: process.id 
      };
      setBlocks(updatedBlocks);
      
      // Update process
      const updatedProcesses = processes.map(p => 
        p.id === process.id ? { ...p, allocated: true, blockId: blocks[bestBlockIndex].id } : p
      );
      setProcesses(updatedProcesses);
      setMessage(`Process ${process.id} allocated to Block ${blocks[bestBlockIndex].id} using Best Fit.`);
      return true;
    }
    
    setMessage(`Cannot allocate Process ${process.id} using Best Fit. No suitable block available.`);
    return false;
  };
  
  // Worst Fit Algorithm
  const worstFit = (processId) => {
    const process = processes.find(p => p.id === processId);
    if (!process) return false;
    
    let worstBlockIndex = -1;
    let worstBlockSize = -1;
    
    for (let i = 0; i < blocks.length; i++) {
      if (!blocks[i].allocated && blocks[i].size >= process.size) {
        if (blocks[i].size > worstBlockSize) {
          worstBlockIndex = i;
          worstBlockSize = blocks[i].size;
        }
      }
    }
    
    if (worstBlockIndex !== -1) {
      // Allocate worst block
      const updatedBlocks = [...blocks];
      updatedBlocks[worstBlockIndex] = { 
        ...blocks[worstBlockIndex], 
        allocated: true, 
        processId: process.id 
      };
      setBlocks(updatedBlocks);
      
      // Update process
      const updatedProcesses = processes.map(p => 
        p.id === process.id ? { ...p, allocated: true, blockId: blocks[worstBlockIndex].id } : p
      );
      setProcesses(updatedProcesses);
      setMessage(`Process ${process.id} allocated to Block ${blocks[worstBlockIndex].id} using Worst Fit.`);
      return true;
    }
    
    setMessage(`Cannot allocate Process ${process.id} using Worst Fit. No suitable block available.`);
    return false;
  };
  
  // Next Fit Algorithm (variation of First Fit, but starts searching from the last allocated block)
  const [lastAllocatedIndex, setLastAllocatedIndex] = useState(0);
  
  const nextFit = (processId) => {
    const process = processes.find(p => p.id === processId);
    if (!process) return false;
    
    let startIndex = lastAllocatedIndex;
    
    // Search from lastAllocatedIndex to end
    for (let i = startIndex; i < blocks.length; i++) {
      if (!blocks[i].allocated && blocks[i].size >= process.size) {
        // Allocate this block
        const updatedBlocks = [...blocks];
        updatedBlocks[i] = { ...blocks[i], allocated: true, processId: process.id };
        setBlocks(updatedBlocks);
        
        // Update process
        const updatedProcesses = processes.map(p => 
          p.id === process.id ? { ...p, allocated: true, blockId: blocks[i].id } : p
        );
        setProcesses(updatedProcesses);
        setLastAllocatedIndex(i);
        setMessage(`Process ${process.id} allocated to Block ${blocks[i].id} using Next Fit.`);
        return true;
      }
    }
    
    // If not found, search from beginning to lastAllocatedIndex
    for (let i = 0; i < startIndex; i++) {
      if (!blocks[i].allocated && blocks[i].size >= process.size) {
        // Allocate this block
        const updatedBlocks = [...blocks];
        updatedBlocks[i] = { ...blocks[i], allocated: true, processId: process.id };
        setBlocks(updatedBlocks);
        
        // Update process
        const updatedProcesses = processes.map(p => 
          p.id === process.id ? { ...p, allocated: true, blockId: blocks[i].id } : p
        );
        setProcesses(updatedProcesses);
        setLastAllocatedIndex(i);
        setMessage(`Process ${process.id} allocated to Block ${blocks[i].id} using Next Fit.`);
        return true;
      }
    }
    
    setMessage(`Cannot allocate Process ${process.id} using Next Fit. No suitable block available.`);
    return false;
  };
  
  // Helper function to merge adjacent free segments in MVT
  const mergeFreeSegments = () => {
    // Sort segments by start address
    const sortedMemory = [...mvtMemory].sort((a, b) => a.start - b.start);
    const mergedMemory = [];
    
    let currentSegment = null;
    
    for (const segment of sortedMemory) {
      if (currentSegment === null) {
        currentSegment = { ...segment };
      } else if (currentSegment.free && segment.free && currentSegment.end + 1 === segment.start) {
        // Merge adjacent free segments
        currentSegment.end = segment.end;
      } else {
        mergedMemory.push(currentSegment);
        currentSegment = { ...segment };
      }
    }
    
    if (currentSegment !== null) {
      mergedMemory.push(currentSegment);
    }
    
    setMvtMemory(mergedMemory);
  };
  
  // MVT Implementation
  const allocateProcessMVT = (processId) => {
    const process = processes.find(p => p.id === processId);
    if (!process) return false;
    
    // Find a free segment based on the algorithm
    let selectedSegmentIndex = -1;
    
    if (algorithm === 'firstFit') {
      // First Fit for MVT - find first segment that fits
      for (let i = 0; i < mvtMemory.length; i++) {
        const segment = mvtMemory[i];
        if (segment.free && (segment.end - segment.start + 1) >= process.size) {
          selectedSegmentIndex = i;
          break;
        }
      }
    } else if (algorithm === 'bestFit') {
      // Best Fit for MVT - find smallest segment that fits
      let bestFitSize = Infinity;
      for (let i = 0; i < mvtMemory.length; i++) {
        const segment = mvtMemory[i];
        const segmentSize = segment.end - segment.start + 1;
        if (segment.free && segmentSize >= process.size && segmentSize < bestFitSize) {
          selectedSegmentIndex = i;
          bestFitSize = segmentSize;
        }
      }
    } else if (algorithm === 'worstFit') {
      // Worst Fit for MVT - find largest segment that fits
      let worstFitSize = -1;
      for (let i = 0; i < mvtMemory.length; i++) {
        const segment = mvtMemory[i];
        const segmentSize = segment.end - segment.start + 1;
        if (segment.free && segmentSize >= process.size && segmentSize > worstFitSize) {
          selectedSegmentIndex = i;
          worstFitSize = segmentSize;
        }
      }
    }
    
    if (selectedSegmentIndex !== -1) {
      const segment = mvtMemory[selectedSegmentIndex];
      const updatedMemory = [...mvtMemory];
      
      // Calculate new segments
      const remainingSize = (segment.end - segment.start + 1) - process.size;
      
      if (remainingSize > 0) {
        // Split the segment
        updatedMemory[selectedSegmentIndex] = {
          id: segment.id,
          start: segment.start,
          end: segment.start + process.size - 1,
          free: false,
          processId: process.id
        };
        
        // Add the remaining free segment
        updatedMemory.push({
          id: Date.now(), // Use timestamp to ensure unique ID
          start: segment.start + process.size,
          end: segment.end,
          free: true,
          processId: null
        });
      } else {
        // Use the entire segment
        updatedMemory[selectedSegmentIndex] = {
          ...segment,
          free: false,
          processId: process.id
        };
      }
      
      // Sort segments by start address
      updatedMemory.sort((a, b) => a.start - b.start);
      
      setMvtMemory(updatedMemory);
      
      // Update process
      const updatedProcesses = processes.map(p => 
        p.id === process.id ? { ...p, allocated: true, blockId: segment.id } : p
      );
      setProcesses(updatedProcesses);
      
      // Merge any adjacent free segments after allocation
      setTimeout(() => mergeFreeSegments(), 0);
      
      setMessage(`Process ${process.id} allocated in MVT memory at location ${segment.start}-${segment.start + process.size - 1}.`);
      return true;
    }
    
    setMessage(`Cannot allocate Process ${process.id} in MVT memory. Insufficient space.`);
    return false;
  };
  
  // MFT Implementation
  const allocateProcessMFT = (processId) => {
    const process = processes.find(p => p.id === processId);
    if (!process) return false;
    
    // Find a partition based on the algorithm
    let selectedPartitionIndex = -1;
    
    if (algorithm === 'firstFit') {
      // First Fit for MFT
      for (let i = 0; i < mftPartitions.length; i++) {
        const partition = mftPartitions[i];
        if (!partition.allocated && partition.size >= process.size) {
          selectedPartitionIndex = i;
          break;
        }
      }
    } else if (algorithm === 'bestFit') {
      // Best Fit for MFT
      let bestFitSize = Infinity;
      for (let i = 0; i < mftPartitions.length; i++) {
        const partition = mftPartitions[i];
        if (!partition.allocated && partition.size >= process.size && partition.size < bestFitSize) {
          selectedPartitionIndex = i;
          bestFitSize = partition.size;
        }
      }
    } else if (algorithm === 'worstFit') {
      // Worst Fit for MFT
      let worstFitSize = -1;
      for (let i = 0; i < mftPartitions.length; i++) {
        const partition = mftPartitions[i];
        if (!partition.allocated && partition.size >= process.size && partition.size > worstFitSize) {
          selectedPartitionIndex = i;
          worstFitSize = partition.size;
        }
      }
    }
    
    if (selectedPartitionIndex !== -1) {
      const partition = mftPartitions[selectedPartitionIndex];
      
      // Allocate the partition
      const updatedPartitions = [...mftPartitions];
      updatedPartitions[selectedPartitionIndex] = {
        ...partition,
        allocated: true,
        processId: process.id
      };
      
      setMftPartitions(updatedPartitions);
      
      // Update process
      const updatedProcesses = processes.map(p => 
        p.id === process.id ? { ...p, allocated: true, blockId: partition.id } : p
      );
      setProcesses(updatedProcesses);
      
      const wastedMemory = partition.size - process.size;
      
      setMessage(`Process ${process.id} allocated to MFT Partition ${partition.id}. Internal fragmentation: ${wastedMemory}`);
      return true;
    }
    
    setMessage(`Cannot allocate Process ${process.id} in MFT memory. No suitable partition available.`);
    return false;
  };
  
  // Allocate a process based on selected algorithm and memory type
  const allocateProcess = (processId) => {
    const process = processes.find(p => p.id === processId);
    if (!process) {
      setMessage(`Process ${processId} not found.`);
      return;
    }
    
    if (process.allocated) {
      setMessage(`Process ${processId} is already allocated.`);
      return;
    }
    
    if (memoryType === 'contiguous') {
      // Contiguous memory allocation
      switch (algorithm) {
        case 'firstFit':
          firstFit(processId);
          break;
        case 'bestFit':
          bestFit(processId);
          break;
        case 'worstFit':
          worstFit(processId);
          break;
        case 'nextFit':
          nextFit(processId);
          break;
        default:
          setMessage('Please select a valid algorithm.');
      }
    } else if (memoryType === 'mvt') {
      // MVT allocation
      allocateProcessMVT(processId);
    } else if (memoryType === 'mft') {
      // MFT allocation
      allocateProcessMFT(processId);
    }
  };
  
  // Calculate memory utilization
  const calculateUtilization = () => {
    if (memoryType === 'contiguous') {
      const allocatedMemory = blocks
        .filter(block => block.allocated)
        .reduce((sum, block) => sum + block.size, 0);
      
      return ((allocatedMemory / memorySize) * 100).toFixed(2);
    } else if (memoryType === 'mvt') {
      const allocatedMemory = mvtMemory
        .filter(segment => !segment.free)
        .reduce((sum, segment) => sum + (segment.end - segment.start + 1), 0);
      
      return ((allocatedMemory / memorySize) * 100).toFixed(2);
    } else if (memoryType === 'mft') {
      const totalMemory = mftPartitions.reduce((sum, partition) => sum + partition.size, 0);
      const allocatedMemory = mftPartitions
        .filter(partition => partition.allocated)
        .reduce((sum, partition) => sum + partition.size, 0);
      
      return ((allocatedMemory / totalMemory) * 100).toFixed(2);
    }
    
    return "0.00";
  };
  
  // Calculate internal fragmentation (only relevant for MFT)
  const calculateInternalFragmentation = () => {
    if (memoryType === 'mft') {
      const wastedMemory = mftPartitions
        .filter(partition => partition.allocated)
        .reduce((sum, partition) => {
          const process = processes.find(p => p.id === partition.processId);
          if (process) {
            return sum + (partition.size - process.size);
          }
          return sum;
        }, 0);
      
      return wastedMemory;
    }
    
    return 0;
  };
  
  // Calculate external fragmentation
  const calculateExternalFragmentation = () => {
    if (memoryType === 'mvt') {
      // Find the size of the largest unallocated process
      const largestProcess = processes
        .filter(p => !p.allocated)
        .reduce((max, p) => Math.max(max, p.size), 0);
      
      if (largestProcess === 0) return 0; // No unallocated processes
      
      // Calculate total free memory
      const totalFreeMemory = mvtMemory
        .filter(segment => segment.free)
        .reduce((sum, segment) => sum + (segment.end - segment.start + 1), 0);
      
      // Find free segments that are too small for the largest unallocated process
      const unusableMemory = mvtMemory
        .filter(segment => segment.free && (segment.end - segment.start + 1) < largestProcess)
        .reduce((sum, segment) => sum + (segment.end - segment.start + 1), 0);
      
      // If there's enough total free memory but no single segment large enough, 
      // then all free memory counts as external fragmentation
      if (totalFreeMemory >= largestProcess && unusableMemory === totalFreeMemory) {
        return totalFreeMemory;
      }
      
      return unusableMemory;
    } else if (memoryType === 'contiguous') {
      // Same approach for contiguous
      const largestProcess = processes
        .filter(p => !p.allocated)
        .reduce((max, p) => Math.max(max, p.size), 0);
      
      if (largestProcess === 0) return 0;
      
      const totalFreeMemory = blocks
        .filter(block => !block.allocated)
        .reduce((sum, block) => sum + block.size, 0);
      
      const unusableMemory = blocks
        .filter(block => !block.allocated && block.size < largestProcess)
        .reduce((sum, block) => sum + block.size, 0);
      
      if (totalFreeMemory >= largestProcess && unusableMemory === totalFreeMemory) {
        return totalFreeMemory;
      }
      
      return unusableMemory;
    }
    
    return 0;
  };
  
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">
          Memory Allocation Simulator
        </h1>
        
        {/* Memory Type Selection */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Memory Type</h2>
          <div className="flex flex-wrap gap-4">
            <button 
              className={`px-4 py-2 rounded-md ${memoryType === 'contiguous' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => setMemoryType('contiguous')}
            >
              Contiguous Memory
            </button>
            <button 
              className={`px-4 py-2 rounded-md ${memoryType === 'mvt' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => setMemoryType('mvt')}
            >
              MVT (Variable Partitions)
            </button>
            <button 
              className={`px-4 py-2 rounded-md ${memoryType === 'mft' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => setMemoryType('mft')}
            >
              MFT (Fixed Partitions)
            </button>
          </div>
        </div>
        
        {/* Algorithm Selection */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Allocation Algorithm</h2>
          <div className="flex flex-wrap gap-4">
            <button 
              className={`px-4 py-2 rounded-md ${algorithm === 'firstFit' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => setAlgorithm('firstFit')}
            >
              First Fit
            </button>
            <button 
              className={`px-4 py-2 rounded-md ${algorithm === 'bestFit' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => setAlgorithm('bestFit')}
            >
              Best Fit
            </button>
            <button 
              className={`px-4 py-2 rounded-md ${algorithm === 'worstFit' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => setAlgorithm('worstFit')}
            >
              Worst Fit
            </button>
            {memoryType === 'contiguous' && (
              <button 
                className={`px-4 py-2 rounded-md ${algorithm === 'nextFit' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                onClick={() => setAlgorithm('nextFit')}
              >
                Next Fit
              </button>
            )}
          </div>
        </div>
        
        {/* Memory Stats */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Memory Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-gray-500">Memory Utilization</p>
              <p className="text-2xl font-bold">{calculateUtilization()}%</p>
            </div>
            {memoryType === 'mft' && (
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-gray-500">Internal Fragmentation</p>
                <p className="text-2xl font-bold">{calculateInternalFragmentation()} units</p>
              </div>
            )}
            {(memoryType === 'mvt' || memoryType === 'contiguous') && (
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-gray-500">External Fragmentation</p>
                <p className="text-2xl font-bold">{calculateExternalFragmentation()} units</p>
              </div>
            )}
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-gray-500">Total Memory Size</p>
              <p className="text-2xl font-bold">{memorySize} units</p>
            </div>
          </div>
        </div>
        
       {/* Process Management */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
  {/* Processes */}
  <div className="bg-white rounded-lg shadow p-6">
    <h2 className="text-xl font-semibold mb-4">Processes</h2>
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 bg-gray-50 text-left">ID</th>
            <th className="py-2 px-4 bg-gray-50 text-left">Size</th>
            <th className="py-2 px-4 bg-gray-50 text-left">Status</th>
            <th className="py-2 px-4 bg-gray-50 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {processes.map(process => (
            <tr key={process.id} className="border-t">
              <td className="py-2 px-4">P{process.id}</td>
              <td className="py-2 px-4">{process.size}</td>
              <td className="py-2 px-4">
                <span className={`px-2 py-1 rounded-full text-xs ${process.allocated ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {process.allocated ? 'Allocated' : 'Waiting'}
                </span>
              </td>
              <td className="py-2 px-4 flex gap-2">
                <button
                  className="px-3 py-1 bg-blue-500 text-white rounded-md text-xs disabled:opacity-50"
                  onClick={() => allocateProcess(process.id)}
                  disabled={process.allocated}
                >
                  Allocate
                </button>
                <button
                  className="px-3 py-1 bg-red-500 text-white rounded-md text-xs"
                  onClick={() => removeProcess(process.id)}
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
            
            {/* Add New Process */}
            <div className="mt-6 bg-gray-50 p-4 rounded-md">
              <h3 className="font-semibold mb-3">Add New Process</h3>
              <div className="flex items-center gap-4">
                <div>
                  <label htmlFor="process-size" className="block text-sm text-gray-600 mb-1">Size</label>
                  <input 
                    id="process-size"
                    type="number" 
                    className="border rounded px-3 py-2 w-full"
                    value={newProcess.size}
                    onChange={(e) => setNewProcess({...newProcess, size: e.target.value})}
                    min="1"
                  />
                </div>
                <button 
                  className="px-4 py-2 bg-green-500 text-white rounded-md mt-6"
                  onClick={addProcess}
                >
                  Add Process
                </button>
              </div>
            </div>
          </div>
          
          {/* Memory Blocks/Partitions */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {memoryType === 'contiguous' ? 'Memory Blocks' : 
                 memoryType === 'mvt' ? 'Memory Segments (MVT)' : 'Fixed Partitions (MFT)'}
              </h2>
              <button 
                className="px-3 py-1 bg-orange-500 text-white rounded-md"
                onClick={resetMemory}
              >
                Reset Memory
              </button>
            </div>
            
            {/* Contiguous Memory Visualization */}
            {memoryType === 'contiguous' && (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 bg-gray-50 text-left">Block ID</th>
                      <th className="py-2 px-4 bg-gray-50 text-left">Size</th>
                      <th className="py-2 px-4 bg-gray-50 text-left">Status</th>
                      <th className="py-2 px-4 bg-gray-50 text-left">Process</th>
                    </tr>
                  </thead>
                  <tbody>
                    {blocks.map(block => (
                      <tr key={block.id} className="border-t">
                        <td className="py-2 px-4">B{block.id}</td>
                        <td className="py-2 px-4">{block.size}</td>
                        <td className="py-2 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${block.allocated ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                            {block.allocated ? 'Allocated' : 'Free'}
                          </span>
                        </td>
                        <td className="py-2 px-4">
                          {block.processId ? `P${block.processId}` : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            {/* MVT Memory Visualization */}
            {memoryType === 'mvt' && (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 bg-gray-50 text-left">Segment</th>
                      <th className="py-2 px-4 bg-gray-50 text-left">Start</th>
                      <th className="py-2 px-4 bg-gray-50 text-left">End</th>
                      <th className="py-2 px-4 bg-gray-50 text-left">Size</th>
                      <th className="py-2 px-4 bg-gray-50 text-left">Status</th>
                      <th className="py-2 px-4 bg-gray-50 text-left">Process</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mvtMemory.map((segment, index) => (
                      <tr key={segment.id} className="border-t">
                        <td className="py-2 px-4">{index + 1}</td>
                        <td className="py-2 px-4">{segment.start}</td>
                        <td className="py-2 px-4">{segment.end}</td>
                        <td className="py-2 px-4">{segment.end - segment.start + 1}</td>
                        <td className="py-2 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${!segment.free ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                            {segment.free ? 'Free' : 'Allocated'}
                          </span>
                        </td>
                        <td className="py-2 px-4">
                          {segment.processId ? `P${segment.processId}` : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            {/* MFT Partitions Visualization */}
            {memoryType === 'mft' && (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 bg-gray-50 text-left">Partition ID</th>
                      <th className="py-2 px-4 bg-gray-50 text-left">Size</th>
                      <th className="py-2 px-4 bg-gray-50 text-left">Status</th>
                      <th className="py-2 px-4 bg-gray-50 text-left">Process</th>
                      <th className="py-2 px-4 bg-gray-50 text-left">Internal Fragmentation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mftPartitions.map(partition => {
                      const allocatedProcess = processes.find(p => p.id === partition.processId);
                      const internalFrag = partition.allocated && allocatedProcess 
                        ? partition.size - allocatedProcess.size 
                        : 0;
                        
                      return (
                        <tr key={partition.id} className="border-t">
                          <td className="py-2 px-4">P{partition.id}</td>
                          <td className="py-2 px-4">{partition.size}</td>
                          <td className="py-2 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs ${partition.allocated ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                              {partition.allocated ? 'Allocated' : 'Free'}
                            </span>
                          </td>
                          <td className="py-2 px-4">
                            {partition.processId ? `P${partition.processId}` : '-'}
                          </td>
                          <td className="py-2 px-4">
                            {partition.allocated ? internalFrag : '-'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
            
            {/* Visual Memory Representation */}
            <div className="mt-6">
              <h3 className="font-semibold mb-3">Memory Visualization</h3>
              <div className="w-full h-16 bg-gray-200 rounded-md overflow-hidden flex">
                {memoryType === 'contiguous' && blocks.map(block => {
                  // Calculate relative width based on block size
                  const widthPercentage = (block.size / memorySize) * 100;
                  return (
                    <div 
                      key={block.id}
                      className={`h-full flex items-center justify-center text-xs ${block.allocated ? 'bg-red-400' : 'bg-green-400'}`}
                      style={{ width: `${widthPercentage}%` }}
                      title={`Block ${block.id}: ${block.size} units, ${block.allocated ? 'Allocated to P' + block.processId : 'Free'}`}
                    >
                      {block.allocated ? `P${block.processId}` : 'Free'}
                    </div>
                  );
                })}
                
                {memoryType === 'mvt' && mvtMemory.map(segment => {
                  // Calculate relative width based on segment size
                  const widthPercentage = ((segment.end - segment.start + 1) / memorySize) * 100;
                  return (
                    <div 
                      key={segment.id}
                      className={`h-full flex items-center justify-center text-xs ${segment.free ? 'bg-green-400' : 'bg-red-400'}`}
                      style={{ width: `${widthPercentage}%` }}
                      title={`Segment ${segment.id}: ${segment.end - segment.start + 1} units, ${segment.free ? 'Free' : 'Allocated to P' + segment.processId}`}
                    >
                      {segment.free ? 'Free' : `P${segment.processId}`}
                    </div>
                  );
                })}
                
                {memoryType === 'mft' && mftPartitions.map(partition => {
                  // Calculate relative width based on partition size
                  const totalSize = mftPartitions.reduce((sum, p) => sum + p.size, 0);
                  const widthPercentage = (partition.size / totalSize) * 100;
                  return (
                    <div 
                      key={partition.id}
                      className={`h-full flex items-center justify-center text-xs ${partition.allocated ? 'bg-red-400' : 'bg-green-400'}`}
                      style={{ width: `${widthPercentage}%` }}
                      title={`Partition ${partition.id}: ${partition.size} units, ${partition.allocated ? 'Allocated to P' + partition.processId : 'Free'}`}
                    >
                      {partition.allocated ? `P${partition.processId}` : 'Free'}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        
        {/* Message Display */}
        {message && (
          <div className="bg-blue-50 border border-blue-300 text-blue-800 p-4 rounded-md mt-4">
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default MemoryAllocationSimulator;
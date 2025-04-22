import React, { useState, useEffect } from 'react';

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
    const processToRemove = processes.find(p => p.id === processId);

    if (processToRemove && processToRemove.allocated && memoryType === 'mvt') {
      const updatedMemory = mvtMemory.map(segment =>
        segment.processId === processId ? { ...segment, free: true, processId: null } : segment
      );
      setMvtMemory(updatedMemory);
      setTimeout(mergeFreeSegments, 0);
    } else if (processToRemove && processToRemove.allocated && memoryType === 'contiguous') {
      setBlocks(blocks.map(block =>
        block.processId === processId ? { ...block, allocated: false, processId: null } : block
      ));
    } else if (processToRemove && processToRemove.allocated && memoryType === 'mft') {
      setMftPartitions(mftPartitions.map(partition =>
        partition.processId === processId ? { ...partition, allocated: false, processId: null } : partition
      ));
    }

    setProcesses(processes.filter(p => p.id !== processId));
    setMessage(`Process ${processId} removed successfully.`);
  };

  // First Fit Algorithm
  const firstFit = (processId) => {
    const process = processes.find(p => p.id === processId);
    if (!process) return false;

    for (let i = 0; i < blocks.length; i++) {
      if (!blocks[i].allocated && blocks[i].size >= process.size) {
        const updatedBlocks = [...blocks];
        updatedBlocks[i] = { ...blocks[i], allocated: true, processId: process.id };
        setBlocks(updatedBlocks);
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
      const updatedBlocks = [...blocks];
      updatedBlocks[bestBlockIndex] = {
        ...blocks[bestBlockIndex],
        allocated: true,
        processId: process.id
      };
      setBlocks(updatedBlocks);
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
      const updatedBlocks = [...blocks];
      updatedBlocks[worstBlockIndex] = {
        ...blocks[worstBlockIndex],
        allocated: true,
        processId: process.id
      };
      setBlocks(updatedBlocks);
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

  // Next Fit Algorithm
  const [lastAllocatedIndex, setLastAllocatedIndex] = useState(0);

  const nextFit = (processId) => {
    const process = processes.find(p => p.id === processId);
    if (!process) return false;

    let startIndex = lastAllocatedIndex % blocks.length; // Ensure index stays within bounds

    for (let i = 0; i < blocks.length; i++) {
      const currentIndex = (startIndex + i) % blocks.length;
      if (!blocks[currentIndex].allocated && blocks[currentIndex].size >= process.size) {
        const updatedBlocks = [...blocks];
        updatedBlocks[currentIndex] = { ...blocks[currentIndex], allocated: true, processId: process.id };
        setBlocks(updatedBlocks);
        const updatedProcesses = processes.map(p =>
          p.id === process.id ? { ...p, allocated: true, blockId: blocks[currentIndex].id } : p
        );
        setProcesses(updatedProcesses);
        setLastAllocatedIndex(currentIndex + 1);
        setMessage(`Process ${process.id} allocated to Block ${blocks[currentIndex].id} using Next Fit.`);
        return true;
      }
    }
    setMessage(`Cannot allocate Process ${process.id} using Next Fit. No suitable block available.`);
    return false;
  };

  const mergeFreeSegments = () => {
    const sortedMemory = [...mvtMemory].sort((a, b) => a.start - b.start);
    const mergedMemory = [];
    let currentSegment = null;

    for (const segment of sortedMemory) {
      if (!currentSegment) {
        currentSegment = { ...segment };
      } else if (currentSegment.free && segment.free && currentSegment.end + 1 === segment.start) {
        currentSegment = { ...currentSegment, end: segment.end };
      } else {
        mergedMemory.push(currentSegment);
        currentSegment = { ...segment };
      }
    }

    if (currentSegment) {
      mergedMemory.push(currentSegment);
    }

    setMvtMemory(mergedMemory);
  };

  const allocateProcessMVT = (processId) => {
    const process = processes.find(p => p.id === processId);
    if (!process) return false;

    let selectedSegmentIndex = -1;

    if (algorithm === 'firstFit') {
      selectedSegmentIndex = mvtMemory.findIndex(
        segment => segment.free && segment.end - segment.start + 1 >= process.size
      );
    } else if (algorithm === 'bestFit') {
      let bestFitIndex = -1;
      let minRemaining = Infinity;
      mvtMemory.forEach((segment, index) => {
        if (segment.free && segment.end - segment.start + 1 >= process.size) {
          const remaining = segment.end - segment.start + 1 - process.size;
          if (remaining < minRemaining) {
            minRemaining = remaining;
            bestFitIndex = index;
          }
        }
      });
      selectedSegmentIndex = bestFitIndex;
    } else if (algorithm === 'worstFit') {
      let worstFitIndex = -1;
      let maxRemaining = -1;
      mvtMemory.forEach((segment, index) => {
        if (segment.free && segment.end - segment.start + 1 >= process.size) {
          const remaining = segment.end - segment.start + 1 - process.size;
          if (remaining > maxRemaining) {
            maxRemaining = remaining;
            worstFitIndex = index;
          }
        }
      });
      selectedSegmentIndex = worstFitIndex;
    }

    if (selectedSegmentIndex !== -1) {
      const segment = mvtMemory[selectedSegmentIndex];
      const segmentSize = segment.end - segment.start + 1;
      const remainingSize = segmentSize - process.size;
      const updatedMemory = [...mvtMemory];

      if (remainingSize > 0) {
        // Allocate at the beginning of the segment
        updatedMemory[selectedSegmentIndex] = {
          ...segment,
          end: segment.start + process.size - 1,
          free: false,
          processId: process.id,
        };
        // Create a new free segment after the allocated one
        updatedMemory.push({
          id: Date.now(),
          start: segment.start + process.size,
          end: segment.end,
          free: true,
          processId: null,
        });
      } else {
        // Exact fit, allocate the entire segment
        updatedMemory[selectedSegmentIndex] = {
          ...segment,
          free: false,
          processId: process.id,
        };
      }

      updatedMemory.sort((a, b) => a.start - b.start);
      setMvtMemory(updatedMemory);
      const updatedProcesses = processes.map(p =>
        p.id === process.id ? { ...p, allocated: true, blockId: segment.id } : p
      );
      setProcesses(updatedProcesses);
      setMessage(`Process ${process.id} allocated in MVT memory at <span class="math-inline">\{segment\.start\}\-</span>{segment.start + process.size - 1}.`);
      return true;
    }

    setMessage(`Cannot allocate Process ${process.id} in MVT memory. Insufficient space.`);
    return false;
  };

  const allocateProcessMFT = (processId) => {
    const process = processes.find(p => p.id === processId);
    if (!process) return false;

    let selectedPartitionIndex = -1;

    if (algorithm === 'firstFit') {
      selectedPartitionIndex = mftPartitions.findIndex(
        partition => !partition.allocated && partition.size >= process.size
      );
    } else if (algorithm === 'bestFit') {
      let bestFitIndex = -1;
      let minWaste = Infinity;
      mftPartitions.forEach((partition, index) => {
        if (!partition.allocated && partition.size >= process.size) {
          const waste = partition.size - process.size;
          if (waste < minWaste) {
            minWaste = waste;
            bestFitIndex = index;
          }
        }
      });
      selectedPartitionIndex = bestFitIndex;
    } else if (algorithm === 'worstFit') {
      let worstFitIndex = -1;
      let maxWaste = -1;
      mftPartitions.forEach((partition, index) => {
        if (!partition.allocated && partition.size >= process.size) {
          const waste = partition.size - process.size;
          if (waste > maxWaste) {
            maxWaste = waste;
            worstFitIndex = index;
          }
        }
      });
      selectedPartitionIndex = worstFitIndex;
    }

    if (selectedPartitionIndex !== -1) {
      const updatedPartitions = [...mftPartitions];
      updatedPartitions[selectedPartitionIndex] = {
        ...mftPartitions[selectedPartitionIndex],
        allocated: true,
        processId: process.id,
      };
      setMftPartitions(updatedPartitions);
      const updatedProcesses = processes.map(p =>
        p.id === process.id ? { ...p, allocated: true, blockId: mftPartitions[selectedPartitionIndex].id } : p
      );
      setProcesses(updatedProcesses);
      const wastedMemory = mftPartitions[selectedPartitionIndex].size - process.size;
      setMessage(`Process ${process.id} allocated to MFT Partition ${mftPartitions[selectedPartitionIndex].id}. Internal fragmentation: ${wastedMemory}`);
      return true;
    }

    setMessage(`Cannot allocate Process ${process.id} in MFT memory. No suitable partition available.`);
    return false;
  };

  const allocateProcess = (processId) => {
    const process = processes.find(p => p.id === processId);
    if (!process) {
      setMessage
      setMessage(`Process ${processId} not found.`);
      return;
    }

    if (process.allocated) {
      setMessage(`Process ${processId} is already allocated.`);
      return;
    }

    if (memoryType === 'contiguous') {
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
      allocateProcessMVT(processId);
    } else if (memoryType === 'mft') {
      allocateProcessMFT(processId);
    }
  };

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

  const calculateInternalFragmentation = () => {
    if (memoryType === 'mft') {
      return mftPartitions
        .filter(partition => partition.allocated)
        .reduce((sum, partition) => {
          const process = processes.find(p => p.id === partition.processId);
          return process ? sum + (partition.size - process.size) : sum;
        }, 0);
    }
    return 0;
  };

  const calculateExternalFragmentation = () => {
    if (memoryType === 'mvt') {
      const largestProcess = processes
        .filter(p => !p.allocated)
        .reduce((max, p) => Math.max(max, p.size), 0);

      if (largestProcess === 0) return 0;

      const totalFreeMemory = mvtMemory
        .filter(segment => segment.free)
        .reduce((sum, segment) => sum + (segment.end - segment.start + 1), 0);

      const largestFreeSegment = mvtMemory
        .filter(segment => segment.free)
        .reduce((max, segment) => Math.max(max, segment.end - segment.start + 1), 0);

      return totalFreeMemory >= largestProcess && largestFreeSegment < largestProcess ? totalFreeMemory : 0;
    } else if (memoryType === 'contiguous') {
      const largestProcess = processes
        .filter(p => !p.allocated)
        .reduce((max, p) => Math.max(max, p.size), 0);

      if (largestProcess === 0) return 0;

      const totalFreeMemory = blocks
        .filter(block => !block.allocated)
        .reduce((sum, block) => sum + block.size, 0);

      const largestFreeBlock = blocks
        .filter(block => !block.allocated)
        .reduce((max, block) => Math.max(max, block.size), 0);

      return totalFreeMemory >= largestProcess && largestFreeBlock < largestProcess ? totalFreeMemory : 0;
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
                    onChange={(e) => setNewProcess({ ...newProcess, size: e.target.value })}
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
                    </tr>
                  </thead>
                  <tbody>
                    {mftPartitions.map(partition => (
                      <tr key={partition.id} className="border-t">
                        <td className="py-2 px-4">M{partition.id}</td>
                        <td className="py-2 px-4">{partition.size}</td>
                        <td className="py-2 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${partition.allocated ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                            {partition.allocated ? 'Allocated' : 'Free'}
                          </span>
                        </td>
                        <td className="py-2 px-4">
                          {partition.processId ? `P${partition.processId}` : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Message Display */}
        {message && (
          <div className="bg-indigo-100 border border-indigo-400 text-indigo-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Info:</strong>
            <span className="block sm:inline ml-2">{message}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemoryAllocationSimulator;
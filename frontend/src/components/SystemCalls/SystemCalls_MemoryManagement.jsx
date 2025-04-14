import { useState, useEffect } from 'react';
import React from 'react';

const MemoryManagement = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <MallocComponent />
          <BrkComponent />
          <SbrkComponent />
        </div>
      </div>
    </div>
  );
};

// Component 1: malloc() Memory Allocation
const MallocComponent = () => {
  const [memoryBlocks, setMemoryBlocks] = useState([]);
  const [requestSize, setRequestSize] = useState(64);
  const [allocating, setAllocating] = useState(false);
  const [freeing, setFreeing] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [heapSize, setHeapSize] = useState(1024); // Total simulated heap size
  const [usedMemory, setUsedMemory] = useState(0);
  
  const generateAddress = () => {
    // Generate a realistic-looking memory address
    return `0x${Math.floor(Math.random() * 0xFFFFFFF).toString(16).padStart(8, '0')}`;
  };
  
  useEffect(() => {
    // Update used memory whenever blocks change
    const total = memoryBlocks.reduce((sum, block) => sum + block.size, 0);
    setUsedMemory(total);
  }, [memoryBlocks]);
  
  const handleMalloc = () => {
    if (allocating) return;
    if (usedMemory + requestSize > heapSize) {
      alert("Cannot allocate memory: Not enough heap space!");
      return;
    }
    
    setAllocating(true);
    
    // Simulate allocation delay
    setTimeout(() => {
      const newBlock = {
        id: Date.now(),
        size: parseInt(requestSize),
        address: generateAddress(),
        color: `hsl(${Math.random() * 360}, 70%, 60%)`
      };
      
      setMemoryBlocks([...memoryBlocks, newBlock]);
      setAllocating(false);
    }, 800);
  };
  
  const handleFree = (blockId) => {
    if (freeing) return;
    setFreeing(true);
    setSelectedBlock(blockId);
    
    // Simulate deallocation delay
    setTimeout(() => {
      setMemoryBlocks(memoryBlocks.filter(block => block.id !== blockId));
      setFreeing(false);
      setSelectedBlock(null);
    }, 800);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-green-600">
      <h2 className="text-xl font-bold mb-4 text-red-600">malloc() & free()</h2>
      <p className="mb-4">
        <strong>malloc()</strong>: Allocates dynamic memory from heap<br />
        <strong>free()</strong>: Deallocates previously allocated memory
      </p>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Memory Request Size (bytes):</label>
        <div className="flex space-x-2">
          <input 
            type="number" 
            min="8"
            max="512"
            value={requestSize} 
            onChange={(e) => setRequestSize(Math.max(8, parseInt(e.target.value) || 0))}
            className="flex-1 p-2 border rounded font-mono"
            disabled={allocating}
          />
          <button 
            onClick={handleMalloc}
            disabled={allocating || usedMemory + requestSize > heapSize}
            className={`px-4 py-2 rounded font-medium ${allocating || usedMemory + requestSize > heapSize ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'}`}
          >
            {allocating ? 'Allocating...' : 'malloc()'}
          </button>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <label className="block text-sm font-medium text-gray-700">Heap Status:</label>
          <span className="text-xs font-mono">
            {usedMemory}/{heapSize} bytes ({Math.round(usedMemory/heapSize*100)}% used)
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-green-600 h-2.5 rounded-full" 
            style={{ width: `${(usedMemory/heapSize)*100}%` }}
          ></div>
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Memory Blocks:</label>
        <div className="border rounded p-2 bg-gray-50 h-64 overflow-auto">
          {memoryBlocks.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-400 italic">
              No memory allocated
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {memoryBlocks.map(block => (
                <div 
                  key={block.id}
                  className={`relative border rounded p-2 
                    ${selectedBlock === block.id ? 'border-red-500 border-2 animate-pulse' : 'border-gray-300'}`}
                  style={{
                    backgroundColor: block.color,
                    width: `${Math.min(100, block.size / 4)}px`,
                    height: `${Math.min(100, block.size / 4)}px`,
                  }}
                >
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-xs text-white font-mono bg-black bg-opacity-40 rounded opacity-0 hover:opacity-100 transition-opacity">
                    <span>{block.size} bytes</span>
                    <span className="truncate max-w-full px-1">{block.address}</span>
                    <button 
                      onClick={() => handleFree(block.id)}
                      className="mt-1 px-2 py-0.5 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
                      disabled={freeing}
                    >
                      free()
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="text-xs text-gray-500 italic">
        Hover over memory blocks to see details and free them
      </div>
    </div>
  );
};

// Component 2: brk() System Call
const BrkComponent = () => {
  const [programBreak, setProgramBreak] = useState(0x1000);
  const [heapStartAddress, setHeapStartAddress] = useState(0x1000);
  const [heapSegments, setHeapSegments] = useState([]);
  const [addressInput, setAddressInput] = useState('');
  const [isMoving, setIsMoving] = useState(false);
  
  // Initialize with some memory segments
  useEffect(() => {
    // Reset heap segments
    const initialSegments = [];
    setProgramBreak(0x1000);
    setHeapSegments(initialSegments);
  }, []);
  
  const handleBrk = () => {
    if (isMoving) return;
    
    const newAddress = parseInt(addressInput, 16);
    if (isNaN(newAddress)) {
      alert("Please enter a valid hexadecimal address");
      return;
    }
    
    if (newAddress < heapStartAddress) {
      alert("Cannot set program break below heap start");
      return;
    }
    
    setIsMoving(true);
    
    // Simulate the operation taking time
    setTimeout(() => {
      if (newAddress > programBreak) {
        // Allocating more memory - add a new segment
        const newSegment = {
          id: Date.now(),
          start: programBreak,
          end: newAddress,
          size: newAddress - programBreak,
          color: `hsl(${Math.random() * 360}, 70%, 60%)`
        };
        setHeapSegments([...heapSegments, newSegment]);
      } else if (newAddress < programBreak) {
        // Releasing memory - remove segments that fall above new break
        const updatedSegments = heapSegments.filter(seg => seg.start < newAddress);
        // Adjust the last segment if needed
        if (updatedSegments.length > 0) {
          const lastIndex = updatedSegments.length - 1;
          if (updatedSegments[lastIndex].end > newAddress) {
            updatedSegments[lastIndex] = {
              ...updatedSegments[lastIndex],
              end: newAddress,
              size: newAddress - updatedSegments[lastIndex].start
            };
          }
        }
        setHeapSegments(updatedSegments);
      }
      
      setProgramBreak(newAddress);
      setAddressInput('');
      setIsMoving(false);
    }, 800);
  };
  
  const formatHex = (value) => {
    return `0x${value.toString(16).toUpperCase()}`;
  };
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-green-600">
      <h2 className="text-xl font-bold mb-4 text-red-600">brk()</h2>
      <p className="mb-4">
        <strong>brk()</strong>: Changes the location of the program break (end of data segment)
      </p>
      
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <label className="block text-sm font-medium text-gray-700">Current Program Break:</label>
          <span className="font-mono bg-gray-100 px-2 py-1 rounded text-sm">
            {formatHex(programBreak)}
          </span>
        </div>
        <div className="flex justify-between items-center mb-1">
          <label className="block text-sm font-medium text-gray-700">Heap Start Address:</label>
          <span className="font-mono bg-gray-100 px-2 py-1 rounded text-sm">
            {formatHex(heapStartAddress)}
          </span>
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Move Program Break To:</label>
        <div className="flex space-x-2">
          <div className="flex-1 flex items-center border rounded overflow-hidden">
            <span className="bg-gray-100 px-2 py-2 text-gray-600 font-mono text-sm">0x</span>
            <input 
              type="text" 
              value={addressInput}
              onChange={(e) => setAddressInput(e.target.value.replace(/[^0-9A-Fa-f]/g, ''))}
              className="flex-1 p-2 font-mono"
              placeholder="hex address"
              disabled={isMoving}
            />
          </div>
          <button 
            onClick={handleBrk}
            disabled={isMoving || !addressInput}
            className={`px-4 py-2 rounded font-medium ${isMoving || !addressInput ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
          >
            brk()
          </button>
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Memory Visualization:</label>
        <div className="border rounded p-2 bg-gray-50 h-64 overflow-auto">
          <div className="relative w-full h-full">
            {/* Heap start marker */}
            <div className="absolute left-0 top-0 w-full border-t border-dashed border-gray-400 flex justify-between">
              <span className="bg-gray-100 px-1 text-xs font-mono">{formatHex(heapStartAddress)}</span>
              <span className="bg-gray-100 px-1 text-xs">Heap Start</span>
            </div>
            
            {/* Memory segments */}
            {heapSegments.map((segment, index) => {
              const topPosition = `${(segment.start - heapStartAddress) / 20}px`;
              const height = `${segment.size / 20}px`;
              
              return (
                <div 
                  key={segment.id}
                  className="absolute left-0 w-full opacity-80"
                  style={{ 
                    top: topPosition, 
                    height: height,
                    backgroundColor: segment.color
                  }}
                >
                  <div className="text-xs font-mono text-white p-1 truncate">
                    {formatHex(segment.start)} - {formatHex(segment.end)}
                    <div>{segment.size} bytes</div>
                  </div>
                </div>
              );
            })}
            
            {/* Program break marker */}
            <div 
              className="absolute left-0 w-full border-t-2 border-red-500 flex justify-between"
              style={{ top: `${(programBreak - heapStartAddress) / 20}px` }}
            >
              <span className="bg-red-100 px-1 text-xs font-mono">{formatHex(programBreak)}</span>
              <span className="bg-red-100 px-1 text-xs">Program Break</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="text-xs text-gray-500 italic">
        Use brk() to move the program break, expanding or shrinking the heap
      </div>
    </div>
  );
};

// Component 3: sbrk() System Call
const SbrkComponent = () => {
  const [programBreak, setProgramBreak] = useState(0x1000);
  const [heapStartAddress, setHeapStartAddress] = useState(0x1000);
  const [incrementSize, setIncrementSize] = useState(64);
  const [heapSegments, setHeapSegments] = useState([]);
  const [isModifying, setIsModifying] = useState(false);
  const [totalAllocated, setTotalAllocated] = useState(0);
  
  useEffect(() => {
    // Calculate total allocated memory
    const total = heapSegments.reduce((sum, segment) => sum + segment.size, 0);
    setTotalAllocated(total);
  }, [heapSegments]);
  
  const handleSbrk = (increment) => {
    if (isModifying) return;
    
    // Don't allow negative increments that would go below heap start
    if (increment < 0 && programBreak + increment < heapStartAddress) {
      alert("Cannot decrease program break below heap start");
      return;
    }
    
    setIsModifying(true);
    
    // Simulate the operation taking time
    setTimeout(() => {
      const newBreak = programBreak + increment;
      
      if (increment > 0) {
        // Allocating more memory - add a new segment
        const newSegment = {
          id: Date.now(),
          start: programBreak,
          end: newBreak,
          size: increment,
          color: `hsl(${Math.random() * 360}, 70%, 60%)`
        };
        setHeapSegments([...heapSegments, newSegment]);
      } else if (increment < 0) {
        // Releasing memory - remove segments that fall above new break
        const updatedSegments = heapSegments.filter(seg => seg.start < newBreak);
        // Adjust the last segment if needed
        if (updatedSegments.length > 0) {
          const lastIndex = updatedSegments.length - 1;
          if (updatedSegments[lastIndex].end > newBreak) {
            updatedSegments[lastIndex] = {
              ...updatedSegments[lastIndex],
              end: newBreak,
              size: newBreak - updatedSegments[lastIndex].start
            };
          }
        }
        setHeapSegments(updatedSegments);
      }
      
      setProgramBreak(newBreak);
      setIsModifying(false);
    }, 800);
  };
  
  const formatHex = (value) => {
    return `0x${value.toString(16).toUpperCase()}`;
  };
  
  const handleIncrement = () => {
    handleSbrk(parseInt(incrementSize));
  };
  
  const handleDecrement = () => {
    handleSbrk(-parseInt(incrementSize));
  };
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-green-600">
      <h2 className="text-xl font-bold mb-4 text-red-600">sbrk()</h2>
      <p className="mb-4">
        <strong>sbrk()</strong>: Increments the program break by specified amount
      </p>
      
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <label className="block text-sm font-medium text-gray-700">Current Program Break:</label>
          <span className="font-mono bg-gray-100 px-2 py-1 rounded text-sm">
            {formatHex(programBreak)}
          </span>
        </div>
        <div className="flex justify-between items-center mb-1">
          <label className="block text-sm font-medium text-gray-700">Total Allocated:</label>
          <span className="font-mono bg-gray-100 px-2 py-1 rounded text-sm">
            {totalAllocated} bytes
          </span>
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Increment Size (bytes):</label>
        <div className="flex space-x-2">
          <input 
            type="number" 
            min="1"
            value={incrementSize} 
            onChange={(e) => setIncrementSize(Math.max(1, parseInt(e.target.value) || 0))}
            className="flex-1 p-2 border rounded font-mono"
            disabled={isModifying}
          />
          <button 
            onClick={handleIncrement}
            disabled={isModifying}
            className={`px-4 py-2 rounded font-medium ${isModifying ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'}`}
          >
            sbrk(+)
          </button>
          <button 
            onClick={handleDecrement}
            disabled={isModifying || programBreak - incrementSize < heapStartAddress}
            className={`px-4 py-2 rounded font-medium ${isModifying || programBreak - incrementSize < heapStartAddress ? 'bg-gray-300 cursor-not-allowed' : 'bg-red-600 text-white hover:bg-red-700'}`}
          >
            sbrk(-)
          </button>
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Quick Allocations:</label>
        <div className="grid grid-cols-3 gap-2">
          <button 
            onClick={() => handleSbrk(16)}
            disabled={isModifying}
            className={`px-2 py-1 rounded text-sm font-medium ${isModifying ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
          >
            +16 bytes
          </button>
          <button 
            onClick={() => handleSbrk(64)}
            disabled={isModifying}
            className={`px-2 py-1 rounded text-sm font-medium ${isModifying ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
          >
            +64 bytes
          </button>
          <button 
            onClick={() => handleSbrk(256)}
            disabled={isModifying}
            className={`px-2 py-1 rounded text-sm font-medium ${isModifying ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
          >
            +256 bytes
          </button>
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Memory Segments:</label>
        <div className="border rounded p-2 bg-gray-50 h-64 overflow-auto">
          <div className="relative w-full h-full pb-4">
            {/* Heap start marker */}
            <div className="absolute left-0 top-0 w-full border-t border-dashed border-gray-400 flex justify-between">
              <span className="bg-gray-100 px-1 text-xs font-mono">{formatHex(heapStartAddress)}</span>
              <span className="bg-gray-100 px-1 text-xs">Heap Start</span>
            </div>
            
            {/* Memory segments */}
            {heapSegments.map((segment, index) => {
              const topPosition = `${(segment.start - heapStartAddress) / 16}px`;
              const height = `${Math.max(20, segment.size / 16)}px`;
              
              return (
                <div 
                  key={segment.id}
                  className="absolute left-0 w-full opacity-80 flex items-center"
                  style={{ 
                    top: topPosition, 
                    minHeight: '20px',
                    height: height,
                    backgroundColor: segment.color
                  }}
                >
                  <div className="text-xs font-mono text-white p-1 truncate">
                    {formatHex(segment.start)} (+{segment.size} bytes)
                  </div>
                </div>
              );
            })}
            
            {/* Program break marker */}
            <div 
              className="absolute left-0 w-full border-t-2 border-red-500 flex justify-between"
              style={{ top: `${(programBreak - heapStartAddress) / 16}px` }}
            >
              <span className="bg-red-100 px-1 text-xs font-mono">{formatHex(programBreak)}</span>
              <span className="bg-red-100 px-1 text-xs">Program Break</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="text-xs text-gray-500 italic">
        Use sbrk() to increment or decrement the program break
      </div>
    </div>
  );
};

export default MemoryManagement;
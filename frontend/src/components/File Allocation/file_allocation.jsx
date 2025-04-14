import { useState, useEffect } from 'react';

export default function FileAllocationSimulator() {
  const [blocks, setBlocks] = useState(Array(50).fill(null));
  const [files, setFiles] = useState({});
  const [activeTab, setActiveTab] = useState('sequential');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState(1);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showDetails, setShowDetails] = useState(false);

  // Clear messages after 3 seconds
  useEffect(() => {
    if (errorMessage || successMessage) {
      const timer = setTimeout(() => {
        setErrorMessage('');
        setSuccessMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage, successMessage]);

  // Generate a random color for each file
  const getFileColor = (fileName) => {
    if (!fileName) return '';
    
    // Predefined color classes
    const colorClasses = [
      'bg-blue-200 border-blue-300 text-blue-800',
      'bg-green-200 border-green-300 text-green-800',
      'bg-yellow-200 border-yellow-300 text-yellow-800',
      'bg-red-200 border-red-300 text-red-800',
      'bg-purple-200 border-purple-300 text-purple-800',
      'bg-pink-200 border-pink-300 text-pink-800',
      'bg-indigo-200 border-indigo-300 text-indigo-800',
      'bg-teal-200 border-teal-300 text-teal-800'
    ];
    
    // Use the sum of character codes to deterministically select a color
    const sum = fileName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colorClasses[sum % colorClasses.length];
  };

  const renderBlockContent = (block, index) => {
    if (!block) return <span className="text-xs">{index}</span>;
    
    if (block.isIndex) {
      return (
        <div className="flex flex-col items-center">
          <div className="text-xs font-bold mb-1">Index: {block.file}</div>
          <div className="text-xs overflow-hidden">
            {block.pointers.map(p => `${p}`).join(', ')}
          </div>
        </div>
      );
    }
    
    if (block.type === 'sequential') {
      return (
        <div className="text-xs">
          <div>{block.file}</div>
          <div>Block {block.blockNumber}</div>
        </div>
      );
    }
    
    if (block.type === 'linked') {
      return (
        <div className="text-xs">
          <div>{block.file}</div>
          <div>→ {block.next !== null ? block.next : 'End'}</div>
        </div>
      );
    }
    
    if (block.type === 'indexed') {
      return (
        <div className="text-xs">
          <div>{block.file}</div>
          <div>Data block</div>
        </div>
      );
    }
    
    return <span className="text-xs">{index}</span>;
  };

  const findFreeSequentialBlocks = (size) => {
    for (let i = 0; i <= blocks.length - size; i++) {
      let freeBlocksCount = 0;
      for (let j = i; j < i + size; j++) {
        if (blocks[j] === null) {
          freeBlocksCount++;
        } else {
          break;
        }
      }
      
      if (freeBlocksCount === size) {
        return i;
      }
    }
    return -1;
  };

  // Get all free blocks
  const getAllFreeBlockIndices = () => {
    const freeIndices = [];
    blocks.forEach((block, index) => {
      if (block === null) {
        freeIndices.push(index);
      }
    });
    return freeIndices;
  };

  // Get random blocks from available free blocks
  const getRandomFreeBlocks = (count) => {
    const freeIndices = getAllFreeBlockIndices();
    
    if (freeIndices.length < count) {
      return [];
    }
    
    // Shuffle the free indices using Fisher-Yates algorithm
    for (let i = freeIndices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [freeIndices[i], freeIndices[j]] = [freeIndices[j], freeIndices[i]];
    }
    
    // Return the required number of random blocks
    return freeIndices.slice(0, count);
  };

  const allocateSequentialFile = () => {
    const startBlock = findFreeSequentialBlocks(fileSize);
    
    if (startBlock === -1) {
      setErrorMessage(`Cannot allocate ${fileSize} contiguous blocks. Try defragmenting or using another allocation method.`);
      return false;
    }
    
    const newBlocks = [...blocks];
    for (let i = 0; i < fileSize; i++) {
      newBlocks[startBlock + i] = {
        file: fileName,
        type: 'sequential',
        blockNumber: i
      };
    }
    
    setBlocks(newBlocks);
    setFiles({
      ...files,
      [fileName]: {
        size: fileSize,
        type: 'sequential',
        start: startBlock
      }
    });
    
    return true;
  };

  const allocateLinkedFile = () => {
    // Get random free blocks instead of consecutive ones
    const randomBlocks = getRandomFreeBlocks(fileSize);
    
    if (randomBlocks.length < fileSize) {
      setErrorMessage(`Cannot allocate ${fileSize} blocks. Only ${randomBlocks.length} free blocks available.`);
      return false;
    }
    
    const newBlocks = [...blocks];
    
    for (let i = 0; i < fileSize; i++) {
      const currentBlock = randomBlocks[i];
      const nextBlock = i < fileSize - 1 ? randomBlocks[i + 1] : null;
      
      newBlocks[currentBlock] = {
        file: fileName,
        type: 'linked',
        next: nextBlock
      };
    }
    
    setBlocks(newBlocks);
    setFiles({
      ...files,
      [fileName]: {
        size: fileSize,
        type: 'linked',
        start: randomBlocks[0]
      }
    });
    
    return true;
  };

  const allocateIndexedFile = () => {
    // We need fileSize + 1 blocks (1 for the index block)
    // Get random blocks instead of consecutive ones
    const randomBlocks = getRandomFreeBlocks(fileSize + 1);
    
    if (randomBlocks.length < fileSize + 1) {
      setErrorMessage(`Cannot allocate ${fileSize + 1} blocks. Only ${randomBlocks.length} free blocks available.`);
      return false;
    }
    
    const indexBlock = randomBlocks[0];
    const dataBlocks = randomBlocks.slice(1);
    
    const newBlocks = [...blocks];
    
    // Set index block
    newBlocks[indexBlock] = {
      file: fileName,
      type: 'indexed',
      isIndex: true,
      pointers: dataBlocks
    };
    
    // Set data blocks
    for (const blockIndex of dataBlocks) {
      newBlocks[blockIndex] = {
        file: fileName,
        type: 'indexed',
        isIndex: false
      };
    }
    
    setBlocks(newBlocks);
    setFiles({
      ...files,
      [fileName]: {
        size: fileSize,
        type: 'indexed',
        indexBlock: indexBlock
      }
    });
    
    return true;
  };

  const addFile = () => {
    // Validation
    if (!fileName.trim()) {
      setErrorMessage('Please enter a file name.');
      return;
    }
    
    if (files[fileName]) {
      setErrorMessage('A file with this name already exists.');
      return;
    }
    
    if (fileSize < 1 || fileSize > 20) {
      setErrorMessage('File size must be between 1 and 20 blocks.');
      return;
    }
    
    let success = false;
    
    switch (activeTab) {
      case 'sequential':
        success = allocateSequentialFile();
        break;
      case 'linked':
        success = allocateLinkedFile();
        break;
      case 'indexed':
        success = allocateIndexedFile();
        break;
      default:
        setErrorMessage('Invalid allocation method.');
    }
    
    if (success) {
      setSuccessMessage(`File "${fileName}" allocated successfully using ${activeTab} allocation.`);
      setFileName('');
      setFileSize(1);
    }
  };

  const deleteFile = (name) => {
    const fileData = files[name];
    if (!fileData) return;
    
    const newBlocks = [...blocks];
    
    if (fileData.type === 'sequential') {
      for (let i = fileData.start; i < fileData.start + fileData.size; i++) {
        newBlocks[i] = null;
      }
    } else if (fileData.type === 'linked') {
      let currentBlock = fileData.start;
      while (currentBlock !== null) {
        const nextBlock = newBlocks[currentBlock]?.next;
        newBlocks[currentBlock] = null;
        currentBlock = nextBlock;
      }
    } else if (fileData.type === 'indexed') {
      // Free the data blocks using pointers from index block
      const indexBlock = newBlocks[fileData.indexBlock];
      if (indexBlock && indexBlock.pointers) {
        for (const dataBlock of indexBlock.pointers) {
          newBlocks[dataBlock] = null;
        }
      }
      // Free the index block
      newBlocks[fileData.indexBlock] = null;
    }
    
    const newFiles = { ...files };
    delete newFiles[name];
    
    setBlocks(newBlocks);
    setFiles(newFiles);
    setSuccessMessage(`File "${name}" deleted successfully.`);
  };

  const resetSimulation = () => {
    setBlocks(Array(50).fill(null));
    setFiles({});
    setFileName('');
    setFileSize(1);
    setErrorMessage('');
    setSuccessMessage('Simulation reset.');
  };

  const allocationDetails = {
    sequential: {
      advantages: [
        'Simple to implement and understand',
        'Fast sequential access to data',
        'Low overhead - no pointers needed',
        'Good for files that don\'t change size'
      ],
      disadvantages: [
        'External fragmentation - empty spaces between files',
        'Difficult to grow files after allocation',
        'May waste disk space',
        'Requires a contiguous free space for allocation'
      ]
    },
    linked: {
      advantages: [
        'No external fragmentation',
        'Files can easily grow in size',
        'No need for compaction',
        'Efficient use of disk space'
      ],
      disadvantages: [
        'Slow random access - must follow the chain',
        'Pointer overhead in each block',
        'Reliability issues - a single damaged pointer can corrupt the file',
        'Poor cache performance due to non-contiguous blocks'
      ]
    },
    indexed: {
      advantages: [
        'Fast direct access to any block',
        'No external fragmentation',
        'Files can grow as long as free blocks are available',
        'Better for both sequential and random access'
      ],
      disadvantages: [
        'Overhead of index block - wastes space for small files',
        'Complex to implement',
        'Multiple disk accesses to read/write data (first index, then data)',
        'Limited file size based on index block capacity'
      ]
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-blue-700 text-center shadow-sm">File Allocation Simulator</h1>
      
      {/* Tab navigation */}
      <div className="flex mb-6 border-b border-gray-300 bg-white rounded-t-lg shadow-md overflow-hidden">
        {['sequential', 'linked', 'indexed'].map(tab => (
          <button 
            key={tab}
            className={`py-3 px-6 font-medium transition-all duration-300 
              ${activeTab === tab 
                ? 'bg-blue-500 text-white shadow-md transform scale-105' 
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'}`}
            onClick={() => {setActiveTab(tab); setShowDetails(false);}}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)} Allocation
          </button>
        ))}
      </div>
      
      {/* Description and details toggle */}
      <div className="mb-6 p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
        <div className="flex justify-between items-center">
          <p className="text-gray-700">
            <strong className="font-semibold">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Allocation:</strong> 
            {activeTab === 'sequential' && " Files are stored in consecutive blocks on disk. Requires finding a large enough contiguous free space."}
            {activeTab === 'linked' && " Each block contains a pointer to the next block in the file. Uses random blocks across the disk."}
            {activeTab === 'indexed' && " Each file has an index block with pointers to all file blocks. Blocks are randomly allocated across the disk."}
          </p>
          <button 
            onClick={() => setShowDetails(!showDetails)}
            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105"
          >
            {showDetails ? 'Hide Details' : 'Show Details'}
          </button>
        </div>
        
        {showDetails && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg shadow-inner">
            <h3 className="font-bold text-xl mb-3 text-blue-800">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Allocation Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <h4 className="font-bold text-green-600 mb-2">Advantages</h4>
                <ul className="list-disc pl-5 text-gray-700">
                  {allocationDetails[activeTab].advantages.map((adv, i) => (
                    <li key={`adv-${i}`} className="mb-1">{adv}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <h4 className="font-bold text-red-600 mb-2">Disadvantages</h4>
                <ul className="list-disc pl-5 text-gray-700">
                  {allocationDetails[activeTab].disadvantages.map((dis, i) => (
                    <li key={`dis-${i}`} className="mb-1">{dis}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* File creation form */}
      <div className="mb-6 p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
        <div className="space-y-4">
          <div className="flex items-center">
            <label className="w-32 font-medium text-gray-700">File Name:</label>
            <input 
              type="text" 
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className="border border-gray-300 p-2 rounded-lg w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 hover:shadow-sm"
              placeholder="Enter file name"
            />
          </div>
          <div className="flex items-center">
            <label className="w-32 font-medium text-gray-700">Size (blocks):</label>
            <input 
              type="number" 
              min="1"
              max="20"
              value={fileSize}
              onChange={(e) => setFileSize(parseInt(e.target.value) || 1)}
              className="border border-gray-300 p-2 rounded-lg w-32 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 hover:shadow-sm"
            />
          </div>
          <div className="flex gap-4">
            <button 
              onClick={addFile}
              className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105"
            >
              Allocate File
            </button>
            <button 
              onClick={resetSimulation}
              className="bg-gray-600 text-white py-2 px-6 rounded-lg hover:bg-gray-700 shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105"
            >
              Reset
            </button>
          </div>
          
          {errorMessage && (
            <div className="mt-4 text-red-600 font-medium p-3 bg-red-50 rounded-lg border border-red-200 animate-pulse">{errorMessage}</div>
          )}
          {successMessage && (
            <div className="mt-4 text-green-600 font-medium p-3 bg-green-50 rounded-lg border border-green-200 animate-pulse">{successMessage}</div>
          )}
        </div>
      </div>
      
      {/* Disk blocks visualization */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4 text-blue-700">Disk Blocks</h2>
        <div className="grid grid-cols-10 gap-2 p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          {blocks.map((block, index) => (
            <div 
              key={index} 
              className={`
                border rounded-lg p-2 h-24 flex items-center justify-center text-center transition-all duration-300 hover:scale-105 hover:z-10
                ${block === null ? 'bg-gray-100 text-gray-500 border-gray-300' : getFileColor(block.file)}
                ${block?.isIndex ? 'ring-2 ring-yellow-500 animate-pulse' : 'border-transparent'}
                shadow-sm hover:shadow-md
              `}
              title={block ? `File: ${block.file}, Type: ${block.type}` : `Free block #${index}`}
            >
              {renderBlockContent(block, index)}
            </div>
          ))}
        </div>
      </div>
      
      {/* File list */}
      <div>
        <h2 className="text-2xl font-bold mb-4 text-blue-700">Allocated Files</h2>
        {Object.keys(files).length === 0 ? (
          <div className="text-gray-500 p-4 bg-white rounded-lg shadow-md">No files allocated yet</div>
        ) : (
          <div className="space-y-3">
            {Object.entries(files).map(([name, fileData]) => (
              <div key={name} className="p-4 bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className={`w-4 h-4 rounded-full mr-3 ${getFileColor(name).split(' ')[0]}`}
                    ></div>
                    <span className="font-medium text-gray-800">{name}</span>
                    <span className="ml-4 text-sm text-gray-600">
                      ({fileData.size} blocks) - {fileData.type.charAt(0).toUpperCase() + fileData.type.slice(1)}
                    </span>
                  </div>
                  <button
                    onClick={() => deleteFile(name)}
                    className="bg-red-600 text-white py-1 px-3 rounded-lg hover:bg-red-700 shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-md"
                  >
                    Delete
                  </button>
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  {fileData.type === 'sequential' && `Start: ${fileData.start}`}
                  {fileData.type === 'linked' && `Start: ${fileData.start}`}
                  {fileData.type === 'indexed' && `Index: ${fileData.indexBlock}`}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <style jsx>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.7; }
          100% { opacity: 1; }
        }
        
        .animate-pulse {
          animation: pulse 2s infinite;
        }
      `}</style>
    </div>
  );
}
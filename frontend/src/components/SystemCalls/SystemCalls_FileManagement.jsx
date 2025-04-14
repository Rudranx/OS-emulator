import React, { useState } from 'react';

const FileManagement = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <FileOpenCloseComponent />
          <FileReadWriteComponent />
          <FileSeekComponent />
        </div>
      </div>
    </div>
  );
};

// Component 1: Open/Close File Operations
const FileOpenCloseComponent = () => {
  const [fileStatus, setFileStatus] = useState('Closed');
  const [fileName, setFileName] = useState('example.txt');
  const [fileDescriptor, setFileDescriptor] = useState(null);
  const [animationState, setAnimationState] = useState('idle');
  
  const handleOpen = () => {
    setAnimationState('opening');
    setTimeout(() => {
      setFileStatus('Open');
      setFileDescriptor(Math.floor(Math.random() * 100) + 3); // Simulate file descriptor (usually 3+ in Unix)
      setAnimationState('idle');
    }, 1000);
  };
  
  const handleClose = () => {
    if (fileStatus === 'Open') {
      setAnimationState('closing');
      setTimeout(() => {
        setFileStatus('Closed');
        setFileDescriptor(null);
        setAnimationState('idle');
      }, 1000);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-red-600">
      <h2 className="text-xl font-bold mb-4 text-green-600">open() & close()</h2>
      <p className="mb-4">
        <strong>open()</strong>: Opens a file and returns a file descriptor<br />
        <strong>close()</strong>: Closes an open file descriptor
      </p>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">File Name:</label>
        <input 
          type="text" 
          value={fileName} 
          onChange={(e) => setFileName(e.target.value)}
          className="mt-1 p-2 w-full border rounded"
          disabled={fileStatus === 'Open'}
        />
      </div>
      
      <div className="flex justify-center items-center h-40 border rounded-lg bg-gray-50 mb-4 relative overflow-hidden">
        <div className={`absolute inset-0 flex items-center justify-center transition-transform duration-1000
          ${animationState === 'opening' ? 'scale-110' : ''}
          ${animationState === 'closing' ? 'scale-90 opacity-0' : ''}
        `}>
          <div className={`w-24 h-32 ${fileStatus === 'Open' ? 'bg-green-200' : 'bg-gray-200'} 
            rounded flex items-center justify-center border-2 
            ${fileStatus === 'Open' ? 'border-green-600' : 'border-gray-400'}`}>
            <span className="text-sm font-mono">{fileName}</span>
          </div>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="font-medium">Status:</span>
          <span className={`font-bold px-2 py-1 rounded ${fileStatus === 'Open' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {fileStatus}
          </span>
        </div>
        {fileDescriptor !== null && (
          <div className="flex justify-between items-center">
            <span className="font-medium">File Descriptor:</span>
            <span className="font-mono bg-gray-100 px-2 py-1 rounded">{fileDescriptor}</span>
          </div>
        )}
      </div>
      
      <div className="flex space-x-2">
        <button 
          onClick={handleOpen}
          disabled={fileStatus === 'Open' || animationState !== 'idle'}
          className={`flex-1 px-4 py-2 rounded font-medium ${fileStatus === 'Open' ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'}`}
        >
          open()
        </button>
        <button 
          onClick={handleClose}
          disabled={fileStatus === 'Closed' || animationState !== 'idle'}
          className={`flex-1 px-4 py-2 rounded font-medium ${fileStatus === 'Closed' ? 'bg-gray-300 cursor-not-allowed' : 'bg-red-600 text-white hover:bg-red-700'}`}
        >
          close()
        </button>
      </div>
      
      {/* Added C Commands */}
      <div className="mt-4 text-sm">
        <pre className="bg-gray-800 text-white p-2 rounded">
          <code>{`int fd = open("${fileName}", O_RDONLY); // Open file\nclose(fd); // Close file`}</code>
        </pre>
      </div>
    </div>
  );
};

// Component 2: Read/Write File Operations
const FileReadWriteComponent = () => {
  const [fileContent, setFileContent] = useState('');
  const [tempContent, setTempContent] = useState('');
  const [fileStatus, setFileStatus] = useState('Closed');
  const [isWriting, setIsWriting] = useState(false);
  const [isReading, setIsReading] = useState(false);
  
  const handleOpen = () => {
    setFileStatus('Open');
  };
  
  const handleClose = () => {
    setFileStatus('Closed');
  };
  
  const handleWrite = () => {
    if (fileStatus === 'Open') {
      setIsWriting(true);
      const contentToWrite = tempContent;
      
      // Simulate character-by-character writing
      let i = 0;
      const writeInterval = setInterval(() => {
        if (i <= contentToWrite.length) {
          setFileContent(contentToWrite.substring(0, i));
          i++;
        } else {
          clearInterval(writeInterval);
          setIsWriting(false);
        }
      }, 50);
    }
  };
  
  const handleRead = () => {
    if (fileStatus === 'Open' && fileContent) {
      setIsReading(true);
      
      // Simulate reading
      setTimeout(() => {
        setTempContent(fileContent);
        setIsReading(false);
      }, 800);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-red-600">
      <h2 className="text-xl font-bold mb-4 text-green-600">read() & write()</h2>
      <p className="mb-4">
        <strong>write()</strong>: Writes data to an open file<br />
        <strong>read()</strong>: Reads data from an open file
      </p>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="font-medium">File Status:</span>
          <span className={`font-bold px-2 py-1 rounded ${fileStatus === 'Open' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {fileStatus}
          </span>
        </div>
        <div className="flex space-x-2 mb-4">
          <button 
            onClick={handleOpen}
            disabled={fileStatus === 'Open'}
            className={`flex-1 px-3 py-1 rounded ${fileStatus === 'Open' ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'}`}
          >
            open()
          </button>
          <button 
            onClick={handleClose}
            disabled={fileStatus === 'Closed'}
            className={`flex-1 px-3 py-1 rounded ${fileStatus === 'Closed' ? 'bg-gray-300 cursor-not-allowed' : 'bg-red-600 text-white hover:bg-red-700'}`}
          >
            close()
          </button>
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Input Buffer:</label>
        <textarea 
          value={tempContent} 
          onChange={(e) => setTempContent(e.target.value)}
          className="w-full p-2 border rounded h-20 font-mono text-sm"
          placeholder="Type content to write to file..."
          disabled={fileStatus === 'Closed' || isWriting || isReading}
        />
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <label className="block text-sm font-medium text-gray-700">File Content:</label>
          <div className="flex items-center text-xs">
            <span className={`w-3 h-3 rounded-full ${isWriting ? 'bg-green-500 animate-pulse' : 'bg-gray-300'} mr-1`}></span>
            <span>{isWriting ? 'Writing...' : ''}</span>
          </div>
        </div>
        <div className="border rounded p-2 h-20 bg-gray-50 font-mono text-sm overflow-auto relative">
          <pre>{fileContent || 'Empty file'}</pre>
          {isReading && (
            <div className="absolute inset-0 bg-blue-100 bg-opacity-50 flex items-center justify-center">
              <div className="text-blue-600 animate-pulse">Reading...</div>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex space-x-2">
        <button 
          onClick={handleWrite}
          disabled={fileStatus === 'Closed' || isWriting || isReading || !tempContent}
          className={`flex-1 px-4 py-2 rounded font-medium 
            ${(fileStatus === 'Closed' || isWriting || isReading || !tempContent) ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'}`}
        >
          write()
        </button>
        <button 
          onClick={handleRead}
          disabled={fileStatus === 'Closed' || isWriting || isReading || !fileContent}
          className={`flex-1 px-4 py-2 rounded font-medium 
            ${(fileStatus === 'Closed' || isWriting || isReading || !fileContent) ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
        >
          read()
        </button>
      </div>
      
      {/* Added C Commands */}
      <div className="mt-4 text-sm">
        <pre className="bg-gray-800 text-white p-2 rounded">
          <code>{`write(fd, "${tempContent}", ${tempContent.length}); // Write content\nchar buf[1024]; read(fd, buf, 1024); // Read content`}</code>
        </pre>
      </div>
    </div>
  );
};

// Component 3: File Seek Operations
const FileSeekComponent = () => {
  const [fileStatus, setFileStatus] = useState('Closed');
  const [fileContent, setFileContent] = useState("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor velit vel nunc venenatis, eu tincidunt elit aliquam. Proin fringilla justo non felis facilisis, vel commodo diam volutpat. Sed fermentum justo in lectus lacinia, vel convallis sapien varius.");
  const [position, setPosition] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  
  const handleOpen = () => {
    setFileStatus('Open');
    setIsOpen(true);
  };
  
  const handleClose = () => {
    setFileStatus('Closed');
    setIsOpen(false);
    setPosition(0);
  };
  
  const handleSeek = (newPosition) => {
    if (fileStatus === 'Open') {
      if (newPosition >= 0 && newPosition <= fileContent.length) {
        setPosition(newPosition);
      }
    }
  };
  
  const handleRead = () => {
    if (fileStatus === 'Open') {
      // Read 20 characters from current position
      setSelectedText(fileContent.substring(position, position + 20));
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-red-600">
      <h2 className="text-xl font-bold mb-4 text-green-600">seek()</h2>
      <p className="mb-4">
        <strong>seek()</strong>: Repositions the file offset/pointer for the next read/write operation
      </p>
      
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="font-medium">File Status:</span>
          <span className={`font-bold px-2 py-1 rounded ${fileStatus === 'Open' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {fileStatus}
          </span>
        </div>
        <div className="flex space-x-2 mb-4">
          <button 
            onClick={handleOpen}
            disabled={fileStatus === 'Open'}
            className={`flex-1 px-3 py-1 rounded ${fileStatus === 'Open' ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'}`}
          >
            open()
          </button>
          <button 
            onClick={handleClose}
            disabled={fileStatus === 'Closed'}
            className={`flex-1 px-3 py-1 rounded ${fileStatus === 'Closed' ? 'bg-gray-300 cursor-not-allowed' : 'bg-red-600 text-white hover:bg-red-700'}`}
          >
            close()
          </button>
        </div>
      </div>
      
      <div className="mb-4 relative">
        <div className="flex justify-between items-center mb-1">
          <label className="block text-sm font-medium text-gray-700">File Content:</label>
          <div className="text-xs">
            Position: <span className="font-mono">{position}</span>
          </div>
        </div>
        <div className="border rounded p-2 bg-gray-50 font-mono text-sm overflow-auto relative h-40">
          {isOpen ? (
            <>
              <div className="mb-1 whitespace-pre-wrap">{fileContent}</div>
              <div 
                className="absolute left-0 h-4 w-0.5 bg-red-500 animate-pulse" 
                style={{ top: `calc(1rem + ${Math.floor(position / 40) * 1.5}rem)`, left: `calc(0.5rem + ${(position % 40) * 0.6}rem)` }}
              ></div>
            </>
          ) : (
            <div className="text-gray-400 italic">File is closed</div>
          )}
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Pointer Position:</label>
        <input 
          type="range" 
          min="0" 
          max={fileContent.length} 
          value={position}
          onChange={(e) => handleSeek(parseInt(e.target.value))}
          disabled={fileStatus === 'Closed'}
          className={`w-full ${fileStatus === 'Closed' ? 'opacity-50' : ''}`}
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>0</span>
          <span>{Math.round(fileContent.length / 2)}</span>
          <span>{fileContent.length}</span>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex space-x-2">
          <button 
            onClick={() => handleSeek(0)}
            disabled={fileStatus === 'Closed'}
            className={`flex-1 px-2 py-1 rounded text-sm font-medium ${fileStatus === 'Closed' ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
          >
            seek(0)
          </button>
          <button 
            onClick={() => handleSeek(position - 10)}
            disabled={fileStatus === 'Closed'}
            className={`flex-1 px-2 py-1 rounded text-sm font-medium ${fileStatus === 'Closed' ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
          >
            seek(-10)
          </button>
          <button 
            onClick={() => handleSeek(position + 10)}
            disabled={fileStatus === 'Closed'}
            className={`flex-1 px-2 py-1 rounded text-sm font-medium ${fileStatus === 'Closed' ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
          >
            seek(+10)
          </button>
        </div>
      </div>
      
      <div className="flex space-x-2">
        <button 
          onClick={handleRead}
          disabled={fileStatus === 'Closed'}
          className={`flex-1 px-4 py-2 rounded font-medium ${fileStatus === 'Closed' ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'}`}
        >
          read() from position
        </button>
      </div>
      
      {selectedText && (
        <div className="mt-4 p-2 bg-green-50 border border-green-200 rounded">
          <div className="text-xs text-green-700 mb-1">Read Result:</div>
          <div className="font-mono text-sm">{selectedText}</div>
        </div>
      )}
      
      {/* Added C Commands */}
      <div className="mt-4 text-sm">
        <pre className="bg-gray-800 text-white p-2 rounded">
          <code>{`lseek(fd, ${position}, SEEK_SET); // Seek to position`}</code>
        </pre>
      </div>
    </div>
  );
};

export default FileManagement;
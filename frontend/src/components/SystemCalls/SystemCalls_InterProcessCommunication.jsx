import { useState } from 'react';
import React from 'react';


const InterProcessCommunication = () => {
  // State for Pipe Demo
  const [pipeMessage, setPipeMessage] = useState('');
  const [pipeReceived, setPipeReceived] = useState('');

  // State for Socket Demo
  const [socketMessage, setSocketMessage] = useState('');
  const [socketReceived, setSocketReceived] = useState([]);
  const [socketStatus, setSocketStatus] = useState('Disconnected');

  // State for Semaphore Demo
  const [semaphoreValue, setSemaphoreValue] = useState(1);
  const [semaphoreQueue, setSemaphoreQueue] = useState([]);

  // State for Message Passing Demo
  const [messageToSend, setMessageToSend] = useState('');
  const [messageQueue, setMessageQueue] = useState([]);
  const [processes, setProcesses] = useState([
    { id: 1, name: 'Process A', messages: [] },
    { id: 2, name: 'Process B', messages: [] },
    { id: 3, name: 'Process C', messages: [] }
  ]);
  const [selectedSender, setSelectedSender] = useState(1);
  const [selectedReceiver, setSelectedReceiver] = useState(2);

  // State for Shared Memory Demo
  const [sharedMemory, setSharedMemory] = useState({ value: 0 });
  const [processAIncrement, setProcessAIncrement] = useState(1);
  const [processBIncrement, setProcessBIncrement] = useState(1);
  const [memoryLocked, setMemoryLocked] = useState(false);
  const [lockOwner, setLockOwner] = useState(null);

  // Pipe Functions
  const sendPipeMessage = () => {
    if (pipeMessage) {
      setPipeReceived(pipeMessage);
      setPipeMessage('');
    }
  };

  // Socket Functions
  const connectSocket = () => setSocketStatus('Connected');
  const disconnectSocket = () => setSocketStatus('Disconnected');
  const sendSocketMessage = () => {
    if (socketStatus === 'Connected' && socketMessage) {
      setSocketReceived([...socketReceived, socketMessage]);
      setSocketMessage('');
    } else {
      alert('Socket must be connected to send a message!');
    }
  };
  const clearSocketMessages = () => setSocketReceived([]);

  // Semaphore Functions
  const waitSemaphore = (processId) => {
    if (semaphoreValue > 0) {
      setSemaphoreValue(semaphoreValue - 1);
    } else {
      setSemaphoreQueue([...semaphoreQueue, `P${processId}`]);
    }
  };
  const signalSemaphore = () => {
    if (semaphoreQueue.length > 0) {
      setSemaphoreQueue(semaphoreQueue.slice(1));
    } else {
      setSemaphoreValue(semaphoreValue + 1);
    }
  };

  // Message Passing Functions
  const sendMessage = () => {
    if (!messageToSend.trim()) return;
    
    // Create new message
    const newMessage = {
      id: Date.now(),
      sender: selectedSender,
      receiver: selectedReceiver,
      content: messageToSend,
      timestamp: new Date().toLocaleTimeString()
    };
    
    // Add to message queue
    setMessageQueue([...messageQueue, newMessage]);
    
    // Clear input
    setMessageToSend('');
  };

  const deliverMessage = (messageId) => {
    const message = messageQueue.find(msg => msg.id === messageId);
    if (!message) return;
    
    // Remove from queue
    setMessageQueue(messageQueue.filter(msg => msg.id !== messageId));
    
    // Deliver to receiver
    setProcesses(processes.map(proc => {
      if (proc.id === message.receiver) {
        return {
          ...proc,
          messages: [...proc.messages, message]
        };
      }
      return proc;
    }));
  };

  const getProcessNameById = (id) => {
    const process = processes.find(p => p.id === id);
    return process ? process.name : 'Unknown';
  };

  // Shared Memory Functions
  const acquireLock = (processName) => {
    if (!memoryLocked) {
      setMemoryLocked(true);
      setLockOwner(processName);
    }
  };

  const releaseLock = () => {
    setMemoryLocked(false);
    setLockOwner(null);
  };

  const updateSharedMemory = (processName, increment) => {
    if (!memoryLocked || lockOwner === processName) {
      setSharedMemory({
        ...sharedMemory,
        value: sharedMemory.value + increment
      });
    } else {
      alert(`Process ${processName} cannot access shared memory. Lock held by ${lockOwner}.`);
    }
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {/* 1. pipe() demo */}
        <section className="bg-green-100 text-green-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Pipe Demo</h2>
          <div className="flex flex-col gap-4">
            <div>
              <p className="font-semibold">Process A (Sender)</p>
              <input
                type="text"
                value={pipeMessage}
                onChange={(e) => setPipeMessage(e.target.value)}
                placeholder="Send via pipe"
                className="p-2 border rounded w-full mt-2"
              />
              <button
                onClick={sendPipeMessage}
                className="p-2 bg-green-600 text-white rounded mt-2 w-full hover:bg-green-700 transition"
              >
                Send via Pipe
              </button>
            </div>
            <div>
              <p className="font-semibold">Process B (Receiver)</p>
              <p className="mt-2 animate-pulse">
                Received: <span className="text-red-600">{pipeReceived}</span>
              </p>
            </div>
          </div>
          <p className="mt-4 text-sm">
            Pipes provide a unidirectional communication channel between related processes, such as a parent and child. Data flows from the sender to the receiver, making it ideal for simple data passing scenarios.
          </p>
        </section>
          {/* 2. socket demo*/}
        <section className="bg-red-100 text-red-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Socket Demo</h2>
          <div className="flex flex-col gap-4">
            <div>
              <p className="font-semibold">Client</p>
              <div className="flex items-center gap-2 mb-2">
                <span>Status:</span>
                <span
                  className={`px-2 py-1 rounded ${
                    socketStatus === 'Connected'
                      ? 'bg-green-200 text-green-800'
                      : 'bg-red-200 text-red-800'
                  }`}
                >
                  {socketStatus}
                </span>
              </div>
              <input
                type="text"
                value={socketMessage}
                onChange={(e) => setSocketMessage(e.target.value)}
                placeholder="Send via socket"
                className="p-2 border rounded w-full"
                disabled={socketStatus !== 'Connected'}
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={connectSocket}
                  className="p-2 bg-green-600 text-white rounded w-1/2 hover:bg-green-700 transition"
                  disabled={socketStatus === 'Connected'}
                >
                  Connect
                </button>
                <button
                  onClick={disconnectSocket}
                  className="p-2 bg-red-600 text-white rounded w-1/2 hover:bg-red-700 transition"
                  disabled={socketStatus === 'Disconnected'}
                >
                  Disconnect
                </button>
              </div>
              <button
                onClick={sendSocketMessage}
                className="p-2 bg-green-600 text-white rounded mt-2 w-full hover:bg-green-700 transition"
                disabled={socketStatus !== 'Connected'}
              >
                Send via Socket
              </button>
            </div>
            <div>
              <p className="font-semibold">Server</p>
              <div className="mt-2 max-h-24 overflow-y-auto">
                {socketReceived.map((msg, index) => (
                  <p key={index} className="animate-pulse">
                    Received: <span className="text-green-600">{msg}</span>
                  </p>
                ))}
              </div>
              <button
                onClick={clearSocketMessages}
                className="p-2 bg-red-600 text-white rounded mt-2 w-full hover:bg-red-700 transition"
              >
                Clear Messages
              </button>
            </div>
          </div>
          <p className="mt-4 text-sm">
            Sockets enable bidirectional communication between processes, either on the same machine or across a network. They are widely used in client-server applications like web servers.
          </p>
        </section>

        {/* 3. semaphore demo */}
        <section className="bg-blue-100 text-blue-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Semaphore Demo</h2>
          <div className="p-4 bg-white rounded">
            <p className="font-semibold">
              Semaphore Value: <span className="text-red-600">{semaphoreValue}</span>
            </p>
            <p className="mt-2">
              Waiting Queue: {semaphoreQueue.length > 0 ? semaphoreQueue.join(', ') : 'Empty'}
            </p>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => waitSemaphore(Math.floor(Math.random() * 100))}
                className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Wait (P)
              </button>
              <button
                onClick={signalSemaphore}
                className="p-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                Signal (V)
              </button>
            </div>
          </div>
          <p className="mt-4 text-sm">
            Semaphores control access to shared resources by multiple processes. They prevent race conditions by allowing only a limited number of processes to proceed at a time.
          </p>
        </section>

        {/* 4. message passing demo */}
        <section className="bg-yellow-100 text-yellow-800 p-6 rounded-lg shadow-lg col-span-1 md:col-span-2 lg:col-span-1">
          <h2 className="text-2xl font-bold mb-4">Message Passing Demo</h2>          
          <div className="mb-4">
            <p className="font-semibold mb-2">Send Message</p>
            <div className="flex gap-2 mb-2">
              <select 
                value={selectedSender}
                onChange={(e) => setSelectedSender(parseInt(e.target.value))}
                className="p-2 border rounded"
              >
                {processes.map(proc => (
                  <option key={`sender-${proc.id}`} value={proc.id}>{proc.name}</option>
                ))}
              </select>
              <span>to</span>
              <select 
                value={selectedReceiver}
                onChange={(e) => setSelectedReceiver(parseInt(e.target.value))}
                className="p-2 border rounded"
              >
                {processes.map(proc => (
                  <option key={`receiver-${proc.id}`} value={proc.id}>{proc.name}</option>
                ))}
              </select>
            </div>
            
            <input
              type="text"
              value={messageToSend}
              onChange={(e) => setMessageToSend(e.target.value)}
              placeholder="Enter message"
              className="p-2 border rounded w-full"
            />
            <button
              onClick={sendMessage}
              className="p-2 bg-yellow-600 text-white rounded mt-2 w-full hover:bg-yellow-700 transition"
              disabled={selectedSender === selectedReceiver}
            >
              Send Message
            </button>
          </div>
          
          <div className="mb-4">
            <p className="font-semibold mb-2">Message Queue</p>
            <div className="max-h-32 overflow-y-auto bg-white p-2 rounded">
              {messageQueue.length > 0 ? (
                messageQueue.map(msg => (
                  <div key={msg.id} className="flex justify-between items-center border-b py-1">
                    <span className="text-sm">
                      {getProcessNameById(msg.sender)} → {getProcessNameById(msg.receiver)}: {msg.content}
                    </span>
                    <button
                      onClick={() => deliverMessage(msg.id)}
                      className="text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                    >
                      Deliver
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-sm italic">Queue is empty</p>
              )}
            </div>
          </div>
          
          <div>
            <p className="font-semibold mb-2">Process Inboxes</p>
            <div className="grid grid-cols-3 gap-2">
              {processes.map(proc => (
                <div key={proc.id} className="bg-white p-2 rounded text-center">
                  <p className="font-medium">{proc.name}</p>
                  <div className="text-xs max-h-20 overflow-y-auto">
                    {proc.messages.length > 0 ? (
                      proc.messages.map(msg => (
                        <p key={msg.id} className="border-b py-1">
                          {msg.content}
                        </p>
                      ))
                    ) : (
                      <p className="italic">No messages</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <p className="mt-4 text-sm">
            Message Passing allows processes to communicate by sending messages to each other without sharing memory. Processes can send messages to a queue or directly to other processes, making it ideal for distributed systems.
          </p>
        </section>

        {/* 5. shared memory demo */}
        <section className="bg-purple-100 text-purple-800 p-6 rounded-lg shadow-lg col-span-1 md:col-span-2 lg:col-span-2">
          <h2 className="text-2xl font-bold mb-4">Shared Memory Demo</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              
              <div className="bg-white p-4 rounded shadow mb-4">
                <h3 className="text-xl font-semibold mb-2">Shared Memory Region</h3>
                <div className="flex items-center justify-center p-6 bg-gray-100 rounded">
                  <span className="text-4xl font-bold">{sharedMemory.value}</span>
                </div>
                <div className="mt-2 text-center">
                  <span className={`px-2 py-1 rounded text-sm ${memoryLocked ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'}`}>
                    {memoryLocked ? `Locked by ${lockOwner}` : 'Unlocked'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-4">
              <div className="bg-white p-4 rounded shadow">
                <h3 className="text-lg font-semibold mb-2">Process A</h3>
                <div className="flex gap-2 items-center mb-2">
                  <span>Increment by:</span>
                  <input
                    type="number"
                    value={processAIncrement}
                    onChange={(e) => setProcessAIncrement(parseInt(e.target.value) || 0)}
                    className="p-1 border rounded w-16 text-center"
                    min="1"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => acquireLock('Process A')}
                    className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex-1"
                    disabled={memoryLocked && lockOwner !== 'Process A'}
                  >
                    Acquire Lock
                  </button>
                  <button
                    onClick={() => updateSharedMemory('Process A', processAIncrement)}
                    className="p-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition flex-1"
                  >
                    Update Memory
                  </button>
                </div>
                <button
                  onClick={releaseLock}
                  className="p-2 bg-red-600 text-white rounded mt-2 w-full hover:bg-red-700 transition"
                  disabled={!memoryLocked || lockOwner !== 'Process A'}
                >
                  Release Lock
                </button>
              </div>
              
              <div className="bg-white p-4 rounded shadow">
                <h3 className="text-lg font-semibold mb-2">Process B</h3>
                <div className="flex gap-2 items-center mb-2">
                  <span>Increment by:</span>
                  <input
                    type="number"
                    value={processBIncrement}
                    onChange={(e) => setProcessBIncrement(parseInt(e.target.value) || 0)}
                    className="p-1 border rounded w-16 text-center"
                    min="1"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => acquireLock('Process B')}
                    className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex-1"
                    disabled={memoryLocked && lockOwner !== 'Process B'}
                  >
                    Acquire Lock
                  </button>
                  <button
                    onClick={() => updateSharedMemory('Process B', processBIncrement)}
                    className="p-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition flex-1"
                  >
                    Update Memory
                  </button>
                </div>
                <button
                  onClick={releaseLock}
                  className="p-2 bg-red-600 text-white rounded mt-2 w-full hover:bg-red-700 transition"
                  disabled={!memoryLocked || lockOwner !== 'Process B'}
                >
                  Release Lock
                </button>
              </div>
            </div>
          </div>
          
          <p className="mt-4 text-sm">
            Shared Memory allows multiple processes to access the same memory region. While efficient for data exchange, it requires synchronization mechanisms (like locks) to prevent race conditions. Process A and B must acquire a lock before updating the shared memory to ensure data consistency.
          </p>
        </section>
      </div>
    </div>
  );
};

export default InterProcessCommunication;
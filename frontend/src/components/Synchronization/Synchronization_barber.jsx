import React, { useState, useEffect } from 'react';

const SleepingBarber = () => {
  const [barberStatus, setBarberStatus] = useState('sleeping');
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [waitingQueue, setWaitingQueue] = useState([]);
  const [maxQueueLength, setMaxQueueLength] = useState(3);
  const [logs, setLogs] = useState([{ message: "Simulation initialized", time: new Date().toLocaleTimeString() }]);
  const [isCuttingHair, setIsCuttingHair] = useState(false);

  const addLog = (message) => {
    setLogs((prevLogs) => [{
      message,
      time: new Date().toLocaleTimeString()
    }, ...prevLogs.slice(0, 9)]);
  };

  const addCustomer = () => {
    const customerId = Date.now();
    const newCustomer = { id: customerId, name: `Customer ${customerId.toString().slice(-4)}` };

    if (barberStatus === 'sleeping') {
      setBarberStatus('awake');
      setCurrentCustomer(newCustomer);
      setIsCuttingHair(true);
      addLog(`Barber woke up to serve ${newCustomer.name}`);
    } else {
      if (waitingQueue.length < maxQueueLength) {
        addLog(`${newCustomer.name} joined the waiting queue`);
        setWaitingQueue((prevQueue) => [...prevQueue, newCustomer]);
      } else {
        addLog(`${newCustomer.name} left (queue full)`);
      }
    }
  };

  const completeHaircut = () => {
    setIsCuttingHair(false);
    if (currentCustomer) {
      addLog(`${currentCustomer.name}'s haircut completed`);
    }
    
    setTimeout(() => {
      setCurrentCustomer(null);
      setWaitingQueue((prevQueue) => {
        if (prevQueue.length > 0) {
          const [nextCustomer, ...remainingQueue] = prevQueue;
          setCurrentCustomer(nextCustomer);
          setIsCuttingHair(true);
          addLog(`Barber started serving ${nextCustomer.name}`);
          return remainingQueue;
        } else {
          setBarberStatus('sleeping');
          addLog('No customers waiting, barber went to sleep');
          return prevQueue;
        }
      });
    }, 300);
  };

  useEffect(() => {
    if (isCuttingHair) {
      const timer = setTimeout(completeHaircut, 2000);
      return () => clearTimeout(timer);
    }
  }, [isCuttingHair]);

  const handleQueueLengthChange = (e) => {
    const newLength = parseInt(e.target.value);
    if (newLength >= 0) {
      const oldLength = maxQueueLength;
      setMaxQueueLength(newLength);
      
      if (newLength !== oldLength) {
        addLog(`Maximum queue length changed to ${newLength}`);
      }

      setWaitingQueue((prevQueue) => {
        if (newLength < prevQueue.length) {
          const excess = prevQueue.slice(newLength);
          excess.forEach(customer => {
            addLog(`${customer.name} left due to queue size reduction`);
          });
          return prevQueue.slice(0, newLength);
        }
        return prevQueue;
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-purple-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text">Sleeping Barber Simulation</h1>
        <div className="h-1 w-40 mx-auto bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mb-8"></div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white bg-opacity-80 p-6 rounded-lg shadow-md col-span-2">
            <h2 className="text-xl font-semibold mb-4 text-purple-600">Barber Shop</h2>

            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <div className={`border-2 ${currentCustomer ? 'border-teal-500' : 'border-purple-300'} rounded-lg p-4 h-48 flex flex-col items-center justify-center transition-all shadow-md`}>
                  <div className="text-center mb-4">
                    <div className="text-lg font-medium">{barberStatus === 'sleeping' ? 'Barber is sleeping' : 'Barber is awake'}</div>
                    {isCuttingHair && (
                      <div className="text-sm text-teal-600 mt-1 animate-pulse">Cutting hair...</div>
                    )}
                  </div>

                  {currentCustomer ? (
                    <div className="bg-teal-100 p-3 rounded-lg w-full text-center">
                      <div className="font-medium">{currentCustomer.name}</div>
                      <div className="text-sm text-teal-600">Getting haircut</div>
                    </div>
                  ) : (
                    <div className="text-gray-400">Barber chair is empty</div>
                  )}
                </div>
              </div>

              <div className="flex-1">
                <div className="border-2 border-purple-300 rounded-lg p-4 h-48 shadow-md">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-blue-600">Waiting Queue</h3>
                    <span className="text-sm bg-blue-100 px-2 py-1 rounded">
                      {waitingQueue.length}/{maxQueueLength}
                    </span>
                  </div>

                  <div className="space-y-2 overflow-y-auto max-h-32">
                    {waitingQueue.length > 0 ? (
                      waitingQueue.map((customer, index) => (
                        <div key={customer.id} className="bg-blue-100 p-2 rounded">
                          <div className="font-medium">{customer.name}</div>
                          <div className="text-xs text-blue-600">Waiting #{index + 1}</div>
                        </div>
                      ))
                    ) : (
                      <div className="text-gray-400 text-center mt-6">Queue is empty</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white bg-opacity-80 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-blue-600">Controls</h2>

            <div className="space-y-4">
              <button
                onClick={addCustomer}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-full transition shadow-md"
              >
                Add Customer
              </button>

              <div>
                <label className="block text-sm font-medium text-purple-600 mb-1">
                  Max Queue Length: {maxQueueLength}
                </label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={maxQueueLength}
                  onChange={handleQueueLengthChange}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white bg-opacity-80 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-3 text-blue-600">Activity Log</h2>
          <div className="h-60 overflow-y-auto flex flex-col border-2 border-blue-200 rounded-lg p-4 bg-white bg-opacity-80 shadow-inner">
            {logs.length === 0 ? (
              <p className="text-gray-500 italic">No activity recorded yet</p>
            ) : (
              logs.map((log, index) => (
                <div key={`log-${index}`} className="text-sm py-1 border-b border-gray-100 last:border-b-0">
                  <span className="text-gray-500 text-xs">{log.time}</span>: {log.message}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SleepingBarber;
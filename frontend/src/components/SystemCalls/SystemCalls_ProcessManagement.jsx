import React, { useState } from 'react';

const ProcessManagement = () => {
  const [processes, setProcesses] = useState([
    { id: 1, parentId: null, status: 'running', program: 'init' }
  ]);
  const [logs, setLogs] = useState([]);
  const [nextId, setNextId] = useState(2);

  // Add a log entry
  const addLog = (message) => {
    setLogs([...logs, message]);
  };

  // Fork: Create a new child process
  const forkProcess = (parentId) => {
    const newProcess = {
      id: nextId,
      parentId,
      status: 'running',
      program: `child_${nextId}`
    };
    setProcesses([...processes, newProcess]);
    setNextId(nextId + 1);
    addLog(`Forked new process ${newProcess.id} from parent ${parentId}`);
  };

  // Exec: Update the process’s program
  const execProcess = (processId) => {
    const newProgram = prompt('Enter new program name:', 'newProgram');
    if (newProgram) {
      setProcesses(processes.map(p =>
        p.id === processId ? { ...p, program: newProgram } : p
      ));
      addLog(`Executed ${newProgram} in process ${processId}`);
    }
  };

  // Kill: Terminate a process, making it a zombie
  const killProcess = (processId) => {
    setProcesses(processes.map(p =>
      p.id === processId ? { ...p, status: 'zombie' } : p
    ));
    addLog(`Killed process ${processId}, now a zombie`);
  };

  // Wait: Remove zombie children of the parent
  const waitProcess = (parentId) => {
    const zombieChildren = processes.filter(p => p.parentId === parentId && p.status === 'zombie');
    if (zombieChildren.length > 0) {
      setProcesses(processes.filter(p => !(p.parentId === parentId && p.status === 'zombie')));
      addLog(`Parent ${parentId} waited and removed zombie children: ${zombieChildren.map(p => p.id).join(', ')}`);
    } else {
      addLog(`Parent ${parentId} has no zombie children to wait for`);
    }
  };

  // Recursive component to render the process tree
  const ProcessNode = ({ process }) => {
    const children = processes.filter(p => p.parentId === process.id);
    return (
      <div className="ml-6 my-2">
        {/* Process Node as a Rectangle */}
        <div
          className={`flex items-center p-3 rounded-lg shadow-md border transition-all duration-300 ${
            process.status === 'zombie'
              ? 'bg-red-100 border-red-300 text-red-800'
              : 'bg-green-100 border-green-300 text-green-800'
          } hover:shadow-lg`}
        >
          <span className="flex-1 font-medium">
            {process.program} (PID: {process.id}, Status: {process.status})
          </span>
          <div className="space-x-2">
            <button
              className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition-colors"
              title="Create a new child process"
              onClick={() => forkProcess(process.id)}
            >
              Fork
            </button>
            <button
              className="bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600 transition-colors"
              title="Change the program of this process"
              onClick={() => execProcess(process.id)}
            >
              Exec
            </button>
            <button
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
              title="Terminate this process"
              onClick={() => killProcess(process.id)}
            >
              Kill
            </button>
            {children.length > 0 && (
              <button
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"
                title="Wait for zombie children"
                onClick={() => waitProcess(process.id)}
              >
                Wait
              </button>
            )}
          </div>
        </div>
        {/* Children Processes */}
        <ul>
          {children.map(child => (
            <li key={child.id}>
              <ProcessNode process={child} />
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-lg">
      {/* Process Tree */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Process Tree</h2>
        <div className="border-l-4 border-orange-400 pl-4">
          <ul>
            {processes.filter(p => p.parentId === null).map(process => (
              <li key={process.id}>
                <ProcessNode process={process} />
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Action Logs */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Action Logs</h2>
        <div className="bg-white border border-gray-200 rounded-lg shadow-md p-4 max-h-60 overflow-y-auto">
          {logs.length === 0 ? (
            <p className="text-gray-500 italic">No actions yet. Start by forking a process!</p>
          ) : (
            <ul className="space-y-2">
              {logs.map((log, index) => (
                <li
                  key={index}
                  className="p-2 bg-orange-50 border-l-4 border-orange-400 text-gray-700 rounded-r-lg"
                >
                  {log}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* System Calls Information */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">System Calls Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* fork() */}
          <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-lg font-semibold text-green-600 mb-2">fork()</h3>
            <p className="text-gray-700">
              Creates a new child process by duplicating the parent. Both continue execution from the same point.
            </p>
            <p className="text-gray-600 mt-2 italic">
              <strong>Relation:</strong> Often paired with <code>exec()</code> to run a new program in the child, or with <code>wait()</code> to manage child termination.
            </p>
          </div>

          {/* exec() */}
          <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-lg font-semibold text-purple-600 mb-2">exec()</h3>
            <p className="text-gray-700">
              Replaces the current process image with a new program. Does not create a new process.
            </p>
            <p className="text-gray-600 mt-2 italic">
              <strong>Relation:</strong> Typically used after <code>fork()</code> to execute a different program in the child process.
            </p>
          </div>

          {/* kill() */}
          <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-lg font-semibold text-red-600 mb-2">kill()</h3>
            <p className="text-gray-700">
              Sends a signal to a process to terminate it, turning it into a zombie until the parent waits.
            </p>
            <p className="text-gray-600 mt-2 italic">
              <strong>Relation:</strong> Works with <code>wait()</code> to clean up zombie processes after termination.
            </p>
          </div>

          {/* wait() */}
          <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-lg font-semibold text-blue-600 mb-2">wait()</h3>
            <p className="text-gray-700">
              Suspends the parent until a child terminates, then cleans up the child’s resources.
            </p>
            <p className="text-gray-600 mt-2 italic">
              <strong>Relation:</strong> Used after <code>fork()</code> and <code>kill()</code> to prevent zombie processes.
            </p>
          </div>

          {/* Zombie Processes */}
          <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Zombie Processes</h3>
            <p className="text-gray-700">
              A zombie process is a child process that has terminated but its parent has not yet called <code>wait()</code> to retrieve its exit status. It remains in the process table until cleaned up.
            </p>
            <p className="text-gray-600 mt-2 italic">
              <strong>Relation:</strong> Created by <code>kill()</code>, cleaned up by <code>wait()</code>.
            </p>
          </div>

          {/* Orphan Processes */}
          <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Orphan Processes</h3>
            <p className="text-gray-700">
              An orphan process is a child process whose parent terminates before it does. It is adopted by the init process (PID 1), which eventually cleans it up.
            </p>
            <p className="text-gray-600 mt-2 italic">
              <strong>Relation:</strong> Can occur if a parent is killed via <code>kill()</code> without waiting for its children.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessManagement;
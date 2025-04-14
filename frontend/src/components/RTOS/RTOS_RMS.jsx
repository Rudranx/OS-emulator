import React, { useState } from 'react';

const SchedulerRMS = () => {
  const colorPalette = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD', '#D4A5A5'];

  const [tasks, setTasks] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [newTask, setNewTask] = useState({ name: '', capacity: '', period: '' });

  // Helper functions for LCM
  const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
  const lcm = (a, b) => (a * b) / gcd(a, b);
  const computeLCM = (tasks) => {
    if (tasks.length === 0) return 100;
    return tasks.reduce((acc, task) => lcm(acc, task.period), tasks[0].period);
  };

  // RMS Scheduling Logic
  const computeRMSSchedule = (tasks, maxTime) => {
    if (!tasks.length) return [];
    const sortedTasks = [...tasks].sort((a, b) => a.period - b.period);
    const schedule = Array(maxTime).fill('Idle');
    const taskStates = sortedTasks.map(task => ({
      name: task.name,
      period: task.period,
      capacity: task.capacity,
      remaining: 0,
      nextRelease: 0,
    }));
    for (let t = 0; t < maxTime; t++) {
      taskStates.forEach(task => {
        if (t >= task.nextRelease) {
          task.remaining = task.capacity;
          task.nextRelease += task.period;
        }
      });
      const taskToRun = taskStates.find(task => task.remaining > 0);
      if (taskToRun) {
        schedule[t] = taskToRun.name;
        taskToRun.remaining--;
      }
    }
    return schedule;
  };

  const addTask = (task) => {
    const { name, capacity, period } = task;
    if (!name || !capacity || !period) return alert('All fields are required.');
    const c = parseInt(capacity), p = parseInt(period);
    if (c <= 0 || p <= 0) return alert('Capacity and period must be positive.');
    if (tasks.some(t => t.name === name)) return alert('Task name must be unique.');
    setTasks([...tasks, { name, capacity: c, period: p }]);
    setNewTask({ name: '', capacity: '', period: '' });
  };

  const removeTask = (name) => {
    setTasks(tasks.filter(t => t.name !== name));
    setSchedule([]);
  };

  const simulate = () => {
    if (!tasks.length) return alert('Add at least one task.');
    const maxTime = computeLCM(tasks);
    setSchedule(computeRMSSchedule(tasks, maxTime));
  };

  const uniqueTasks = [...new Set(schedule.filter(t => t !== 'Idle'))];
  const colorMap = Object.fromEntries(uniqueTasks.map((task, i) => [task, colorPalette[i % colorPalette.length]]));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-5xl">
        <p className="text-gray-600 mb-6 text-center italic">Priority based on shorter periods</p>

        {/* Input Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Add New Task</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Task Name (e.g., T1)"
              value={newTask.name}
              onChange={e => setNewTask({ ...newTask, name: e.target.value })}
              className="col-span-1 border-2 border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-500 transition"
            />
            <input
              type="number"
              placeholder="Capacity"
              value={newTask.capacity}
              onChange={e => setNewTask({ ...newTask, capacity: e.target.value })}
              className="border-2 border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-500 transition"
            />
            <input
              type="number"
              placeholder="Period"
              value={newTask.period}
              onChange={e => setNewTask({ ...newTask, period: e.target.value })}
              className="border-2 border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-500 transition"
            />
            <button
              onClick={() => addTask(newTask)}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition"
            >
              Add Task
            </button>
          </div>
        </div>

        {/* Task List */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Task List</h2>
          {!tasks.length ? (
            <p className="text-gray-500">No tasks added.</p>
          ) : (
            <ul className="space-y-3">
              {tasks.map(task => (
                <li key={task.name} className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow-sm">
                  <span className="text-gray-700">{task.name}: Capacity = {task.capacity}, Period = {task.period}</span>
                  <button onClick={() => removeTask(task.name)} className="text-red-600 hover:text-red-800 font-semibold">
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Simulate Button */}
        <button
          onClick={simulate}
          className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition mb-8"
        >
          Simulate RMS
        </button>

        {/* Timeline */}
        {schedule.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-700 mb-4">Timeline (1 to {schedule.length})</h2>
            <div className="overflow-x-auto border-2 border-gray-200 rounded-lg p-3 bg-gray-50">
              <div className="flex space-x-1">
                {schedule.map((task, index) => (
                  <div
                    key={index}
                    className="w-10 h-10 rounded flex-shrink-0 transition-transform hover:scale-110"
                    style={{ backgroundColor: task === 'Idle' ? '#D1D5DB' : colorMap[task] }}
                    title={`Time ${index + 1}: ${task}`} // Adjusted to start from 1
                  />
                ))}
              </div>
            </div>
            <div className="mt-6">
              <h3 className="text-xl font-semibold text-gray-700 mb-3">Legend</h3>
              <div className="flex flex-wrap gap-4">
                {uniqueTasks.map(task => (
                  <div key={task} className="flex items-center">
                    <span className="w-5 h-5 mr-2 rounded" style={{ backgroundColor: colorMap[task] }} />
                    <span className="text-gray-700">{task}</span>
                  </div>
                ))}
                <div className="flex items-center">
                  <span className="w-5 h-5 mr-2 rounded bg-gray-300" />
                  <span className="text-gray-700">Idle</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SchedulerRMS;
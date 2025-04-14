import React, { useState } from 'react';

const SchedulerEDF = () => {
  const colorPalette = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD', '#D4A5A5'];

  const [tasks, setTasks] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [newTask, setNewTask] = useState({ name: '', capacity: '', deadline: '', period: '' });

  // Helper functions for LCM
  const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
  const lcm = (a, b) => (a * b) / gcd(a, b);
  const computeLCM = (tasks) => {
    if (tasks.length === 0) return 100;
    return tasks.reduce((acc, task) => lcm(acc, task.period), tasks[0].period);
  };

  // EDF Scheduling Logic
  const computeEDFSchedule = (tasks, maxTime) => {
    if (!tasks.length) return [];
    const schedule = Array(maxTime).fill('Idle');
    const taskInstances = [];
    tasks.forEach(task => {
      for (let release = 0; release < maxTime; release += task.period) {
        taskInstances.push({
          name: task.name,
          release,
          deadline: release + task.deadline,
          remaining: task.capacity,
        });
      }
    });
    for (let t = 0; t < maxTime; t++) {
      const activeTasks = taskInstances.filter(
        inst => t >= inst.release && t < inst.deadline && inst.remaining > 0
      ).sort((a, b) => a.deadline - b.deadline);
      if (activeTasks.length) {
        schedule[t] = activeTasks[0].name;
        activeTasks[0].remaining--;
      }
    }
    return schedule;
  };

  const addTask = (task) => {
    const { name, capacity, deadline, period } = task;
    if (!name || !capacity || !deadline || !period) return alert('All fields are required.');
    const c = parseInt(capacity), d = parseInt(deadline), p = parseInt(period);
    if (c <= 0 || d <= 0 || p <= 0) return alert('Inputs must be positive.');
    if (d > p) return alert('Deadline must not exceed period.');
    if (tasks.some(t => t.name === name)) return alert('Task name must be unique.');
    setTasks([...tasks, { name, capacity: c, deadline: d, period: p }]);
    setNewTask({ name: '', capacity: '', deadline: '', period: '' });
  };

  const removeTask = (name) => {
    setTasks(tasks.filter(t => t.name !== name));
    setSchedule([]);
  };

  const simulate = () => {
    if (!tasks.length) return alert('Add at least one task.');
    const maxTime = computeLCM(tasks);
    setSchedule(computeEDFSchedule(tasks, maxTime));
  };

  const uniqueTasks = [...new Set(schedule.filter(t => t !== 'Idle'))];
  const colorMap = Object.fromEntries(uniqueTasks.map((task, i) => [task, colorPalette[i % colorPalette.length]]));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-5xl">
        <p className="text-gray-600 mb-6 text-center italic">Dynamic priority by earliest deadline</p>

        {/* Input Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Add New Task</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
              placeholder="Deadline"
              value={newTask.deadline}
              onChange={e => setNewTask({ ...newTask, deadline: e.target.value })}
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
                  <span className="text-gray-700">{task.name}: Capacity = {task.capacity}, Deadline = {task.deadline}, Period = {task.period}</span>
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
          Simulate EDF
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
                    title={`Time ${index + 1}: ${task}`}
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

export default SchedulerEDF;
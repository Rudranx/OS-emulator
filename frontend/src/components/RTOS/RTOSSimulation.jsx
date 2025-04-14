import React from 'react';
import { Clock, Timer, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const RTOSSimulation = () => {
  const simulations = [
    {
      title: "Rate Monotonic Scheduling (RMS)",
      description: "A fixed-priority scheduling algorithm where tasks with shorter periods are assigned higher priorities. RMS is optimal among fixed-priority scheduling algorithms for periodic tasks.",
      icon: <Clock size={48} />,
      key: "rms",
      color: "bg-gradient-to-br from-blue-600 to-indigo-700",
      textColor: "text-blue-600",
      challenges: ["Priority Assignment", "Schedulability Analysis", "Period Management"],
      link: "/simulations/rtos/rms"
    },
    {
      title: "Earliest Deadline First (EDF)",
      description: "A dynamic-priority scheduling algorithm that assigns priorities based on absolute deadlines. EDF is optimal for preemptive scheduling of periodic and sporadic tasks on a uniprocessor.",
      icon: <Timer size={48} />,
      key: "edf",
      color: "bg-gradient-to-br from-emerald-600 to-teal-700",
      textColor: "text-emerald-600",
      challenges: ["Dynamic Priority", "Deadline Management", "Utilization Bounds"],
      link: "/simulations/rtos/edf"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center py-12 mb-8">
          <div className="inline-block p-2 bg-indigo-50 rounded-full mb-6">
            <div className="bg-indigo-100 rounded-full p-3">
              <Zap size={40} className="text-indigo-600" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text pb-2">
            Real-Time Scheduling Algorithms
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto text-slate-600 mt-6">
            Explore real-time scheduling algorithms used in RTOS through interactive simulations.
          </p>
          <div className="mt-10 h-1 w-20 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto rounded-full"></div>
        </header>

        {/* Simulation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 my-12">
          {simulations.map((sim) => (
            <div 
              key={sim.key}
              className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-2 flex flex-col h-full border border-slate-100"
            >
              {/* Card Header */}
              <div className={`${sim.color} p-8 relative`}>
                <div className="flex justify-between items-start">
                  <div className="bg-white rounded-xl p-4 shadow-md">
                    <div className={sim.textColor}>
                      {sim.icon}
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-white">
                    {sim.title}
                  </h2>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              
              {/* Card Body */}
              <div className="p-8 flex flex-col flex-grow">
                <div className="flex-grow">
                  <p className="text-slate-700 mb-6 leading-relaxed">
                    {sim.description}
                  </p>
                  
                  {/* Challenges */}
                  <div className="mb-8">
                    <h3 className="font-semibold text-slate-900 mb-3">Key Concepts:</h3>
                    <div className="flex flex-wrap gap-2">
                      {sim.challenges.map((challenge, index) => (
                        <span 
                          key={index} 
                          className={`${sim.textColor.replace('text', 'bg')}/10 ${sim.textColor} px-4 py-1.5 rounded-full text-sm font-medium`}
                        >
                          {challenge}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Action Button */}
                <Link 
                  to={sim.link}
                  className={`${sim.color} text-white font-medium py-4 px-6 rounded-xl text-center transition-all hover:opacity-90 flex items-center justify-center space-x-2 shadow-md`}
                >
                  <span>Try Simulation</span>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4.16667 10H15.8333" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10 4.16667L15.8333 10L10 15.8333" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Information Section */}
        <div className="bg-white rounded-2xl p-8 shadow-lg mb-12 border border-slate-100">
          <div className="flex items-start space-x-4">
            <div className="bg-blue-50 p-3 rounded-full">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 16V12M12 8H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">About Real-Time Scheduling</h2>
              <p className="text-slate-600 leading-relaxed">
                Real-time scheduling is crucial in systems where timing constraints are as important as 
                functional correctness. These algorithms ensure that tasks meet their deadlines, making 
                them essential for applications like embedded systems, robotics, and industrial automation. 
                Through these simulations, you'll learn how different scheduling approaches handle periodic 
                tasks and maintain predictable system behavior.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="h-px bg-slate-200 mx-auto w-full max-w-4xl mb-8"></div>
        <footer className="text-center text-slate-500 py-6">
          <p>© 2025 RTOS Scheduling Simulations</p>
          <p className="text-sm mt-2">Designed for computer science education</p>
        </footer>
      </div>
    </div>
  );
};

export default RTOSSimulation; 
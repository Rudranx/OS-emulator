import React from 'react';
import { BookOpen, Users, ArrowUpDown, Code, Scissors } from 'lucide-react';

const SynchronizationSimulation = () => {
  // Simulation descriptions
  const simulations = [
    {
      title: "Dining Philosophers",
      description: "A classic synchronization problem that illustrates challenges in resource allocation and deadlock prevention. Five philosophers sit around a table, alternating between thinking and eating. Between each pair of philosophers is a single fork, and a philosopher needs two forks to eat.",
      icon: <Users size={48} />,
      key: "dining",
      color: "bg-gradient-to-br from-purple-600 to-indigo-700",
      textColor: "text-purple-600",
      challenges: ["Deadlock prevention", "Resource allocation", "Starvation avoidance"],
      link: "/simulations/process_sync/dining_philosophers"
    },
    {
      title: "Producer-Consumer",
      description: "A synchronization pattern where producers create items and add them to a shared buffer, while consumers remove and process these items. This illustrates challenges in coordinating access to a shared, fixed-size buffer.",
      icon: <ArrowUpDown size={48} />,
      key: "producer",
      color: "bg-gradient-to-br from-emerald-600 to-teal-700",
      textColor: "text-emerald-600",
      challenges: ["Buffer management", "Synchronization", "Flow control"],
      link: "/simulations/process_sync/producer_consumer"
    },
    {
      title: "Reader-Writer",
      description: "A synchronization pattern that solves the problem of having multiple processes reading from and writing to a shared resource simultaneously. It prioritizes either readers or writers to optimize performance for different use cases.",
      icon: <BookOpen size={48} />,
      key: "reader",
      color: "bg-gradient-to-br from-amber-500 to-orange-600",
      textColor: "text-amber-600",
      challenges: ["Concurrent access control", "Priority management", "Read-write lock implementation"],
      link: "/simulations/process_sync/readers_writers"
    },
    {
      title: "Sleeping Barber",
      description: "A classic synchronization problem that illustrates customer/service provider interactions and resource handling. A barber shop has a single barber, a barber chair, and a waiting room with several chairs. When there are no customers, the barber sleeps in the barber chair.",
      icon: <Scissors size={48} />,
      key: "barber",
      color: "bg-gradient-to-br from-rose-600 to-red-700",
      textColor: "text-rose-600",
      challenges: ["Mutual exclusion", "Queue management", "Process coordination"],
      link: "/simulations/process_sync/sleeping_barber"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Enhanced header */}
        <header className="text-center py-12 mb-8">
          <div className="inline-block p-2 bg-indigo-50 rounded-full mb-6">
            <div className="bg-indigo-100 rounded-full p-3">
              <Code size={40} className="text-indigo-600" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text pb-2">
            Classic Synchronization Problems
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto text-slate-600 mt-6">
            Interactive visualizations of fundamental concurrent programming challenges.
          </p>
          <div className="mt-10 h-1 w-20 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto rounded-full"></div>
        </header>

        {/* Main content - redesigned cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 my-12">
          {simulations.map((sim) => (
            <div 
              key={sim.key}
              className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-2 flex flex-col h-full border border-slate-100"
            >
              {/* Card header - improved with larger icon area */}
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
              
              {/* Card body with improved spacing and design */}
              <div className="p-8 flex flex-col flex-grow">
                <div className="flex-grow">
                  <p className="text-slate-700 mb-6 leading-relaxed">
                    {sim.description}
                  </p>
                  
                  {/* Challenges with improved styling */}
                  <div className="mb-8">
                    <h3 className="font-semibold text-slate-900 mb-3">Key Challenges:</h3>
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
                
                {/* Enhanced action button */}
                <a 
                  href={sim.link}
                  className={`${sim.color} text-white font-medium py-4 px-6 rounded-xl text-center transition-all hover:opacity-90 flex items-center justify-center space-x-2 shadow-md`}
                >
                  <span>Explore Simulation</span>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4.16667 10H15.8333" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10 4.16667L15.8333 10L10 15.8333" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced information section */}
        <div className="bg-white rounded-2xl p-8 shadow-lg mb-12 border border-slate-100">
          <div className="flex items-start space-x-4">
            <div className="bg-blue-50 p-3 rounded-full">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 16V12M12 8H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">About Synchronization Problems</h2>
              <p className="text-slate-600 leading-relaxed">
                Synchronization problems involve multiple computations executing simultaneously and potentially 
                interacting with each other. These classic problems illustrate fundamental challenges in 
                concurrent systems such as deadlock, starvation, and race conditions. Understanding these 
                issues is essential for developing reliable multi-threaded applications, operating systems, 
                and distributed systems.
              </p>
            </div>
          </div>
        </div>

        {/* Footer with divider */}
        <div className="h-px bg-slate-200 mx-auto w-full max-w-4xl mb-8"></div>
        <footer className="text-center text-slate-500 py-6">
          <p>© 2025 Synchronization Problems Visualizations</p>
          <p className="text-sm mt-2">Designed for computer science education</p>
        </footer>
      </div>
    </div>
  );
};

export default SynchronizationSimulation;
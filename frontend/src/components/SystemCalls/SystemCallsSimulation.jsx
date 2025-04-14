import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Server, FileText, Cpu, Share2, Database } from "lucide-react";

const SystemCallsLanding = () => {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState(null);

  const systemCallTypes = [
    {
      id: "process_management",
      title: "Process Management",
      icon: <Cpu className="w-10 h-10 text-red-600" />,
      description: "System calls for creating, scheduling, and terminating processes.",
      calls: ["fork()", "wait()", "kill()", "exec()"],
    },
    {
      id: "file_management",
      title: "File Management",
      icon: <FileText className="w-10 h-10 text-red-600" />,
      description: "System calls for creating, deleting, reading from, and writing to files.",
      calls: ["write()", "read()", "open()", "close()", "seek()"],
    },
    {
      id: "ipc",
      title: "Inter-Process Communication",
      icon: <Share2 className="w-10 h-10 text-red-600" />,
      description: "System calls for communication between processes.",
      calls: ["pipe()", "socket()", "semget()"],
    },
    {
      id: "memory_management",
      title: "Memory Management",
      icon: <Database className="w-10 h-10 text-red-600" />,
      description: "System calls for managing memory allocation and deallocation.",
      calls: ["malloc()", "brk()", "sbrk()"],
    },
  ];

  const handleCardClick = (typeId) => {
    navigate(`/simulations/system_calls/${typeId}`);
  };

  return (
    <div className="min-h-screen bg-green-50">
      <header className="bg-gradient-to-r from-red-600 to-green-600 text-white shadow-lg">
        <div className="container mx-auto py-8 px-4">
          <h1 className="text-4xl font-bold text-center">System Calls</h1>
          <p className="text-center mt-2 text-xl">The Bridge Between User and Kernel Space</p>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        <section className="mb-12">
          <h2 className="text-3xl font-semibold text-red-700 mb-6">Types of System Calls</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {systemCallTypes.map((type) => (
              <div
                key={type.id}
                className={`bg-white p-6 rounded-lg shadow-md border-2 transition-all duration-300 ${
                  hoveredCard === type.id ? "border-red-500 transform scale-105" : "border-green-300"
                }`}
                onMouseEnter={() => setHoveredCard(type.id)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => handleCardClick(type.id)}
                role="button"
                tabIndex={0}
              >
                <div className="flex items-center mb-4">
                  {type.icon}
                  <h3 className="ml-3 text-2xl font-semibold text-green-700">{type.title}</h3>
                </div>
                <p className="mb-4 text-gray-700">{type.description}</p>
                <div className="mb-4">
                  <span className="text-sm font-medium text-gray-500">Includes:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {type.calls.map((call) => (
                      <span key={call} className="px-2 py-1 bg-red-100 text-red-700 rounded-md text-sm">
                        {call}
                      </span>
                    ))}
                  </div>
                </div>
                <button className="flex items-center text-green-600 hover:text-green-800 transition-colors">
                  Learn more <ChevronRight className="ml-1 w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default SystemCallsLanding;

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const algorithms = [
  {
    name: "FIFO (First-In-First-Out)",
    id: "fifo",
    description: "Replaces the oldest page in memory (the one that came first).",
    advantages: [
      "Simple to implement",
      "Low overhead"
    ],
    disadvantages: [
      "Can replace frequently used pages",
      "Suffers from Belady's anomaly"
    ]
  },
  {
    name: "Optimal Page Replacement",
    id: "optimal",
    description: "Replaces the page that will not be used for the longest time in the future.",
    advantages: [
      "Lowest possible page faults",
      "Theoretical benchmark"
    ],
    disadvantages: [
      "Requires future knowledge of references",
      "Not feasible in real systems"
    ]
  },
  {
    name: "LRU (Least Recently Used)",
    id: "lru",
    description: "Replaces the page that has not been used for the longest period of time.",
    advantages: [
      "Good approximation of optimal",
      "Widely used"
    ],
    disadvantages: [
      "Higher overhead than FIFO",
      "Requires tracking usage history"
    ]
  },
  {
    name: "LFU (Least Frequently Used)",
    id: "lfu",
    description: "Replaces the page with the lowest access frequency.",
    advantages: [
      "Good for identifying infrequently used pages",
      "Reduces replacement of often-used pages"
    ],
    disadvantages: [
      "Can be unfair to newly loaded pages",
      "Requires frequency tracking"
    ]
  },
  {
    name: "Second Chance",
    id: "sc",
    description: "Gives pages a second chance before replacing them, based on reference bits.",
    advantages: [
      "Improves on FIFO",
      "Simple implementation"
    ],
    disadvantages: [
      "Requires additional tracking (ref bits)",
      "Performance depends on workload"
    ]
  },
  {
    name: "Random Replacement",
    id: "random",
    description: "Randomly selects a page to replace regardless of usage.",
    advantages: [
      "Simple logic",
      "Low overhead"
    ],
    disadvantages: [
      "Unpredictable",
      "May replace heavily used pages"
    ]
  }
];

const PageReplacementOverview = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const basePath = currentPath.endsWith('/page_replacement') ? currentPath : '/simulations/page_replacement';

  const handleAlgorithmClick = (algoId) => {
    navigate(`/simulations/page_replacement/${algoId}`);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto bg-gray-900 text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Page Replacement Algorithms Overview</h1>
      <div className="grid md:grid-cols-2 gap-6">
        {algorithms.map((algo, index) => (
          <div key={index} className="bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-700">
            <h2 className="text-xl font-semibold mb-2">{algo.name}</h2>
            <p className="mb-3 text-gray-300">{algo.description}</p>
            <div className="mb-2">
              <strong className="text-green-400">Advantages:</strong>
              <ul className="list-disc ml-6 text-gray-300">
                {algo.advantages.map((adv, i) => <li key={i}>{adv}</li>)}
              </ul>
            </div>
            <div className="mb-4">
              <strong className="text-red-400">Disadvantages:</strong>
              <ul className="list-disc ml-6 text-gray-300">
                {algo.disadvantages.map((dis, i) => <li key={i}>{dis}</li>)}
              </ul>
            </div>
            <button
              onClick={() => handleAlgorithmClick(algo.id)}
              className="mt-2 px-4 py-2 rounded bg-blue-600 hover:bg-blue-700"
            >
              Launch Simulation
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PageReplacementOverview;

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';
import ScrollProgress from '../components/layout/ScrollProgress';
import { getAllSimulations } from '../utils/simulationMapping';
import { pageTransitions, listItem, staggerContainer } from '../utils/animationHelpers';
import teamData from '../utils/teamData';

const TeamSimulationsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const navigate = useNavigate();
  
  const allSimulations = getAllSimulations();

  // Create a mapping of simulation IDs to team members
  const simulationToMember = {};
  teamData.members.forEach(member => {
    member.simulationIds?.forEach(simId => {
      simulationToMember[simId] = member.name; // Use full name
    });
  });
  // Add leader's simulation
  if (teamData.leader.simulationId) {
    simulationToMember[teamData.leader.simulationId] = teamData.leader.name;
  }
  
  // Filter simulations based on search query
  const filteredSimulations = allSimulations.filter(sim => {
    const searchLower = searchQuery.toLowerCase();
    const memberName = simulationToMember[sim.id]?.toLowerCase() || '';
    
    return (
      sim.title.toLowerCase().includes(searchLower) ||
      sim.description.toLowerCase().includes(searchLower) ||
      memberName.includes(searchLower) ||
      (sim.topics && sim.topics.some(topic => topic.toLowerCase().includes(searchLower)))
    );
  });
  
  const handleSimulationSelect = (simulation) => {
    // Check if the simulation has a component
    if (simulation.component) {
      // If there are sub-simulations, check for overview or use first available
      if (simulation.subSimulations) {
        // Get the first available sub-simulation
        const firstSubSimKey = Object.keys(simulation.subSimulations)[0];
        
        // If there's an overview, use main path, otherwise use first sub-simulation
        if (simulation.subSimulations.overview) {
          navigate(`/simulations/${simulation.id}`);
        } else {
          navigate(`/simulations/${simulation.id}/${firstSubSimKey}`);
        }
      } else {
        // If no sub-simulations, navigate to the main simulation
        navigate(`/simulations/${simulation.id}`);
      }
    }
  };
  
  return (
    <motion.div
      className="pt-16"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransitions}
    >
      <ScrollProgress />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-600 to-blue-700 text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-6">Interactive OS Simulations</h1>
            <p className="text-xl max-w-3xl mx-auto mb-8 text-blue-100">
              Explore hands-on simulations that bring operating system concepts to life. 
              These interactive tools will help you understand complex OS mechanisms through 
              visual, interactive learning.
            </p>
          </div>
        </div>

        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full translate-x-1/3 translate-y-1/3"></div>
        </div>
      </section>
      
      {/* Search Bar */}
      <section className="py-8 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, description, topic, or team member name..."
              className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          {searchQuery && (
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Found {filteredSimulations.length} simulation{filteredSimulations.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      </section>
      
      {/* Simulations Grid */}
      <section ref={ref} className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            animate={inView ? "animate" : "initial"}
          >
            {filteredSimulations.map((simulation) => (
              <motion.div
                key={simulation.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col"
                variants={listItem}
                initial={{ y: 0, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}
                whileHover={{ 
                  y: -5, 
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                  transition: { duration: 0.2 }
                }}
              >
                <div className="h-48 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <div className="text-white text-center px-4">
                    <div className="text-3xl font-bold">{simulation.title.split(' ')[0]}</div>
                    <div className="opacity-80">{simulation.title.split(' ').slice(1).join(' ')}</div>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">{simulation.title}</h3>
                      {simulation.component ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                          {simulationToMember[simulation.id] || 'Available'}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-800 dark:text-amber-100">
                          Coming Soon
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-6 line-clamp-3">
                      {simulation.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {simulation.topics && simulation.topics.map((topic) => (
                        <span 
                          key={topic} 
                          className="inline-block bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full text-xs text-gray-700 dark:text-gray-300"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="mt-auto">
                    <button
                      onClick={() => handleSimulationSelect(simulation)}
                      className={`w-full py-2 rounded-md ${
                        simulation.component
                          ? 'bg-blue-600 hover:bg-blue-700 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                      } transition-colors`}
                      disabled={!simulation.component}
                    >
                      {simulation.component ? 'Try Simulation' : 'Coming Soon'}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

export default TeamSimulationsPage; 
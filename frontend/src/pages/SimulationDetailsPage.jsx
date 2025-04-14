import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import ScrollProgress from '../components/layout/ScrollProgress';
import { getSimulation, getSimulationInfo } from '../utils/simulationMapping';
import { pageTransitions, listItem, staggerContainer } from '../utils/animationHelpers';

const SimulationDetailsPage = () => {
  const { simulationId, subSimulationId } = useParams();
  const [simulation, setSimulation] = useState(null);
  const [activeSubSimulation, setActiveSubSimulation] = useState(null);
  const [isSimulationMode, setIsSimulationMode] = useState(false);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const navigate = useNavigate();
  
  useEffect(() => {
    const simulationInfo = getSimulationInfo(simulationId);
    if (!simulationInfo) {
      navigate('/simulations', { replace: true });
      return;
    }
    
    setSimulation(simulationInfo);
    
    // Check if we're in simulation mode
    setIsSimulationMode(window.location.pathname.endsWith('/simulate'));
    
    if (subSimulationId) {
      const subSimInfo = getSimulationInfo(simulationId, subSimulationId.replace('/simulate', ''));
      if (subSimInfo) {
        setActiveSubSimulation(subSimInfo);
      } else if (simulationInfo.subSimulations?.length > 0) {
        // If sub-simulation ID is invalid but there are sub-simulations, redirect to overview
        navigate(`/simulations/${simulationId}/overview`, { replace: true });
      }
    } else if (simulationInfo.subSimulations) {
      // If no sub-simulation is specified, redirect to overview
      navigate(`/simulations/${simulationId}/overview`, { replace: true });
    }
  }, [simulationId, subSimulationId, navigate]);
  
  if (!simulation) {
    return (
      <div className="pt-16 flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse text-xl text-gray-600 dark:text-gray-400">Loading simulation...</div>
      </div>
    );
  }

  const SimulationComponent = getSimulation(simulationId, subSimulationId);
  
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
      <section className="relative bg-gradient-to-br from-indigo-600 to-blue-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Link 
              to="/simulations" 
              className="inline-flex items-center text-blue-200 hover:text-white mb-4"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to All Simulations
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{simulation.title}</h1>
            <p className="text-xl max-w-3xl mx-auto mb-6 text-blue-100">
              {simulation.description}
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {simulation.topics.map((topic) => (
                <span 
                  key={topic} 
                  className="inline-block bg-blue-500/30 px-3 py-1 rounded-full text-sm"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full translate-x-1/3 translate-y-1/3"></div>
        </div>
      </section>
      
      {/* Sub-simulation Tabs */}
      {simulation.subSimulations && simulation.subSimulations.length > 0 && (
        <section className="bg-white dark:bg-gray-800 shadow-md sticky top-16 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex overflow-x-auto py-4 scrollbar-hide">
              <div className="flex space-x-4">
                {simulation.subSimulations.map((subSim) => (
                  <Link
                    key={subSim.id}
                    to={`/simulations/${simulationId}/${subSim.id}`}
                    className={`flex-shrink-0 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                      activeSubSimulation?.id === subSim.id
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {subSim.title}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
      
      {/* Main Content */}
      <section ref={ref} className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {activeSubSimulation ? (
            <div>
              <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  {activeSubSimulation.title}
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                  {activeSubSimulation.description}
                </p>
              </div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="p-6 mb-8"
              >
                {SimulationComponent && (
                  <SimulationComponent 
                    isSimulationMode={isSimulationMode}
                    onBackClick={() => navigate(`/simulations/${simulationId}/${subSimulationId.replace('/simulate', '')}`)}
                    onHomeClick={() => navigate('/simulations')}
                  />
                )}
              </motion.div>
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300">
                Please select a sub-simulation to continue.
              </h3>
            </div>
          )}
        </div>
      </section>
    </motion.div>
  );
};

export default SimulationDetailsPage; 
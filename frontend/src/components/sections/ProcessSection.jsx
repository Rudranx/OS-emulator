import { useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import storyContent from '../../utils/storyContent';
import CodeBlock from '../interactive/CodeBlock';
import { slideInLeft, slideInRight, revealOnScroll } from '../../utils/animationHelpers';
import { Link } from 'react-router-dom';

const ProcessSection = ({ onVisible }) => {
  // Tracking if we've already called onVisible
  const hasCalledOnVisible = useRef(false);
  
  // Use standard useInView without destructuring
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  
  const controls = useAnimation();
  const section = storyContent.sections.find(s => s.id === 'processes');
  
  // Split into two effects to avoid interdependencies
  useEffect(() => {
    // Only handle animations here
    if (inView) {
      controls.start('animate');
    }
  }, [inView, controls]);
  
  // Separate effect for onVisible with cleanup
  useEffect(() => {
    // Only call onVisible once when the component first comes into view
    if (inView && !hasCalledOnVisible.current && typeof onVisible === 'function') {
      hasCalledOnVisible.current = true;
      onVisible(1);
    }
    
    // Clean up function
    return () => {
      // No cleanup needed
    };
  }, [inView, onVisible]);
  
  return (
    <section 
      ref={ref}
      id="processes" 
      className="py-16 md:py-24 min-h-[80vh] bg-gray-50 dark:bg-gray-900 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          variants={revealOnScroll}
          initial="initial"
          animate={controls}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
            {section.title}
          </h2>
          <div 
            className="prose prose-lg dark:prose-invert mx-auto mb-8"
            dangerouslySetInnerHTML={{ __html: section.content }}
          />
        </motion.div>
        
        {/* Process State Diagram */}
        <motion.div
          className="mb-20"
          variants={slideInLeft}
          initial="initial"
          animate={controls}
        >
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Process State Transitions</h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
              A process moves through different states during its lifetime, transitioning 
              based on CPU scheduling decisions and I/O operations.
            </p>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <img 
                src="https://images.tpointtech.com/operating-system/images/components-of-operating-system2.png" 
                alt="Process State Transition Diagram"
                className="w-auto h-auto max-w-full mx-auto rounded-lg"
              />
            </div>
          </div>
        </motion.div>
        
        {/* Quote */}
        {section.quote && (
          <motion.blockquote 
            className="border-l-4 border-blue-500 pl-4 italic text-gray-700 dark:text-gray-300 my-8 max-w-3xl mx-auto"
            variants={revealOnScroll}
            initial="initial"
            animate={controls}
          >
            <p className="text-xl mb-2">{section.quote.text}</p>
            <footer className="text-gray-600 dark:text-gray-400">— {section.quote.author}</footer>
          </motion.blockquote>
        )}
        
        {/* Key Points */}
        {section.keyPoints && (
          <motion.div 
            className="mt-16 max-w-3xl mx-auto"
            variants={revealOnScroll}
            initial="initial"
            animate={controls}
          >
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">Key Points to Remember</h3>
            <ul className="space-y-4">
              {section.keyPoints.map((point, index) => (
                <li key={index} className="flex items-start">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-600 text-white font-bold flex-shrink-0 mr-3 mt-1">
                    {index + 1}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">{point}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
        
        {/* Try It Button */}
        <div className="mt-16 text-center">
          <Link
            to="/simulations/process_management"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Process Management Simulation
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
        
        {/* Next section indicator */}
        <motion.div
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
          initial={{ y: 0 }}
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <svg className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </div>
    </section>
  );
};

export default ProcessSection; 
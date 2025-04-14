import { useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import storyContent from '../../utils/storyContent';
import { slideInLeft, slideInRight, revealOnScroll } from '../../utils/animationHelpers';

const Introduction = ({ onVisible }) => {
  // Tracking if we've already called onVisible
  const hasCalledOnVisible = useRef(false);
  
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  
  const controls = useAnimation();
  const section = storyContent.sections.find(s => s.id === 'introduction');
  
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
      onVisible(0);
    }
    
    // Clean up function
    return () => {
      // No cleanup needed
    };
  }, [inView, onVisible]);
  
  return (
    <section 
      ref={ref}
      id="introduction" 
      className="py-16 md:py-32 min-h-[90vh] relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          variants={revealOnScroll}
          initial="initial"
          animate={controls}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            {section.title}
          </h1>
          <div 
            className="prose prose-lg dark:prose-invert mx-auto mb-8"
            dangerouslySetInnerHTML={{ __html: section.content }}
          />
        </motion.div>
        
        {/* OS Fundamentals */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
          <motion.div
            variants={slideInLeft}
            initial="initial"
            animate={controls}
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">What is an Operating System?</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              An operating system (OS) is the most crucial software that runs on a computer. It manages the computer's memory, 
              processes, and all of its software and hardware. It also allows you to communicate with the computer without 
              knowing how to speak the computer's "language."
            </p>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Think of an OS as a traffic cop — it makes sure that different programs and users running at the same time don't 
              interfere with each other. The OS also ensures that unauthorized users don't access the system.
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Core Responsibilities</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-blue-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Process Management: Creating, scheduling, and terminating processes</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-blue-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Memory Management: Allocating and freeing memory space</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-blue-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>File System Management: Creating, deleting, and accessing files</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-blue-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Device Management: Managing input/output devices</span>
                </li>
              </ul>
            </div>
          </motion.div>
          
          <motion.div
            variants={slideInRight}
            initial="initial"
            animate={controls}
          >
            {/* OS Architecture Diagram */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 text-center">OS Components</h3>
              <img 
                src="https://images.tpointtech.com/operating-system/images/components-of-operating-system.png" 
                alt="Operating System Architecture" 
                className="w-full h-auto rounded-lg mb-4"
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center italic">
                Modern operating system architecture showing the relationship between hardware, kernel, and applications
              </p>
            </div>
          </motion.div>
        </div>
        
        {/* Continue Your Journey Button */}
        <div className="text-center">
          <button 
            onClick={() => {
              document.getElementById('process_management').scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Continue Your Journey
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Introduction; 
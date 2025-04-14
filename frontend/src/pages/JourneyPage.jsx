import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import ScrollProgress from '../components/layout/ScrollProgress';
import StoryNavigation from '../components/layout/StoryNavigation';
import Introduction from '../components/sections/Introduction';
import ProcessSection from '../components/sections/ProcessSection';
import CodeBlock from '../components/interactive/CodeBlock';
import storyContent from '../utils/storyContent';
import { pageTransitions } from '../utils/animationHelpers';
import { useScroll } from '../contexts/ScrollContext';
import { Link } from 'react-router-dom';

// System Calls Section
const SystemCallsSection = ({ onVisible }) => {
  const hasCalledOnVisible = useRef(false);
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  
  useEffect(() => {
    if (inView && !hasCalledOnVisible.current && typeof onVisible === 'function') {
      hasCalledOnVisible.current = true;
      onVisible(2);
    }
  }, [inView, onVisible]);
  
  return (
    <section ref={ref} id="system_calls" className="py-16 md:py-24 min-h-[80vh] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
          {storyContent.sections.find(s => s.id === 'system_calls').title}
        </h2>
        <div 
          className="prose prose-lg dark:prose-invert mb-8"
          dangerouslySetInnerHTML={{ __html: storyContent.sections.find(s => s.id === 'system_calls').content }}
        />
        {storyContent.sections.find(s => s.id === 'system_calls').codeExample && (
          <div className="pr-4 xl:pr-32">
            <CodeBlock
              code={storyContent.sections.find(s => s.id === 'system_calls').codeExample.code}
              language={storyContent.sections.find(s => s.id === 'system_calls').codeExample.language}
              title={storyContent.sections.find(s => s.id === 'system_calls').codeExample.title}
            />
          </div>
        )}
        <div className="mt-8">
          <Link
            to="/simulations/system_calls"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try System Calls Simulation
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

// Process Creation Section
const ProcessCreationSection = ({ onVisible }) => {
  const hasCalledOnVisible = useRef(false);
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  
  useEffect(() => {
    if (inView && !hasCalledOnVisible.current && typeof onVisible === 'function') {
      hasCalledOnVisible.current = true;
      onVisible(3);
    }
  }, [inView, onVisible]);
  
  return (
    <section ref={ref} id="process_creation" className="py-16 md:py-24 min-h-[80vh] bg-gray-50 dark:bg-gray-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
          {storyContent.sections.find(s => s.id === 'process_creation').title}
        </h2>
        <div 
          className="prose prose-lg dark:prose-invert mb-8"
          dangerouslySetInnerHTML={{ __html: storyContent.sections.find(s => s.id === 'process_creation').content }}
        />
        {storyContent.sections.find(s => s.id === 'process_creation').codeExample && (
          <div className="pr-4 xl:pr-32">
            <CodeBlock
              code={storyContent.sections.find(s => s.id === 'process_creation').codeExample.code}
              language={storyContent.sections.find(s => s.id === 'process_creation').codeExample.language}
              title={storyContent.sections.find(s => s.id === 'process_creation').codeExample.title}
            />
          </div>
        )}
        <div className="mt-8">
          <Link
            to="/simulations/process_creation"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Process Creation Simulation
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

// Import placeholder components for other sections
// These will be replaced with actual section components as they are developed
const MemorySection = ({ onVisible }) => {
  const hasCalledOnVisible = useRef(false);
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  
  useEffect(() => {
    if (inView && !hasCalledOnVisible.current && typeof onVisible === 'function') {
      hasCalledOnVisible.current = true;
      onVisible(4);
    }
  }, [inView, onVisible]);
  
  return (
    <section ref={ref} id="memory" className="py-16 md:py-24 min-h-[80vh] bg-gray-50 dark:bg-gray-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
          {storyContent.sections.find(s => s.id === 'memory').title}
        </h2>
        <div 
          className="prose prose-lg dark:prose-invert mb-8"
          dangerouslySetInnerHTML={{ __html: storyContent.sections.find(s => s.id === 'memory').content }}
        />
        
       
        
        {storyContent.sections.find(s => s.id === 'memory').codeExample && (
          <div className="pr-4 xl:pr-32">
            <CodeBlock
              code={storyContent.sections.find(s => s.id === 'memory').codeExample.code}
              language={storyContent.sections.find(s => s.id === 'memory').codeExample.language}
              title={storyContent.sections.find(s => s.id === 'memory').codeExample.title}
            />
          </div>
        )}
        <div className="mt-8">
          <Link
            to="/simulations/memory_management"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Memory Management Simulation
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

const SchedulingSection = ({ onVisible }) => {
  const hasCalledOnVisible = useRef(false);
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  
  useEffect(() => {
    if (inView && !hasCalledOnVisible.current && typeof onVisible === 'function') {
      hasCalledOnVisible.current = true;
      onVisible(5);
    }
  }, [inView, onVisible]);
  
  return (
    <section ref={ref} id="scheduling" className="py-16 md:py-24 min-h-[80vh] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
          {storyContent.sections.find(s => s.id === 'scheduling').title}
        </h2>
        <div 
          className="prose prose-lg dark:prose-invert mb-8"
          dangerouslySetInnerHTML={{ __html: storyContent.sections.find(s => s.id === 'scheduling').content }}
        />
        <div className="mt-8">
          <Link
            to="/simulations/cpu_scheduling"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try CPU Scheduling Simulation
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

// Interrupts Section
const InterruptsSection = ({ onVisible }) => {
  const hasCalledOnVisible = useRef(false);
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  
  useEffect(() => {
    if (inView && !hasCalledOnVisible.current && typeof onVisible === 'function') {
      hasCalledOnVisible.current = true;
      onVisible(6);
    }
  }, [inView, onVisible]);
  
  return (
    <section ref={ref} id="interrupts" className="py-16 md:py-24 min-h-[80vh] bg-gray-50 dark:bg-gray-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
          {storyContent.sections.find(s => s.id === 'interrupts').title}
        </h2>
        <div 
          className="prose prose-lg dark:prose-invert mb-8"
          dangerouslySetInnerHTML={{ __html: storyContent.sections.find(s => s.id === 'interrupts').content }}
        />
        {storyContent.sections.find(s => s.id === 'interrupts').codeExample && (
          <div className="pr-4 xl:pr-32">
            <CodeBlock
              code={storyContent.sections.find(s => s.id === 'interrupts').codeExample.code}
              language={storyContent.sections.find(s => s.id === 'interrupts').codeExample.language}
              title={storyContent.sections.find(s => s.id === 'interrupts').codeExample.title}
            />
          </div>
        )}
        <div className="mt-8">
          <Link
            to="/simulations/interrupts"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Interrupts Simulation
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

const SynchronizationSection = ({ onVisible }) => {
  const hasCalledOnVisible = useRef(false);
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  
  useEffect(() => {
    if (inView && !hasCalledOnVisible.current && typeof onVisible === 'function') {
      hasCalledOnVisible.current = true;
      onVisible(7);
    }
  }, [inView, onVisible]);
  
  return (
    <section ref={ref} id="synchronization" className="py-16 md:py-24 min-h-[80vh] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
          {storyContent.sections.find(s => s.id === 'synchronization').title}
        </h2>
        <div 
          className="prose prose-lg dark:prose-invert mb-8"
          dangerouslySetInnerHTML={{ __html: storyContent.sections.find(s => s.id === 'synchronization').content }}
        />
        {storyContent.sections.find(s => s.id === 'synchronization').codeExample && (
          <div className="pr-4 xl:pr-32">
            <CodeBlock
              code={storyContent.sections.find(s => s.id === 'synchronization').codeExample.code}
              language={storyContent.sections.find(s => s.id === 'synchronization').codeExample.language}
              title={storyContent.sections.find(s => s.id === 'synchronization').codeExample.title}
            />
          </div>
        )}
        <div className="mt-8">
          <Link
            to="/simulations/process_sync"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Process Synchronization Simulation
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

const DeadlockSection = ({ onVisible }) => {
  const hasCalledOnVisible = useRef(false);
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  
  useEffect(() => {
    if (inView && !hasCalledOnVisible.current && typeof onVisible === 'function') {
      hasCalledOnVisible.current = true;
      onVisible(8);
    }
  }, [inView, onVisible]);
  
  return (
    <section ref={ref} id="deadlock" className="py-16 md:py-24 min-h-[80vh] bg-gray-50 dark:bg-gray-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
          {storyContent.sections.find(s => s.id === 'deadlock').title}
        </h2>
        <div 
          className="prose prose-lg dark:prose-invert mb-8"
          dangerouslySetInnerHTML={{ __html: storyContent.sections.find(s => s.id === 'deadlock').content }}
        />
        {storyContent.sections.find(s => s.id === 'deadlock').codeExample && (
          <div className="pr-4 xl:pr-32">
            <CodeBlock
              code={storyContent.sections.find(s => s.id === 'deadlock').codeExample.code}
              language={storyContent.sections.find(s => s.id === 'deadlock').codeExample.language}
              title={storyContent.sections.find(s => s.id === 'deadlock').codeExample.title}
            />
          </div>
        )}
        <div className="mt-8">
          <Link
            to="/simulations/deadlock"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Deadlock Detection Simulation
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

const BootingSection = ({ onVisible }) => {
  const hasCalledOnVisible = useRef(false);
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  
  useEffect(() => {
    if (inView && !hasCalledOnVisible.current && typeof onVisible === 'function') {
      hasCalledOnVisible.current = true;
      onVisible(9);
    }
  }, [inView, onVisible]);
  
  return (
    <section ref={ref} id="booting" className="py-16 md:py-24 min-h-[80vh] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
          {storyContent.sections.find(s => s.id === 'booting').title}
        </h2>
        <div 
          className="prose prose-lg dark:prose-invert mb-8"
          dangerouslySetInnerHTML={{ __html: storyContent.sections.find(s => s.id === 'booting').content }}
        />
        <div className="mt-8">
          <Link
            to="/simulations/booting_system"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Booting System Simulation
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

// Page Replacement Section
const PageReplacementSection = ({ onVisible }) => {
  const hasCalledOnVisible = useRef(false);
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  
  useEffect(() => {
    if (inView && !hasCalledOnVisible.current && typeof onVisible === 'function') {
      hasCalledOnVisible.current = true;
      onVisible(10);
    }
  }, [inView, onVisible]);
  
  return (
    <section ref={ref} id="page_replacement" className="py-16 md:py-24 min-h-[80vh] bg-gray-50 dark:bg-gray-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
          {storyContent.sections.find(s => s.id === 'page_replacement').title}
        </h2>
        <div 
          className="prose prose-lg dark:prose-invert mb-8"
          dangerouslySetInnerHTML={{ __html: storyContent.sections.find(s => s.id === 'page_replacement').content }}
        />
        {storyContent.sections.find(s => s.id === 'page_replacement').codeExample && (
          <div className="pr-4 xl:pr-32">
            <CodeBlock
              code={storyContent.sections.find(s => s.id === 'page_replacement').codeExample.code}
              language={storyContent.sections.find(s => s.id === 'page_replacement').codeExample.language}
              title={storyContent.sections.find(s => s.id === 'page_replacement').codeExample.title}
            />
          </div>
        )}
        <div className="mt-8">
          <Link
            to="/simulations/page_replacement"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Page Replacement Simulation
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

const JourneyPage = () => {
  const [activeSection, setActiveSection] = useState(0);
  const scrollContainerRef = useRef(null);
  const { registerSection, scrollTo, updateScroll } = useScroll();

  // Define sections array for reuse
  const sections = [
    'introduction', 
    'booting', 
    'processes', 
    'process_creation', 
    'system_calls', 
    'interrupts', 
    'scheduling', 
    'synchronization', 
    'deadlock', 
    'memory',
    'page_replacement'
  ];

  const handleSectionVisible = useCallback((index) => {
    setActiveSection(index);
    // Find section id from index
    const sectionId = sections[index];
    
    // Log for debugging
    console.log("Section visible:", sectionId, index);
    
    // Mark this section as visible and deregister all others
    // This ensures only one section is considered active at a time
    sections.forEach(section => {
      if (section === sectionId) {
        registerSection(sectionId, true);
      } else {
        registerSection(section, false);
      }
    });
  }, [registerSection, sections]);

  // Handle manual scroll events
  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollYProgress = scrollHeight > 0 ? scrollY / scrollHeight : 0;
    
    updateScroll({
      scrollY,
      scrollYProgress
    });
  }, [updateScroll]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    // Initial call to set initial values
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  return (
    <motion.div 
      ref={scrollContainerRef}
      className="relative min-h-screen pt-16"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransitions}
    >
      <ScrollProgress />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-16 md:py-24 journey-hero-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-6">OSCanvas Learning Journey</h1>
            <p className="text-xl max-w-3xl mx-auto mb-8 text-blue-100">
              Explore the inner workings of operating systems through our comprehensive, 
              step-by-step learning path with interactive content and visualizations.
            </p>
          </div>
        </div>

        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full translate-x-1/3 translate-y-1/3"></div>
        </div>
      </section>
      
      <StoryNavigation />
      
      <div className="journey-sections lg:pr-64">
        <Introduction onVisible={() => handleSectionVisible(0)} />
        <BootingSection onVisible={() => handleSectionVisible(1)} />
        <ProcessSection onVisible={() => handleSectionVisible(2)} />
        <ProcessCreationSection onVisible={() => handleSectionVisible(3)} />
        <SystemCallsSection onVisible={() => handleSectionVisible(4)} />
        <InterruptsSection onVisible={() => handleSectionVisible(5)} />
        <SchedulingSection onVisible={() => handleSectionVisible(6)} />
        <SynchronizationSection onVisible={() => handleSectionVisible(7)} />
        <DeadlockSection onVisible={() => handleSectionVisible(8)} />
        <MemorySection onVisible={() => handleSectionVisible(9)} />
        <PageReplacementSection onVisible={() => handleSectionVisible(10)} />
      </div>
      
      {/* Journey Footer with Continue Learning CTA */}
      <div id="journey-footer" className="bg-blue-600 dark:bg-blue-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-white mb-6">
            Continue Your Operating Systems Journey
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
            You've completed the operating system learning journey! Now explore our interactive simulations 
            to deepen your understanding of these concepts.
          </p>
          <Link
            to="/simulations"
            className="inline-flex items-center px-8 py-4 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50"
          >
            Explore Interactive Simulations
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default JourneyPage; 
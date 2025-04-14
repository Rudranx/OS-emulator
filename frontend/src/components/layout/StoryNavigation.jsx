import { motion } from 'framer-motion';
import { useScroll } from '../../contexts/ScrollContext';
import { useState, useEffect, useRef } from 'react';

const sections = [
  { id: 'introduction', title: 'Introduction' },
  { id: 'booting', title: 'Booting Process' },
  { id: 'processes', title: 'Process Management' },
  { id: 'process_creation', title: 'Process Creation' },
  { id: 'system_calls', title: 'System Calls' },
  { id: 'interrupts', title: 'Interrupts' },
  { id: 'scheduling', title: 'CPU Scheduling' },
  { id: 'synchronization', title: 'Process Synchronization' },
  { id: 'deadlock', title: 'Deadlock' },
  { id: 'memory', title: 'Memory Management' },
  { id: 'page_replacement', title: 'Page Replacement' },
];

const StoryNavigation = () => {
  const { scrollData, scrollTo } = useScroll();
  const [activeSection, setActiveSection] = useState(0);
  const [navStyle, setNavStyle] = useState({ position: 'fixed', top: '50%', transform: 'translateY(-50%)' });
  const [isVisible, setIsVisible] = useState(false);
  const navRef = useRef(null);

  useEffect(() => {
    // Update active section based on scrollData
    if (scrollData.activeSection) {
      const index = sections.findIndex(section => section.id === scrollData.activeSection);
      if (index !== -1) {
        setActiveSection(index);
      }
    }
  }, [scrollData.activeSection]);

  // Add console log to debug
  // useEffect(() => {
  //   console.log("Active section updated:", activeSection, scrollData.activeSection);
  // }, [activeSection, scrollData.activeSection]);

  useEffect(() => {
    const handleScroll = () => {
      if (!navRef.current) return;

      // Get the hero section and determine when to show navigation
      const heroSection = document.querySelector('.journey-hero-section');
      if (heroSection) {
        const heroBottom = heroSection.getBoundingClientRect().bottom;
        setIsVisible(heroBottom < 0); // Show navigation after scrolling past hero
      }

      const footerElement = document.getElementById('journey-footer');
      if (!footerElement) return;

      const navHeight = navRef.current.offsetHeight;
      const footerTop = footerElement.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      const bottomOffset = 40; // Increased buffer space between nav and footer

      // If footer is approaching the navigation
      if (footerTop < windowHeight) {
        // Calculate how far the footer is from the bottom of the viewport
        const distanceFromBottom = windowHeight - footerTop;
        
        // Check if we need to reposition the navigation
        if (distanceFromBottom > 0) {
          // Calculate the new position that keeps navigation above footer
          const newTopPosition = 50 - (distanceFromBottom / windowHeight * 100);
          
          if (newTopPosition > 10) { // Ensure navigation doesn't go too high
            setNavStyle({
              position: 'fixed',
              top: `${newTopPosition}%`,
              transform: 'translateY(-50%)'
            });
          } else {
            // If not enough space, switch to absolute positioning
            setNavStyle({
              position: 'absolute',
              top: `${window.scrollY + footerTop - navHeight - bottomOffset}px`,
              transform: 'none'
            });
          }
        }
      } else {
        // Reset to default centered position
        setNavStyle({
          position: 'fixed',
          top: '50%',
          transform: 'translateY(-50%)'
        });
      }
    };

    window.addEventListener('scroll', handleScroll);
    // Initial check
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      ref={navRef}
      className={`right-6 mt-4 xl:right-12 hidden lg:block z-30 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      style={{
        ...navStyle,
        transition: 'top 0.3s ease-out, opacity 0.3s ease-in-out'
      }}
    >
      <motion.div 
        className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-lg p-4 max-w-[200px]"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Navigation</h3>
        <nav className="space-y-2">
          {sections.map((section, index) => (
            <button
              key={section.id}
              onClick={() => scrollTo(section.id)}
              className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors duration-200 ${
                activeSection === index
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {section.title}
            </button>
          ))}
        </nav>
      </motion.div>
    </div>
  );
};

export default StoryNavigation; 
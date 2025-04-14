import { createContext, useContext, useState, useCallback, useRef } from 'react';

const ScrollContext = createContext();

export function useScroll() {
  return useContext(ScrollContext);
}

export function ScrollProvider({ children }) {
  const [scrollData, setScrollData] = useState({
    scrollY: 0,
    scrollYProgress: 0,
    direction: 'down',
    lastScrollY: 0,
    activeSection: '',
    visibleSections: new Set(),
  });
  
  // Track the previous state to avoid unnecessary updates
  const prevStateRef = useRef({
    visibleSections: new Set(),
    activeSection: '',
  });

  // Reset scroll data to default values
  const resetScroll = useCallback(() => {
    setScrollData({
      scrollY: 0,
      scrollYProgress: 0,
      direction: 'down',
      lastScrollY: 0,
      activeSection: '',
      visibleSections: new Set(),
    });
  }, []);

  const updateScroll = useCallback((data) => {
    setScrollData(prev => ({
      ...prev,
      ...data,
      direction: data.scrollY > prev.lastScrollY ? 'down' : 'up',
      lastScrollY: prev.scrollY,
    }));
  }, []);

  const registerSection = useCallback((sectionId, isVisible) => {
    // Use functional updates to avoid closure issues
    setScrollData(prev => {
      const newVisibleSections = new Set(prev.visibleSections);
      
      // Check if anything would change
      const wasVisible = newVisibleSections.has(sectionId);
      if (isVisible === wasVisible) {
        // No change needed
        return prev;
      }
      
      if (isVisible) {
        newVisibleSections.add(sectionId);
        
        // When a section is marked as visible, set it as active immediately
        return {
          ...prev,
          visibleSections: newVisibleSections,
          activeSection: sectionId, // Set as active section
        };
      } else {
        newVisibleSections.delete(sectionId);
        
        // If we're making a section invisible and it was the active one, find a new active section
        if (prev.activeSection === sectionId) {
          // Set active section to the first visible one
          const sortedVisibleSections = Array.from(newVisibleSections).sort();
          const newActiveSection = sortedVisibleSections.length > 0 
            ? sortedVisibleSections[0] 
            : prev.activeSection;
          
          // Save the new state to the ref
          prevStateRef.current = {
            visibleSections: newVisibleSections,
            activeSection: newActiveSection
          };
          
          return {
            ...prev,
            visibleSections: newVisibleSections,
            activeSection: newActiveSection,
          };
        }
        
        // Otherwise just update the visible sections
        return {
          ...prev,
          visibleSections: newVisibleSections,
        };
      }
    });
  }, []);

  const scrollTo = useCallback((elementId) => {
    const element = document.getElementById(elementId);
    if (element) {
      const offsetTop = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: offsetTop - 80, // Account for header height
        behavior: 'smooth',
      });
    }
  }, []);

  const value = {
    scrollData,
    updateScroll,
    registerSection,
    scrollTo,
    resetScroll,
  };

  return (
    <ScrollContext.Provider value={value}>
      {children}
    </ScrollContext.Provider>
  );
} 
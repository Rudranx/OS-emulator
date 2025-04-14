import { useState, useEffect } from 'react';

/**
 * Custom hook to track window scroll position
 * @returns {Object} scrollPosition - Contains x and y coordinates
 */
const useScrollPosition = () => {
  const [scrollPosition, setScrollPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition({
        x: window.scrollX,
        y: window.scrollY
      });
    };

    // Set initial position
    handleScroll();

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Remove event listener on cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return scrollPosition;
};

/**
 * Determines if an element is in viewport based on current scroll position
 * @param {number} elementTop - Top position of element relative to viewport
 * @param {number} elementHeight - Height of the element
 * @param {number} offset - Optional offset to trigger before element is fully visible
 * @returns {boolean} - Whether element is in viewport
 */
export const isElementInViewport = (elementTop, elementHeight, offset = 0) => {
  const scrollY = window.scrollY;
  const windowHeight = window.innerHeight;
  
  // Check if element is in viewport
  return (
    elementTop + offset < scrollY + windowHeight &&
    elementTop + elementHeight - offset > scrollY
  );
};

/**
 * Calculate scroll percentage through a page or element
 * @returns {number} - Scroll percentage from 0 to 100
 */
export const getScrollPercentage = () => {
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;
  const scrollTop = window.scrollY;
  
  // Calculate percentage scrolled
  return (scrollTop / (documentHeight - windowHeight)) * 100;
};

export default useScrollPosition; 
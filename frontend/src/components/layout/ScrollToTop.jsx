import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useScroll } from '../../contexts/ScrollContext';

/**
 * ScrollToTop component
 * Automatically scrolls to the top of the page when the route changes
 * If a hash is present in the URL, it will scroll to that element instead
 * Special handling for /journey page to preserve its internal scroll navigation
 * Also resets scroll progress data when navigating away from the Journey page
 */
function ScrollToTop() {
  const { pathname, hash } = useLocation();
  const { resetScroll } = useScroll();

  useEffect(() => {
    // Handle journey page separately - it has its own scroll management
    if (pathname.includes('/journey')) {
      return; // Don't interfere with Journey page scroll management
    }
    
    // Reset scroll data when not on journey page
    resetScroll();
    
    // If there's a hash in the URL, scroll to that element
    if (hash) {
      // Wait for the DOM to be fully updated before scrolling
      setTimeout(() => {
        const element = document.getElementById(hash.substring(1));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 0);
    } else {
      // For all other routes, scroll to top when pathname changes
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant' // Use 'instant' instead of 'auto' for immediate scroll
      });
    }
  }, [pathname, hash, resetScroll]);

  return null; // This component doesn't render anything
}

export default ScrollToTop; 
import { motion } from 'framer-motion';
import { useScroll } from '../../contexts/ScrollContext';
import { useLocation } from 'react-router-dom';

/**
 * ScrollProgress component
 * Shows a horizontal progress bar at the top of the page
 * Only appears on pages that need it (like Journey page)
 */
const ScrollProgress = () => {
  const { scrollData } = useScroll();
  const location = useLocation();
  
  // Determine if we should show the progress bar on this page
  const showProgressBar = () => {
    // Only show on Journey page
    return location.pathname.includes('/journey');
  };
  
  // Don't render anything if we're not on a page that needs the progress bar
  if (!showProgressBar()) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 w-full h-1 z-50">
      <motion.div
        className="h-full bg-blue-600 dark:bg-blue-400"
        initial={{ width: 0 }}
        animate={{ width: `${scrollData.scrollYProgress * 100}%` }}
        transition={{ duration: 0.2 }}
      />
    </div>
  );
};

export default ScrollProgress; 
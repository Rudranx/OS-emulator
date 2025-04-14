import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook for detecting when an element enters or exits the viewport
 * @param {Object} options - IntersectionObserver options
 * @param {number} options.threshold - A number between 0 and 1 indicating the percentage of the element that needs to be visible
 * @param {string|Element} options.root - The element that is used as the viewport for checking visibility
 * @param {string} options.rootMargin - Margin around the root element
 * @param {boolean} options.triggerOnce - Whether to unobserve the element after it enters the viewport once
 * @returns {Array} [ref, isIntersecting, entry] - Ref to attach to element, boolean indicating if element is in viewport, and the full IntersectionObserverEntry
 */
const useIntersectionObserver = ({
  threshold = 0.1,
  root = null,
  rootMargin = '0px',
  triggerOnce = false
} = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [entry, setEntry] = useState(null);
  const elementRef = useRef(null);
  const observer = useRef(null);

  useEffect(() => {
    // Disconnect the previous observer if it exists
    if (observer.current) {
      observer.current.disconnect();
    }

    // Create a new observer
    observer.current = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        setEntry(entry);

        // If triggerOnce is true and the element is intersecting, unobserve it
        if (triggerOnce && entry.isIntersecting) {
          observer.current.unobserve(entry.target);
        }
      },
      { threshold, root, rootMargin }
    );

    // Observe the element
    const currentElement = elementRef.current;
    if (currentElement) {
      observer.current.observe(currentElement);
    }

    // Cleanup function
    return () => {
      if (observer.current && currentElement) {
        observer.current.unobserve(currentElement);
        observer.current.disconnect();
      }
    };
  }, [threshold, root, rootMargin, triggerOnce]);

  return [elementRef, isIntersecting, entry];
};

export default useIntersectionObserver; 
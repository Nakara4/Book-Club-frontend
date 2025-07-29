import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook to observe element visibility using Intersection Observer API
 * Useful for lazy loading follow status on scroll
 * 
 * @param {Object} options - Intersection Observer options
 * @param options.threshold - Visibility threshold (0-1)
 * @param options.rootMargin - Root margin for early/late triggering
 * @param options.triggerOnce - Whether to trigger only once
 * @returns {Object} - {ref, isIntersecting, hasIntersected}
 */
const useIntersectionObserver = ({
  threshold = 0.1,
  rootMargin = '50px',
  triggerOnce = true
} = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Check if Intersection Observer is supported
    if (!window.IntersectionObserver) {
      // Fallback: assume element is always visible
      setIsIntersecting(true);
      setHasIntersected(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const { isIntersecting: intersecting } = entry;
        
        setIsIntersecting(intersecting);
        
        if (intersecting && !hasIntersected) {
          setHasIntersected(true);
          
          // If triggerOnce is true, stop observing after first intersection
          if (triggerOnce) {
            observer.unobserve(element);
          }
        }
      },
      {
        threshold,
        rootMargin
      }
    );

    observer.observe(element);

    // Cleanup function
    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [threshold, rootMargin, triggerOnce, hasIntersected]);

  return {
    ref,
    isIntersecting,
    hasIntersected
  };
};

export default useIntersectionObserver;

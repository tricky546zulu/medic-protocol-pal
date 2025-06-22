
import { useEffect, useRef } from 'react';

interface PerformanceMetrics {
  loadTime: number;
  domContentLoaded: number;
  firstContentfulPaint?: number;
  largestContentfulPaint?: number;
}

export const usePerformanceMonitoring = () => {
  const metricsRef = useRef<PerformanceMetrics>({
    loadTime: 0,
    domContentLoaded: 0,
  });

  useEffect(() => {
    const collectMetrics = () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      if (navigation) {
        metricsRef.current = {
          loadTime: navigation.loadEventEnd - navigation.loadEventStart,
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        };
      }

      // Collect paint metrics
      const paintEntries = performance.getEntriesByType('paint');
      paintEntries.forEach((entry) => {
        if (entry.name === 'first-contentful-paint') {
          metricsRef.current.firstContentfulPaint = entry.startTime;
        }
      });

      // Collect LCP if available
      if ('PerformanceObserver' in window) {
        try {
          const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            metricsRef.current.largestContentfulPaint = lastEntry.startTime;
          });
          observer.observe({ entryTypes: ['largest-contentful-paint'] });
        } catch (e) {
          // LCP not supported
        }
      }

      // Log metrics in development
      if (process.env.NODE_ENV === 'development') {
        console.log('Performance Metrics:', metricsRef.current);
      }
    };

    if (document.readyState === 'complete') {
      collectMetrics();
    } else {
      window.addEventListener('load', collectMetrics);
    }

    return () => {
      window.removeEventListener('load', collectMetrics);
    };
  }, []);

  const getMetrics = () => metricsRef.current;

  return { getMetrics };
};

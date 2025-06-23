import { useEffect, useRef, useCallback } from 'react';

interface PerformanceMetrics {
  loadTime: number;
  domContentLoaded: number;
  firstContentfulPaint?: number;
  largestContentfulPaint?: number;
  cumulativeLayoutShift?: number;
  firstInputDelay?: number;
  timeToInteractive?: number;
  memoryUsage?: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  };
  networkInfo?: {
    effectiveType: string;
    downlink: number;
    rtt: number;
  };
}

interface PerformanceThresholds {
  goodLCP: 2500;
  goodFID: 100;
  goodCLS: 0.1;
  goodTTI: 3800;
}

export const usePerformanceMonitoring = () => {
  const metricsRef = useRef<PerformanceMetrics>({
    loadTime: 0,
    domContentLoaded: 0,
  });
  
  const observersRef = useRef<PerformanceObserver[]>([]);
  const thresholds: PerformanceThresholds = {
    goodLCP: 2500,
    goodFID: 100,
    goodCLS: 0.1,
    goodTTI: 3800,
  };

  const evaluatePerformance = (metrics: PerformanceMetrics) => {
    const scores = {
      lcp: metrics.largestContentfulPaint ? 
        (metrics.largestContentfulPaint <= thresholds.goodLCP ? 'good' : 
         metrics.largestContentfulPaint <= thresholds.goodLCP * 2 ? 'needs-improvement' : 'poor') : 'unknown',
      fid: metrics.firstInputDelay ? 
        (metrics.firstInputDelay <= thresholds.goodFID ? 'good' : 
         metrics.firstInputDelay <= thresholds.goodFID * 3 ? 'needs-improvement' : 'poor') : 'unknown',
      cls: metrics.cumulativeLayoutShift ? 
        (metrics.cumulativeLayoutShift <= thresholds.goodCLS ? 'good' : 
         metrics.cumulativeLayoutShift <= thresholds.goodCLS * 2.5 ? 'needs-improvement' : 'poor') : 'unknown',
    };

    return {
      overall: Object.values(scores).filter(s => s === 'good').length >= 2 ? 'good' : 
               Object.values(scores).includes('poor') ? 'poor' : 'needs-improvement',
      ...scores
    };
  };

  const collectMemoryMetrics = () => {
    if ((performance as any).memory) {
      metricsRef.current.memoryUsage = {
        usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
        totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
        jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit,
      };
    }
  };

  const collectNetworkMetrics = () => {
    if ((navigator as any).connection) {
      const connection = (navigator as any).connection;
      metricsRef.current.networkInfo = {
        effectiveType: connection.effectiveType || 'unknown',
        downlink: connection.downlink || 0,
        rtt: connection.rtt || 0,
      };
    }
  };

  const setupPerformanceObservers = () => {
    try {
      // LCP Observer
      if ('PerformanceObserver' in window) {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          metricsRef.current.largestContentfulPaint = lastEntry.startTime;
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        observersRef.current.push(lcpObserver);

        // FID Observer
        const fidObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.processingStart > entry.startTime) {
              metricsRef.current.firstInputDelay = entry.processingStart - entry.startTime;
            }
          }
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
        observersRef.current.push(fidObserver);

        // CLS Observer
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value;
              metricsRef.current.cumulativeLayoutShift = clsValue;
            }
          }
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
        observersRef.current.push(clsObserver);

        // Long Task Observer (for TTI calculation)
        const longTaskObserver = new PerformanceObserver((list) => {
          // Simple TTI approximation: time when no long tasks occur for 5s after FCP
          if (metricsRef.current.firstContentfulPaint) {
            const lastLongTask = Math.max(...list.getEntries().map(entry => entry.startTime + entry.duration));
            metricsRef.current.timeToInteractive = Math.max(
              lastLongTask + 5000, // 5s after last long task
              metricsRef.current.firstContentfulPaint || 0
            );
          }
        });
        longTaskObserver.observe({ entryTypes: ['longtask'] });
        observersRef.current.push(longTaskObserver);
      }
    } catch (error) {
      console.warn('Failed to setup performance observers:', error);
    }
  };

  const collectBasicMetrics = () => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    if (navigation) {
      metricsRef.current = {
        ...metricsRef.current,
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

    collectMemoryMetrics();
    collectNetworkMetrics();
  };

  const logPerformanceMetrics = () => {
    if (process.env.NODE_ENV === 'development') {
      const scores = evaluatePerformance(metricsRef.current);
      console.group('📊 Performance Metrics');
      console.log('Metrics:', metricsRef.current);
      console.log('Performance Scores:', scores);
      console.groupEnd();
    }

    // Store metrics for analysis
    try {
      const metricsHistory = JSON.parse(localStorage.getItem('performance_metrics') || '[]');
      metricsHistory.push({
        ...metricsRef.current,
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent,
      });

      // Keep last 10 measurements
      if (metricsHistory.length > 10) {
        metricsHistory.splice(0, metricsHistory.length - 10);
      }

      localStorage.setItem('performance_metrics', JSON.stringify(metricsHistory));
    } catch (error) {
      console.warn('Failed to store performance metrics:', error);
    }
  };

  useEffect(() => {
    setupPerformanceObservers();

    const handleLoad = () => {
      // Wait a bit for all metrics to be collected
      setTimeout(() => {
        collectBasicMetrics();
        logPerformanceMetrics();
      }, 1000);
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
    }

    // Collect metrics periodically
    const metricsInterval = setInterval(() => {
      collectMemoryMetrics();
      collectNetworkMetrics();
    }, 30000); // Every 30 seconds

    return () => {
      window.removeEventListener('load', handleLoad);
      clearInterval(metricsInterval);
      
      // Disconnect all observers
      observersRef.current.forEach(observer => {
        try {
          observer.disconnect();
        } catch (error) {
          console.warn('Failed to disconnect performance observer:', error);
        }
      });
      observersRef.current = [];
    };
  }, []);

  const getMetrics = useCallback(() => metricsRef.current, []);
  
  const getPerformanceScore = useCallback(() => evaluatePerformance(metricsRef.current), []);
  
  const getMetricsHistory = useCallback(() => {
    try {
      return JSON.parse(localStorage.getItem('performance_metrics') || '[]');
    } catch {
      return [];
    }
  }, []);

  return { getMetrics, getPerformanceScore, getMetricsHistory };
};

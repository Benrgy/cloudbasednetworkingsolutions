import React, { useState, useEffect } from 'react';
import { analytics } from './AnalyticsTracker';

interface PopupConfig {
  initialDelay: number;
  showFrequency: 'once' | 'session' | 'daily' | 'always';
  maxDisplaysPerSession: number;
  exitIntentEnabled: boolean;
  scrollThreshold: number; // percentage of page scrolled
  timeOnPageThreshold: number; // seconds
}

interface PopupOptimizerProps {
  children: React.ReactNode;
  config?: Partial<PopupConfig>;
  onShow?: () => void;
  onClose?: () => void;
  testVariant?: 'A' | 'B' | 'C';
}

const defaultConfig: PopupConfig = {
  initialDelay: 30000, // 30 seconds
  showFrequency: 'once',
  maxDisplaysPerSession: 1,
  exitIntentEnabled: true,
  scrollThreshold: 50, // 50% of page
  timeOnPageThreshold: 45 // 45 seconds
};

export const PopupOptimizer: React.FC<PopupOptimizerProps> = ({
  children,
  config = {},
  onShow,
  onClose,
  testVariant = 'A'
}) => {
  const [shouldShow, setShouldShow] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const [displayCount, setDisplayCount] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [timeOnPage, setTimeOnPage] = useState(0);

  const finalConfig = { ...defaultConfig, ...config };

  // A/B testing variants
  const variants = {
    A: { ...finalConfig, initialDelay: 30000 }, // 30 seconds
    B: { ...finalConfig, initialDelay: 60000 }, // 1 minute  
    C: { ...finalConfig, initialDelay: 15000 }  // 15 seconds
  };

  const activeConfig = variants[testVariant];

  useEffect(() => {
    // Check if popup should be shown based on frequency settings
    const checkDisplayFrequency = () => {
      const lastShown = localStorage.getItem('popup_last_shown');
      const sessionShown = sessionStorage.getItem('popup_shown_this_session');
      const totalShown = localStorage.getItem('popup_total_shown') || '0';

      switch (activeConfig.showFrequency) {
        case 'once':
          return !lastShown;
        case 'session':
          return !sessionShown;
        case 'daily':
          if (!lastShown) return true;
          const daysSinceLastShown = (Date.now() - parseInt(lastShown)) / (1000 * 60 * 60 * 24);
          return daysSinceLastShown >= 1;
        case 'always':
          return parseInt(totalShown) < activeConfig.maxDisplaysPerSession;
        default:
          return true;
      }
    };

    // Initial delay timer
    const initialTimer = setTimeout(() => {
      if (checkDisplayFrequency()) {
        setShouldShow(true);
      }
    }, activeConfig.initialDelay);

    // Time on page tracker
    const timeTracker = setInterval(() => {
      setTimeOnPage(prev => prev + 1);
    }, 1000);

    // Scroll tracking
    const handleScroll = () => {
      const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      setScrollProgress(scrolled);
    };

    // Exit intent detection
    const handleMouseLeave = (e: MouseEvent) => {
      if (activeConfig.exitIntentEnabled && e.clientY <= 0 && checkDisplayFrequency()) {
        setShouldShow(true);
        analytics.track('popup_exit_intent_triggered', {
          category: 'popup',
          action: 'exit_intent',
          label: `variant_${testVariant}`
        });
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(timeTracker);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [activeConfig, testVariant]);

  // Check scroll and time thresholds
  useEffect(() => {
    if (
      scrollProgress >= activeConfig.scrollThreshold ||
      timeOnPage >= activeConfig.timeOnPageThreshold
    ) {
      if (!hasShown && displayCount < activeConfig.maxDisplaysPerSession) {
        setShouldShow(true);
      }
    }
  }, [scrollProgress, timeOnPage, hasShown, displayCount, activeConfig]);

  // Handle popup show
  useEffect(() => {
    if (shouldShow && !hasShown) {
      setHasShown(true);
      setDisplayCount(prev => prev + 1);
      
      // Update storage
      const now = Date.now().toString();
      localStorage.setItem('popup_last_shown', now);
      sessionStorage.setItem('popup_shown_this_session', 'true');
      
      const totalShown = parseInt(localStorage.getItem('popup_total_shown') || '0') + 1;
      localStorage.setItem('popup_total_shown', totalShown.toString());

      // Analytics tracking
      analytics.track('popup_displayed', {
        category: 'popup',
        action: 'display',
        label: `variant_${testVariant}`,
        value: timeOnPage
      });

      onShow?.();
    }
  }, [shouldShow, hasShown, timeOnPage, testVariant, onShow]);

  const handleClose = () => {
    setShouldShow(false);
    
    analytics.track('popup_closed', {
      category: 'popup',
      action: 'close',
      label: `variant_${testVariant}`,
      value: timeOnPage
    });

    onClose?.();
  };

  const handleInteraction = (action: string) => {
    analytics.track('popup_interaction', {
      category: 'popup',
      action,
      label: `variant_${testVariant}`
    });
  };

  // Clone children and add interaction tracking
  const enhancedChildren = React.cloneElement(children as React.ReactElement, {
    onClose: handleClose,
    onInteraction: handleInteraction,
    variant: testVariant,
    timeOnPage,
    scrollProgress: Math.round(scrollProgress)
  });

  if (!shouldShow) {
    return null;
  }

  return enhancedChildren;
};

// Hook for popup analytics
export const usePopupAnalytics = () => {
  const getPopupMetrics = () => {
    try {
      const stored = localStorage.getItem('networking_calculator_analytics') || '[]';
      const events = JSON.parse(stored);
      
      const popupEvents = events.filter((e: any) => e.properties.category === 'popup');
      const displays = popupEvents.filter((e: any) => e.event === 'popup_displayed').length;
      const closes = popupEvents.filter((e: any) => e.event === 'popup_closed').length;
      const interactions = popupEvents.filter((e: any) => e.event === 'popup_interaction').length;
      
      const conversionRate = displays > 0 ? (interactions / displays) * 100 : 0;
      const closeRate = displays > 0 ? (closes / displays) * 100 : 0;
      
      return {
        displays,
        interactions,
        closes,
        conversionRate: Math.round(conversionRate * 100) / 100,
        closeRate: Math.round(closeRate * 100) / 100
      };
    } catch (error) {
      console.warn('Failed to get popup metrics:', error);
      return null;
    }
  };

  const resetPopupData = () => {
    localStorage.removeItem('popup_last_shown');
    localStorage.removeItem('popup_total_shown');
    sessionStorage.removeItem('popup_shown_this_session');
  };

  return {
    getPopupMetrics,
    resetPopupData
  };
};

export default PopupOptimizer;
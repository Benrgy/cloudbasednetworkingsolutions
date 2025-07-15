import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Professional analytics tracking for networking tool usage
export interface AnalyticsEvent {
  event: string;
  properties: {
    category?: string;
    action?: string;
    label?: string;
    value?: number;
    provider?: string;
    region?: string;
    calculationType?: string;
    timestamp?: string;
    sessionId?: string;
  };
}

class AnalyticsTracker {
  private sessionId: string;
  private events: AnalyticsEvent[] = [];
  
  constructor() {
    this.sessionId = this.generateSessionId();
    this.initializeTracking();
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeTracking() {
    // Track session start
    this.track('session_start', {
      category: 'engagement',
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId
    });

    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.track('page_hidden', { category: 'engagement' });
      } else {
        this.track('page_visible', { category: 'engagement' });
      }
    });

    // Track user engagement time
    let startTime = Date.now();
    window.addEventListener('beforeunload', () => {
      const engagementTime = Date.now() - startTime;
      this.track('session_end', {
        category: 'engagement',
        value: Math.round(engagementTime / 1000), // seconds
      });
    });
  }

  track(event: string, properties: Partial<AnalyticsEvent['properties']> = {}) {
    const analyticsEvent: AnalyticsEvent = {
      event,
      properties: {
        ...properties,
        timestamp: new Date().toISOString(),
        sessionId: this.sessionId,
      }
    };

    this.events.push(analyticsEvent);
    
    // Store in localStorage for demonstration (in production, send to analytics service)
    this.storeEvent(analyticsEvent);
    
    // Console log for development visibility
    console.log('📊 Analytics:', analyticsEvent);
  }

  private storeEvent(event: AnalyticsEvent) {
    try {
      const stored = localStorage.getItem('networking_calculator_analytics') || '[]';
      const events = JSON.parse(stored);
      events.push(event);
      
      // Keep only last 100 events to prevent storage bloat
      if (events.length > 100) {
        events.splice(0, events.length - 100);
      }
      
      localStorage.setItem('networking_calculator_analytics', JSON.stringify(events));
    } catch (error) {
      console.warn('Failed to store analytics event:', error);
    }
  }

  // Specific tracking methods for networking calculator events
  trackCalculation(type: 'subnet' | 'cost' | 'optimization', provider?: string, region?: string) {
    this.track('calculation_performed', {
      category: 'calculator',
      action: 'calculate',
      calculationType: type,
      provider,
      region
    });
  }

  trackToolUsage(tool: string, action: string) {
    this.track('tool_usage', {
      category: 'tools',
      action,
      label: tool
    });
  }

  trackCostOptimization(savingsAmount: number, provider: string) {
    this.track('cost_optimization', {
      category: 'optimization',
      action: 'savings_identified',
      value: savingsAmount,
      provider
    });
  }

  trackUserEngagement(element: string, action: string) {
    this.track('user_engagement', {
      category: 'interaction',
      action,
      label: element
    });
  }

  trackError(error: string, context: string) {
    this.track('error', {
      category: 'error',
      action: 'encountered',
      label: `${context}: ${error}`
    });
  }

  // Get analytics summary for dashboard
  getAnalyticsSummary() {
    try {
      const stored = localStorage.getItem('networking_calculator_analytics') || '[]';
      const events = JSON.parse(stored);
      
      const summary = {
        totalEvents: events.length,
        calculationsPerformed: events.filter((e: AnalyticsEvent) => e.event === 'calculation_performed').length,
        sessionDuration: this.calculateSessionDuration(events),
        mostUsedCalculator: this.getMostUsedCalculator(events),
        topProvider: this.getTopProvider(events),
        errorRate: this.calculateErrorRate(events)
      };
      
      return summary;
    } catch (error) {
      console.warn('Failed to generate analytics summary:', error);
      return null;
    }
  }

  private calculateSessionDuration(events: AnalyticsEvent[]) {
    const sessionEvents = events.filter(e => e.properties.sessionId === this.sessionId);
    if (sessionEvents.length < 2) return 0;
    
    const start = new Date(sessionEvents[0].properties.timestamp!).getTime();
    const end = new Date(sessionEvents[sessionEvents.length - 1].properties.timestamp!).getTime();
    return Math.round((end - start) / 1000); // seconds
  }

  private getMostUsedCalculator(events: AnalyticsEvent[]) {
    const calculatorEvents = events.filter(e => e.event === 'calculation_performed');
    const counts = calculatorEvents.reduce((acc: Record<string, number>, event) => {
      const type = event.properties.calculationType || 'unknown';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});
    
    return Object.entries(counts).sort(([,a], [,b]) => b - a)[0]?.[0] || 'none';
  }

  private getTopProvider(events: AnalyticsEvent[]) {
    const providerEvents = events.filter(e => e.properties.provider);
    const counts = providerEvents.reduce((acc: Record<string, number>, event) => {
      const provider = event.properties.provider!;
      acc[provider] = (acc[provider] || 0) + 1;
      return acc;
    }, {});
    
    return Object.entries(counts).sort(([,a], [,b]) => b - a)[0]?.[0] || 'none';
  }

  private calculateErrorRate(events: AnalyticsEvent[]) {
    const totalEvents = events.length;
    const errorEvents = events.filter(e => e.event === 'error').length;
    return totalEvents > 0 ? (errorEvents / totalEvents) * 100 : 0;
  }
}

// Global analytics instance
export const analytics = new AnalyticsTracker();

// React hook for analytics tracking
export const useAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    // Track page views
    analytics.track('page_view', {
      category: 'navigation',
      action: 'page_view',
      label: location.pathname
    });
  }, [location]);

  return {
    track: analytics.track.bind(analytics),
    trackCalculation: analytics.trackCalculation.bind(analytics),
    trackToolUsage: analytics.trackToolUsage.bind(analytics),
    trackCostOptimization: analytics.trackCostOptimization.bind(analytics),
    trackUserEngagement: analytics.trackUserEngagement.bind(analytics),
    trackError: analytics.trackError.bind(analytics),
    getAnalyticsSummary: analytics.getAnalyticsSummary.bind(analytics)
  };
};

export default AnalyticsTracker;

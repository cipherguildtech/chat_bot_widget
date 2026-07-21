// src/utils/tracking.ts

interface TrackingData {
  websiteUrl: string;
  widgetId: string;
  timestamp: string;
  userAgent: string;
  ip?: string;
}

class WidgetTracker {
  private static instance: WidgetTracker;
//   private trackingEndpoint: string;
//   private isEnabled: boolean;

//   private constructor() {
//     this.trackingEndpoint = 
//                            'https://your-vercel-app.vercel.app/api/track';
//     this.isEnabled = true;
//   }

  static getInstance(): WidgetTracker {
    if (!WidgetTracker.instance) {
      WidgetTracker.instance = new WidgetTracker();
    }
    return WidgetTracker.instance;
  }

  async trackInstallation() {
    // if (!this.isEnabled) return;

    try {
      const data: TrackingData = {
        websiteUrl: window.location.origin,
        widgetId: this.getWidgetId(),
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
      };

    //   await fetch(this.trackingEndpoint, {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(data),
    //     mode: 'no-cors', // This prevents CORS issues but you won't get a response
    //   });

      console.log('Widget tracking successful',data);
    } catch (error) {
      console.warn('Failed to track widget:', error);
    }
  }

  private getWidgetId(): string {
    // You can embed a unique ID in your widget
    return 'widget-001';
  }
}

export default WidgetTracker.getInstance();
import { Injectable } from '@nestjs/common';
import * as Sentry from '@sentry/node';

@Injectable()
export class AnalyticsService {
  /**
   * Track custom event
   */
  track(event: string, properties?: Record<string, any>) {
    if (process.env.SENTRY_DSN) {
      Sentry.addBreadcrumb({
        category: 'analytics',
        message: event,
        level: 'info',
        data: properties,
      });
    }

    // Could also send to other analytics providers here
    // (Google Analytics, Mixpanel, etc.)
  }

  /**
   * Track error with context
   */
  captureError(error: Error, context?: Record<string, any>) {
    if (process.env.SENTRY_DSN) {
      Sentry.captureException(error, {
        extra: context,
      });
    }
  }

  /**
   * Set user context for tracking
   */
  setUser(userId: string, email?: string) {
    if (process.env.SENTRY_DSN) {
      Sentry.setUser({ id: userId, email });
    }
  }

  /**
   * Clear user context (on logout)
   */
  clearUser() {
    if (process.env.SENTRY_DSN) {
      Sentry.setUser(null);
    }
  }
}

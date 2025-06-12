import * as Sentry from "@sentry/nextjs";

export const logError = (error: Error | string, context?: string) => {
    console.error('Error:', error);

    if (context) {
        Sentry.setContext('error_context', { context });
    }

    if (typeof error === 'string') {
        Sentry.captureMessage(error, 'error');
    } else {
        Sentry.captureException(error);
    }
};

export const logWarning = (message: string, extra?: Record<string, unknown>) => {
    console.warn('Warning:', message, extra);

    if (extra) {
        Sentry.setContext('warning_context', extra);
    }

    Sentry.captureMessage(message, 'warning');
};

export const logInfo = (message: string, extra?: Record<string, unknown>) => {
    console.info('Info:', message, extra);

    Sentry.addBreadcrumb({
        message,
        level: 'info',
        data: extra,
    });
};

export const setUser = (user: { id?: string; email?: string; username?: string }) => {
    Sentry.setUser(user);
};

export const setContext = (key: string, context: Record<string, unknown>) => {
    Sentry.setContext(key, context);
};

export const setTag = (key: string, value: string) => {
    Sentry.setTag(key, value);
};
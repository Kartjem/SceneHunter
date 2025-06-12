// Sentry client configuration
import * as Sentry from "@sentry/nextjs";

Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    tracesSampleRate: 1.0,
    debug: false,
    environment: process.env.NODE_ENV,
    beforeSend(event) {
        if (process.env.NODE_ENV === 'development') {
            console.log('Sentry event captured:', event);
        }
        return event;
    },
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;

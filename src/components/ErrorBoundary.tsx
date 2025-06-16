"use client";

import React, { Component, ReactNode, useEffect } from 'react';

interface ErrorBoundaryState {
    hasError: boolean;
    error?: Error;
}

interface ErrorBoundaryProps {
    children: ReactNode;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-background">
                    <div className="text-center p-8">
                        <h2 className="text-2xl font-bold text-foreground mb-4">Something went wrong</h2>
                        <p className="text-muted-foreground mb-4">
                            An error occurred while loading the application.
                        </p>
                        <button
                            onClick={() => this.setState({ hasError: false })}
                            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                        >
                            Try again
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

// Global error handler component
export function GlobalErrorHandler({ children }: { children: ReactNode }) {
    useEffect(() => {
        const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
            // Prevent the default browser behavior (showing the error in console)
            event.preventDefault();

            // Handle specific cases
            if (event.reason === null || event.reason === undefined) {
                console.warn('Caught null/undefined promise rejection - likely from Firebase auth or async operation');
                // Try to get stack trace to identify source, but don't log it as error
                if (process.env.NODE_ENV === 'development') {
                    console.debug('Stack trace for null rejection:', new Error().stack);
                }
                return;
            }

            // Handle Firebase App Check / reCAPTCHA errors specially
            if (event.reason && typeof event.reason === 'object') {
                const error = event.reason as any;

                // Check for App Check related errors
                if (error.code && (
                    error.code.includes('appCheck') ||
                    error.code.includes('recaptcha') ||
                    error.code === 'app-check-token-invalid' ||
                    error.message?.includes('App Check') ||
                    error.message?.includes('reCAPTCHA')
                )) {
                    console.warn('Caught App Check/reCAPTCHA promise rejection (non-critical):', {
                        code: error.code,
                        message: error.message
                    });
                    return;
                }

                // Handle general Firebase errors
                if (error.code && typeof error.code === 'string') {
                    console.warn('Firebase-related unhandled rejection:', error.code, error.message);
                    return;
                }
            }

            // Only log non-null, non-Firebase errors as actual errors
            console.error('Unhandled promise rejection:', event.reason);
        };

        const handleError = (event: ErrorEvent) => {
            // Don't log App Check errors as critical errors
            if (event.error && typeof event.error === 'object') {
                const error = event.error as any;
                if (error.message?.includes('App Check') || error.message?.includes('reCAPTCHA')) {
                    console.warn('App Check/reCAPTCHA error (non-critical):', error.message);
                    return;
                }
            }
            console.error('Global error:', event.error);
        };

        // Add event listeners
        window.addEventListener('unhandledrejection', handleUnhandledRejection);
        window.addEventListener('error', handleError);

        // Cleanup
        return () => {
            window.removeEventListener('unhandledrejection', handleUnhandledRejection);
            window.removeEventListener('error', handleError);
        };
    }, []);

    return <>{children}</>;
}

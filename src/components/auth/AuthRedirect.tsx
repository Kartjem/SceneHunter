"use client";

import React, { useEffect } from "react";
import { useFirebaseAuth } from "@/hooks/use-firebase";
import { useRouter } from "next/navigation";

interface AuthRedirectProps {
    children: React.ReactNode;
}

export function AuthRedirect({ children }: AuthRedirectProps) {
    const { isAuthenticated, isLoading } = useFirebaseAuth();
    const router = useRouter();

    useEffect(() => {
        // Redirect to dashboard if already authenticated
        if (!isLoading && isAuthenticated) {
            router.push("/dashboard");
        }
    }, [isAuthenticated, isLoading, router]);

    // Show loading spinner while checking auth state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            </div>
        );
    }

    // Don't render children if user is authenticated (will redirect)
    if (isAuthenticated) {
        return null;
    }

    return <>{children}</>;
}

'use client';

import { createContext, useContext, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, User, getRedirectResult } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuthStore } from '@/stores/authStore';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const { user, isLoading, isAuthenticated, setUser, setLoading } = useAuthStore();

    useEffect(() => {
        // Handle redirect result from Google sign-in
        const handleRedirectResult = async () => {
            try {
                const result = await getRedirectResult(auth);
                if (result?.user) {
                    console.log('Google redirect sign-in successful:', result.user);
                    // The user will be automatically set via onAuthStateChanged
                }
            } catch (error) {
                console.error('Redirect result error:', error);
                // Handle the error gracefully - don't let it become an unhandled promise rejection
                if (error && typeof error === 'object' && 'code' in error) {
                    const firebaseError = error as { code: string; message?: string };
                    console.warn('Firebase redirect error:', firebaseError.code, firebaseError.message);
                }
            }
        };

        // Ensure the promise is properly handled
        handleRedirectResult().catch((error) => {
            console.error('Unhandled redirect result error:', error);
        });

        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            try {
                setUser(firebaseUser);
                setLoading(false);
            } catch (error) {
                console.error('Auth state change error:', error);
                setLoading(false);
            }
        });

        return unsubscribe;
    }, [setUser, setLoading]);

    const value = {
        user,
        isLoading,
        isAuthenticated,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

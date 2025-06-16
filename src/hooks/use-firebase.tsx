"use client";

import { useAuth } from '@/providers/AuthProvider';
import { useUserProfile, useCreateUserProfile } from './useUserProfile';

export function useFirebaseAuth() {
    const auth = useAuth();
    const userProfileQuery = useUserProfile(auth.user?.uid);
    const createUserProfileMutation = useCreateUserProfile();

    const createUserProfile = async (userData: Parameters<typeof createUserProfileMutation.mutate>[0]) => {
        try {
            return new Promise<void>((resolve, reject) => {
                createUserProfileMutation.mutate(userData, {
                    onSuccess: () => {
                        resolve();
                    },
                    onError: (error) => {
                        console.error('Create user profile error:', error);
                        reject(error);
                    }
                });
            });
        } catch (error) {
            console.error('Error calling createUserProfile:', error);
            throw error;
        }
    };

    return {
        ...auth,
        userProfile: userProfileQuery.data,
        isProfileLoading: userProfileQuery.isLoading,
        profileError: userProfileQuery.error,
        createUserProfile,
        isCreatingProfile: createUserProfileMutation.isPending,
    };
}

export function handleFirebaseError(error: unknown): string {
    const firebaseError = error as { code?: string; message?: string };

    // Handle App Check and reCAPTCHA errors first
    if (firebaseError.code && (
        firebaseError.code.includes('appCheck') ||
        firebaseError.code.includes('recaptcha') ||
        firebaseError.code === 'app-check-token-invalid' ||
        firebaseError.code === 'appCheck/recaptcha-error'
    )) {
        console.warn('App Check error (non-critical):', firebaseError.code, firebaseError.message);
        return 'Security verification temporarily unavailable, but you can still continue';
    }

    // Handle specific auth errors
    switch (firebaseError.code) {
        case 'auth/user-not-found':
            return 'No account found with this email';
        case 'auth/wrong-password':
            return 'Incorrect password';
        case 'auth/invalid-email':
            return 'Invalid email address';
        case 'auth/user-disabled':
            return 'This account has been disabled';
        case 'auth/email-already-in-use':
            return 'Email is already registered';
        case 'auth/popup-blocked':
            return 'Popup was blocked by browser. Please allow popups for this site or try again.';
        case 'auth/popup-closed-by-user':
            return 'Sign-in was cancelled';
        case 'auth/cancelled-popup-request':
            return 'Sign-in was cancelled';
        case 'permission-denied':
            return 'Access denied';
        case 'not-found':
            return 'Data not found';
        case 'unauthenticated':
            return 'Authentication required';
        default:
            // Check if message contains App Check references
            if (firebaseError.message && (
                firebaseError.message.includes('AppCheck') ||
                firebaseError.message.includes('App Check') ||
                firebaseError.message.includes('reCAPTCHA')
            )) {
                console.warn('App Check related error:', firebaseError);
                return 'Security verification service temporarily unavailable';
            }
            return firebaseError.message || 'An error occurred';
    }
}

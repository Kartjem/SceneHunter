"use client";

import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    return { user, loading };
}

export function handleFirebaseError(error: unknown): string {
    const firebaseError = error as { code?: string; message?: string };
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
        case 'permission-denied':
            return 'Access denied';
        case 'not-found':
            return 'Data not found';
        default:
            return firebaseError.message || 'An error occurred';
    }
}

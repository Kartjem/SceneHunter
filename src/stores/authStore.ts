import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from 'firebase/auth';

interface UserProfile {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
    emailVerified: boolean;
    createdAt?: Date;
    lastLoginAt?: Date;
    preferences?: {
        theme: 'light' | 'dark' | 'system';
        language: string;
        notifications: boolean;
    };
    roles?: string[];
}

interface AuthState {
    user: User | null;
    userProfile: UserProfile | null;
    isLoading: boolean;
    isAuthenticated: boolean;

    setUser: (user: User | null) => void;
    setUserProfile: (profile: UserProfile | null) => void;
    setLoading: (loading: boolean) => void;
    logout: () => void;
    updateProfile: (updates: Partial<UserProfile>) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            userProfile: null,
            isLoading: true,
            isAuthenticated: false,

            setUser: (user) => set({
                user,
                isAuthenticated: !!user,
                isLoading: false
            }),

            setUserProfile: (userProfile) => set({ userProfile }),

            setLoading: (isLoading) => set({ isLoading }),

            logout: () => set({
                user: null,
                userProfile: null,
                isAuthenticated: false,
                isLoading: false
            }),

            updateProfile: (updates) => {
                const currentProfile = get().userProfile;
                if (currentProfile) {
                    set({
                        userProfile: { ...currentProfile, ...updates }
                    });
                }
            },
        }),
        {
            name: 'auth-store',
            partialize: (state) => ({
                userProfile: state.userProfile,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);

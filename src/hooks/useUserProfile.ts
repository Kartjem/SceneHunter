import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuthStore } from '@/stores/authStore';

interface UserProfile {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
    emailVerified: boolean;
    createdAt?: any;
    lastLoginAt?: any;
    preferences?: {
        theme: 'light' | 'dark' | 'system';
        language: string;
        notifications: boolean;
    };
    roles?: string[];
}

export function useUserProfile(uid?: string) {
    return useQuery({
        queryKey: ['userProfile', uid],
        queryFn: async () => {
            if (!uid) {
                throw new Error('User ID required');
            }

            try {
                const docRef = doc(db, 'users', uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    return docSnap.data() as UserProfile;
                }

                return null;
            } catch (error) {
                console.error('Error fetching user profile:', error);
                throw error; // Re-throw so React Query handles it properly
            }
        },
        enabled: !!uid,
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: (failureCount, error) => {
            // Retry up to 3 times, but not for authentication errors
            if (error && typeof error === 'object' && 'code' in error) {
                const firebaseError = error as { code: string };
                if (firebaseError.code === 'permission-denied' || firebaseError.code === 'unauthenticated') {
                    return false;
                }
            }
            return failureCount < 3;
        },
    });
}

export function useCreateUserProfile() {
    const queryClient = useQueryClient();
    const { setUserProfile } = useAuthStore();

    return useMutation({
        mutationFn: async (userData: Partial<UserProfile> & { uid: string }) => {
            try {
                const userDoc = {
                    ...userData,
                    createdAt: serverTimestamp(),
                    lastLoginAt: serverTimestamp(),
                    preferences: {
                        theme: 'system' as const,
                        language: 'en',
                        notifications: true,
                        ...userData.preferences,
                    },
                    roles: ['user'],
                };

                await setDoc(doc(db, 'users', userData.uid), userDoc);
                return userDoc;
            } catch (error) {
                console.error('User profile creation failed:', error);
                throw error; // Re-throw so the mutation handles it properly
            }
        },
        onSuccess: (data) => {
            try {
                queryClient.setQueryData(['userProfile', data.uid], data);
                setUserProfile(data as UserProfile);
            } catch (error) {
                console.error('Error updating query cache or store:', error);
            }
        },
        onError: (error) => {
            console.error('Create user profile mutation error:', error);
        },
    });
}

export function useUpdateUserProfile() {
    const queryClient = useQueryClient();
    const { updateProfile, setUserProfile } = useAuthStore();

    return useMutation({
        mutationFn: async ({ uid, updates }: { uid: string; updates: Partial<UserProfile> }) => {
            const docRef = doc(db, 'users', uid);
            const updateData = {
                ...updates,
                lastLoginAt: serverTimestamp(),
            };

            await updateDoc(docRef, updateData);
            return { uid, updates: updateData };
        },
        onSuccess: (data, variables) => {
            // Получаем свежие данные из Firestore и обновляем кэш
            queryClient.invalidateQueries({ queryKey: ['userProfile', variables.uid] });

            // Принудительно обновляем кэш с новыми данными
            queryClient.refetchQueries({ queryKey: ['userProfile', variables.uid] });

            console.log('Profile updated successfully:', variables.updates);
        },
        onError: (error) => {
            console.error('Update user profile mutation error:', error);
        },
    });
}

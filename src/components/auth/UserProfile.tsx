'use client';

import { useFirebaseAuth } from '@/hooks/use-firebase';
import { useUpdateUserProfile } from '@/hooks/useUserProfile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState, useEffect } from 'react';
import { signOut, updateProfile as updateAuthProfile } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export function UserProfile() {
    const { user, userProfile, isProfileLoading } = useFirebaseAuth();
    const updateProfile = useUpdateUserProfile();
    const [isEditing, setIsEditing] = useState(false);
    const [displayName, setDisplayName] = useState('');

    // Синхронизируем локальный state с актуальными данными профиля
    useEffect(() => {
        setDisplayName(userProfile?.displayName || user?.displayName || '');
    }, [userProfile?.displayName, user?.displayName]);

    const handleSave = async () => {
        if (!user?.uid) return;

        try {
            // Обновляем профиль в Firestore
            await updateProfile.mutateAsync({
                uid: user.uid,
                updates: { displayName }
            });

            // Обновляем профиль в Firebase Auth
            if (user) {
                await updateAuthProfile(user, {
                    displayName: displayName
                });
            }

            setIsEditing(false);
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    if (isProfileLoading) {
        return <div className="animate-pulse">Loading profile...</div>;
    }

    if (!user) {
        return <div>Please sign in to view your profile.</div>;
    }

    return (
        <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="text-center mb-6">
                {user.photoURL && (
                    <img
                        src={user.photoURL}
                        alt="Profile"
                        className="w-20 h-20 rounded-full mx-auto mb-4"
                    />
                )}
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {userProfile?.displayName || user.displayName || 'Anonymous User'}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
            </div>

            <div className="space-y-4">
                {isEditing ? (
                    <div className="space-y-2">
                        <Label htmlFor="displayName">Display Name</Label>
                        <Input
                            id="displayName"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            placeholder="Enter your display name"
                        />
                        <div className="flex gap-2">
                            <Button
                                onClick={handleSave}
                                disabled={updateProfile.isPending}
                                className="flex-1"
                            >
                                {updateProfile.isPending ? 'Saving...' : 'Save'}
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => setIsEditing(false)}
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                ) : (
                    <Button
                        onClick={() => setIsEditing(true)}
                        variant="outline"
                        className="w-full"
                    >
                        Edit Profile
                    </Button>
                )}

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                        <p>Email verified: {user.emailVerified ? '✅' : '❌'}</p>
                        <p>Account created: {userProfile?.createdAt?.toDate?.()?.toLocaleDateString() || 'Unknown'}</p>
                        <p>Last login: {userProfile?.lastLoginAt?.toDate?.()?.toLocaleDateString() || 'Unknown'}</p>
                    </div>
                </div>

                <Button
                    onClick={handleLogout}
                    variant="destructive"
                    className="w-full"
                >
                    Sign Out
                </Button>
            </div>
        </div>
    );
}

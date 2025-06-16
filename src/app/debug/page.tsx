"use client";

import React from 'react';
import { useFirebaseAuth } from '@/hooks/use-firebase';
import { signInWithPopup, GoogleAuthProvider, signInWithRedirect } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function DebugPage() {
    const { user } = useFirebaseAuth();

    const triggerAppCheckError = async () => {
        try {
            console.log('Triggering potential App Check error via Google sign-in...');
            const provider = new GoogleAuthProvider();
            provider.addScope('email');
            provider.addScope('profile');

            await signInWithPopup(auth, provider);
        } catch (error: any) {
            console.error('Google sign-in error:', error);

            // Try redirect as fallback
            if (error.code === 'auth/popup-blocked') {
                console.log('Popup blocked, trying redirect...');
                const provider = new GoogleAuthProvider();
                provider.addScope('email');
                provider.addScope('profile');
                await signInWithRedirect(auth, provider);
            }
        }
    };

    const triggerNullRejection = () => {
        console.log('Triggering null promise rejection...');
        Promise.reject(null);
    };

    const triggerFirebaseError = () => {
        console.log('Triggering Firebase App Check error...');
        Promise.reject({
            code: 'appCheck/recaptcha-error',
            message: 'ReCAPTCHA error simulated'
        });
    };

    const triggerUndefinedRejection = () => {
        console.log('Triggering undefined promise rejection...');
        Promise.reject(undefined);
    };

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Debug Page</h1>

                <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                        <h2 className="text-xl font-semibold mb-4">User Status</h2>
                        <p>Current user: {user ? user.email : 'Not signed in'}</p>
                    </div>

                    <div className="p-4 border rounded-lg">
                        <h2 className="text-xl font-semibold mb-4">Error Tests</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={triggerAppCheckError}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Test Google Sign-in (App Check)
                            </button>

                            <button
                                onClick={triggerNullRejection}
                                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                            >
                                Test Null Rejection
                            </button>

                            <button
                                onClick={triggerFirebaseError}
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                            >
                                Test Firebase Error
                            </button>

                            <button
                                onClick={triggerUndefinedRejection}
                                className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
                            >
                                Test Undefined Rejection
                            </button>
                        </div>
                    </div>

                    <div className="p-4 border rounded-lg">
                        <h2 className="text-xl font-semibold mb-4">Console Monitoring</h2>
                        <div className="text-sm text-gray-600 space-y-2">
                            <p>• Open browser console (F12) to see error handling in action.</p>
                            <p>• Check for warning messages instead of error messages.</p>
                            <p>• Null/undefined rejections should show as warnings, not errors.</p>
                            <p>• App Check/reCAPTCHA errors should be handled gracefully.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

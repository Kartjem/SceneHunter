import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from 'firebase/app-check';

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);

// Initialize App Check - temporarily disabled to avoid 403 errors
if (typeof window !== 'undefined' && false) { // Set to false to disable for now
    try {
        // Add debug token for development first
        if (process.env.NODE_ENV === 'development') {
            const debugToken = process.env.NEXT_PUBLIC_APPCHECK_DEBUG_TOKEN;
            if (debugToken && debugToken !== '') {
                (self as any).FIREBASE_APPCHECK_DEBUG_TOKEN = debugToken;
                console.log('Firebase App Check debug token set for development');
            }
        }

        // Only initialize App Check if we have a valid reCAPTCHA key
        const recaptchaKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
        if (recaptchaKey && recaptchaKey !== '' && !recaptchaKey?.startsWith('your-')) {
            const appCheck = initializeAppCheck(app, {
                provider: new ReCaptchaEnterpriseProvider(recaptchaKey as string),
                isTokenAutoRefreshEnabled: true
            });
            console.log('Firebase App Check initialized successfully with reCAPTCHA Enterprise');
        } else {
            console.warn('Firebase App Check not initialized: Invalid or missing reCAPTCHA site key',
                { key: recaptchaKey ? `${recaptchaKey?.slice(0, 10)}...` : 'undefined' });
        }
    } catch (error: any) {
        console.warn('Failed to initialize Firebase App Check (non-critical):', {
            message: error?.message,
            code: error?.code,
            details: error
        });
        // Don't let App Check initialization failure break the app
        // Suppress any unhandled promise rejections from App Check
        if (error && typeof error.then === 'function') {
            error.catch((err: any) => {
                console.warn('Suppressed App Check promise rejection:', err);
            });
        }
    }
}

// Log that App Check is disabled
if (typeof window !== 'undefined') {
    console.log('Firebase App Check is temporarily disabled to avoid 403 errors');
}

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;

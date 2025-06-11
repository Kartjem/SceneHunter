import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

const initializeFirebase = () => {
    try {
        const projectId = process.env.FIREBASE_PROJECT_ID;
        if (!projectId) {
            throw new Error('FIREBASE_PROJECT_ID environment variable is required');
        }

        if (process.env.GOOGLE_APPLICATION_CREDENTIALS &&
            process.env.GOOGLE_APPLICATION_CREDENTIALS !== '' &&
            process.env.NODE_ENV === 'development') {

            console.log('🔑 Using service account key for local development');
            const serviceAccount = require(process.env.GOOGLE_APPLICATION_CREDENTIALS);
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
                projectId: projectId,
                storageBucket: `${projectId}.appspot.com`
            });
        } else {
            console.log('🔐 Using Application Default Credentials');
            admin.initializeApp({
                projectId: projectId,
                storageBucket: `${projectId}.appspot.com`
            });
        }

        console.log('✅ Firebase Admin SDK initialized successfully');
        console.log(`📁 Project: ${projectId}`);
        console.log(`🪣 Storage Bucket: ${projectId}.appspot.com`);
    } catch (error) {
        console.error('❌ Error initializing Firebase Admin SDK:', error);
        throw error;
    }
};

initializeFirebase();

export const db = getFirestore();
export const storage = getStorage();
export const auth = admin.auth();

export default admin;

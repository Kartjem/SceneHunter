import {
    collection,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    getDoc,
    getDocs,
    query,
    where,
    limit,
    serverTimestamp,
    Timestamp,
    QueryConstraint,
} from 'firebase/firestore';
import { db } from './firebase';
import {
    COLLECTIONS,
    UserProfile,
    CreateUserProfile,
    UpdateUserProfile,
} from '../types/firestore';
import { logError } from './sentry';

export class FirestoreError extends Error {
    constructor(
        message: string,
        public code: string,
        public operation: string
    ) {
        super(message);
        this.name = 'FirestoreError';

        logError(this, `Firestore ${operation} error`);
    }
}

class FirestoreAPI<T, TCreate, TUpdate> {
    constructor(private collectionName: string) { }

    async create(data: TCreate): Promise<string> {
        try {
            const docRef = await addDoc(collection(db, this.collectionName), {
                ...data,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });
            return docRef.id;
        } catch (error) {
            throw new FirestoreError(
                `Failed to create document: ${error}`,
                'create-failed',
                'create'
            );
        }
    }

    async get(id: string): Promise<T | null> {
        try {
            const docRef = doc(db, this.collectionName, id);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) {
                return null;
            }

            return { id: docSnap.id, ...docSnap.data() } as T;
        } catch (error) {
            throw new FirestoreError(
                `Failed to get document: ${error}`,
                'get-failed',
                'get'
            );
        }
    }

    async update(id: string, data: TUpdate): Promise<void> {
        try {
            const docRef = doc(db, this.collectionName, id);
            await updateDoc(docRef, {
                ...data,
                updatedAt: serverTimestamp(),
            });
        } catch (error) {
            throw new FirestoreError(
                `Failed to update document: ${error}`,
                'update-failed',
                'update'
            );
        }
    }

    async delete(id: string): Promise<void> {
        try {
            const docRef = doc(db, this.collectionName, id);
            await deleteDoc(docRef);
        } catch (error) {
            throw new FirestoreError(
                `Failed to delete document: ${error}`,
                'delete-failed',
                'delete'
            );
        }
    }

    async list(
        constraints: QueryConstraint[] = [],
        limitCount: number = 50
    ): Promise<T[]> {
        try {
            const q = query(
                collection(db, this.collectionName),
                ...constraints,
                limit(limitCount)
            );

            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as T));
        } catch (error) {
            throw new FirestoreError(
                `Failed to list documents: ${error}`,
                'list-failed',
                'list'
            );
        }
    }
}

export class UserAPI extends FirestoreAPI<UserProfile, CreateUserProfile, UpdateUserProfile> {
    constructor() {
        super(COLLECTIONS.USERS);
    }

    async getByEmail(email: string): Promise<UserProfile | null> {
        try {
            const q = query(
                collection(db, COLLECTIONS.USERS),
                where('email', '==', email),
                limit(1)
            );
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                return null;
            }

            const doc = querySnapshot.docs[0];
            return { id: doc.id, ...doc.data() } as UserProfile;
        } catch (error) {
            throw new FirestoreError(
                `Failed to get user by email: ${error}`,
                'get-by-email-failed',
                'getByEmail'
            );
        }
    }

    async updateLastLogin(userId: string): Promise<void> {
        await this.update(userId, { lastLoginAt: Timestamp.now() });
    }

    async incrementStats(userId: string, stat: keyof UserProfile['stats'], increment: number = 1): Promise<void> {
        const user = await this.get(userId);
        if (user) {
            const updatedStats = { ...user.stats };
            if (stat === 'locationsAdded' || stat === 'reviewsWritten') {
                updatedStats[stat] = (updatedStats[stat] || 0) + increment;
                await this.update(userId, { stats: updatedStats });
            }
        }
    }
}

export const userAPI = new UserAPI();

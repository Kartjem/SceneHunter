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
    orderBy,
    limit,
    startAfter,
    writeBatch,
    serverTimestamp,
    Timestamp,
    QueryConstraint,
    DocumentSnapshot,
    GeoPoint,
} from 'firebase/firestore';
import { db } from './firebase';
import {
    COLLECTIONS,
    UserProfile,
    Movie,
    Location,
    Review,
    CreateUserProfile,
    CreateMovie,
    CreateLocation,
    CreateReview,
    UpdateUserProfile,
    UpdateMovie,
    UpdateLocation,
    UpdateReview,
    MovieFilters,
    LocationFilters,
    ReviewFilters,
} from '../types/firestore';

// Error handling
export class FirestoreError extends Error {
    constructor(
        message: string,
        public code: string,
        public operation: string
    ) {
        super(message);
        this.name = 'FirestoreError';
    }
}

// Generic CRUD operations
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

    async paginate(
        constraints: QueryConstraint[] = [],
        limitCount: number = 50,
        lastDoc?: DocumentSnapshot
    ): Promise<{ data: T[]; lastDoc: DocumentSnapshot | null }> {
        try {
            const queryConstraints = [...constraints, limit(limitCount)];
            if (lastDoc) {
                queryConstraints.push(startAfter(lastDoc));
            }

            const q = query(collection(db, this.collectionName), ...queryConstraints);
            const querySnapshot = await getDocs(q);

            const data = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as T));

            const newLastDoc = querySnapshot.docs[querySnapshot.docs.length - 1] || null;

            return { data, lastDoc: newLastDoc };
        } catch (error) {
            throw new FirestoreError(
                `Failed to paginate documents: ${error}`,
                'paginate-failed',
                'paginate'
            );
        }
    }
}

// User Profile API
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
        // This would need a transaction in a real implementation
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

// Movie API
export class MovieAPI extends FirestoreAPI<Movie, CreateMovie, UpdateMovie> {
    constructor() {
        super(COLLECTIONS.MOVIES);
    }

    async search(
        searchTerm: string,
        filters: MovieFilters = {},
        limitCount: number = 20
    ): Promise<Movie[]> {
        try {
            const constraints: QueryConstraint[] = [
                where('status', '==', 'published'),
                orderBy('title'),
            ];

            if (filters.genre) {
                constraints.push(where('genres', 'array-contains', filters.genre));
            }

            if (filters.year) {
                constraints.push(where('year', '==', filters.year));
            }

            if (filters.minRating) {
                constraints.push(where('rating', '>=', filters.minRating));
            }

            if (filters.hasLocations) {
                constraints.push(where('locationCount', '>', 0));
            }

            return await this.list(constraints, limitCount);
        } catch (error) {
            throw new FirestoreError(
                `Failed to search movies: ${error}`,
                'search-failed',
                'search'
            );
        }
    }

    async getPopular(limitCount: number = 20): Promise<Movie[]> {
        return await this.list([
            where('status', '==', 'published'),
            orderBy('rating', 'desc'),
            orderBy('locationCount', 'desc'),
        ], limitCount);
    }

    async getRecent(limitCount: number = 20): Promise<Movie[]> {
        return await this.list([
            where('status', '==', 'published'),
            orderBy('createdAt', 'desc'),
        ], limitCount);
    }
}

// Location API
export class LocationAPI extends FirestoreAPI<Location, CreateLocation, UpdateLocation> {
    constructor() {
        super(COLLECTIONS.LOCATIONS);
    }

    async getByMovie(movieId: string, limitCount: number = 50): Promise<Location[]> {
        return await this.list([
            where('movieId', '==', movieId),
            where('status', '==', 'approved'),
            orderBy('createdAt', 'desc'),
        ], limitCount);
    }

    async getByUser(userId: string, limitCount: number = 50): Promise<Location[]> {
        return await this.list([
            where('createdBy', '==', userId),
            orderBy('createdAt', 'desc'),
        ], limitCount);
    }

    async getNearby(
        center: GeoPoint,
        radiusKm: number,
        limitCount: number = 50
    ): Promise<Location[]> {
        // Note: This is a simplified version. For production, you'd want to use
        // Geohash or GeoFirestore for efficient geospatial queries
        try {
            // Calculate rough bounding box (simplified)
            const latDelta = radiusKm / 111.32; // Rough km to degrees
            const lngDelta = radiusKm / (111.32 * Math.cos(center.latitude * Math.PI / 180));

            const constraints: QueryConstraint[] = [
                where('status', '==', 'approved'),
                orderBy('coordinates'),
            ];

            const locations = await this.list(constraints, limitCount * 2); // Get more for filtering

            // Filter by actual distance (client-side)
            return locations.filter(location => {
                const distance = this.calculateDistance(center, location.coordinates);
                return distance <= radiusKm;
            }).slice(0, limitCount);
        } catch (error) {
            throw new FirestoreError(
                `Failed to get nearby locations: ${error}`,
                'nearby-failed',
                'getNearby'
            );
        }
    }

    private calculateDistance(point1: GeoPoint, point2: GeoPoint): number {
        const R = 6371; // Earth's radius in km
        const dLat = (point2.latitude - point1.latitude) * Math.PI / 180;
        const dLon = (point2.longitude - point1.longitude) * Math.PI / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(point1.latitude * Math.PI / 180) * Math.cos(point2.latitude * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    async approve(locationId: string, adminId: string): Promise<void> {
        await this.update(locationId, {
            status: 'approved',
            verified: true,
            verifiedBy: adminId,
        });
    }

    async reject(locationId: string, adminId: string, reason?: string): Promise<void> {
        await this.update(locationId, {
            status: 'rejected',
            verifiedBy: adminId,
        });
    }
}

// Review API
export class ReviewAPI extends FirestoreAPI<Review, CreateReview, UpdateReview> {
    constructor() {
        super(COLLECTIONS.REVIEWS);
    }

    async getByLocation(locationId: string, limitCount: number = 50): Promise<Review[]> {
        return await this.list([
            where('locationId', '==', locationId),
            where('status', '==', 'active'),
            orderBy('createdAt', 'desc'),
        ], limitCount);
    }

    async getByUser(userId: string, limitCount: number = 50): Promise<Review[]> {
        return await this.list([
            where('userId', '==', userId),
            orderBy('createdAt', 'desc'),
        ], limitCount);
    }

    async markHelpful(reviewId: string, userId: string): Promise<void> {
        const review = await this.get(reviewId);
        if (review && !review.helpfulBy.includes(userId)) {
            const updatedHelpfulBy = [...review.helpfulBy, userId];
            await this.update(reviewId, {
                helpfulBy: updatedHelpfulBy,
                helpful: updatedHelpfulBy.length,
            });
        }
    }

    async removeHelpful(reviewId: string, userId: string): Promise<void> {
        const review = await this.get(reviewId);
        if (review && review.helpfulBy.includes(userId)) {
            const updatedHelpfulBy = review.helpfulBy.filter(id => id !== userId);
            await this.update(reviewId, {
                helpfulBy: updatedHelpfulBy,
                helpful: updatedHelpfulBy.length,
            });
        }
    }
}

// Batch operations
export class BatchAPI {
    private batch = writeBatch(db);

    addCreate<T>(collectionName: string, data: T): string {
        const docRef = doc(collection(db, collectionName));
        this.batch.set(docRef, {
            ...data,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });
        return docRef.id;
    }

    addUpdate<T>(collectionName: string, id: string, data: Partial<T>): void {
        const docRef = doc(db, collectionName, id);
        this.batch.update(docRef, {
            ...data,
            updatedAt: serverTimestamp(),
        });
    }

    addDelete(collectionName: string, id: string): void {
        const docRef = doc(db, collectionName, id);
        this.batch.delete(docRef);
    }

    async commit(): Promise<void> {
        try {
            await this.batch.commit();
        } catch (error) {
            throw new FirestoreError(
                `Failed to commit batch: ${error}`,
                'batch-commit-failed',
                'commit'
            );
        }
    }
}

// Export API instances
export const userAPI = new UserAPI();
export const movieAPI = new MovieAPI();
export const locationAPI = new LocationAPI();
export const reviewAPI = new ReviewAPI();

// Export batch creator
export const createBatch = () => new BatchAPI();

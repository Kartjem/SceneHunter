import { Timestamp } from 'firebase/firestore';

export interface BaseDocument {
    id: string;
    createdAt: Timestamp;
    updatedAt?: Timestamp;
}

export interface UserProfile extends BaseDocument {
    email: string;
    displayName: string;
    avatar?: string;
    bio?: string;
    lastLoginAt?: Timestamp;
    isAdmin?: boolean;
    preferences: {
        theme: 'light' | 'dark' | 'system';
        notifications: boolean;
        publicProfile: boolean;
    };
    stats: {
        locationsAdded: number;
        reviewsWritten: number;
        favoriteMovies: string[];
    };
}

export const COLLECTIONS = {
    USERS: 'users',
} as const;

export type CreateUserProfile = Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt' | 'lastLoginAt'>;
export type UpdateUserProfile = Partial<Omit<UserProfile, 'id' | 'createdAt' | 'email'>>;

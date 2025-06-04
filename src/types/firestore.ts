import { Timestamp, GeoPoint } from 'firebase/firestore';

// Base interface for documents with timestamps
export interface BaseDocument {
    id: string;
    createdAt: Timestamp;
    updatedAt?: Timestamp;
}

// User profile in Firestore
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
        favoriteMovies: string[]; // Movie IDs
    };
}

// Movie document
export interface Movie extends BaseDocument {
    title: string;
    originalTitle?: string;
    year: number;
    description: string;
    poster?: string;
    backdrop?: string;
    genres: string[];
    director?: string;
    cast?: string[];
    tmdbId?: number;
    imdbId?: string;
    runtime?: number; // in minutes
    rating?: number; // average rating
    status: 'draft' | 'published' | 'archived';
    locationCount: number; // denormalized count
}

// Location document
export interface Location extends BaseDocument {
    name: string;
    description?: string;
    address: string;
    coordinates: GeoPoint;
    movieId: string; // Reference to Movie
    createdBy: string; // Reference to User
    images: string[]; // Storage paths
    thumbnail?: string; // Auto-generated thumbnail
    sceneDescription?: string;
    filmingDate?: Timestamp;
    verified: boolean;
    verifiedBy?: string; // Admin who verified
    status: 'pending' | 'approved' | 'rejected';
    stats: {
        viewCount: number;
        reviewCount: number;
        averageRating: number;
        favoriteCount: number;
    };
    metadata: {
        accuracy: 'exact' | 'approximate' | 'general_area';
        source: 'user_submitted' | 'official' | 'crowd_verified';
        confidence: number; // 0-1
    };
}

// Review document
export interface Review extends BaseDocument {
    userId: string; // Reference to User
    locationId: string; // Reference to Location
    rating: number; // 1-5 stars
    comment?: string;
    images?: string[]; // Storage paths
    helpful: number; // Count of helpful votes
    helpfulBy: string[]; // User IDs who found it helpful
    reportedBy?: string[]; // User IDs who reported
    status: 'active' | 'hidden' | 'removed';
    moderatedBy?: string; // Admin who moderated
    moderationReason?: string;
}

// Favorite/Bookmark document
export interface UserFavorite extends BaseDocument {
    userId: string;
    itemType: 'movie' | 'location';
    itemId: string;
    notes?: string;
}

// User activity log
export interface UserActivity extends BaseDocument {
    userId: string;
    action: 'location_added' | 'review_written' | 'movie_favorited' | 'location_visited';
    targetType: 'movie' | 'location' | 'review';
    targetId: string;
    metadata?: Record<string, any>;
}

// Notification document
export interface Notification extends BaseDocument {
    userId: string;
    type: 'location_approved' | 'location_rejected' | 'review_helpful' | 'new_location_near_favorite';
    title: string;
    message: string;
    read: boolean;
    actionUrl?: string;
    metadata?: Record<string, any>;
}

// Firestore collection names as constants
export const COLLECTIONS = {
    USERS: 'users',
    MOVIES: 'movies',
    LOCATIONS: 'locations',
    REVIEWS: 'reviews',
    USER_FAVORITES: 'userFavorites',
    USER_ACTIVITIES: 'userActivities',
    NOTIFICATIONS: 'notifications',
} as const;

// Helper types for creating new documents (without server-generated fields)
export type CreateUserProfile = Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt' | 'lastLoginAt'>;
export type CreateMovie = Omit<Movie, 'id' | 'createdAt' | 'updatedAt' | 'locationCount' | 'rating'>;
export type CreateLocation = Omit<Location, 'id' | 'createdAt' | 'updatedAt' | 'verified' | 'verifiedBy' | 'stats' | 'thumbnail'>;
export type CreateReview = Omit<Review, 'id' | 'createdAt' | 'updatedAt' | 'helpful' | 'helpfulBy' | 'status'>;

// Update types (for partial updates)
export type UpdateUserProfile = Partial<Omit<UserProfile, 'id' | 'createdAt' | 'email'>>;
export type UpdateMovie = Partial<Omit<Movie, 'id' | 'createdAt'>>;
export type UpdateLocation = Partial<Omit<Location, 'id' | 'createdAt' | 'createdBy'>>;
export type UpdateReview = Partial<Omit<Review, 'id' | 'createdAt' | 'userId' | 'locationId'>>;

// Query filter types
export interface MovieFilters {
    genre?: string;
    year?: number;
    yearRange?: [number, number];
    director?: string;
    minRating?: number;
    hasLocations?: boolean;
}

export interface LocationFilters {
    movieId?: string;
    verified?: boolean;
    withinRadius?: {
        center: GeoPoint;
        radiusKm: number;
    };
    hasImages?: boolean;
    minRating?: number;
}

export interface ReviewFilters {
    locationId?: string;
    userId?: string;
    minRating?: number;
    hasImages?: boolean;
    status?: Review['status'];
}

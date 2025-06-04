import { storage } from './firebase';
import {
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject,
    listAll,
    StorageReference,
    UploadResult
} from 'firebase/storage';

// Storage paths
export const STORAGE_PATHS = {
    USER_AVATARS: 'users/avatars',
    LOCATION_IMAGES: 'locations/images',
    LOCATION_THUMBNAILS: 'locations/thumbnails',
    MOVIE_POSTERS: 'movies/posters',
    MOVIE_BACKDROPS: 'movies/backdrops',
    REVIEW_IMAGES: 'reviews/images',
    TEMP_UPLOADS: 'temp'
} as const;

// File type validation
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export class StorageError extends Error {
    constructor(
        message: string,
        public code: string,
        public operation: string
    ) {
        super(message);
        this.name = 'StorageError';
    }
}

// Generic Storage API
export class StorageAPI {
    /**
     * Upload a file to Firebase Storage
     */
    async uploadFile(
        path: string,
        file: File,
        options: {
            validateImage?: boolean;
            maxSize?: number;
            generateThumbnail?: boolean;
        } = {}
    ): Promise<{
        url: string;
        path: string;
        thumbnailUrl?: string;
    }> {
        try {
            const { validateImage = true, maxSize = MAX_FILE_SIZE } = options;

            // Validate file
            if (validateImage && !ALLOWED_IMAGE_TYPES.includes(file.type)) {
                throw new StorageError(
                    'Invalid file type. Only images are allowed.',
                    'invalid-file-type',
                    'uploadFile'
                );
            }

            if (file.size > maxSize) {
                throw new StorageError(
                    `File size exceeds ${maxSize / (1024 * 1024)}MB limit.`,
                    'file-too-large',
                    'uploadFile'
                );
            }

            // Create storage reference
            const storageRef = ref(storage, path);

            // Upload file
            const uploadResult: UploadResult = await uploadBytes(storageRef, file);

            // Get download URL
            const url = await getDownloadURL(uploadResult.ref);

            const result = {
                url,
                path,
            };

            // Generate thumbnail if requested
            if (options.generateThumbnail && validateImage) {
                try {
                    const thumbnailPath = this.getThumbnailPath(path);
                    const thumbnailFile = await this.generateThumbnail(file);
                    const thumbnailRef = ref(storage, thumbnailPath);
                    const thumbnailUploadResult = await uploadBytes(thumbnailRef, thumbnailFile);
                    const thumbnailUrl = await getDownloadURL(thumbnailUploadResult.ref);

                    return {
                        ...result,
                        thumbnailUrl,
                    };
                } catch (error) {
                    console.warn('Failed to generate thumbnail:', error);
                    // Continue without thumbnail
                }
            }

            return result;
        } catch (error) {
            if (error instanceof StorageError) {
                throw error;
            }
            throw new StorageError(
                `Failed to upload file: ${error}`,
                'upload-failed',
                'uploadFile'
            );
        }
    }

    /**
     * Delete a file from Firebase Storage
     */
    async deleteFile(path: string): Promise<void> {
        try {
            const storageRef = ref(storage, path);
            await deleteObject(storageRef);
        } catch (error) {
            throw new StorageError(
                `Failed to delete file: ${error}`,
                'delete-failed',
                'deleteFile'
            );
        }
    }

    /**
     * Get download URL for a file
     */
    async getDownloadURL(path: string): Promise<string> {
        try {
            const storageRef = ref(storage, path);
            return await getDownloadURL(storageRef);
        } catch (error) {
            throw new StorageError(
                `Failed to get download URL: ${error}`,
                'get-url-failed',
                'getDownloadURL'
            );
        }
    }

    /**
     * List files in a directory
     */
    async listFiles(path: string): Promise<string[]> {
        try {
            const storageRef = ref(storage, path);
            const result = await listAll(storageRef);

            return Promise.all(
                result.items.map(async (item) => {
                    const url = await getDownloadURL(item);
                    return url;
                })
            );
        } catch (error) {
            throw new StorageError(
                `Failed to list files: ${error}`,
                'list-failed',
                'listFiles'
            );
        }
    }

    /**
     * Generate thumbnail path from original path
     */
    protected getThumbnailPath(originalPath: string): string {
        const pathParts = originalPath.split('/');
        const fileName = pathParts.pop() || '';
        const nameWithoutExt = fileName.split('.')[0];
        const ext = fileName.split('.').pop();

        return `${pathParts.join('/')}/thumbnails/${nameWithoutExt}_thumb.${ext}`;
    }

    /**
     * Generate thumbnail from image file
     */
    private async generateThumbnail(file: File, maxSize: number = 300): Promise<File> {
        return new Promise((resolve, reject) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();

            img.onload = () => {
                // Calculate new dimensions
                let { width, height } = img;

                if (width > height) {
                    if (width > maxSize) {
                        height = (height * maxSize) / width;
                        width = maxSize;
                    }
                } else {
                    if (height > maxSize) {
                        width = (width * maxSize) / height;
                        height = maxSize;
                    }
                }

                canvas.width = width;
                canvas.height = height;

                // Draw and compress
                ctx?.drawImage(img, 0, 0, width, height);

                canvas.toBlob((blob) => {
                    if (blob) {
                        const thumbnailFile = new File([blob], file.name, {
                            type: file.type,
                            lastModified: Date.now(),
                        });
                        resolve(thumbnailFile);
                    } else {
                        reject(new Error('Failed to generate thumbnail blob'));
                    }
                }, file.type, 0.8);
            };

            img.onerror = () => reject(new Error('Failed to load image'));
            img.src = URL.createObjectURL(file);
        });
    }
}

// User Avatar API
export class UserAvatarAPI extends StorageAPI {
    async uploadAvatar(userId: string, file: File): Promise<string> {
        const path = `${STORAGE_PATHS.USER_AVATARS}/${userId}/${Date.now()}_${file.name}`;
        const result = await this.uploadFile(path, file, {
            validateImage: true,
            generateThumbnail: true,
        });
        return result.url;
    }

    async deleteAvatar(path: string): Promise<void> {
        await this.deleteFile(path);

        // Also delete thumbnail if exists
        try {
            const thumbnailPath = this.getThumbnailPath(path);
            await this.deleteFile(thumbnailPath);
        } catch (error) {
            // Thumbnail might not exist, ignore error
            console.warn('Failed to delete thumbnail:', error);
        }
    }
}

// Location Images API
export class LocationImageAPI extends StorageAPI {
    async uploadLocationImage(locationId: string, file: File): Promise<{
        url: string;
        thumbnailUrl?: string;
    }> {
        const path = `${STORAGE_PATHS.LOCATION_IMAGES}/${locationId}/${Date.now()}_${file.name}`;
        const result = await this.uploadFile(path, file, {
            validateImage: true,
            generateThumbnail: true,
        });

        return {
            url: result.url,
            thumbnailUrl: result.thumbnailUrl,
        };
    }

    async getLocationImages(locationId: string): Promise<string[]> {
        const path = `${STORAGE_PATHS.LOCATION_IMAGES}/${locationId}`;
        return await this.listFiles(path);
    }

    async deleteLocationImage(path: string): Promise<void> {
        await this.deleteFile(path);

        // Also delete thumbnail if exists
        try {
            const thumbnailPath = this.getThumbnailPath(path);
            await this.deleteFile(thumbnailPath);
        } catch (error) {
            // Thumbnail might not exist, ignore error
            console.warn('Failed to delete thumbnail:', error);
        }
    }
}

// Movie Images API
export class MovieImageAPI extends StorageAPI {
    async uploadPoster(movieId: string, file: File): Promise<string> {
        const path = `${STORAGE_PATHS.MOVIE_POSTERS}/${movieId}/${Date.now()}_${file.name}`;
        const result = await this.uploadFile(path, file, {
            validateImage: true,
        });
        return result.url;
    }

    async uploadBackdrop(movieId: string, file: File): Promise<string> {
        const path = `${STORAGE_PATHS.MOVIE_BACKDROPS}/${movieId}/${Date.now()}_${file.name}`;
        const result = await this.uploadFile(path, file, {
            validateImage: true,
        });
        return result.url;
    }
}

// Review Images API
export class ReviewImageAPI extends StorageAPI {
    async uploadReviewImage(reviewId: string, file: File): Promise<string> {
        const path = `${STORAGE_PATHS.REVIEW_IMAGES}/${reviewId}/${Date.now()}_${file.name}`;
        const result = await this.uploadFile(path, file, {
            validateImage: true,
            generateThumbnail: true,
        });
        return result.url;
    }

    async getReviewImages(reviewId: string): Promise<string[]> {
        const path = `${STORAGE_PATHS.REVIEW_IMAGES}/${reviewId}`;
        return await this.listFiles(path);
    }
}

// Export API instances
export const storageAPI = new StorageAPI();
export const userAvatarAPI = new UserAvatarAPI();
export const locationImageAPI = new LocationImageAPI();
export const movieImageAPI = new MovieImageAPI();
export const reviewImageAPI = new ReviewImageAPI();

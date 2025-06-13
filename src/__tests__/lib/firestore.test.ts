import { FirestoreError, userAPI } from '@/lib/firestore'
import { COLLECTIONS } from '@/types/firestore'
import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    deleteDoc,
    addDoc,
    collection,
    serverTimestamp
} from 'firebase/firestore'

jest.mock('firebase/firestore', () => ({
    doc: jest.fn(),
    getDoc: jest.fn(),
    setDoc: jest.fn(),
    updateDoc: jest.fn(),
    deleteDoc: jest.fn(),
    addDoc: jest.fn(),
    collection: jest.fn(),
    serverTimestamp: jest.fn(),
}))

jest.mock('@/lib/firebase', () => ({
    db: {},
}))

jest.mock('@/lib/sentry', () => ({
    logError: jest.fn(),
}))

const mockDoc = doc as jest.MockedFunction<typeof doc>
const mockGetDoc = getDoc as jest.MockedFunction<typeof getDoc>
const mockSetDoc = setDoc as jest.MockedFunction<typeof setDoc>
const mockUpdateDoc = updateDoc as jest.MockedFunction<typeof updateDoc>
const mockDeleteDoc = deleteDoc as jest.MockedFunction<typeof deleteDoc>
const mockAddDoc = addDoc as jest.MockedFunction<typeof addDoc>
const mockCollection = collection as jest.MockedFunction<typeof collection>
const mockServerTimestamp = serverTimestamp as jest.MockedFunction<typeof serverTimestamp>

describe('FirestoreError', () => {
    it('creates with correct properties', () => {
        const error = new FirestoreError('Test error', 'test-code', 'test-operation')

        expect(error.message).toBe('Test error')
        expect(error.code).toBe('test-code')
        expect(error.operation).toBe('test-operation')
        expect(error.name).toBe('FirestoreError')
        expect(error).toBeInstanceOf(Error)
    })
})

describe('userAPI', () => {
    let mockDocRef: any
    let mockDocSnap: any

    beforeEach(() => {
        jest.clearAllMocks()

        mockDocRef = { id: 'test-uid' }
        mockDocSnap = {
            exists: jest.fn(),
            data: jest.fn(),
            id: 'test-uid'
        }

        mockDoc.mockReturnValue(mockDocRef)
        mockServerTimestamp.mockReturnValue('mock-timestamp' as any)
    })

    describe('get', () => {
        it('successfully retrieves user profile', async () => {
            const userData = {
                email: 'test@example.com',
                displayName: 'Test User',
                preferences: {
                    theme: 'light' as const,
                    notifications: true,
                    publicProfile: true
                },
                stats: {
                    locationsAdded: 5,
                    reviewsWritten: 3,
                    favoriteMovies: ['movie1', 'movie2']
                }
            }

            mockDocSnap.exists.mockReturnValue(true)
            mockDocSnap.data.mockReturnValue(userData)
            mockGetDoc.mockResolvedValue(mockDocSnap as any)

            const result = await userAPI.get('test-uid')

            expect(mockDoc).toHaveBeenCalledWith({}, COLLECTIONS.USERS, 'test-uid')
            expect(mockGetDoc).toHaveBeenCalledWith(mockDocRef)
            expect(result).toEqual({
                id: 'test-uid',
                ...userData
            })
        })

        it('returns null if document not found', async () => {
            mockDocSnap.exists.mockReturnValue(false)
            mockGetDoc.mockResolvedValue(mockDocSnap as any)

            const result = await userAPI.get('test-uid')

            expect(result).toBeNull()
        })

        it('throws FirestoreError on error', async () => {
            const mockError = new Error('Firestore error')
            mockGetDoc.mockRejectedValue(mockError)

            await expect(userAPI.get('test-uid')).rejects.toThrow(FirestoreError)
        })
    })

    describe('create', () => {
        it('successfully creates user profile', async () => {
            const createData = {
                uid: 'test-uid',
                email: 'test@example.com',
                displayName: 'Test User',
                preferences: {
                    theme: 'light' as const,
                    notifications: true,
                    publicProfile: true
                },
                stats: {
                    locationsAdded: 0,
                    reviewsWritten: 0,
                    favoriteMovies: []
                }
            }

            mockSetDoc.mockResolvedValue(undefined)

            const result = await userAPI.create(createData)

            expect(mockDoc).toHaveBeenCalledWith({}, COLLECTIONS.USERS, 'test-uid')
            expect(mockSetDoc).toHaveBeenCalledWith(mockDocRef, expect.objectContaining({
                email: createData.email,
                displayName: createData.displayName,
                preferences: createData.preferences,
                createdAt: expect.anything(),
                updatedAt: expect.anything(),
                stats: expect.objectContaining({
                    locationsAdded: 0,
                    reviewsWritten: 0,
                    favoriteMovies: []
                })
            }))
            expect(result).toBe('test-uid')
        })

        it('throws FirestoreError on creation error', async () => {
            const createData = {
                uid: 'test-uid',
                email: 'test@example.com',
                displayName: 'Test User',
                preferences: {
                    theme: 'light' as const,
                    notifications: true,
                    publicProfile: true
                },
                stats: {
                    locationsAdded: 0,
                    reviewsWritten: 0,
                    favoriteMovies: []
                }
            }
            const mockError = new Error('Firestore error')
            mockSetDoc.mockRejectedValue(mockError)

            await expect(userAPI.create(createData)).rejects.toThrow(FirestoreError)
        })
    })

    describe('update', () => {
        it('successfully updates user profile', async () => {
            const updateData = { displayName: 'Updated Name' }
            mockUpdateDoc.mockResolvedValue(undefined)

            await userAPI.update('test-uid', updateData)

            expect(mockDoc).toHaveBeenCalledWith({}, COLLECTIONS.USERS, 'test-uid')
            expect(mockUpdateDoc).toHaveBeenCalledWith(mockDocRef, expect.objectContaining({
                ...updateData,
                updatedAt: expect.anything()
            }))
        })

        it('throws FirestoreError on update error', async () => {
            const updateData = { displayName: 'Updated Name' }
            const mockError = new Error('Firestore error')
            mockUpdateDoc.mockRejectedValue(mockError)

            await expect(userAPI.update('test-uid', updateData)).rejects.toThrow(FirestoreError)
        })
    })

    describe('delete', () => {
        it('successfully deletes user profile', async () => {
            mockDeleteDoc.mockResolvedValue(undefined)

            await userAPI.delete('test-uid')

            expect(mockDoc).toHaveBeenCalledWith({}, COLLECTIONS.USERS, 'test-uid')
            expect(mockDeleteDoc).toHaveBeenCalledWith(mockDocRef)
        })

        it('throws FirestoreError on deletion error', async () => {
            const mockError = new Error('Firestore error')
            mockDeleteDoc.mockRejectedValue(mockError)

            await expect(userAPI.delete('test-uid')).rejects.toThrow(FirestoreError)
        })
    })
})
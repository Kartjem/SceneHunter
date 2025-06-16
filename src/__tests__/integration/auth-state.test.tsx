import React from 'react'
import { render, screen } from '@testing-library/react'
import { useFirebaseAuth } from '@/hooks/use-firebase'

jest.mock('@/hooks/use-firebase')
const mockUseFirebaseAuth = useFirebaseAuth as jest.MockedFunction<typeof useFirebaseAuth>

function TestComponent() {
    const { user, isAuthenticated, userProfile } = useFirebaseAuth()

    return (
        <div>
            <div data-testid="auth-status">
                {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
            </div>
            {user && <div data-testid="user-id">{user.uid}</div>}
            {userProfile && <div data-testid="user-email">{userProfile.email}</div>}
        </div>
    )
}

describe('Authentication State Integration', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('displays unauthenticated state by default', () => {
        mockUseFirebaseAuth.mockReturnValue({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            userProfile: null,
            isProfileLoading: false,
            profileError: null,
            createUserProfile: jest.fn(),
            isCreatingProfile: false,
        })

        render(<TestComponent />)

        expect(screen.getByTestId('auth-status')).toHaveTextContent('Not Authenticated')
        expect(screen.queryByTestId('user-id')).not.toBeInTheDocument()
        expect(screen.queryByTestId('user-email')).not.toBeInTheDocument()
    })

    it('displays authenticated state with user data', () => {
        const mockUser = {
            uid: 'test-user-123',
            email: 'test@example.com',
            displayName: 'Test User',
        }

        const mockUserProfile = {
            uid: 'test-user-123',
            email: 'test@example.com',
            displayName: 'Test User',
            photoURL: null,
            emailVerified: true,
        }

        mockUseFirebaseAuth.mockReturnValue({
            user: mockUser as any,
            isAuthenticated: true,
            isLoading: false,
            userProfile: mockUserProfile,
            isProfileLoading: false,
            profileError: null,
            createUserProfile: jest.fn(),
            isCreatingProfile: false,
        })

        render(<TestComponent />)

        expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated')
        expect(screen.getByTestId('user-id')).toHaveTextContent('test-user-123')
        expect(screen.getByTestId('user-email')).toHaveTextContent('test@example.com')
    })
})

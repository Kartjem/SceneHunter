import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LoginForm } from '@/components/auth/LoginForm'
import { signInWithEmailAndPassword, signInWithPopup, UserCredential } from 'firebase/auth'

jest.mock('firebase/auth', () => ({
    signInWithEmailAndPassword: jest.fn(),
    signInWithPopup: jest.fn(),
    GoogleAuthProvider: jest.fn(),
}))

jest.mock('@/lib/firebase', () => ({
    auth: {},
}))

jest.mock('@/hooks/use-firebase', () => ({
    handleFirebaseError: jest.fn((error) => error.message || 'Unknown error'),
}))

const mockSignInWithEmailAndPassword = signInWithEmailAndPassword as jest.MockedFunction<typeof signInWithEmailAndPassword>
const mockSignInWithPopup = signInWithPopup as jest.MockedFunction<typeof signInWithPopup>

describe('LoginForm', () => {
    const mockOnSuccess = jest.fn()
    const mockOnError = jest.fn()

    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('renders with required fields', () => {
        render(<LoginForm />)

        expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /continue with google/i })).toBeInTheDocument()
    })

    it('displays validation errors for empty fields', async () => {
        const user = userEvent.setup()
        render(<LoginForm onError={mockOnError} />)

        const submitButton = screen.getByRole('button', { name: /sign in/i })
        await user.click(submitButton)

        expect(screen.getByText('Email is required')).toBeInTheDocument()
        expect(screen.getByText('Password is required')).toBeInTheDocument()
    })

    it('displays error for invalid email format', async () => {
        const user = userEvent.setup()
        render(<LoginForm onError={mockOnError} />)

        const emailInput = screen.getByLabelText(/email/i)
        const passwordInput = screen.getByLabelText(/password/i)
        const submitButton = screen.getByRole('button', { name: /sign in/i })

        await user.type(emailInput, 'invalid@email')
        await user.type(passwordInput, 'password123')

        await user.click(submitButton)

        await waitFor(() => {
            expect(screen.getByText('Email is invalid')).toBeInTheDocument()
        })
    })

    it('successfully submits form with valid data', async () => {
        const user = userEvent.setup()
        const mockUserCredential = { user: { uid: 'test-uid' } }
        mockSignInWithEmailAndPassword.mockResolvedValueOnce(mockUserCredential as any)

        render(<LoginForm onSuccess={mockOnSuccess} onError={mockOnError} />)

        const emailInput = screen.getByLabelText(/email/i)
        const passwordInput = screen.getByLabelText(/password/i)
        const submitButton = screen.getByRole('button', { name: /sign in/i })

        await user.type(emailInput, 'test@example.com')
        await user.type(passwordInput, 'password123')
        await user.click(submitButton)

        await waitFor(() => {
            expect(mockSignInWithEmailAndPassword).toHaveBeenCalledWith(
                {},
                'test@example.com',
                'password123'
            )
            expect(mockOnSuccess).toHaveBeenCalled()
        })
    })

    it('handles login errors', async () => {
        const user = userEvent.setup()
        const errorMessage = 'Invalid credentials'
        mockSignInWithEmailAndPassword.mockRejectedValueOnce(new Error(errorMessage))

        render(<LoginForm onSuccess={mockOnSuccess} onError={mockOnError} />)

        const emailInput = screen.getByLabelText(/email/i)
        const passwordInput = screen.getByLabelText(/password/i)
        const submitButton = screen.getByRole('button', { name: /sign in/i })

        await user.type(emailInput, 'test@example.com')
        await user.type(passwordInput, 'wrongpassword')
        await user.click(submitButton)

        await waitFor(() => {
            expect(mockOnError).toHaveBeenCalledWith(errorMessage)
        })
    })

    it('displays loading state during submission', async () => {
        const user = userEvent.setup()
        let resolvePromise: (value: any) => void
        const loginPromise = new Promise<UserCredential>((resolve) => {
            resolvePromise = resolve
        })
        mockSignInWithEmailAndPassword.mockReturnValueOnce(loginPromise)

        render(<LoginForm onSuccess={mockOnSuccess} onError={mockOnError} />)

        const emailInput = screen.getByLabelText(/email/i)
        const passwordInput = screen.getByLabelText(/password/i)
        const submitButton = screen.getByRole('button', { name: /sign in/i })

        await user.type(emailInput, 'test@example.com')
        await user.type(passwordInput, 'password123')
        await user.click(submitButton)

        expect(submitButton).toBeDisabled()

        resolvePromise!({ user: { uid: 'test-uid' } })

        await waitFor(() => {
            expect(submitButton).not.toBeDisabled()
        })
    })

    it('supports Google OAuth login', async () => {
        const user = userEvent.setup()
        const mockUserCredential = { user: { uid: 'google-uid' } }
        mockSignInWithPopup.mockResolvedValueOnce(mockUserCredential as any)

        render(<LoginForm onSuccess={mockOnSuccess} onError={mockOnError} />)

        const googleButton = screen.getByRole('button', { name: /continue with google/i })
        await user.click(googleButton)

        await waitFor(() => {
            expect(mockSignInWithPopup).toHaveBeenCalled()
            expect(mockOnSuccess).toHaveBeenCalled()
        })
    })
})
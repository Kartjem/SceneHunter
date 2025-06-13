import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SignupForm } from '@/components/auth/SignupForm'
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth'

jest.mock('firebase/auth', () => ({
    createUserWithEmailAndPassword: jest.fn(),
    signInWithPopup: jest.fn(),
    GoogleAuthProvider: jest.fn(),
}))

jest.mock('@/lib/firebase', () => ({
    auth: {},
}))

jest.mock('@/hooks/use-firebase', () => ({
    handleFirebaseError: jest.fn((error) => error.message || 'Unknown error'),
}))

const mockCreateUserWithEmailAndPassword = createUserWithEmailAndPassword as jest.MockedFunction<typeof createUserWithEmailAndPassword>
const mockSignInWithPopup = signInWithPopup as jest.MockedFunction<typeof signInWithPopup>

describe('SignupForm', () => {
    const mockOnSuccess = jest.fn()
    const mockOnError = jest.fn()

    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('renders with all required fields', () => {
        render(<SignupForm />)

        expect(screen.getByLabelText(/first name/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/last name/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /continue with google/i })).toBeInTheDocument()
    })

    it('displays validation errors for empty required fields', async () => {
        const user = userEvent.setup()
        render(<SignupForm onError={mockOnError} />)

        const submitButton = screen.getByRole('button', { name: /create account/i })
        await user.click(submitButton)

        await waitFor(() => {
            expect(screen.getByText('First name is required')).toBeInTheDocument()
            expect(screen.getByText('Last name is required')).toBeInTheDocument()
            expect(screen.getByText('Email is required')).toBeInTheDocument()
            expect(screen.getByText('Password is required')).toBeInTheDocument()
        })
    })

    it('successfully registers user with valid data', async () => {
        const user = userEvent.setup()
        const mockUserCredential = { user: { uid: 'test-uid' } }
        mockCreateUserWithEmailAndPassword.mockResolvedValueOnce(mockUserCredential as any)

        render(<SignupForm onSuccess={mockOnSuccess} onError={mockOnError} />)

        const firstNameInput = screen.getByLabelText(/first name/i)
        const lastNameInput = screen.getByLabelText(/last name/i)
        const emailInput = screen.getByLabelText(/email/i)
        const passwordInput = screen.getByLabelText(/^password$/i)
        const confirmPasswordInput = screen.getByLabelText(/confirm password/i)
        const submitButton = screen.getByRole('button', { name: /create account/i })

        await user.type(firstNameInput, 'John')
        await user.type(lastNameInput, 'Doe')
        await user.type(emailInput, 'john@example.com')
        await user.type(passwordInput, 'password123')
        await user.type(confirmPasswordInput, 'password123')
        await user.click(submitButton)

        await waitFor(() => {
            expect(mockCreateUserWithEmailAndPassword).toHaveBeenCalledWith(
                {},
                'john@example.com',
                'password123'
            )
            expect(mockOnSuccess).toHaveBeenCalled()
        })
    })
})
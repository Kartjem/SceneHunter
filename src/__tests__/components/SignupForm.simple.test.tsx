import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SignupForm } from '@/components/auth/SignupForm'

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

describe('SignupForm', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('renders with all fields', () => {
        render(<SignupForm />)

        expect(screen.getByLabelText(/first name/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/last name/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /continue with google/i })).toBeInTheDocument()
    })

    it('allows data input in fields', async () => {
        const user = userEvent.setup()
        render(<SignupForm />)

        const firstNameInput = screen.getByLabelText(/first name/i)
        const emailInput = screen.getByLabelText(/email/i)

        await user.type(firstNameInput, 'John')
        await user.type(emailInput, 'john@example.com')

        expect(firstNameInput).toHaveValue('John')
        expect(emailInput).toHaveValue('john@example.com')
    })
})
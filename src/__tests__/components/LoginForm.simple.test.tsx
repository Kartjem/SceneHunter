import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LoginForm } from '@/components/auth/LoginForm'

jest.mock('firebase/auth', () => ({
    signInWithEmailAndPassword: jest.fn(),
    signInWithPopup: jest.fn().mockResolvedValue({
        user: { uid: 'google-uid' }
    }),
    GoogleAuthProvider: jest.fn(),
}))

jest.mock('@/lib/firebase', () => ({
    auth: {},
}))

describe('LoginForm', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('renders with basic elements', () => {
        render(<LoginForm />)

        expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /continue with google/i })).toBeInTheDocument()
    })

    it('allows data input in fields', async () => {
        const user = userEvent.setup()
        render(<LoginForm />)

        const emailInput = screen.getByLabelText(/email/i)
        const passwordInput = screen.getByLabelText(/password/i)

        await user.type(emailInput, 'test@example.com')
        await user.type(passwordInput, 'password123')

        expect(emailInput).toHaveValue('test@example.com')
        expect(passwordInput).toHaveValue('password123')
    })
})
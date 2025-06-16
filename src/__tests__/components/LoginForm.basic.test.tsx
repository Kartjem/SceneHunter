import React from 'react'
import { render, screen } from '@testing-library/react'
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

describe('LoginForm - Basic Functionality', () => {
    it('renders without errors', () => {
        render(<LoginForm />)

        const emailInput = screen.getByLabelText(/email/i)
        const passwordInput = screen.getByLabelText(/password/i)
        const signInButton = screen.getByRole('button', { name: /sign in/i })
        const googleButton = screen.getByRole('button', { name: /continue with google/i })

        expect(emailInput).toBeTruthy()
        expect(passwordInput).toBeTruthy()
        expect(signInButton).toBeTruthy()
        expect(googleButton).toBeTruthy()
    })

    it('allows data input in fields', async () => {
        const user = userEvent.setup()
        render(<LoginForm />)

        const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement
        const passwordInput = screen.getByLabelText(/password/i) as HTMLInputElement

        await user.type(emailInput, 'test@example.com')
        await user.type(passwordInput, 'password123')

        expect(emailInput.value).toBe('test@example.com')
        expect(passwordInput.value).toBe('password123')
    })

    it('buttons are available for interaction', async () => {
        const user = userEvent.setup()
        render(<LoginForm />)

        const signInButton = screen.getByRole('button', { name: /sign in/i })
        const googleButton = screen.getByRole('button', { name: /continue with google/i })

        expect(signInButton).not.toHaveAttribute('disabled')
        expect(googleButton).not.toHaveAttribute('disabled')

        await user.click(signInButton)
        await user.click(googleButton)
    })
})
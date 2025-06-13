import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AuthPage from '@/app/auth/page'

const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: mockPush,
        replace: jest.fn(),
        prefetch: jest.fn(),
    }),
    useSearchParams: () => ({
        get: jest.fn(),
    }),
}))

jest.mock('firebase/auth', () => ({
    signInWithEmailAndPassword: jest.fn(),
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

describe('Auth Page Integration', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('renders with sign in and sign up buttons', () => {
        render(<AuthPage />)

        const signInButton = screen.getByRole('button', { name: 'Sign In' })
        const signUpButton = screen.getByRole('button', { name: 'Sign Up' })

        expect(signInButton).toBeDefined()
        expect(signUpButton).toBeDefined()

        const emailInput = screen.getByLabelText(/email/i)
        const passwordInput = screen.getByLabelText(/password/i)

        expect(emailInput).toBeDefined()
        expect(passwordInput).toBeDefined()

        const submitButtons = screen.getAllByRole('button')
        const signInSubmit = submitButtons.find(button =>
            button.textContent?.includes('Sign in') && button.getAttribute('type') === 'submit'
        )
        expect(signInSubmit).toBeDefined()
    })

    it('switches between sign in and sign up forms', async () => {
        const user = userEvent.setup()
        render(<AuthPage />)

        const firstNameInput = screen.queryByLabelText(/first name/i)
        expect(firstNameInput).toBeNull()

        const signUpButton = screen.getByRole('button', { name: 'Sign Up' })
        await user.click(signUpButton)

        await waitFor(() => {
            const firstNameInputAfter = screen.getByLabelText(/first name/i)
            expect(firstNameInputAfter).toBeDefined()
        })

        const lastNameInput = screen.getByLabelText(/last name/i)
        expect(lastNameInput).toBeDefined()

        const signInButton = screen.getByRole('button', { name: 'Sign In' })
        await user.click(signInButton)

        await waitFor(() => {
            const firstNameInputGone = screen.queryByLabelText(/first name/i)
            expect(firstNameInputGone).toBeNull()
        })
    })

    it('displays correct title and description', () => {
        render(<AuthPage />)

        const welcomeHeader = screen.getByText('Welcome Back')
        const description = screen.getByText(/sign in to your account/i)

        expect(welcomeHeader).toBeDefined()
        expect(description).toBeDefined()
    })

    it('updates title when switching between forms', async () => {
        const user = userEvent.setup()
        render(<AuthPage />)

        const welcomeBackHeader = screen.getByText('Welcome Back')
        expect(welcomeBackHeader).toBeDefined()

        const signUpButton = screen.getByRole('button', { name: 'Sign Up' })
        await user.click(signUpButton)

        await waitFor(() => {
            const joinHeader = screen.getByText('Join SceneHunter')
            expect(joinHeader).toBeDefined()
        })

        const createAccountText = screen.getByText(/create your account to get started/i)
        expect(createAccountText).toBeDefined()
    })

    it('correctly handles form interaction', async () => {
        const user = userEvent.setup()
        render(<AuthPage />)

        const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement
        const passwordInput = screen.getByLabelText(/password/i) as HTMLInputElement

        await user.type(emailInput, 'test@example.com')
        await user.type(passwordInput, 'password123')

        expect(emailInput.value).toBe('test@example.com')
        expect(passwordInput.value).toBe('password123')

        const submitButtons = screen.getAllByRole('button')
        const signInSubmit = submitButtons.find(button =>
            button.textContent?.includes('Sign in') && button.getAttribute('type') === 'submit'
        )
        expect(signInSubmit).toBeDefined()
        expect(signInSubmit?.hasAttribute('disabled')).toBe(false)
    })
})
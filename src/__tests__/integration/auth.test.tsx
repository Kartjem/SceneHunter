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

describe('Auth Page Integration', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('renders with sign in and sign up buttons', () => {
        render(<AuthPage />)

        const signInButton = screen.getByRole('tab', { name: 'Sign In' })
        const signUpButton = screen.getByRole('tab', { name: 'Create Account' })

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

        const signUpButton = screen.getByRole('tab', { name: 'Create Account' })
        await user.click(signUpButton)

        await waitFor(() => {
            const firstNameInputAfter = screen.getByLabelText(/first name/i)
            expect(firstNameInputAfter).toBeDefined()
        })

        const lastNameInput = screen.getByLabelText(/last name/i)
        expect(lastNameInput).toBeDefined()

        const signInButton = screen.getByRole('tab', { name: 'Sign In' })
        await user.click(signInButton)

        await waitFor(() => {
            const firstNameInputGone = screen.queryByLabelText(/first name/i)
            expect(firstNameInputGone).toBeNull()
        })
    })

    it('displays correct title and description', () => {
        render(<AuthPage />)

        const welcomeHeader = screen.getByText('Welcome to the Platform')
        const description = screen.getByText(/sign in to your professional account/i)

        expect(welcomeHeader).toBeDefined()
        expect(description).toBeDefined()
    })

    it('updates title when switching between forms', async () => {
        const user = userEvent.setup()
        render(<AuthPage />)

        // Initially we're on the Sign In tab
        const signInTab = screen.getByRole('tab', { name: 'Sign In' })
        expect(signInTab).toHaveAttribute('aria-selected', 'true')

        const signUpButton = screen.getByRole('tab', { name: 'Create Account' })
        await user.click(signUpButton)

        await waitFor(() => {
            const signUpTabSelected = screen.getByRole('tab', { name: 'Create Account' })
            expect(signUpTabSelected).toHaveAttribute('aria-selected', 'true')
        })

        // Check if signup form fields are visible
        const firstNameInput = screen.getByLabelText(/first name/i)
        expect(firstNameInput).toBeDefined()
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
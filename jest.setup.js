import '@testing-library/jest-dom'

// Mock Firebase App Check
jest.mock('firebase/app-check', () => ({
    initializeAppCheck: jest.fn(),
    ReCaptchaEnterpriseProvider: jest.fn(),
}))

// Mock Firebase modules
jest.mock('firebase/app', () => ({
    initializeApp: jest.fn(() => ({})),
}))

jest.mock('firebase/auth', () => ({
    getAuth: jest.fn(() => ({})),
    signInWithEmailAndPassword: jest.fn(),
    signInWithPopup: jest.fn(),
    signInWithRedirect: jest.fn(),
    getRedirectResult: jest.fn(() => Promise.resolve(null)),
    GoogleAuthProvider: jest.fn(),
    onAuthStateChanged: jest.fn(),
    signOut: jest.fn(),
}))

jest.mock('firebase/firestore', () => ({
    getFirestore: jest.fn(() => ({})),
    doc: jest.fn(),
    setDoc: jest.fn(),
    getDoc: jest.fn(),
    updateDoc: jest.fn(),
    serverTimestamp: jest.fn(() => ({ serverTimestamp: true })),
    collection: jest.fn(),
    addDoc: jest.fn(),
}))

// Mock Zustand
jest.mock('zustand', () => ({
    create: jest.fn(() => jest.fn()),
}))

// Mock Zustand persist middleware
jest.mock('zustand/middleware', () => ({
    persist: (config) => config,
}))

// Mock Auth Store
jest.mock('@/stores/authStore', () => ({
    useAuthStore: jest.fn(() => ({
        user: null,
        userProfile: null,
        isLoading: false,
        isAuthenticated: false,
        setUser: jest.fn(),
        setUserProfile: jest.fn(),
        setLoading: jest.fn(),
        logout: jest.fn(),
        updateProfile: jest.fn(),
    })),
}));

// Mock React Query
jest.mock('@tanstack/react-query', () => ({
    useQuery: jest.fn(() => ({
        data: null,
        isLoading: false,
        error: null,
    })),
    useMutation: jest.fn(() => ({
        mutate: jest.fn(),
        mutateAsync: jest.fn(),
        isPending: false,
    })),
    useQueryClient: jest.fn(() => ({
        setQueryData: jest.fn(),
        invalidateQueries: jest.fn(),
    })),
    QueryClient: jest.fn(),
    QueryClientProvider: ({ children }) => children,
}));

// Mock Auth Provider
jest.mock('@/providers/AuthProvider', () => ({
    useAuth: jest.fn(() => ({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        signInWithGoogle: jest.fn(),
        signInWithEmail: jest.fn(),
        signUp: jest.fn(),
        signOut: jest.fn(),
    })),
    AuthProvider: ({ children }) => children,
}));

// Mock UserProfile hooks
jest.mock('@/hooks/useUserProfile', () => ({
    useUserProfile: jest.fn(() => ({
        data: null,
        isLoading: false,
        error: null,
    })),
    useCreateUserProfile: jest.fn(() => ({
        mutate: jest.fn(),
        isPending: false,
    })),
}));

// Mock use-firebase hook
jest.mock('@/hooks/use-firebase', () => ({
    useFirebaseAuth: jest.fn(() => ({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        userProfile: null,
        isProfileLoading: false,
        profileError: null,
        createUserProfile: jest.fn(),
        isCreatingProfile: false,
        signInWithGoogle: jest.fn(),
        signInWithEmail: jest.fn(),
        signUp: jest.fn(),
        signOut: jest.fn(),
    })),
    handleFirebaseError: jest.fn((error) => error.message || 'Unknown error'),
}));

// Mock Toast components
jest.mock('@/components/ui/toast', () => ({
    useToast: jest.fn(() => ({
        showToast: jest.fn(),
    })),
    ToastProvider: ({ children }) => children,
    Toast: jest.fn(() => null),
}));

jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: jest.fn(),
        replace: jest.fn(),
        prefetch: jest.fn(),
    }),
    useSearchParams: () => ({
        get: jest.fn(),
    }),
    usePathname: () => '/test',
}))

Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
})

const originalError = console.error
beforeAll(() => {
    console.error = (...args) => {
        if (
            typeof args[0] === 'string' && (
                args[0].includes('Warning:') ||
                args[0].includes('Login error:') ||
                args[0].includes('Google sign-in error:') ||
                args[0].includes('Invalid credentials') ||
                args[0].includes('Error creating user:')
            )
        ) {
            return
        }
        originalError.call(console, ...args)
    }
})

afterAll(() => {
    console.error = originalError
})

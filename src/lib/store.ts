/**
 * Zustand store for global application state
 */
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { User } from 'firebase/auth'

// User authentication state
interface AuthState {
    user: User | null
    isLoading: boolean
    isAuthenticated: boolean
    setUser: (user: User | null) => void
    setLoading: (loading: boolean) => void
    logout: () => void
}

// Application UI state
interface UIState {
    sidebarOpen: boolean
    mapView: 'hybrid' | 'satellite' | 'terrain' | 'roadmap'
    searchQuery: string
    selectedLocation: any | null
    setSidebarOpen: (open: boolean) => void
    setMapView: (view: 'hybrid' | 'satellite' | 'terrain' | 'roadmap') => void
    setSearchQuery: (query: string) => void
    setSelectedLocation: (location: any | null) => void
}

// Movies and locations state
interface ContentState {
    favoriteMovies: string[]
    favoriteLocations: string[]
    recentSearches: string[]
    addFavoriteMovie: (movieId: string) => void
    removeFavoriteMovie: (movieId: string) => void
    addFavoriteLocation: (locationId: string) => void
    removeFavoriteLocation: (locationId: string) => void
    addRecentSearch: (search: string) => void
    clearRecentSearches: () => void
}

// Auth store
export const useAuthStore = create<AuthState>()(
    devtools(
        persist(
            (set) => ({
                user: null,
                isLoading: true,
                isAuthenticated: false,
                setUser: (user) =>
                    set({
                        user,
                        isAuthenticated: !!user,
                        isLoading: false
                    }),
                setLoading: (loading) => set({ isLoading: loading }),
                logout: () =>
                    set({
                        user: null,
                        isAuthenticated: false,
                        isLoading: false
                    }),
            }),
            {
                name: 'auth-storage',
                partialize: (state) => ({
                    user: state.user,
                    isAuthenticated: state.isAuthenticated
                }),
            }
        ),
        { name: 'auth-store' }
    )
)

// UI store
export const useUIStore = create<UIState>()(
    devtools(
        persist(
            (set) => ({
                sidebarOpen: false,
                mapView: 'hybrid',
                searchQuery: '',
                selectedLocation: null,
                setSidebarOpen: (open) => set({ sidebarOpen: open }),
                setMapView: (view) => set({ mapView: view }),
                setSearchQuery: (query) => set({ searchQuery: query }),
                setSelectedLocation: (location) => set({ selectedLocation: location }),
            }),
            {
                name: 'ui-storage',
                partialize: (state) => ({
                    mapView: state.mapView,
                    sidebarOpen: state.sidebarOpen
                }),
            }
        ),
        { name: 'ui-store' }
    )
)

// Content store
export const useContentStore = create<ContentState>()(
    devtools(
        persist(
            (set, get) => ({
                favoriteMovies: [],
                favoriteLocations: [],
                recentSearches: [],
                addFavoriteMovie: (movieId) =>
                    set((state) => ({
                        favoriteMovies: [...new Set([...state.favoriteMovies, movieId])]
                    })),
                removeFavoriteMovie: (movieId) =>
                    set((state) => ({
                        favoriteMovies: state.favoriteMovies.filter(id => id !== movieId)
                    })),
                addFavoriteLocation: (locationId) =>
                    set((state) => ({
                        favoriteLocations: [...new Set([...state.favoriteLocations, locationId])]
                    })),
                removeFavoriteLocation: (locationId) =>
                    set((state) => ({
                        favoriteLocations: state.favoriteLocations.filter(id => id !== locationId)
                    })),
                addRecentSearch: (search) =>
                    set((state) => ({
                        recentSearches: [
                            search,
                            ...state.recentSearches.filter(s => s !== search)
                        ].slice(0, 10) // Keep only last 10 searches
                    })),
                clearRecentSearches: () => set({ recentSearches: [] }),
            }),
            {
                name: 'content-storage',
            }
        ),
        { name: 'content-store' }
    )
)

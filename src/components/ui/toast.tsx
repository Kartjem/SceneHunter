"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface ToastProps {
    message: string
    type?: 'success' | 'error' | 'warning' | 'info'
    duration?: number
    onClose?: () => void
}

export function Toast({ message, type = 'info', duration = 4000, onClose }: ToastProps) {
    const [isVisible, setIsVisible] = React.useState(true)

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false)
            setTimeout(() => onClose?.(), 300) // Wait for animation
        }, duration)

        return () => clearTimeout(timer)
    }, [duration, onClose])

    const handleClose = () => {
        setIsVisible(false)
        setTimeout(() => onClose?.(), 300)
    }

    const typeStyles = {
        success: 'bg-green-500/90 text-white',
        error: 'bg-red-500/90 text-white',
        warning: 'bg-yellow-500/90 text-white',
        info: 'bg-blue-500/90 text-white'
    }

    return (
        <div
            className={cn(
                "fixed top-4 right-4 z-50 min-w-[300px] max-w-[500px] p-4 rounded-xl shadow-lg backdrop-blur-md border transition-all duration-300 ease-in-out",
                typeStyles[type],
                isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full"
            )}
        >
            <div className="flex items-start justify-between">
                <p className="text-sm font-medium pr-4">{message}</p>
                <button
                    onClick={handleClose}
                    className="text-white/70 hover:text-white transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    )
}

interface ToastContextType {
    showToast: (message: string, type?: ToastProps['type']) => void
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = React.useState<Array<{ id: string; message: string; type: ToastProps['type'] }>>([])

    const showToast = React.useCallback((message: string, type: ToastProps['type'] = 'info') => {
        const id = Math.random().toString(36).substr(2, 9)
        setToasts(prev => [...prev, { id, message, type }])
    }, [])

    const removeToast = React.useCallback((id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id))
    }, [])

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {toasts.map(toast => (
                <Toast
                    key={toast.id}
                    message={toast.message}
                    type={toast.type}
                    onClose={() => removeToast(toast.id)}
                />
            ))}
        </ToastContext.Provider>
    )
}

export function useToast() {
    const context = React.useContext(ToastContext)
    if (context === undefined) {
        throw new Error('useToast must be used within a ToastProvider')
    }
    return context
}

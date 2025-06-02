"use client";

import React, { useState } from "react";
import { SignupForm } from "@/components/auth/SignupForm";
import { LoginForm } from "@/components/auth/LoginForm";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState<string>("");
    const [success, setSuccess] = useState<string>("");
    const router = useRouter();

    const handleSuccess = () => {
        setError("");
        setSuccess(isLogin ? "Successfully logged in!" : "Account created successfully!");

        // Redirect to home page after successful auth
        setTimeout(() => {
            router.push("/");
        }, 1500);
    };

    const handleError = (errorMessage: string) => {
        setSuccess("");
        setError(errorMessage);
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setError("");
        setSuccess("");
    };

    return (
        <div className="min-h-screen bg-background relative overflow-hidden">
            {/* Apple-style gradient mesh background */}
            <div className="absolute inset-0 bg-apple-mesh dark:bg-apple-mesh-dark" />

            {/* Floating gradient orbs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-apple-purple opacity-10 rounded-full blur-3xl floating" />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-apple-blue opacity-15 rounded-full blur-3xl floating-delayed" />
            <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-apple-green opacity-8 rounded-full blur-2xl floating" style={{ animationDelay: '-3s' }} />

            {/* Glass navigation */}
            <div className="absolute top-6 left-6 z-10">
                <button
                    onClick={() => router.push("/")}
                    className="glass rounded-xl px-4 py-2 flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-all duration-300 hover:bg-background/30"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span className="text-sm font-medium">Back to Home</span>
                </button>
            </div>

            {/* Theme toggle */}
            <div className="absolute top-6 right-6 z-10">
                <ThemeToggle />
            </div>

            {/* Main content */}
            <div className="flex items-center justify-center min-h-screen p-4">
                <div className="w-full max-w-md relative z-10">
                    {/* Glass container */}
                    <div className="glass rounded-3xl p-8 shadow-2xl">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold mb-2">
                                <span className="bg-apple-blue bg-clip-text text-transparent">
                                    {isLogin ? 'Welcome Back' : 'Join SceneHunter'}
                                </span>
                            </h1>
                            <p className="text-muted-foreground">
                                {isLogin ? 'Sign in to your account' : 'Create your account to get started'}
                            </p>
                        </div>

                        {/* Tab switching */}
                        <div className="mb-8">
                            <div className="glass rounded-2xl p-1">
                                <div className="grid grid-cols-2 gap-1">
                                    <button
                                        onClick={() => setIsLogin(true)}
                                        className={`text-sm font-medium rounded-xl px-4 py-3 transition-all duration-300 ${isLogin
                                                ? 'bg-apple-blue text-white shadow-lg'
                                                : 'text-muted-foreground hover:text-foreground hover:bg-background/30'
                                            }`}
                                    >
                                        Sign In
                                    </button>
                                    <button
                                        onClick={() => setIsLogin(false)}
                                        className={`text-sm font-medium rounded-xl px-4 py-3 transition-all duration-300 ${!isLogin
                                                ? 'bg-apple-blue text-white shadow-lg'
                                                : 'text-muted-foreground hover:text-foreground hover:bg-background/30'
                                            }`}
                                    >
                                        Sign Up
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Error/Success Messages */}
                        {error && (
                            <div className="mb-6 p-4 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm animate-slide-in-from-top">
                                <div className="flex items-center space-x-3">
                                    <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </div>
                                    <span>{error}</span>
                                </div>
                            </div>
                        )}

                        {success && (
                            <div className="mb-6 p-4 rounded-2xl bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 text-sm animate-slide-in-from-top">
                                <div className="flex items-center space-x-3">
                                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span>{success}</span>
                                </div>
                            </div>
                        )}

                        {/* Auth Form with animation */}
                        <div className="animate-fade-in-up">
                            {isLogin ? (
                                <LoginForm
                                    onSuccess={handleSuccess}
                                    onError={handleError}
                                />
                            ) : (
                                <SignupForm
                                    onSuccess={handleSuccess}
                                    onError={handleError}
                                />
                            )}
                        </div>
                    </div>

                    {/* Additional info */}
                    <div className="text-center mt-6">
                        <p className="text-xs text-muted-foreground">
                            By continuing, you agree to our{' '}
                            <a href="#" className="text-apple-blue hover:underline">Terms of Service</a>
                            {' '}and{' '}
                            <a href="#" className="text-apple-blue hover:underline">Privacy Policy</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
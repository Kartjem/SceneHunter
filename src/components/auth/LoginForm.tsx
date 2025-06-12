"use client";

import React, { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import {
    IconBrandGoogle,
} from "@tabler/icons-react";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { handleFirebaseError } from "@/hooks/use-firebase";

interface LoginFormProps {
    onSuccess?: () => void;
    onError?: (error: string) => void;
}

export function LoginForm({ onSuccess, onError }: LoginFormProps) {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email is invalid";
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            const userCredential = await signInWithEmailAndPassword(
                auth,
                formData.email,
                formData.password
            );

            console.log("User logged in successfully:", userCredential.user);
            onSuccess?.();
        } catch (error: unknown) {
            console.error("Login error:", error);
            const errorMessage = handleFirebaseError(error);
            onError?.(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setIsLoading(true);

        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            console.log("Google sign-in successful:", result.user);
            onSuccess?.();
        } catch (error: unknown) {
            console.error("Google sign-in error:", error);
            const errorMessage = handleFirebaseError(error);
            onError?.(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ""
            }));
        }
    };

    return (
        <div className="w-full">
            <form className="space-y-6" onSubmit={handleSubmit}>
                <LabelInputContainer>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                        id="email"
                        name="email"
                        placeholder="john.doe@example.com"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={isLoading}
                        className="glass border-0 bg-background/50 focus:bg-background/70 transition-all duration-300"
                    />
                    {errors.email && <span className="text-red-500 text-xs">{errors.email}</span>}
                </LabelInputContainer>

                <LabelInputContainer>
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        name="password"
                        placeholder="••••••••"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        disabled={isLoading}
                        className="glass border-0 bg-background/50 focus:bg-background/70 transition-all duration-300"
                    />
                    {errors.password && <span className="text-red-500 text-xs">{errors.password}</span>}
                </LabelInputContainer>

                <button
                    className="w-full h-12 bg-apple-blue text-white rounded-2xl font-medium hover:bg-apple-blue/90 transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 group relative overflow-hidden"
                    type="submit"
                    disabled={isLoading}
                >
                    <div className="absolute inset-0 bg-apple-blue opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="relative z-10 flex items-center justify-center">
                        {isLoading ? (
                            <>
                                <svg className="w-5 h-5 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Signing in...
                            </>
                        ) : (
                            <>
                                Sign in
                                <svg className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </>
                        )}
                    </span>
                </button>

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-border/30" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-4 text-muted-foreground bg-background/80">or</span>
                    </div>
                </div>

                <button
                    className="w-full h-12 glass rounded-2xl font-medium text-foreground hover:bg-background/30 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 group relative overflow-hidden"
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                >
                    <span className="flex items-center justify-center">
                        <IconBrandGoogle className="h-5 w-5 mr-3" />
                        Continue with Google
                    </span>
                </button>

                <div className="text-center">
                    <a href="#" className="text-sm text-apple-blue hover:underline">
                        Forgot your password?
                    </a>
                </div>
            </form>
        </div>
    );
}

const LabelInputContainer = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) => {
    return (
        <div className={cn("flex w-full flex-col space-y-2", className)}>
            {children}
        </div>
    );
};

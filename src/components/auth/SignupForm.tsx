"use client";

import React, { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { IconBrandGoogle } from "@tabler/icons-react";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { handleFirebaseError } from "@/hooks/use-firebase";

interface SignupFormProps {
    onSuccess?: () => void;
    onError?: (error: string) => void;
}

export function SignupForm({ onSuccess, onError }: SignupFormProps) {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.firstName.trim()) {
            newErrors.firstName = "First name is required";
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = "Last name is required";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email is invalid";
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
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
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                formData.email,
                formData.password
            );

            console.log("User created successfully:", userCredential.user);
            onSuccess?.();
        } catch (error: unknown) {
            console.error("Registration error:", error);
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
        <div className="w-full max-w-md mx-auto">
            <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4">
                    <LabelInputContainer>
                        <Label
                            htmlFor="firstName"
                            className="text-sm font-medium text-foreground/80 mb-1.5"
                        >
                            First Name
                        </Label>
                        <Input
                            id="firstName"
                            name="firstName"
                            placeholder="John"
                            type="text"
                            value={formData.firstName}
                            onChange={handleChange}
                            disabled={isLoading}
                            className={cn(
                                "h-12 glass border-0 bg-white/10 backdrop-blur-xl rounded-xl",
                                "text-foreground placeholder:text-foreground/50",
                                "focus:bg-white/20 focus:ring-2 focus:ring-apple-blue/30",
                                "transition-all duration-300 hover:bg-white/15",
                                errors.firstName && "ring-2 ring-red-400/50"
                            )}
                        />
                        {errors.firstName && (
                            <span className="text-red-400 text-xs font-medium mt-1">
                                {errors.firstName}
                            </span>
                        )}
                    </LabelInputContainer>

                    <LabelInputContainer>
                        <Label
                            htmlFor="lastName"
                            className="text-sm font-medium text-foreground/80 mb-1.5"
                        >
                            Last Name
                        </Label>
                        <Input
                            id="lastName"
                            name="lastName"
                            placeholder="Doe"
                            type="text"
                            value={formData.lastName}
                            onChange={handleChange}
                            disabled={isLoading}
                            className={cn(
                                "h-12 glass border-0 bg-white/10 backdrop-blur-xl rounded-xl",
                                "text-foreground placeholder:text-foreground/50",
                                "focus:bg-white/20 focus:ring-2 focus:ring-apple-blue/30",
                                "transition-all duration-300 hover:bg-white/15",
                                errors.lastName && "ring-2 ring-red-400/50"
                            )}
                        />
                        {errors.lastName && (
                            <span className="text-red-400 text-xs font-medium mt-1">
                                {errors.lastName}
                            </span>
                        )}
                    </LabelInputContainer>
                </div>

                <LabelInputContainer>
                    <Label
                        htmlFor="email"
                        className="text-sm font-medium text-foreground/80 mb-1.5"
                    >
                        Email Address
                    </Label>
                    <Input
                        id="email"
                        name="email"
                        placeholder="john.doe@example.com"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={isLoading}
                        className={cn(
                            "h-12 glass border-0 bg-white/10 backdrop-blur-xl rounded-xl",
                            "text-foreground placeholder:text-foreground/50",
                            "focus:bg-white/20 focus:ring-2 focus:ring-apple-blue/30",
                            "transition-all duration-300 hover:bg-white/15",
                            errors.email && "ring-2 ring-red-400/50"
                        )}
                    />
                    {errors.email && (
                        <span className="text-red-400 text-xs font-medium mt-1">
                            {errors.email}
                        </span>
                    )}
                </LabelInputContainer>

                <LabelInputContainer>
                    <Label
                        htmlFor="password"
                        className="text-sm font-medium text-foreground/80 mb-1.5"
                    >
                        Password
                    </Label>
                    <Input
                        id="password"
                        name="password"
                        placeholder="••••••••"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        disabled={isLoading}
                        className={cn(
                            "h-12 glass border-0 bg-white/10 backdrop-blur-xl rounded-xl",
                            "text-foreground placeholder:text-foreground/50",
                            "focus:bg-white/20 focus:ring-2 focus:ring-apple-blue/30",
                            "transition-all duration-300 hover:bg-white/15",
                            errors.password && "ring-2 ring-red-400/50"
                        )}
                    />
                    {errors.password && (
                        <span className="text-red-400 text-xs font-medium mt-1">
                            {errors.password}
                        </span>
                    )}
                </LabelInputContainer>

                <LabelInputContainer>
                    <Label
                        htmlFor="confirmPassword"
                        className="text-sm font-medium text-foreground/80 mb-1.5"
                    >
                        Confirm Password
                    </Label>
                    <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        placeholder="••••••••"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        disabled={isLoading}
                        className={cn(
                            "h-12 glass border-0 bg-white/10 backdrop-blur-xl rounded-xl",
                            "text-foreground placeholder:text-foreground/50",
                            "focus:bg-white/20 focus:ring-2 focus:ring-apple-blue/30",
                            "transition-all duration-300 hover:bg-white/15",
                            errors.confirmPassword && "ring-2 ring-red-400/50"
                        )}
                    />
                    {errors.confirmPassword && (
                        <span className="text-red-400 text-xs font-medium mt-1">
                            {errors.confirmPassword}
                        </span>
                    )}
                </LabelInputContainer>

                <button
                    className={cn(
                        "w-full h-12 bg-gradient-to-r from-apple-blue to-blue-500",
                        "text-white rounded-xl font-semibold",
                        "hover:shadow-lg hover:shadow-apple-blue/25",
                        "transition-all duration-300 hover:scale-[1.02]",
                        "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
                        "group relative overflow-hidden",
                        "active:scale-[0.98]"
                    )}
                    type="submit"
                    disabled={isLoading}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-apple-blue opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="relative z-10 flex items-center justify-center">
                        {isLoading ? (
                            <>
                                <div className="w-5 h-5 mr-2">
                                    <div className="w-full h-full border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                </div>
                                Creating Account...
                            </>
                        ) : (
                            <>
                                Create Account
                                <svg
                                    className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                                    />
                                </svg>
                            </>
                        )}
                    </span>
                </button>

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/20" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-4 text-foreground/60 bg-background/80 glass rounded-full">
                            or
                        </span>
                    </div>
                </div>

                <button
                    className={cn(
                        "w-full h-12 glass rounded-xl font-medium",
                        "text-foreground bg-white/10 backdrop-blur-xl",
                        "hover:bg-white/20 border border-white/20",
                        "transition-all duration-300 hover:scale-[1.02]",
                        "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
                        "group relative overflow-hidden",
                        "active:scale-[0.98]"
                    )}
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                >
                    <span className="flex items-center justify-center">
                        <IconBrandGoogle className="h-5 w-5 mr-3" />
                        Continue with Google
                    </span>
                </button>
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
        <div className={cn("flex w-full flex-col space-y-1", className)}>
            {children}
        </div>
    );
};

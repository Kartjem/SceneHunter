"use client";

import React, { useState } from "react";
import { SignupForm } from "@/components/auth/SignupForm";
import { LoginForm } from "@/components/auth/LoginForm";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Film, ArrowLeft, Shield, Users, Award, Building, Camera, BarChart3 } from "lucide-react";

export default function AuthPage() {
    const [error, setError] = useState<string>("");
    const [success, setSuccess] = useState<string>("");
    const router = useRouter();

    const handleSuccess = () => {
        setError("");
        setSuccess("Success! Redirecting to dashboard...");

        setTimeout(() => {
            router.push("/dashboard");
        }, 1500);
    };

    const handleError = (errorMessage: string) => {
        setSuccess("");
        setError(errorMessage);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
            {/* Navigation */}
            <div className="absolute top-6 left-6 z-10">
                <Button
                    variant="ghost"
                    onClick={() => router.push("/")}
                    className="gap-2"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Home
                </Button>
            </div>

            <div className="absolute top-6 right-6 z-10">
                <ThemeToggle />
            </div>

            <div className="flex min-h-screen">
                {/* Left side - Features */}
                <div className="hidden lg:flex lg:w-1/2 flex-col justify-center p-12 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
                    <div className="max-w-md">
                        <div className="flex items-center gap-3 mb-8">
                            <Film className="h-10 w-10" />
                            <h1 className="text-3xl font-bold">SceneHunter</h1>
                        </div>

                        <h2 className="text-4xl font-bold mb-6">
                            Professional Film Production Platform
                        </h2>

                        <p className="text-xl text-blue-100 mb-12">
                            Streamline your film projects with enterprise-grade tools for professionals, organizations, and funding bodies.
                        </p>

                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 bg-white/20 rounded-lg flex items-center justify-center">
                                    <Shield className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">Enterprise Security</h3>
                                    <p className="text-blue-100 text-sm">Bank-grade security with compliance standards</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 bg-white/20 rounded-lg flex items-center justify-center">
                                    <Building className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">Professional Network</h3>
                                    <p className="text-blue-100 text-sm">Connect with verified film industry professionals</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 bg-white/20 rounded-lg flex items-center justify-center">
                                    <BarChart3 className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">Advanced Analytics</h3>
                                    <p className="text-blue-100 text-sm">Data-driven insights for your productions</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right side - Auth forms */}
                <div className="flex-1 flex items-center justify-center p-6">
                    <div className="w-full max-w-md">
                        <Card className="shadow-xl border-0 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl">
                            <CardHeader className="text-center">
                                <div className="flex items-center justify-center gap-2 mb-4 lg:hidden">
                                    <Film className="h-8 w-8 text-blue-600" />
                                    <span className="text-2xl font-bold">SceneHunter Pro</span>
                                </div>
                                <CardTitle className="text-2xl">Welcome to the Platform</CardTitle>
                                <CardDescription>
                                    Sign in to your professional account or create one to get started
                                </CardDescription>
                            </CardHeader>

                            <CardContent>
                                <Tabs defaultValue="login" className="w-full">
                                    <TabsList className="grid w-full grid-cols-2 mb-6">
                                        <TabsTrigger value="login">Sign In</TabsTrigger>
                                        <TabsTrigger value="signup">Create Account</TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="login" className="space-y-4">
                                        <LoginForm
                                            onSuccess={handleSuccess}
                                            onError={handleError}
                                        />
                                    </TabsContent>

                                    <TabsContent value="signup" className="space-y-4">
                                        <SignupForm
                                            onSuccess={handleSuccess}
                                            onError={handleError}
                                        />
                                    </TabsContent>
                                </Tabs>

                                {/* Status messages */}
                                {error && (
                                    <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-200 text-sm">
                                        {error}
                                    </div>
                                )}

                                {success && (
                                    <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/50 border border-green-200 dark:border-green-800 rounded-lg text-green-800 dark:text-green-200 text-sm">
                                        {success}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <p className="text-center text-sm text-slate-600 dark:text-slate-400 mt-6">
                            By continuing, you agree to our{" "}
                            <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>
                            {" "}and{" "}
                            <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
"use client";

import React from "react";
import { useFirebaseAuth } from "@/hooks/use-firebase";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Film,
    Users,
    Search,
    Calendar,
    Award,
    Shield,
    Settings,
    HelpCircle,
    LogOut,
    Camera,
    Building,
    BarChart3,
    FileText,
    MapPin,
    Cloud,
    Zap,
    Star,
    CheckCircle,
    Clock,
    Target,
    Rocket,
    Globe
} from "lucide-react";

export default function DashboardPage() {
    const { user, isAuthenticated, isLoading } = useFirebaseAuth();
    const router = useRouter();

    // Redirect to auth if not authenticated
    React.useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push("/auth");
        }
    }, [isAuthenticated, isLoading, router]);

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            router.push("/");
        } catch (error) {
            console.error("Sign out error:", error);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-slate-600 dark:text-slate-400">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated || !user) {
        return null; // Will redirect in useEffect
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
            {/* Top Navigation */}
            <nav className="sticky top-0 z-50 w-full border-b border-slate-200/50 dark:border-slate-800/50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <div className="flex items-center space-x-2">
                            <Film className="h-8 w-8 text-blue-600" />
                            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                SceneHunter
                            </span>
                        </div>

                        {/* Right side */}
                        <div className="flex items-center space-x-4">
                            <ThemeToggle />

                            {/* User Menu */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage src={user.photoURL || ""} alt={user.displayName || "User"} />
                                            <AvatarFallback>
                                                {user.displayName?.charAt(0) || user.email?.charAt(0) || "U"}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="end" forceMount>
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none">
                                                {user.displayName || "User"}
                                            </p>
                                            <p className="text-xs leading-none text-muted-foreground">
                                                {user.email}
                                            </p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                        <Settings className="mr-2 h-4 w-4" />
                                        Settings
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <HelpCircle className="mr-2 h-4 w-4" />
                                        Support
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                                        <LogOut className="mr-2 h-4 w-4" />
                                        Sign out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                {/* Welcome Hero Section */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                            <Rocket className="h-8 w-8 text-white" />
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Welcome to the Future of Film Production!
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-8">
                        Hello {user.displayName || user.email}! You're now part of SceneHunter Pro -
                        a revolutionary cloud-native platform designed specifically for film industry professionals.
                    </p>
                    <Badge variant="secondary" className="text-base px-4 py-2">
                        <Clock className="h-4 w-4 mr-2" />
                        Platform in Active Development
                    </Badge>
                </div>

                {/* Platform Vision */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-2xl">
                            <Target className="h-7 w-7 text-blue-600" />
                            Our Vision & Mission
                        </CardTitle>
                        <CardDescription className="text-lg">
                            Transforming the film industry through technology and innovation
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold text-blue-600">What We're Building</h3>
                                <p className="text-slate-600 dark:text-slate-400">
                                    A comprehensive cloud-native platform that connects film professionals,
                                    organizations, and funding bodies. We're creating an ecosystem where
                                    every aspect of film production - from location scouting to rebate
                                    applications - can be managed efficiently and professionally.
                                </p>
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold text-purple-600">Why It Matters</h3>
                                <p className="text-slate-600 dark:text-slate-400">
                                    The film industry needs modern tools that match its creative ambitions.
                                    By leveraging cutting-edge technology like AI, cloud computing, and
                                    advanced analytics, we're making film production more accessible,
                                    efficient, and sustainable.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Platform Features */}
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-center mb-8">Coming Soon: Revolutionary Features</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <Card className="border-2 border-blue-200 dark:border-blue-800">
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <Search className="h-8 w-8 text-blue-600" />
                                    <CardTitle>AI-Powered Search</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-slate-600 dark:text-slate-400 mb-4">
                                    Advanced semantic and visual search capabilities powered by AI
                                </p>
                                <div className="space-y-2">
                                    <div className="flex items-center text-sm">
                                        <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                                        Semantic location matching
                                    </div>
                                    <div className="flex items-center text-sm">
                                        <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                                        Visual similarity detection
                                    </div>
                                    <div className="flex items-center text-sm">
                                        <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                                        Natural language queries
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-2 border-purple-200 dark:border-purple-800">
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <FileText className="h-8 w-8 text-purple-600" />
                                    <CardTitle>Smart Applications</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-slate-600 dark:text-slate-400 mb-4">
                                    Automated application workflows with AI assistance
                                </p>
                                <div className="space-y-2">
                                    <div className="flex items-center text-sm">
                                        <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                                        Automated rebate submissions
                                    </div>
                                    <div className="flex items-center text-sm">
                                        <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                                        Real-time status tracking
                                    </div>
                                    <div className="flex items-center text-sm">
                                        <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                                        Smart form completion
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-2 border-green-200 dark:border-green-800">
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <Shield className="h-8 w-8 text-green-600" />
                                    <CardTitle>Enterprise Security</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-slate-600 dark:text-slate-400 mb-4">
                                    Bank-grade security with full compliance standards
                                </p>
                                <div className="space-y-2">
                                    <div className="flex items-center text-sm">
                                        <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                                        GDPR & CCPA compliant
                                    </div>
                                    <div className="flex items-center text-sm">
                                        <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                                        Role-based access control
                                    </div>
                                    <div className="flex items-center text-sm">
                                        <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                                        End-to-end encryption
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-2 border-orange-200 dark:border-orange-800">
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <BarChart3 className="h-8 w-8 text-orange-600" />
                                    <CardTitle>Advanced Analytics</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-slate-600 dark:text-slate-400 mb-4">
                                    Data-driven insights for better decision making
                                </p>
                                <div className="space-y-2">
                                    <div className="flex items-center text-sm">
                                        <Clock className="h-4 w-4 text-orange-600 mr-2" />
                                        Real-time dashboards
                                    </div>
                                    <div className="flex items-center text-sm">
                                        <Clock className="h-4 w-4 text-orange-600 mr-2" />
                                        Predictive modeling
                                    </div>
                                    <div className="flex items-center text-sm">
                                        <Clock className="h-4 w-4 text-orange-600 mr-2" />
                                        Performance metrics
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-2 border-teal-200 dark:border-teal-800">
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <Globe className="h-8 w-8 text-teal-600" />
                                    <CardTitle>Global Network</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-slate-600 dark:text-slate-400 mb-4">
                                    Connect with professionals and locations worldwide
                                </p>
                                <div className="space-y-2">
                                    <div className="flex items-center text-sm">
                                        <Clock className="h-4 w-4 text-teal-600 mr-2" />
                                        Professional networking
                                    </div>
                                    <div className="flex items-center text-sm">
                                        <Clock className="h-4 w-4 text-teal-600 mr-2" />
                                        Location marketplace
                                    </div>
                                    <div className="flex items-center text-sm">
                                        <Clock className="h-4 w-4 text-teal-600 mr-2" />
                                        Global collaboration
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-2 border-red-200 dark:border-red-800">
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <Cloud className="h-8 w-8 text-red-600" />
                                    <CardTitle>Cloud Infrastructure</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-slate-600 dark:text-slate-400 mb-4">
                                    Scalable, reliable cloud-native architecture
                                </p>
                                <div className="space-y-2">
                                    <div className="flex items-center text-sm">
                                        <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                                        Google Cloud Platform
                                    </div>
                                    <div className="flex items-center text-sm">
                                        <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                                        Auto-scaling infrastructure
                                    </div>
                                    <div className="flex items-center text-sm">
                                        <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                                        99.9% uptime guarantee
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Development Roadmap */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-2xl">
                            <Calendar className="h-7 w-7 text-green-600" />
                            Development Roadmap
                        </CardTitle>
                        <CardDescription className="text-lg">
                            Here's what we're working on and what's coming next
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <Badge variant="default" className="bg-green-600">Phase 1</Badge>
                                        <span className="text-sm text-slate-600 dark:text-slate-400">Q2 2025</span>
                                    </div>
                                    <h3 className="font-semibold text-green-600">Foundation Complete ✅</h3>
                                    <ul className="text-sm space-y-1 text-slate-600 dark:text-slate-400">
                                        <li>• Authentication system</li>
                                        <li>• User management</li>
                                        <li>• Basic UI framework</li>
                                        <li>• Cloud infrastructure</li>
                                    </ul>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <Badge variant="secondary" className="bg-blue-600 text-white">Phase 2</Badge>
                                        <span className="text-sm text-slate-600 dark:text-slate-400">Q3 2025</span>
                                    </div>
                                    <h3 className="font-semibold text-blue-600">Core Features 🚧</h3>
                                    <ul className="text-sm space-y-1 text-slate-600 dark:text-slate-400">
                                        <li>• Location catalog</li>
                                        <li>• Application system</li>
                                        <li>• Professional profiles</li>
                                        <li>• Search functionality</li>
                                    </ul>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline">Phase 3</Badge>
                                        <span className="text-sm text-slate-600 dark:text-slate-400">Q4 2025</span>
                                    </div>
                                    <h3 className="font-semibold text-purple-600">Advanced Features 📋</h3>
                                    <ul className="text-sm space-y-1 text-slate-600 dark:text-slate-400">
                                        <li>• AI-powered search</li>
                                        <li>• Analytics dashboards</li>
                                        <li>• Mobile applications</li>
                                        <li>• API ecosystem</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Call to Action */}
                <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
                    <CardContent className="p-8 text-center">
                        <h2 className="text-3xl font-bold mb-4">Ready to Shape the Future?</h2>
                        <p className="text-xl text-blue-100 mb-6">
                            As an early user, your feedback will directly influence the platform's development.
                            Help us build the tools that will transform the film industry.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg" variant="secondary">
                                <Star className="mr-2 h-4 w-4" />
                                Provide Feedback
                            </Button>
                            <Button size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                                <Users className="mr-2 h-4 w-4" />
                                Join Community
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

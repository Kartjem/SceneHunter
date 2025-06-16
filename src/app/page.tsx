import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { AuthRedirect } from "@/components/auth/AuthRedirect";
import {
    Film,
    Shield,
    Database,
    BarChart3,
    Search,
    Building,
    FileText,
    Award,
    Zap,
    Cloud,
    Lock,
    Users,
    Camera,
    MapPin,
    Calendar,
    CheckCircle,
    Clock,
    Target,
    Rocket
} from "lucide-react";

export default function HomePage() {
    return (
        <AuthRedirect>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
                {/* Navigation */}
                <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Film className="h-8 w-8 text-blue-600" />
                                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    SceneHunter
                                </span>
                            </div>

                            <div className="hidden md:flex items-center space-x-8">
                                <Link href="#platform" className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors">
                                    Platform
                                </Link>
                                <Link href="#roadmap" className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors">
                                    Roadmap
                                </Link>
                                <Link href="#architecture" className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors">
                                    Architecture
                                </Link>
                                <ThemeToggle />
                                <Button asChild>
                                    <Link href="/auth">Get Started</Link>
                                </Button>
                            </div>

                            <div className="md:hidden flex items-center space-x-2">
                                <ThemeToggle />
                                <Button size="sm" asChild>
                                    <Link href="/auth">Get Started</Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <section className="pt-32 pb-20 px-4">
                    <div className="container mx-auto text-center">
                        <div className="max-w-4xl mx-auto">
                            <Badge variant="secondary" className="mb-4">
                                <Rocket className="h-4 w-4 mr-2" />
                                Platform Development in Progress
                            </Badge>

                            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 dark:from-slate-100 dark:via-blue-100 dark:to-purple-100 bg-clip-text text-transparent">
                                Building the Future of
                                <br />
                                Film Production
                            </h1>

                            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 mb-12 leading-relaxed">
                                A comprehensive cloud-native platform connecting film professionals, location scouts,
                                and funding organizations. We're creating the next generation of film industry tools.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                                <Button size="lg" className="group" asChild>
                                    <Link href="/auth">
                                        Join Early Access
                                        <Rocket className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </Link>
                                </Button>

                                <Button size="lg" variant="outline" className="group">
                                    <Calendar className="mr-2 h-4 w-4" />
                                    Schedule Demo
                                </Button>
                            </div>

                            {/* Current Status */}
                            <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm rounded-2xl p-6 mb-8">
                                <div className="flex flex-wrap justify-center items-center gap-6 text-sm">
                                    <div className="flex items-center gap-2 text-green-600">
                                        <CheckCircle className="h-4 w-4" />
                                        <span>Authentication System</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-green-600">
                                        <CheckCircle className="h-4 w-4" />
                                        <span>UI Components</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-blue-600">
                                        <Clock className="h-4 w-4" />
                                        <span>Dashboard Development</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-blue-600">
                                        <Clock className="h-4 w-4" />
                                        <span>Application System</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Platform Overview */}
                <section id="platform" className="py-20 px-4 bg-white/50 dark:bg-slate-900/50">
                    <div className="container mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-bold mb-4">
                                What We're Building
                            </h2>
                            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
                                A comprehensive platform that transforms how film professionals manage projects,
                                apply for funding, and collaborate on productions.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Film Professionals */}
                            <Card className="border-2 border-blue-200 dark:border-blue-800 hover:shadow-xl transition-all duration-300">
                                <CardHeader>
                                    <div className="flex items-center gap-3 mb-4">
                                        <Camera className="h-8 w-8 text-blue-600" />
                                        <CardTitle className="text-xl">For Film Professionals</CardTitle>
                                    </div>
                                    <CardDescription>
                                        Producers, directors, and location scouts
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                            <span className="text-sm">Streamlined rebate applications</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                            <span className="text-sm">Advanced location search & booking</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                            <span className="text-sm">Project management tools</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                            <span className="text-sm">Professional networking</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Film Funds */}
                            <Card className="border-2 border-purple-200 dark:border-purple-800 hover:shadow-xl transition-all duration-300">
                                <CardHeader>
                                    <div className="flex items-center gap-3 mb-4">
                                        <Building className="h-8 w-8 text-purple-600" />
                                        <CardTitle className="text-xl">For Film Fund Organizations</CardTitle>
                                    </div>
                                    <CardDescription>
                                        Funding bodies and government agencies
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                                            <span className="text-sm">Application review workflows</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                                            <span className="text-sm">Fund management dashboards</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                                            <span className="text-sm">Content moderation tools</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                                            <span className="text-sm">Impact analytics & reporting</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Platform Admin */}
                            <Card className="border-2 border-green-200 dark:border-green-800 hover:shadow-xl transition-all duration-300">
                                <CardHeader>
                                    <div className="flex items-center gap-3 mb-4">
                                        <Shield className="h-8 w-8 text-green-600" />
                                        <CardTitle className="text-xl">Platform Administration</CardTitle>
                                    </div>
                                    <CardDescription>
                                        System management and operations
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                                            <span className="text-sm">User & organization management</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                                            <span className="text-sm">System analytics & monitoring</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                                            <span className="text-sm">Content administration</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                                            <span className="text-sm">Security configuration</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* Development Roadmap */}
                <section id="roadmap" className="py-20 px-4">
                    <div className="container mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-bold mb-4">
                                Development Roadmap
                            </h2>
                            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                                Our planned development phases to deliver a world-class film industry platform
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* Phase 1 */}
                            <Card className="relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-green-600"></div>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                                            Phase 1
                                        </Badge>
                                        <CheckCircle className="h-5 w-5 text-green-600" />
                                    </div>
                                    <CardTitle className="text-lg">Foundation</CardTitle>
                                    <CardDescription>Core Infrastructure</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="h-3 w-3 text-green-600" />
                                        <span>Authentication System</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="h-3 w-3 text-green-600" />
                                        <span>UI Component Library</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="h-3 w-3 text-green-600" />
                                        <span>Basic Layouts</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="h-3 w-3 text-green-600" />
                                        <span>Role-based Access</span>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Phase 2 */}
                            <Card className="relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-blue-600"></div>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                            Phase 2
                                        </Badge>
                                        <Clock className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <CardTitle className="text-lg">Core Features</CardTitle>
                                    <CardDescription>Professional Tools</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-3 w-3 text-blue-600" />
                                        <span>Application System</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-3 w-3 text-blue-600" />
                                        <span>Location Catalog</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-3 w-3 text-blue-600" />
                                        <span>Project Management</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-3 w-3 text-blue-600" />
                                        <span>Media Library</span>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Phase 3 */}
                            <Card className="relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-purple-600"></div>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                                            Phase 3
                                        </Badge>
                                        <Target className="h-5 w-5 text-purple-600" />
                                    </div>
                                    <CardTitle className="text-lg">Advanced Tools</CardTitle>
                                    <CardDescription>AI & Analytics</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2">
                                        <Target className="h-3 w-3 text-purple-600" />
                                        <span>AI-Powered Search</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Target className="h-3 w-3 text-purple-600" />
                                        <span>Advanced Analytics</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Target className="h-3 w-3 text-purple-600" />
                                        <span>Automated Workflows</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Target className="h-3 w-3 text-purple-600" />
                                        <span>Smart Recommendations</span>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Phase 4 */}
                            <Card className="relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-orange-600"></div>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                                            Phase 4
                                        </Badge>
                                        <Rocket className="h-5 w-5 text-orange-600" />
                                    </div>
                                    <CardTitle className="text-lg">Enterprise</CardTitle>
                                    <CardDescription>Scale & Innovation</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2">
                                        <Rocket className="h-3 w-3 text-orange-600" />
                                        <span>Enterprise Integration</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Rocket className="h-3 w-3 text-orange-600" />
                                        <span>Mobile Applications</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Rocket className="h-3 w-3 text-orange-600" />
                                        <span>API Ecosystem</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Rocket className="h-3 w-3 text-orange-600" />
                                        <span>Global Expansion</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* Technical Architecture */}
                <section id="architecture" className="py-20 px-4 bg-white/50 dark:bg-slate-900/50">
                    <div className="container mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-bold mb-4">
                                Technical Architecture
                            </h2>
                            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                                Built on modern cloud-native technologies for scalability, security, and performance
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <Card className="hover:shadow-xl transition-all duration-300">
                                <CardHeader>
                                    <div className="flex items-center gap-3 mb-2">
                                        <Cloud className="h-6 w-6 text-blue-600" />
                                        <CardTitle className="text-lg">Frontend</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                        <span>Next.js 15 with App Router</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                        <span>React 18 with TypeScript</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                        <span>Tailwind CSS & shadcn/ui</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                        <span>React Query & Zustand</span>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="hover:shadow-xl transition-all duration-300">
                                <CardHeader>
                                    <div className="flex items-center gap-3 mb-2">
                                        <Database className="h-6 w-6 text-green-600" />
                                        <CardTitle className="text-lg">Backend & Data</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                                        <span>Firebase Auth & Firestore</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                                        <span>Google Cloud Platform</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                                        <span>Cloud Functions & Cloud Run</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                                        <span>PostgreSQL & BigQuery</span>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="hover:shadow-xl transition-all duration-300">
                                <CardHeader>
                                    <div className="flex items-center gap-3 mb-2">
                                        <Shield className="h-6 w-6 text-purple-600" />
                                        <CardTitle className="text-lg">Security & DevOps</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                                        <span>Enterprise-grade security</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                                        <span>CI/CD with Cloud Build</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                                        <span>Kubernetes deployment</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                                        <span>Monitoring & observability</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 px-4">
                    <div className="container mx-auto text-center">
                        <Card className="max-w-4xl mx-auto bg-gradient-to-r from-blue-600 to-purple-600 border-0 text-white">
                            <CardContent className="p-12">
                                <h2 className="text-4xl font-bold mb-4">
                                    Be Part of the Future
                                </h2>
                                <p className="text-xl mb-8 text-blue-100">
                                    Join our early access program and help shape the platform that will transform the film industry
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Button size="lg" variant="secondary" asChild>
                                        <Link href="/auth">
                                            Request Early Access
                                            <Rocket className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                    <Button size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                                        Learn More
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* Footer */}
                <footer className="py-12 px-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
                    <div className="container mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                            <div className="space-y-4">
                                <div className="flex items-center space-x-2">
                                    <Film className="h-6 w-6 text-blue-600" />
                                    <span className="text-xl font-bold">SceneHunter</span>
                                </div>
                                <p className="text-slate-600 dark:text-slate-400 text-sm">
                                    The next generation film production platform - currently in development.
                                </p>
                            </div>

                            <div>
                                <h3 className="font-semibold mb-3">Platform</h3>
                                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                                    <li><a href="#platform" className="hover:text-slate-900 dark:hover:text-slate-100">Overview</a></li>
                                    <li><a href="#roadmap" className="hover:text-slate-900 dark:hover:text-slate-100">Roadmap</a></li>
                                    <li><a href="#architecture" className="hover:text-slate-900 dark:hover:text-slate-100">Architecture</a></li>
                                    <li><a href="/auth" className="hover:text-slate-900 dark:hover:text-slate-100">Early Access</a></li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="font-semibold mb-3">Development</h3>
                                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                                    <li><span className="text-slate-400">Documentation (Coming Soon)</span></li>
                                    <li><span className="text-slate-400">API Reference (Coming Soon)</span></li>
                                    <li><span className="text-slate-400">Developer Tools (Coming Soon)</span></li>
                                    <li><span className="text-slate-400">Community (Coming Soon)</span></li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="font-semibold mb-3">Company</h3>
                                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                                    <li><span className="text-slate-400">About Us (Coming Soon)</span></li>
                                    <li><span className="text-slate-400">Contact (Coming Soon)</span></li>
                                    <li><span className="text-slate-400">Careers (Coming Soon)</span></li>
                                    <li><span className="text-slate-400">Press Kit (Coming Soon)</span></li>
                                </ul>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-slate-200 dark:border-slate-800">
                            <div className="text-slate-600 dark:text-slate-400 text-sm">
                                © 2025 SceneHunter. Platform in development.
                            </div>
                            <div className="flex items-center space-x-4 mt-4 md:mt-0">
                                <Badge variant="outline" className="gap-1">
                                    <Cloud className="h-3 w-3" />
                                    Cloud-Native
                                </Badge>
                                <Badge variant="outline" className="gap-1">
                                    <Lock className="h-3 w-3" />
                                    Enterprise Ready
                                </Badge>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </AuthRedirect>
    );
}
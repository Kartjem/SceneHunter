import Link from "next/link";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function HomePage() {
    return (
        <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
            {/* Apple-style gradient mesh background */}
            <div className="absolute inset-0 bg-apple-mesh dark:bg-apple-mesh-dark" />

            {/* Floating gradient orbs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-apple-blue opacity-20 rounded-full blur-3xl floating" />
            <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-apple-purple opacity-15 rounded-full blur-3xl floating-delayed" />
            <div className="absolute bottom-1/3 left-1/3 w-64 h-64 bg-apple-orange opacity-10 rounded-full blur-2xl floating" style={{ animationDelay: '-4s' }} />

            {/* Glass navigation bar */}
            <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
                <div className="glass rounded-2xl px-6 py-3">
                    <div className="flex items-center space-x-8">
                        <div className="text-lg font-semibold text-foreground">SceneHunter</div>
                        <div className="hidden md:flex items-center space-x-6 text-sm text-muted-foreground">
                            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
                            <a href="#about" className="hover:text-foreground transition-colors">About</a>
                            <a href="#contact" className="hover:text-foreground transition-colors">Contact</a>
                        </div>
                        <ThemeToggle />
                    </div>
                </div>
            </nav>

            {/* Main content */}
            <div className="flex items-center justify-center min-h-screen px-4 pt-20">
                <div className="text-center relative z-10 max-w-5xl mx-auto">
                    <div className="mb-12 animate-fade-in-up">
                        <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
                            <span className="bg-apple-blue bg-clip-text text-transparent">Welcome to</span>
                            <br />
                            <span className="text-foreground">SceneHunter</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-muted-foreground mb-12 leading-relaxed max-w-3xl mx-auto">
                            Discover breathtaking filming locations from your favorite movies and shows.
                            Experience the magic behind the scenes.
                        </p>
                    </div>

                    {/* Apple-style buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                        <Link
                            href="/auth"
                            className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-apple-blue rounded-2xl hover:bg-apple-blue/90 transition-all duration-300 hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-apple-blue focus:ring-offset-2 focus:ring-offset-background overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-apple-blue opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <span className="relative z-10 flex items-center">
                                Get Started
                                <svg className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </span>
                        </Link>

                        <button className="group glass rounded-2xl px-8 py-4 text-lg font-medium text-foreground hover:bg-background/50 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background">
                            <span className="flex items-center">
                                Watch Demo
                                <svg className="ml-2 h-5 w-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </span>
                        </button>
                    </div>

                    {/* Feature cards with glass morphism */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                        <div className="group glass rounded-3xl p-8 hover:bg-background/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
                            <div className="w-16 h-16 bg-apple-blue rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-foreground mb-3">Discover Locations</h3>
                            <p className="text-muted-foreground leading-relaxed">Find iconic filming spots from blockbuster movies and beloved TV series around the world.</p>
                        </div>

                        <div className="group glass rounded-3xl p-8 hover:bg-background/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
                            <div className="w-16 h-16 bg-apple-purple rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-foreground mb-3">Save Favorites</h3>
                            <p className="text-muted-foreground leading-relaxed">Create personalized collections of your most-loved scenes and share them with friends.</p>
                        </div>

                        <div className="group glass rounded-3xl p-8 hover:bg-background/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
                            <div className="w-16 h-16 bg-apple-green rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-foreground mb-3">Connect & Share</h3>
                            <p className="text-muted-foreground leading-relaxed">Join a community of film enthusiasts and discover hidden gems together.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
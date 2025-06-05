import Link from "next/link";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function HomePage() {
    return (
        <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center p-4">
            <div className="absolute top-4 right-4">
                <ThemeToggle />
            </div>

            <div className="text-center">
                <h1 className="text-4xl font-bold text-neutral-800 dark:text-neutral-200 mb-4">
                    Welcome to SceneHunter
                </h1>
                <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-8">
                    Discover amazing filming locations around the world
                </p>

                <div className="space-x-4">
                    <Link
                        href="/auth"
                        className="inline-block px-6 py-3 bg-gradient-to-br from-black to-neutral-600 text-white font-medium rounded-md hover:from-neutral-800 hover:to-neutral-700 transition-all dark:from-zinc-900 dark:to-zinc-800 dark:hover:from-zinc-800 dark:hover:to-zinc-700"
                    >
                        Get Started
                    </Link>
                </div>
            </div>
        </div>
    );
}

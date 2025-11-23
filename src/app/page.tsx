import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[var(--background)] to-[var(--secondary)] p-4">
            <main className="max-w-4xl w-full text-center space-y-8 animate-fade-in">
                <div className="space-y-4">
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-[var(--primary)] to-[var(--accent)]">
                        FindMyStuff
                    </h1>
                    <p className="text-xl text-[var(--secondary-foreground)] max-w-2xl mx-auto">
                        The premium platform to connect lost items with their owners.
                        Secure, fast, and community-driven.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link href="/api/auth/signin">
                        <Button size="lg" className="text-lg px-8 shadow-lg shadow-indigo-500/20">
                            Get Started
                        </Button>
                    </Link>
                    <Link href="/feed">
                        <Button variant="outline" size="lg" className="text-lg px-8 glass">
                            Browse Items
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 text-left">
                    <FeatureCard
                        title="Report Lost Items"
                        desc="Quickly report lost items with location and photos."
                        icon="📍"
                    />
                    <FeatureCard
                        title="Community Driven"
                        desc="Connect with people nearby to recover your belongings."
                        icon="🤝"
                    />
                    <FeatureCard
                        title="Secure & Private"
                        desc="Your data is protected. Connect safely with others."
                        icon="🔒"
                    />
                </div>
            </main>
        </div>
    );
}

function FeatureCard({ title, desc, icon }: { title: string, desc: string, icon: string }) {
    return (
        <div className="p-6 rounded-xl glass hover:bg-[var(--secondary)]/50 transition-colors duration-300">
            <div className="text-4xl mb-4">{icon}</div>
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-[var(--secondary-foreground)]/80">{desc}</p>
        </div>
    );
}

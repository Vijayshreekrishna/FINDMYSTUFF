import Link from "next/link";

export default function Home() {
    return (
        <div className="min-h-screen flex flex-col">
            {/* Background with glow */}
            <div className="fixed inset-0 bg-gradient-to-br from-[var(--background)] via-[var(--surface)] to-[var(--background)] -z-10" />
            <div className="fixed top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[var(--accent)] opacity-10 blur-3xl rounded-full animate-pulse -z-10" />

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center section-padding">
                <div className="container max-w-6xl">
                    <div className="space-y-12 md:space-y-16 animate-fade-in text-center">
                        {/* Hero Section */}
                        <div className="space-y-6">
                            <h1 className="text-responsive-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter">
                                <span className="text-gradient">FindMyStuff</span>
                            </h1>
                            <p className="text-responsive-lg md:text-responsive-xl text-[var(--text-secondary)] max-w-3xl mx-auto leading-relaxed px-4">
                                The premium platform to connect lost items with their owners.
                                <br className="hidden md:block" />
                                <span className="text-[var(--text-dim)]">Secure, fast, and community-driven.</span>
                            </p>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4">
                            <Link href="/api/auth/signin?callbackUrl=/feed" className="w-full sm:w-auto">
                                <button className="premium-button premium-button-primary shadow-glow w-full sm:w-auto px-8 py-4 text-lg">
                                    Get Started
                                </button>
                            </Link>
                            <Link href="/feed" className="w-full sm:w-auto">
                                <button className="premium-button premium-button-ghost w-full sm:w-auto px-8 py-4 text-lg">
                                    Browse Items
                                </button>
                            </Link>
                        </div>

                        {/* Features Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 px-4">
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

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4 md:gap-8 pt-12 border-t border-[var(--border)] max-w-2xl mx-auto px-4">
                            <div className="text-center">
                                <div className="text-responsive-2xl md:text-responsive-3xl font-bold text-gradient mb-1">Fast</div>
                                <div className="text-xs md:text-sm text-[var(--text-dim)]">Response Time</div>
                            </div>
                            <div className="text-center">
                                <div className="text-responsive-2xl md:text-responsive-3xl font-bold text-gradient mb-1">Secure</div>
                                <div className="text-xs md:text-sm text-[var(--text-dim)]">Data Protection</div>
                            </div>
                            <div className="text-center">
                                <div className="text-responsive-2xl md:text-responsive-3xl font-bold text-gradient mb-1">Simple</div>
                                <div className="text-xs md:text-sm text-[var(--text-dim)]">User Experience</div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

function FeatureCard({ title, desc, icon }: { title: string, desc: string, icon: string }) {
    return (
        <div className="premium-card text-left group">
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {icon}
            </div>
            <h3 className="text-responsive-lg md:text-responsive-xl font-semibold mb-2 text-white">{title}</h3>
            <p className="text-responsive-sm text-[var(--text-secondary)] leading-relaxed">{desc}</p>
        </div>
    );
}

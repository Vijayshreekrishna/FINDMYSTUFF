export default function OfflinePage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <div className="text-center space-y-6 max-w-md animate-fade-in">
                <div className="text-8xl mb-4">📡</div>
                <h1 className="text-4xl font-bold">
                    <span className="text-gradient">You're Offline</span>
                </h1>
                <p className="text-[var(--text-secondary)] text-lg">
                    No internet connection detected. Some features may be limited.
                </p>
                <button
                    onClick={() => window.location.reload()}
                    className="premium-button premium-button-primary px-8 py-3"
                >
                    Try Again
                </button>
            </div>
        </div>
    );
}

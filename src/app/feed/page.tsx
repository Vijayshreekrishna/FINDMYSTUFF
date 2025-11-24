import FeedContent from "./feed-content";

// Force dynamic rendering for client-side data fetching
export const dynamic = 'force-dynamic';

export default function FeedPage() {
    return (
        <div className="min-h-screen p-4 md:p-8 bg-[var(--background)]">
            <FeedContent />
        </div>
    );
}

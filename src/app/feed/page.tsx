import FeedContent from "./feed-content";
import { PageContainer } from "@/components/layout/PageContainer";

// Force dynamic rendering for client-side data fetching
export const dynamic = 'force-dynamic';

export default function FeedPage() {
    return (
        <PageContainer fullWidth className="p-0 md:p-0">
            <FeedContent />
        </PageContainer>
    );
}

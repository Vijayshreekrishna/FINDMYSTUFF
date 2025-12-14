"use client";

import { use, useEffect, useState } from "react";
import MaskedChat from "@/components/chat/MaskedChat";
import { useSession } from "next-auth/react";

export default function MessagePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { data: session } = useSession();
    const [threadId, setThreadId] = useState<string | null>(null);

    // We need to fetch the Thread ID associated with this Claim ID
    // OR we can just assume `GET /api/claims/:id` returns threadId?
    // Let's assume we can fetch claim details and get thread info.

    useEffect(() => {
        // Warning: MaskedChat takes a threadId, but here `id` is claimId? 
        // The previous Link in dashboard was `/messages/${claim._id}`.
        // We need to resolve claim -> thread.
        // Let's add that to GET /api/claims/:id/thread or similar.
        // Or better, let's just make the Page accept threadId if we link to `/messages/thread/[id]`.
        // But dashboard has `claim._id` readily available.
        // Let's fetch thread by claim.
        fetch(`/api/claims/${id}/thread`)
            .then(res => res.json())
            .then(data => {
                if (data.threadId) setThreadId(data.threadId);
            });
    }, [id]);

    if (!session || !threadId) return <div>Loading...</div>;

    // @ts-ignore
    return <MaskedChat threadId={threadId} currentUserId={session.user.id} />;
}

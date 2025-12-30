import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        // @ts-ignore
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // @ts-ignore
        const userId = session.user.id;

        // Claims I (as owner/claimant) submitted
        const claims = await prisma.claim.findMany({
            where: { claimantId: userId },
            include: {
                post: { select: { title: true, status: true, images: true } }
            },
            orderBy: { createdAt: 'desc' }
        });

        // Enrich with chatThread ID if exists
        const claimIds = claims.map((c) => c.id);
        const threads = await prisma.chatThread.findMany({
            where: { claimId: { in: claimIds } },
            select: { claimId: true, id: true }
        });

        // Create a map of claimId -> threadId
        const threadMap = new Map();
        threads.forEach((t) => {
            threadMap.set(t.claimId, t.id);
        });

        const enrichedClaims = claims.map((c) => ({
            ...c,
            chatThread: threadMap.get(c.id) || null
        }));

        return NextResponse.json(enrichedClaims);
    } catch (e: any) {
        console.error("Error fetching my claims:", e);
        return NextResponse.json({ error: e?.message ?? "Server error" }, { status: 500 });
    }
}

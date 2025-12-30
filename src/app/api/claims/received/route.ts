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

        // Posts created by me (as finder / post owner)
        const myPosts = await prisma.post.findMany({
            where: { userId: userId },
            select: { id: true }
        });

        const myPostIds = myPosts.map(p => p.id);
        if (myPostIds.length === 0) return NextResponse.json([]);

        const claims = await prisma.claim.findMany({
            where: { postId: { in: myPostIds } },
            include: {
                post: { select: { title: true, status: true, images: true, type: true } },
                claimant: { select: { name: true, email: true, image: true } }
            },
            orderBy: { createdAt: 'desc' }
        });

        // Enrich with chatThread ID if exists
        const claimIds = claims.map((c) => c.id);
        const threads = await prisma.chatThread.findMany({
            where: { claimId: { in: claimIds } },
            select: { claimId: true, id: true }
        });

        // Map claimId -> threadId
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
        console.error("Error fetching received claims:", e);
        return NextResponse.json({ error: e?.message ?? "Server error" }, { status: 500 });
    }
}

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Public endpoint - fetch recent success stories with masked user info
export async function GET() {
    try {
        // Fetch completed claims (after handoff confirmation) with post details
        const successfulClaims = await prisma.claim.findMany({
            where: { status: 'completed' },
            take: 20,
            orderBy: { updatedAt: 'desc' },
            include: {
                post: {
                    include: { user: { select: { name: true } } }
                },
                claimant: { select: { name: true } }
            }
        });

        // Format response with real user names
        const successStories = successfulClaims
            .filter((claim) => claim.post) // Ensure post exists
            .map((claim) => ({
                id: claim.id,
                post: {
                    title: claim.post.title,
                    image: claim.post.images?.[0] || null,
                    type: claim.post.type,
                    category: claim.post.category,
                    location: claim.post.address || 'Unknown location',
                },
                finder: claim.post.user?.name || 'Anonymous',
                owner: claim.claimant?.name || 'Anonymous',
                completedAt: claim.updatedAt,
                createdAt: claim.post.createdAt,
            }));

        return NextResponse.json(successStories);
    } catch (error: any) {
        console.error("Error fetching success stories:", error);
        return NextResponse.json(
            { error: "Failed to fetch success stories", details: error.message },
            { status: 500 }
        );
    }
}

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

// Get user's successfully completed claims (GotMyStuff)
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        // @ts-ignore
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // @ts-ignore
        const userId = session.user.id;

        // Fetch completed claims
        const gotMyStuff = await prisma.claim.findMany({
            where: {
                claimantId: userId,
                status: 'completed'
            },
            include: {
                post: {
                    include: {
                        user: {
                            select: { name: true, email: true }
                        }
                    }
                }
            },
            orderBy: { updatedAt: 'desc' }
        });

        // Format response
        const formattedClaims = gotMyStuff
            .filter((claim) => claim.post)
            .map((claim) => ({
                id: claim.id,
                post: {
                    _id: claim.post.id,
                    title: claim.post.title,
                    image: claim.post.images?.[0] || null,
                    type: claim.post.type,
                    category: claim.post.category,
                    location: claim.post.address || 'Unknown location',
                    finder: claim.post.user?.name || 'Anonymous',
                },
                completedAt: claim.updatedAt,
                claimedAt: claim.createdAt,
            }));

        return NextResponse.json(formattedClaims);
    } catch (error: any) {
        console.error("Error fetching GotMyStuff:", error);
        return NextResponse.json(
            { error: "Failed to fetch completed claims", details: error.message },
            { status: 500 }
        );
    }
}

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/db";
import Claim from "@/models/Claim";
import Post from "@/models/Post";

// Get user's successfully completed claims (GotMyStuff)
export async function GET() {
    try {
        await dbConnect();

        const session = await getServerSession(authOptions);
        // @ts-ignore
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // @ts-ignore
        const userId = session.user.id;

        // Fetch approved claims where user is the claimant
        const gotMyStuff = await Claim.find({
            claimant: userId,
            status: 'approved'
        })
            .populate({
                path: 'post',
                select: 'title images type category location createdAt user',
                populate: {
                    path: 'user',
                    select: 'name email'
                }
            })
            .sort({ updatedAt: -1 })
            .lean();

        // Format response
        const formattedClaims = gotMyStuff
            .filter((claim: any) => claim.post)
            .map((claim: any) => ({
                id: claim._id,
                post: {
                    _id: claim.post._id,
                    title: claim.post.title,
                    image: claim.post.images?.[0] || null,
                    type: claim.post.type,
                    category: claim.post.category,
                    location: claim.post.location?.address || 'Unknown location',
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

import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Claim from "@/models/Claim";
import Post from "@/models/Post";

// Public endpoint - fetch recent success stories with masked user info
export async function GET() {
    try {
        await dbConnect();

        // Fetch completed claims (after handoff confirmation) with post details
        const successfulClaims = await Claim.find({ status: 'completed' })
            .populate({
                path: 'post',
                select: 'title images type category location createdAt',
                populate: {
                    path: 'user',
                    select: 'name' // We'll mask this
                }
            })
            .populate({
                path: 'claimant',
                select: 'name' // We'll mask this too
            })
            .sort({ updatedAt: -1 })
            .limit(20)
            .lean();

        // Format response with real user names
        const successStories = successfulClaims
            .filter((claim: any) => claim.post) // Ensure post exists
            .map((claim: any) => ({
                id: claim._id,
                post: {
                    title: claim.post.title,
                    image: claim.post.images?.[0] || null,
                    type: claim.post.type,
                    category: claim.post.category,
                    location: claim.post.location?.address || 'Unknown location',
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

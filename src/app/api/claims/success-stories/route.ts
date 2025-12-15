import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Claim from "@/models/Claim";
import Post from "@/models/Post";

// Public endpoint - fetch recent success stories with masked user info
export async function GET() {
    try {
        await dbConnect();

        // Fetch approved claims with post details
        const successfulClaims = await Claim.find({ status: 'approved' })
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

        // Mask user information and format response
        const maskedStories = successfulClaims
            .filter((claim: any) => claim.post) // Ensure post exists
            .map((claim: any, index: number) => ({
                id: claim._id,
                post: {
                    title: claim.post.title,
                    image: claim.post.images?.[0] || null,
                    type: claim.post.type,
                    category: claim.post.category,
                    location: claim.post.location?.address || 'Unknown location',
                },
                finder: `User ${String.fromCharCode(65 + (index % 26))}`, // User A, B, C, etc.
                owner: `User ${String.fromCharCode(90 - (index % 26))}`, // User Z, Y, X, etc.
                completedAt: claim.updatedAt,
                createdAt: claim.post.createdAt,
            }));

        return NextResponse.json(maskedStories);
    } catch (error: any) {
        console.error("Error fetching success stories:", error);
        return NextResponse.json(
            { error: "Failed to fetch success stories", details: error.message },
            { status: 500 }
        );
    }
}

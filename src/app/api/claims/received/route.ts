import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Claim from "@/models/Claim";
import Post from "@/models/Post";
import ChatThread from "@/models/ChatThread";
import dbConnect from "@/lib/db";

export async function GET() {
    try {
        await dbConnect();

        const session = await getServerSession(authOptions);
        // @ts-ignore
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Posts created by me (as finder / post owner)
        // @ts-ignore
        const myPosts = await Post.find({ user: session.user.id })
            .select("_id")
            .lean();

        const myPostIds = myPosts.map((p: any) => p._id);
        if (myPostIds.length === 0) return NextResponse.json([]);

        const claims = await Claim.find({ post: { $in: myPostIds } })
            .populate([
                { path: "post", select: "title status images type" },
                { path: "claimant", select: "name email image" },
            ])
            .sort({ createdAt: -1 })
            .lean();

        // Enrich with chatThread ID if exists
        const claimIds = claims.map((c: any) => c._id);
        const threads = await ChatThread.find({ claim: { $in: claimIds } }).select("claim _id").lean();

        // Map claimId -> threadId
        const threadMap = new Map();
        threads.forEach((t: any) => {
            threadMap.set(t.claim.toString(), t._id.toString());
        });

        const enrichedClaims = claims.map((c: any) => ({
            ...c,
            chatThread: threadMap.get(c._id.toString()) || null
        }));

        return NextResponse.json(enrichedClaims);
    } catch (e: any) {
        console.error("Error fetching received claims:", e);
        return NextResponse.json({ error: e?.message ?? "Server error" }, { status: 500 });
    }
}

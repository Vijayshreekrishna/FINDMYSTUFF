import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Claim from "@/models/Claim";
import Post from "@/models/Post";
import dbConnect from "@/lib/db";

// GET /api/notifications/count - Get count of unread notifications
export async function GET() {
    try {
        await dbConnect();

        const session = await getServerSession(authOptions);
        // @ts-ignore
        if (!session?.user?.id) {
            return NextResponse.json({ count: 0 });
        }

        // @ts-ignore
        const userId = session.user.id;

        // Find posts created by the user (as finder)
        const myPosts = await Post.find({ user: userId })
            .select("_id")
            .lean();

        const myPostIds = myPosts.map((p: any) => p._id);

        if (myPostIds.length === 0) {
            return NextResponse.json({ count: 0 });
        }

        // Count claims that need attention:
        // 1. Claims with status 'pending' (new claims)
        // 2. Claims with status 'awaiting_verification' (proof submitted, needs review)
        const notificationCount = await Claim.countDocuments({
            post: { $in: myPostIds },
            status: { $in: ['pending', 'awaiting_verification'] }
        });

        return NextResponse.json({ count: notificationCount });
    } catch (e: any) {
        console.error("Error fetching notification count:", e);
        return NextResponse.json({ count: 0 });
    }
}

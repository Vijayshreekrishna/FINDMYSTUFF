import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/db";
import Claim from "@/models/Claim";
import Post from "@/models/Post";

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // @ts-ignore
        const userId = session.user.id;

        await dbConnect();

        // Find posts by this user
        const posts = await Post.find({ user: userId }).select('_id');
        const postIds = posts.map(p => p._id);

        // Find claims on these posts
        const claims = await Claim.find({ post: { $in: postIds } })
            .populate("post", "title description images type")
            .sort({ createdAt: -1 });

        return NextResponse.json({ claims });
    } catch (error) {
        console.error("Error fetching incoming claims:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Post from "@/models/Post";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const post = await Post.findById(params.id);

        if (!post) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }

        // Check ownership
        // @ts-ignore
        if (post.user.toString() !== session.user.id) {
            return NextResponse.json({ error: "Forbidden - You can only delete your own posts" }, { status: 403 });
        }

        await Post.findByIdAndDelete(params.id);

        return NextResponse.json({ success: true, message: "Post deleted successfully" });
    } catch (error) {
        console.error("Error deleting post:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

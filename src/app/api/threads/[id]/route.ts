import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/db";
import ChatThread from "@/models/ChatThread";
import Message from "@/models/Message";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // @ts-ignore
        const userId = session.user.id;
        const { id } = await params;

        await dbConnect();

        const thread = await ChatThread.findById(id).populate("claim");
        if (!thread) {
            return NextResponse.json({ error: "Thread not found" }, { status: 404 });
        }

        // Verify membership
        if (thread.finder.toString() !== userId && thread.claimant.toString() !== userId) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const messages = await Message.find({ thread: id })
            .sort({ createdAt: 1 }) // Oldest first
            .limit(50);

        return NextResponse.json({ thread, messages });
    } catch (error) {
        console.error("Error fetching thread:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

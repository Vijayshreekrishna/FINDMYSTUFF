import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/db";
import ChatThread from "@/models/ChatThread";
import Message from "@/models/Message";
import { ratelimit } from "@/lib/ratelimit";
import { stripLinks } from "@/lib/sanitize";
import { Types } from "mongoose";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Rate limit
        const ip = req.headers.get("x-forwarded-for") || "unknown";
        const key = `msg_${session.user.email}_${ip}`;
        const { success } = await ratelimit.limit(key);
        if (!success) {
            return NextResponse.json({ error: "Too many messages" }, { status: 429 });
        }

        // @ts-ignore
        const userId = session.user.id;
        const { id } = await params;
        const { content } = await req.json();

        if (!content || typeof content !== "string") {
            return NextResponse.json({ error: "Invalid content" }, { status: 400 });
        }

        await dbConnect();

        const thread = await ChatThread.findById(id);
        if (!thread) {
            return NextResponse.json({ error: "Thread not found" }, { status: 404 });
        }

        if (thread.isClosed) {
            return NextResponse.json({ error: "Thread is closed" }, { status: 400 });
        }

        if (thread.finder.toString() !== userId && thread.claimant.toString() !== userId) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        // Sanitize if links not allowed
        let finalContent = content;
        if (!thread.allowLinks) {
            finalContent = stripLinks(content);
        }

        // ... existing imports

        const message = await Message.create({
            thread: new Types.ObjectId(id),
            sender: new Types.ObjectId(userId),
            content: finalContent,
        });

        return NextResponse.json(message, { status: 201 });

    } catch (error) {
        console.error("Error sending message:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

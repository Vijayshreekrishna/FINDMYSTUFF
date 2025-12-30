import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { ratelimit } from "@/lib/ratelimit";
import { stripLinks } from "@/lib/sanitize";

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

        const thread = await prisma.chatThread.findUnique({
            where: { id: id }
        });

        if (!thread) {
            return NextResponse.json({ error: "Thread not found" }, { status: 404 });
        }

        if (thread.isClosed) {
            return NextResponse.json({ error: "Thread is closed" }, { status: 400 });
        }

        if (thread.finderId !== userId && thread.claimantId !== userId) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        // Sanitize if links not allowed
        let finalContent = content;
        if (!thread.allowLinks) {
            finalContent = stripLinks(content);
        }

        const message = await prisma.message.create({
            data: {
                threadId: id,
                senderId: userId,
                content: finalContent,
            }
        });

        // Update thread updated at
        await prisma.chatThread.update({
            where: { id: id },
            data: { updatedAt: new Date() }
        });

        return NextResponse.json(message, { status: 201 });

    } catch (error) {
        console.error("Error sending message:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

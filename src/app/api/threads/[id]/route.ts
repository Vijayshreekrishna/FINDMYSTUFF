import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // @ts-ignore
        const userId = session.user.id;
        const { id } = await params;

        const thread = await prisma.chatThread.findUnique({
            where: { id: id },
            include: { claim: true }
        });

        if (!thread) {
            return NextResponse.json({ error: "Thread not found" }, { status: 404 });
        }

        // Verify membership
        if (thread.finderId !== userId && thread.claimantId !== userId) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const messages = await prisma.message.findMany({
            where: { threadId: id },
            orderBy: { createdAt: 'asc' },
            take: 50
        });

        return NextResponse.json({ thread, messages });
    } catch (error) {
        console.error("Error fetching thread:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

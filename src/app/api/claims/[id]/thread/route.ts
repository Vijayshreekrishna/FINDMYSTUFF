import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;

    const thread = await prisma.chatThread.findFirst({
        where: { claimId: id }
    });

    if (!thread) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ threadId: thread.id });
}

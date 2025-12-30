import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // @ts-ignore
        const userId = session.user.id;
        const { id } = await params;
        const { status } = await req.json(); // 'approved', 'rejected'

        if (!['approved', 'rejected'].includes(status)) {
            return NextResponse.json({ error: "Invalid status" }, { status: 400 });
        }

        const claim = await prisma.claim.findUnique({
            where: { id: id },
            include: { post: true }
        });

        if (!claim) {
            return NextResponse.json({ error: "Claim not found" }, { status: 404 });
        }

        // Only finder can decide
        if (claim.post.userId !== userId) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        // Update claim status
        await prisma.claim.update({
            where: { id: id },
            data: { status: status }
        });

        // If approved, maybe open link sharing?
        if (status === 'approved') {
            await prisma.chatThread.updateMany({
                where: { claimId: id },
                data: { allowLinks: true }
            });
        }

        if (status === 'rejected') {
            await prisma.chatThread.updateMany({
                where: { claimId: id },
                data: { isClosed: true }
            });
        }

        return NextResponse.json({ success: true, claim });
    } catch (error) {
        console.error("Error updating claim:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

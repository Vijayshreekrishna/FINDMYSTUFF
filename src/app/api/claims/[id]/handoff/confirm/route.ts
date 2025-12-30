import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { verifyHandoffCode } from "@/lib/handoff";

// Confirm Code (Claimant)
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        // @ts-ignore
        const userId = session.user.id;
        const { id } = await params;

        const { code } = await req.json();

        const claim = await prisma.claim.findUnique({
            where: { id: id },
            include: { post: true }
        });

        if (!claim) return NextResponse.json({ error: "Not found" }, { status: 404 });

        if (claim.claimantId !== userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

        if (!claim.handoffCodeHash) {
            return NextResponse.json({ error: "No code generated yet" }, { status: 400 });
        }

        const isValid = await verifyHandoffCode(code, claim.handoffCodeHash);
        if (!isValid) {
            return NextResponse.json({ error: "Invalid code" }, { status: 400 });
        }

        // Success! Mark as completed (not just approved)
        await prisma.claim.update({
            where: { id: id },
            data: { status: 'completed' }
        });

        // Update Post
        await prisma.post.update({
            where: { id: claim.postId },
            data: { status: 'resolved' }
        });

        // Update Reputation (Finder + Claimant)
        // Finder gets karma
        await prisma.reputation.upsert({
            where: { userId: claim.post.userId },
            create: { userId: claim.post.userId, score: 20, successfulHandoffs: 1 },
            update: { score: { increment: 20 }, successfulHandoffs: { increment: 1 } }
        });

        // Claimant gets karma
        await prisma.reputation.upsert({
            where: { userId: userId },
            create: { userId: userId, score: 10, successfulHandoffs: 1 },
            update: { score: { increment: 10 }, successfulHandoffs: { increment: 1 } }
        });

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('❌ Handoff confirmation error:', error);
        return NextResponse.json({
            error: "Error confirming handoff",
            details: error.message
        }, { status: 500 });
    }
}

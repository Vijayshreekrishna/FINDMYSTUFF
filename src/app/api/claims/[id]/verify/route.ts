import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

// POST /api/claims/[id]/verify
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // @ts-ignore
    const userId = session.user.id;
    const { id } = await params;

    try {
        const body = await req.json();
        console.log("[DEBUG] POST /api/claims/[id]/verify - Body:", body);
        const { decision, reason } = body;

        if (!['approved', 'rejected'].includes(decision)) {
            return NextResponse.json({ error: "Invalid decision" }, { status: 400 });
        }

        // We need to fetch the claim and populate post to verify the current user is the FINDER (post owner)
        const claim = await prisma.claim.findUnique({
            where: { id: id },
            include: { post: true }
        });

        if (!claim) {
            return NextResponse.json({ error: "Claim not found" }, { status: 404 });
        }

        // @ts-ignore
        const isFinder = claim.post.userId === userId;
        console.log("[DEBUG] Verify Permission Check:", { isFinder, postOwner: claim.post.userId, currentUserId: userId });

        if (!isFinder) {
            return NextResponse.json({ error: "Forbidden: You are not the finder" }, { status: 403 });
        }

        // Update Verification
        const verificationData = {
            reviewedBy: userId,
            decision,
            decidedAt: new Date(),
            reason
        };

        // Explicit cast for Prisma JSON compatibility
        const jsonVerification = verificationData as unknown as Prisma.InputJsonValue;

        const updateData: any = {
            verificationData: jsonVerification
        };

        if (decision === 'approved') {
            updateData.status = 'approved';
        } else {
            updateData.status = 'rejected';
        }

        await prisma.claim.update({
            where: { id: id },
            data: updateData
        });

        return NextResponse.json({ success: true, claim: { ...claim, ...updateData } });

    } catch (error: any) {
        console.error("Verification error:", error);
        return NextResponse.json({ error: error.message || "Server error" }, { status: 500 });
    }
}

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/db";
import Claim from "@/models/Claim";
import ChatThread from "@/models/ChatThread";
import Message from "@/models/Message";

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
        await dbConnect();

        const { decision, reason } = await req.json();

        if (!['approved', 'rejected'].includes(decision)) {
            return NextResponse.json({ error: "Invalid decision" }, { status: 400 });
        }

        // We need to fetch the claim and populate post to verify the current user is the FINDER (post owner)
        const claim = await Claim.findById(id).populate("post");
        if (!claim) {
            return NextResponse.json({ error: "Claim not found" }, { status: 404 });
        }

        // @ts-ignore
        const isFinder = claim.post.user.toString() === userId;
        if (!isFinder) {
            return NextResponse.json({ error: "Forbidden: You are not the finder" }, { status: 403 });
        }

        // Update Verification
        claim.verification = {
            reviewedBy: userId,
            decision,
            decidedAt: new Date(),
            reason
        };

        if (decision === 'approved') {
            claim.status = 'approved';
            // Chat remains open per user request
        } else {
            claim.status = 'rejected';
        }

        await claim.save();

        return NextResponse.json({ success: true, claim });

    } catch (error: any) {
        console.error("Verification error:", error);
        return NextResponse.json({ error: error.message || "Server error" }, { status: 500 });
    }
}

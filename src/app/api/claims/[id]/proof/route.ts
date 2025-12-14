import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/db";
import Claim from "@/models/Claim";
import ChatThread from "@/models/ChatThread";
import Message from "@/models/Message";

// POST /api/claims/[id]/proof
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

        const { imageUrl, note } = await req.json();

        if (!imageUrl) {
            return NextResponse.json({ error: "Image URL is required" }, { status: 400 });
        }

        const claim = await Claim.findById(id);
        if (!claim) {
            return NextResponse.json({ error: "Claim not found" }, { status: 404 });
        }

        if (claim.claimant.toString() !== userId) {
            return NextResponse.json({ error: "Forbidden: Not your claim" }, { status: 403 });
        }

        // Update claim proof details
        claim.claimerProof = {
            imageUrl,
            note: note || "",
            submittedAt: new Date()
        };
        claim.status = "awaiting_verification";
        await claim.save();

        // Notify via System Message in Chat
        // Find existing thread
        const thread = await ChatThread.findOne({ claim: claim._id });
        if (thread) {
            // We use a special system user ID or just mark it as system message if model supported it.
            // For now, we can create a message from the system (null sender or specific ID).
            // Or typically we just rely on the status change to update UI.
            // Let's create a message to bump the thread.

            // NOTE: In Stage 1 Message model, we only had senderId. 
            // We might need to handle "System" messages elegantly. 
            // For now, let's skip creating a backend message and rely on the UI 'status' update 
            // to show the "Proof Submitted" state.
        }

        return NextResponse.json({ success: true, claim });

    } catch (error: any) {
        console.error("Proof upload error:", error);
        return NextResponse.json({ error: error.message || "Server error" }, { status: 500 });
    }
}

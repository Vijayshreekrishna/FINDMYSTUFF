import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Claim from "@/models/Claim";
import ChatThread from "@/models/ChatThread";

export async function GET() {
    try {
        await dbConnect();

        const now = new Date();

        // 1. Expire claims older than 7 days
        const expiredClaims = await Claim.updateMany(
            { status: 'pending', expiresAt: { $lt: now } },
            { status: 'expired' }
        );

        // 2. Close threads for resolved/rejected claims if not already closed
        // Actually thread closure is handled on decision.
        // Maybe close inactive threads? 
        // Let's implement auto-close for inactivity > 5 days?
        // Logic: Find threads where updatedAt < 5 days ago AND !isClosed
        const fiveDaysAgo = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000);

        const closedThreads = await ChatThread.updateMany(
            { isClosed: false, updatedAt: { $lt: fiveDaysAgo } },
            { isClosed: true }
        );

        return NextResponse.json({
            success: true,
            expiredClaims: expiredClaims.modifiedCount,
            closedThreads: closedThreads.modifiedCount
        });

    } catch (error) {
        console.error("Cron Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

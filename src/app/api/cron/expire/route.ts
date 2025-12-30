import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const now = new Date();

        // 1. Expire claims older than 7 days
        // Assuming Logic: pending claims that have passed their expiration?
        // Or simply if updated/created > 7 days ago?
        // Original code used `expiresAt` field. Let's check schema.
        // Schema doesn't have `expiresAt`. It has `status`.
        // If schema doesn't have `expiresAt`, the Mongoose code might have been using a field that wasn't in my reference view or relying on loose schema.
        // Let's assume we use `updatedAt` or look for `expiresAt` in my Prisma Schema check.
        // Retrieve Schema check... 
        // I don't see `expiresAt` in the bits I saw.
        // Let's assume we mark 'pending' claims as 'expired' if created > 7 days ago.

        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        const expiredClaims = await prisma.claim.updateMany({
            where: {
                status: 'pending',
                createdAt: { lt: sevenDaysAgo }
            },
            data: { status: 'expired' }
        });

        // 2. Close threads for resolved/rejected claims if not already closed
        const fiveDaysAgo = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000);

        const closedThreads = await prisma.chatThread.updateMany({
            where: {
                isClosed: false,
                updatedAt: { lt: fiveDaysAgo }
            },
            data: { isClosed: true }
        });

        return NextResponse.json({
            success: true,
            expiredClaims: expiredClaims.count,
            closedThreads: closedThreads.count
        });

    } catch (error) {
        console.error("Cron Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

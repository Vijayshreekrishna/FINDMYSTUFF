import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

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
        const { imageUrl, note } = await req.json();

        if (!imageUrl) {
            return NextResponse.json({ error: "Image URL is required" }, { status: 400 });
        }

        const claim = await prisma.claim.findUnique({
            where: { id: id }
        });

        if (!claim) {
            return NextResponse.json({ error: "Claim not found" }, { status: 404 });
        }

        if (claim.claimantId !== userId) {
            return NextResponse.json({ error: "Forbidden: Not your claim" }, { status: 403 });
        }

        // Update claim proof details
        const proofData = {
            imageUrl,
            note: note || "",
            submittedAt: new Date()
        };

        // Cast explicitly to InputJsonValue
        const jsonProof = proofData as unknown as Prisma.InputJsonValue;

        await prisma.claim.update({
            where: { id: id },
            data: {
                claimerProof: jsonProof,
                status: "awaiting_verification"
            }
        });

        return NextResponse.json({ success: true, claim: { ...claim, claimerProof: proofData, status: "awaiting_verification" } });

    } catch (error: any) {
        console.error("Proof upload error:", error);
        return NextResponse.json({ error: error.message || "Server error" }, { status: 500 });
    }
}

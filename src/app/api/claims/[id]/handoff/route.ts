import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { generateHandoffCode, hashHandoffCode } from "@/lib/handoff";

// Generate Code (Finder Only)
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        // @ts-ignore
        const userId = session.user.id;
        const { id } = await params;

        const claim = await prisma.claim.findUnique({
            where: { id: id },
            include: { post: true }
        });

        if (!claim) return NextResponse.json({ error: "Not found" }, { status: 404 });

        if (claim.post.userId !== userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

        // Check if code already exists for this claim
        if (claim.handoffCodeHash) {
            return NextResponse.json({
                error: "Code already generated for this claim. Each claim can only have one handoff code.",
                alreadyGenerated: true
            }, { status: 400 });
        }

        const code = generateHandoffCode();
        const hash = await hashHandoffCode(code);

        await prisma.claim.update({
            where: { id: id },
            data: { handoffCodeHash: hash }
        });

        // Return plain code to finder so they can share it
        return NextResponse.json({ code });

    } catch (error) {
        return NextResponse.json({ error: "Error" }, { status: 500 });
    }
}

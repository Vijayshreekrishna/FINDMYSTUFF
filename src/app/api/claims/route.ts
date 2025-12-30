import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { calculateClaimScore } from "@/lib/claimScore";
import { generateMaskedHandle } from "@/lib/maskedHandle";
import { claimRateLimit } from "@/lib/ratelimit";
import { z } from "zod";

const createClaimSchema = z.object({
    postId: z.string(),
    answers: z.record(z.string(), z.any()),
    evidenceImage: z.string().optional(),
});

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Rate Limiting
        const ip = req.headers.get("x-forwarded-for") || "unknown";
        try {
            const { success } = await claimRateLimit.limit(`claim_${session.user.email}_${ip}`);
            if (!success) {
                return NextResponse.json({ error: "Rate limit exceeded. Try again later." }, { status: 429 });
            }
        } catch (rlError) {
            console.warn("Rate limit failed, proceeding anyway:", rlError);
        }

        const body = await req.json();
        const result = createClaimSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: "Invalid input", details: result.error }, { status: 400 });
        }

        const { postId, answers, evidenceImage } = result.data;
        // @ts-ignore
        const userId = session.user.id;

        const post = await prisma.post.findUnique({
            where: { id: postId },
        });

        if (!post) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }

        // Prevent finder from claiming their own item
        if (post.userId === userId) {
            return NextResponse.json({ error: "Cannot claim your own post" }, { status: 400 });
        }

        // Check for duplicate claim
        const existingClaim = await prisma.claim.findFirst({
            where: {
                postId: postId,
                claimantId: userId,
            },
        });

        if (existingClaim) {
            return NextResponse.json({ error: "You have already claimed this item" }, { status: 409 });
        }

        // Initial Scoring (Basic)
        const scoreFactors = {
            keywordMatchCount: 1, // Placeholder logic
            recentClaimsCount: 0,
        };

        const score = calculateClaimScore(scoreFactors);

        // Transaction: Create Claim + Thread
        const userAgent = req.headers.get("user-agent") || "";
        const fingerprint = `${ip}-${userAgent}`; // Simple string or hash

        const [claim, thread] = await prisma.$transaction(async (tx) => {
            const newClaim = await tx.claim.create({
                data: {
                    postId,
                    claimantId: userId,
                    score,
                    answers,
                    evidenceImage,
                    // fingerprint, // Not in schema yet, assumed handled or ignored
                    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
                }
            });

            const finderId = post.userId;
            const maskedHandleMap = {
                [userId]: generateMaskedHandle(),
                [finderId]: generateMaskedHandle(),
            };

            const newThread = await tx.chatThread.create({
                data: {
                    claimId: newClaim.id,
                    finderId: finderId,
                    claimantId: userId,
                    maskedHandleMap: maskedHandleMap,
                    allowLinks: false,
                    allowAttachments: false,
                    autoCloseAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
                }
            });

            return [newClaim, newThread];
        });

        return NextResponse.json({ claim, threadId: thread.id }, { status: 201 });

    } catch (error: any) {
        console.error("Error creating claim:", error);
        return NextResponse.json({
            error: "Internal Server Error",
            details: error.message || String(error)
        }, { status: 500 });
    }
}

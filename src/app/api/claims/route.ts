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
        console.log("[DEBUG] POST /api/claims - Start");
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            console.log("[DEBUG] Unauthorized");
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Rate Limiting
        const ip = req.headers.get("x-forwarded-for") || "unknown";
        try {
            // Check if ratelimit exists
            if (claimRateLimit) {
                const { success } = await claimRateLimit.limit(`claim_${session.user.email}_${ip}`);
                if (!success) {
                    return NextResponse.json({ error: "Rate limit exceeded. Try again later." }, { status: 429 });
                }
            } else {
                console.warn("[DEBUG] claimRateLimit is undefined, skipping");
            }
        } catch (rlError) {
            console.warn("Rate limit failed, proceeding anyway:", rlError);
        }

        const body = await req.json();
        console.log("[DEBUG] Request Body:", body);
        const result = createClaimSchema.safeParse(body);

        if (!result.success) {
            console.error("[DEBUG] Validation Error:", result.error);
            return NextResponse.json({ error: "Invalid input", details: result.error }, { status: 400 });
        }

        const { postId, answers, evidenceImage } = result.data;
        // @ts-ignore
        const userId = session.user.id;
        console.log("[DEBUG] Claimant ID:", userId, "Post ID:", postId);

        const post = await prisma.post.findUnique({
            where: { id: postId },
        });

        if (!post) {
            console.error("[DEBUG] Post not found in DB");
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }
        console.log("[DEBUG] Post found, Owner:", post.userId);

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
            console.log("[DEBUG] Duplicate claim found");
            return NextResponse.json({ error: "You have already claimed this item" }, { status: 409 });
        }

        console.log("[DEBUG] Calculating score...");
        // Initial Scoring (Basic)
        const scoreFactors = {
            keywordMatchCount: 1, // Placeholder logic
            recentClaimsCount: 0,
        };

        const score = calculateClaimScore(scoreFactors);
        console.log("[DEBUG] Score:", score);

        // Transaction: Create Claim + Thread
        const userAgent = req.headers.get("user-agent") || "";
        const fingerprint = `${ip}-${userAgent}`; // Simple string or hash

        console.log("[DEBUG] Starting Transaction...");
        const [claim, thread] = await prisma.$transaction(async (tx) => {
            console.log("[DEBUG] Creating Claim...");
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
            console.log("[DEBUG] Claim Created:", newClaim.id);

            const finderId = post.userId;
            const maskedHandleMap = {
                [userId]: generateMaskedHandle(),
                [finderId]: generateMaskedHandle(),
            };
            console.log("[DEBUG] Masked Handles:", maskedHandleMap);

            console.log("[DEBUG] Creating Thread...");
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
            console.log("[DEBUG] Thread Created:", newThread.id);

            return [newClaim, newThread];
        });

        console.log("[DEBUG] Transaction Complete");
        return NextResponse.json({ claim, threadId: thread.id }, { status: 201 });

    } catch (error: any) {
        console.error("[DEBUG] Error creating claim:", error);
        return NextResponse.json({
            error: "Internal Server Error",
            details: error.message || String(error)
        }, { status: 500 });
    }
}

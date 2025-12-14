import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/db";
import Claim from "@/models/Claim";
import Post from "@/models/Post";
import ChatThread from "@/models/ChatThread";
import { calculateClaimScore, getClaimBand } from "@/lib/claimScore";
import { generateMaskedHandle } from "@/lib/maskedHandle";
import { claimRateLimit } from "@/lib/ratelimit";
import { z } from "zod";
import { isValidObjectId, Types } from "mongoose";


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
            // Default to allowing if rate limiter fails (e.g. upstash credentials missing)
        }

        const body = await req.json();
        const result = createClaimSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: "Invalid input", details: result.error }, { status: 400 });
        }

        const { postId, answers, evidenceImage } = result.data;
        // @ts-ignore
        const userId = session.user.id;

        // Validate IDs
        if (!isValidObjectId(postId) || !isValidObjectId(userId)) {
            return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
        }

        await dbConnect();

        // Check if post exists
        const post = await Post.findById(postId);
        if (!post) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }

        // Prevent finder from claiming their own item
        if (post.user.toString() === userId) {
            return NextResponse.json({ error: "Cannot claim your own post" }, { status: 400 });
        }

        // Check for duplicate claim
        const existingClaim = await Claim.findOne()
            .where("post").equals(postId)
            .where("claimant").equals(userId);
        if (existingClaim) {
            return NextResponse.json({ error: "You have already claimed this item" }, { status: 409 });
        }

        // Initial Scoring (Basic)
        // In a real scenario, we would compare answers with hidden fields, etc.
        const scoreFactors = {
            // Placeholder: assuming some matching logic here
            keywordMatchCount: 1,
            recentClaimsCount: 0, // Should query recent claims
        };

        const score = calculateClaimScore(scoreFactors);
        // const band = getClaimBand(score);

        // Create Claim
        const userAgent = req.headers.get("user-agent") || "";
        const fingerprint = `${ip}-${userAgent}`; // Simple string or hash

        const claim = await Claim.create({
            post: new Types.ObjectId(postId),
            claimant: new Types.ObjectId(userId),
            score,
            answers,
            evidenceImage,
            fingerprint,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        });

        // Create Chat Thread
        const finderId = post.user.toString();
        const maskedHandleMap = new Map();
        maskedHandleMap.set(userId, generateMaskedHandle(userId)); // Claimant
        maskedHandleMap.set(finderId, generateMaskedHandle(finderId)); // Finder

        const thread = await ChatThread.create({
            claim: claim._id,
            finder: finderId,
            claimant: userId,
            maskedHandleMap,
            allowLinks: false,
            allowAttachments: false,
            autoCloseAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        });

        return NextResponse.json({ claim, threadId: thread._id }, { status: 201 });

    } catch (error: any) {
        console.error("Error creating claim:", error);
        if (error.stack) console.error(error.stack);
        return NextResponse.json({
            error: "Internal Server Error",
            details: error.message || String(error)
        }, { status: 500 });
    }
}

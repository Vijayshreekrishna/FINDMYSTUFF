import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/db";
import Claim from "@/models/Claim";
import { sendVerificationEmail } from "@/lib/email";
import { calculateClaimScore } from "@/lib/claimScore";

// Request OTP
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        // @ts-ignore
        const userId = session.user.id;
        const { id } = await params;

        await dbConnect();
        const claim = await Claim.findById(id);

        if (!claim) return NextResponse.json({ error: "Not found" }, { status: 404 });
        if (claim.claimant.toString() !== userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

        // Generate 6 digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Store OTP in claim (or separate generic OTP collection, but simplifying here)
        // We didn't add otp field to Claim model, let's use answers map or generic field?
        // Or better, just update the Claim model to support it or use 'answers' temporarily.
        // Ideally, we should have added `emailVerificationCode` to Claim schema.
        // I will add it to `answers` for now as metadata: `_otp`, `_otpExpires`.

        // In a real app, use Redis for short-lived OTPs.
        // Let's use `answers` map for simplicity in this free-tier constraint if Redis isn't strictly for KV (though Upstash IS Redis).
        // Let's use Upstash Redis!

        // We already have `redis` from ratelimit lib? No, we didn't export it.
        // Let's just import Redis from @upstash/redis and use text keys.
        const { Redis } = await import("@upstash/redis");
        const redis = new Redis({
            url: process.env.UPSTASH_REDIS_REST_URL!,
            token: process.env.UPSTASH_REDIS_REST_TOKEN!,
        });

        await redis.set(`claim_otp_${id}`, otp, { ex: 300 }); // 5 mins

        // Send email
        if (session.user.email) {
            await sendVerificationEmail(session.user.email, otp);
        } else {
            return NextResponse.json({ error: "User has no email" }, { status: 400 });
        }

        return NextResponse.json({ success: true, message: "OTP sent" });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Error" }, { status: 500 });
    }
}

// Verify OTP
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        // @ts-ignore
        const userId = session.user.id;
        const { id } = await params;
        const { otp } = await req.json();

        await dbConnect();
        const claim = await Claim.findById(id);
        if (!claim) return NextResponse.json({ error: "Not found" }, { status: 404 });
        if (claim.claimant.toString() !== userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

        const { Redis } = await import("@upstash/redis");
        const redis = new Redis({
            url: process.env.UPSTASH_REDIS_REST_URL!,
            token: process.env.UPSTASH_REDIS_REST_TOKEN!,
        });

        const storedOtp = await redis.get(`claim_otp_${id}`);
        if (!storedOtp || storedOtp !== otp) {
            return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
        }

        // Success
        claim.verificationStatus = 'email_verified';

        // Recalculate Score
        const factors = {
            emailVerified: true,
            // We need to re-evaluate other factors if possible, but for now just add the bonus
        };
        const bonus = 10;
        claim.score += bonus;

        await claim.save();

        // Clear OTP
        await redis.del(`claim_otp_${id}`);

        return NextResponse.json({ success: true, claim });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Error" }, { status: 500 });
    }
}

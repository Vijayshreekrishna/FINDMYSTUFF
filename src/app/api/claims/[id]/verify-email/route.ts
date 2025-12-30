import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { sendVerificationEmail } from "@/lib/email";

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

        const claim = await prisma.claim.findUnique({ where: { id: id } });

        if (!claim) return NextResponse.json({ error: "Not found" }, { status: 404 });
        if (claim.claimantId !== userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

        // Generate 6 digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

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

        const claim = await prisma.claim.findUnique({ where: { id: id } });
        if (!claim) return NextResponse.json({ error: "Not found" }, { status: 404 });
        if (claim.claimantId !== userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

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
        // Recalculate Score
        const bonus = 10;

        await prisma.claim.update({
            where: { id: id },
            data: {
                verificationStatus: 'email_verified',
                score: { increment: bonus }
            }
        });

        // Clear OTP
        await redis.del(`claim_otp_${id}`);

        return NextResponse.json({ success: true, claim });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Error" }, { status: 500 });
    }
}

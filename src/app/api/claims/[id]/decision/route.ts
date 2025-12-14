import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/db";
import Claim from "@/models/Claim";
import ChatThread from "@/models/ChatThread";
import Post from "@/models/Post";
import { castObjectId } from "@/lib/castObjectId";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // @ts-ignore
        const userId = session.user.id;
        const { id } = await params;
        const { status } = await req.json(); // 'approved', 'rejected'

        if (!['approved', 'rejected'].includes(status)) {
            return NextResponse.json({ error: "Invalid status" }, { status: 400 });
        }

        await dbConnect();
        const claim = await Claim.findById(id).populate("post");

        if (!claim) {
            return NextResponse.json({ error: "Claim not found" }, { status: 404 });
        }

        // Only finder can decide
        // @ts-ignore
        if (claim.post.user.toString() !== userId) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        claim.status = status;
        await claim.save();

        // If approved, maybe open link sharing?
        if (status === 'approved') {
            await ChatThread.findOneAndUpdate(
                { claim: castObjectId(id) },
                { allowLinks: true }
            );
        }

        if (status === 'rejected') {
            await ChatThread.findOneAndUpdate(
                { claim: castObjectId(id) },
                { isClosed: true }
            );
        }

        return NextResponse.json({ success: true, claim });
    } catch (error) {
        console.error("Error updating claim:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

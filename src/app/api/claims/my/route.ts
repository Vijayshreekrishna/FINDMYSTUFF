import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/db";
import Claim from "@/models/Claim";

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // @ts-ignore
        const userId = session.user.id;

        await dbConnect();

        const claims = await Claim.find({ claimant: userId })
            .populate("post", "title description images type")
            .sort({ createdAt: -1 });

        return NextResponse.json({ claims });
    } catch (error) {
        console.error("Error fetching claims:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

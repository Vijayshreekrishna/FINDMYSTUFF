import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/db";
import ChatThread from "@/models/ChatThread";
import { castObjectId } from "@/lib/castObjectId";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    await dbConnect();

    const thread = await ChatThread.findOne({ claim: castObjectId(id) });
    if (!thread) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ threadId: thread._id });
}

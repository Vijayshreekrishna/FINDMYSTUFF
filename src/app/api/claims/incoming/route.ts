import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // @ts-ignore
        const userId = session.user.id;

        // Find posts by this user
        const posts = await prisma.post.findMany({
            where: { userId: userId },
            select: { id: true }
        });
        const postIds = posts.map(p => p.id);

        if (postIds.length === 0) {
            return NextResponse.json({ claims: [] });
        }

        // Find claims on these posts
        const claims = await prisma.claim.findMany({
            where: { postId: { in: postIds } },
            include: {
                post: {
                    select: { title: true, description: true, images: true, type: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({ claims });
    } catch (error) {
        console.error("Error fetching incoming claims:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

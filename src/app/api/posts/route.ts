import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const data = await req.json();

        // @ts-ignore
        const userId = session.user.id;

        if (!userId) {
            return NextResponse.json({ error: "User ID not found in session" }, { status: 400 });
        }

        // Validate required fields
        if (!data.title || !data.description || !data.category || !data.type) {
            console.error("Missing required fields:", data);
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Ensure location has required fields
        if (!data.location || typeof data.location.lat !== 'number' || typeof data.location.lng !== 'number') {
            console.error("Invalid location data:", data.location);
            return NextResponse.json({ error: "Invalid location data" }, { status: 400 });
        }

        console.log("Creating Post - User:", userId, "Data:", data);

        const post = await prisma.post.create({
            data: {
                userId: userId,
                title: data.title,
                description: data.description,
                category: data.category,
                type: data.type,
                status: 'reported',
                lat: data.location.lat,
                lng: data.location.lng,
                address: data.location.address,
                images: data.images || [],
                sensitiveAreas: data.sensitiveAreas || undefined, // Prisma handles optional JSON well usually
            }
        });

        return NextResponse.json(post, { status: 201 });
    } catch (error: any) {
        console.error("Error creating post:", error);
        return NextResponse.json({
            error: "Internal Server Error",
            details: error.message
        }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const type = searchParams.get("type");
        const category = searchParams.get("category");
        const search = searchParams.get("search");
        const userId = searchParams.get("userId");
        const skip = parseInt(searchParams.get("skip") || "0");
        const limit = parseInt(searchParams.get("limit") || "12");

        const where: any = {};

        // Exclude resolved/closed posts from feed
        where.status = { notIn: ['resolved', 'closed'] };

        // Filter by user
        if (userId) {
            where.userId = userId;
        }

        // Filter by type (lost/found)
        if (type && type !== "all") {
            where.type = type;
        }

        // Filter by category
        if (category) {
            where.category = category;
        }

        // Search in title and description
        if (search) {
            where.OR = [
                { title: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } }
            ];
        }

        const posts = await prisma.post.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit,
            include: {
                user: {
                    select: { name: true, image: true, email: true }
                }
            }
        });

        const total = await prisma.post.count({ where });

        return NextResponse.json({
            posts,
            hasMore: skip + posts.length < total,
            total
        });
    } catch (error) {
        console.error("Error fetching posts:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Post from "@/models/Post";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const data = await req.json();

        console.log("Received post data:", data);
        console.log("Session user:", session.user);

        // @ts-ignore
        const userId = session.user.id; // Added in session callback

        if (!userId) {
            console.error("No user ID in session");
            return NextResponse.json({ error: "User ID not found in session" }, { status: 400 });
        }

        // Validate required fields
        if (!data.title || !data.description || !data.category || !data.type) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Ensure location has required fields
        if (!data.location || typeof data.location.lat !== 'number' || typeof data.location.lng !== 'number') {
            return NextResponse.json({ error: "Invalid location data" }, { status: 400 });
        }

        const post = await Post.create({
            ...data,
            user: userId,
        });

        console.log("Created post:", post);

        return NextResponse.json(post, { status: 201 });
    } catch (error: any) {
        console.error("Error creating post:", error);
        console.error("Error details:", error.message, error.stack);
        return NextResponse.json({
            error: "Internal Server Error",
            details: error.message
        }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const type = searchParams.get("type");
        const category = searchParams.get("category");
        const search = searchParams.get("search");
        const userId = searchParams.get("userId");
        const skip = parseInt(searchParams.get("skip") || "0");
        const limit = parseInt(searchParams.get("limit") || "12");

        const query: any = {};

        // Filter by user
        if (userId) {
            query.user = userId;
        }

        // Filter by type (lost/found)
        if (type && type !== "all") {
            query.type = type;
        }

        // Filter by category
        if (category) {
            query.category = category;
        }

        // Search in title and description
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } }
            ];
        }

        const posts = await Post.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate("user", "name image email");

        const total = await Post.countDocuments(query);

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

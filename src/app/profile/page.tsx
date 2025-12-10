
import React from "react";
import { ProfileDashboard } from "@/components/ProfileDashboard";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/db";
import Post from "@/models/Post";

async function getUserPosts(userId: string) {
    await dbConnect();
    const posts = await Post.find({ user: userId }).sort({ createdAt: -1 }).lean();
    return posts.map(post => ({
        ...post,
        _id: post._id.toString(),
        location: post.location || {},
        user: post.user?.toString()
    }));
}

export default async function ProfilePage() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        redirect("/login");
    }

    // @ts-ignore
    const userId = session.user.id;
    const posts = await getUserPosts(userId);

    return (
        <main className="min-h-screen bg-gray-50 py-8">
            {/* @ts-ignore */}
            <ProfileDashboard posts={posts} user={session.user} />
        </main>
    );
}


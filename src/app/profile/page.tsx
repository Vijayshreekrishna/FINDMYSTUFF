import React from "react";
import { ProfileDashboard } from "@/components/ProfileDashboard";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/db";
import Post from "@/models/Post";
import Link from "next/link";
import GotMyStuffSection from "@/components/profile/GotMyStuffSection";

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
        <main className="min-h-screen bg-gray-50 dark:bg-zinc-950 py-8">
            {/* @ts-ignore */}
            <ProfileDashboard posts={posts} user={session.user} />

            {/* GotMyStuff Section */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                <GotMyStuffSection />
            </div>
        </main>
    );
}

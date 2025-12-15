
import React from "react";
import { ProfileDashboard } from "@/components/ProfileDashboard";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/db";
import Post from "@/models/Post";
import Link from "next/link"; // Import Link

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

            {/* Claim Management Links */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-6">
                <div className="grid md:grid-cols-1 gap-4">
                    {/* Unified Claim Management */}
                    <Link
                        href="/profile/claims"
                        className="block rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-4 hover:bg-gray-50 dark:hover:bg-zinc-700 transition shadow-sm"
                    >
                        <h3 className="font-semibold text-lg text-green-700 dark:text-green-500 flex items-center gap-2">
                            🧾 Claim Management
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                            Track your lost items and manage requests for items you found.
                        </p>
                    </Link>
                </div>
            </div>
        </main>
    );
}

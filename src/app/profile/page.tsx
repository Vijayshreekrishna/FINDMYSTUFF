import React from "react";
import { ProfileDashboard } from "@/components/ProfileDashboard";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";
import GotMyStuffSection from "@/components/profile/GotMyStuffSection";

async function getUserPosts(userId: string) {
    const posts = await prisma.post.findMany({
        where: { userId: userId },
        orderBy: { createdAt: 'desc' }
    });

    return posts.map(post => ({
        ...post,
        _id: post.id,
        user: post.userId,
        location: {
            lat: post.lat,
            lng: post.lng,
            address: post.address
        }
    }));
}

export default async function ProfilePage() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        redirect("/login");
    }

    // @ts-ignore
    const userId = session.user.id;

    // Fetch posts and reputation in parallel
    const [posts, reputation] = await Promise.all([
        getUserPosts(userId),
        prisma.reputation.findUnique({ where: { userId } })
    ]);

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-zinc-950 py-8">
            {/* @ts-ignore */}
            <ProfileDashboard posts={posts} user={session.user} reputation={reputation} />

            {/* GotMyStuff Section */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                <GotMyStuffSection />
            </div>
        </main>
    );
}

import React from "react";
import Link from "next/link";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { Section } from "@/components/Wrappers";
import { ItemsGrid } from "@/components/ItemsGrid";
import dbConnect from "@/lib/db";
import Post from "@/models/Post";

async function getPosts() {
    await dbConnect();
    // Fetch latest 6 posts
    const posts = await Post.find({}).sort({ createdAt: -1 }).limit(6).lean();

    return posts.map(post => ({
        ...post,
        _id: post._id.toString(),
        // Simple serialization for now
        location: post.location || {},
        user: post.user?.toString()
    }));
}

export default async function Home() {
    const posts = await getPosts();

    return (
        <main>
            <Hero />
            <HowItWorks />
            <Section
                title="Recent items"
                subtitle="A mix of lost and found posts near you."
                actions={<Link href="/search" className="inline-flex items-center justify-center font-semibold transition-all duration-200 rounded-xl bg-white text-gray-700 border border-gray-200 hover:border-blue-500 hover:text-blue-600 h-9 px-4 text-sm shadow-sm">View all</Link>}
            >
                {/* @ts-ignore */}
                <ItemsGrid posts={posts} />
            </Section>
        </main>
    );
}

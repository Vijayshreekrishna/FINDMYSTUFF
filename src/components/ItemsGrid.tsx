import React from "react";
import PostCard from "@/components/post-card";

interface Post {
    _id: string;
    title: string;
    description: string;
    type: "lost" | "found";
    location?: {
        lat: number;
        lng: number;
        address?: string;
    };
    category: string;
    createdAt: string;
}

export const ItemsGrid = ({ posts }: { posts?: Post[] }) => {
    if (!posts || posts.length === 0) {
        return (
            <div className="col-span-full py-12 text-center text-gray-500">
                No items found. Be the first to report something!
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
                <PostCard key={post._id} post={post} />
            ))}
        </div>
    );
};

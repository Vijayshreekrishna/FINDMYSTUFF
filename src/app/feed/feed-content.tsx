"use client";

import { useEffect, useState } from "react";
import PostCard from "@/components/post-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function FeedContent() {
    const [posts, setPosts] = useState([]);
    const [filter, setFilter] = useState("all");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPosts();
    }, [filter]);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            let url = "/api/posts";
            if (filter !== "all") {
                url += `?type=${filter}`;
            }
            const res = await fetch(url);
            const data = await res.json();
            setPosts(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen p-4 md:p-8 bg-[var(--background)]">
            <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <h1 className="text-3xl font-bold">Public Feed</h1>
                    <div className="flex flex-col sm:flex-row gap-2 items-center">
                        <Link href="/report">
                            <Button className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 shadow-lg">
                                📝 Report Item
                            </Button>
                        </Link>
                        <div className="flex gap-2">
                            <Button
                                variant={filter === "all" ? "default" : "outline"}
                                onClick={() => setFilter("all")}
                            >
                                All
                            </Button>
                            <Button
                                variant={filter === "lost" ? "default" : "outline"}
                                onClick={() => setFilter("lost")}
                                className={filter === "lost" ? "bg-red-500 hover:bg-red-600" : ""}
                            >
                                Lost
                            </Button>
                            <Button
                                variant={filter === "found" ? "default" : "outline"}
                                onClick={() => setFilter("found")}
                                className={filter === "found" ? "bg-indigo-500 hover:bg-indigo-600" : ""}
                            >
                                Found
                            </Button>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-80 rounded-xl bg-[var(--secondary)] animate-pulse"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {posts.map((post: any) => (
                            <PostCard key={post._id} post={post} />
                        ))}
                    </div>
                )}

                {!loading && posts.length === 0 && (
                    <div className="text-center py-20 text-[var(--secondary-foreground)]">
                        <p className="text-xl">No items found.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

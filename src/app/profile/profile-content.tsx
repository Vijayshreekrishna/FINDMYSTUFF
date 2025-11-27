"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Calendar, MapPin, Package } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import PostCard from "@/components/post-card";

interface ProfileContentProps {
    user: any;
}

export default function ProfileContent({ user }: ProfileContentProps) {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUserPosts();
    }, []);

    const fetchUserPosts = async () => {
        try {
            // @ts-ignore
            const res = await fetch(`/api/posts?userId=${user.id}`);
            const data = await res.json();
            setPosts(data);
        } catch (error) {
            console.error("Error fetching user posts:", error);
        } finally {
            setLoading(false);
        }
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="space-y-8 animate-fade-in pb-20">
            {/* Profile Header */}
            <div className="text-center space-y-6">
                <div className="relative inline-block">
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-[var(--surface-elevated)] shadow-glow mx-auto">
                        {user.image ? (
                            <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-[var(--surface-elevated)] flex items-center justify-center text-4xl">
                                👤
                            </div>
                        )}
                    </div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 bg-[var(--accent)] rounded-full border-4 border-[var(--background)] flex items-center justify-center">
                        <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                    </div>
                </div>

                <div className="space-y-2">
                    <h1 className="text-2xl md:text-3xl font-bold text-white">{user.name}</h1>
                    <div className="flex items-center justify-center gap-2 text-[var(--text-secondary)] text-sm">
                        <Mail className="w-4 h-4" />
                        <span>{user.email}</span>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
                    <Card className="p-4 text-center bg-[var(--surface-elevated)]/50">
                        <div className="text-2xl font-bold text-white">{posts.length}</div>
                        <div className="text-xs text-[var(--text-dim)] uppercase tracking-wider">Posts</div>
                    </Card>
                    <Card className="p-4 text-center bg-[var(--surface-elevated)]/50">
                        <div className="text-2xl font-bold text-[var(--accent)]">Active</div>
                        <div className="text-xs text-[var(--text-dim)] uppercase tracking-wider">Status</div>
                    </Card>
                </div>
            </div>

            {/* User Posts */}
            <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Package className="w-5 h-5 text-[var(--accent)]" />
                        Your Posts
                    </h2>
                </div>

                {loading ? (
                    <div className="grid-responsive">
                        {[1, 2, 3].map(i => (
                            <Skeleton key={i} className="h-[320px] w-full rounded-2xl" />
                        ))}
                    </div>
                ) : (
                    <>
                        {posts.length > 0 ? (
                            <motion.div
                                variants={container}
                                initial="hidden"
                                animate="show"
                                className="grid-responsive"
                            >
                                {posts.map((post: any) => (
                                    <motion.div key={post._id} variants={item}>
                                        <PostCard post={post} onDelete={fetchUserPosts} />
                                    </motion.div>
                                ))}
                            </motion.div>
                        ) : (
                            <Card className="p-12 text-center border-dashed border-[var(--border-hover)] bg-transparent">
                                <div className="max-w-xs mx-auto space-y-4">
                                    <div className="text-4xl opacity-30">📭</div>
                                    <h3 className="text-lg font-medium text-white">No posts yet</h3>
                                    <p className="text-sm text-[var(--text-secondary)]">
                                        You haven't reported any lost or found items yet.
                                    </p>
                                    <Button variant="primary" onClick={() => window.location.href = '/report'}>
                                        Create First Report
                                    </Button>
                                </div>
                            </Card>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

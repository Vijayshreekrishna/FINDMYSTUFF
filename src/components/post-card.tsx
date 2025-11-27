"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Trash2, Loader2, MapPin } from "lucide-react";
import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface PostProps {
    post: any;
    onDelete?: () => void;
}

export default function PostCard({ post, onDelete }: PostProps) {
    const { data: session } = useSession();
    const [isDeleting, setIsDeleting] = useState(false);

    const sessionUserId = (session?.user as any)?.id;
    const postUserId = post.user?._id?.toString() || post.user?.toString();
    const isOwner = sessionUserId && postUserId && sessionUserId === postUserId;

    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!confirm("Delete this post?")) return;

        setIsDeleting(true);
        try {
            const res = await fetch(`/api/posts/${post._id}`, { method: "DELETE" });
            if (res.ok && onDelete) onDelete();
        } catch (error) {
            console.error(error);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <Card className="group relative overflow-hidden p-0 hover:border-[var(--accent)] transition-all">
            {isOwner && (
                <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 hover:bg-[var(--danger)] backdrop-blur-md z-20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                >
                    {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                </button>
            )}

            <Link href={`/feed/${post._id}`} className="block">
                {/* Image - 16:9 */}
                <div className="relative w-full aspect-video bg-[var(--surface)] overflow-hidden">
                    {post.images?.[0] ? (
                        <img src={post.images[0]} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl opacity-20">📦</div>
                    )}
                    <div className={`absolute top-2 left-2 px-2 py-1 rounded-lg text-xs font-bold uppercase backdrop-blur-md ${post.type === "lost" ? "bg-red-500/20 text-red-200 border border-red-500/30" : "bg-emerald-500/20 text-emerald-200 border border-emerald-500/30"
                        }`}>
                        {post.type}
                    </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-2">
                    <span className="inline-block px-2 py-1 rounded-md text-xs font-bold text-white bg-[var(--accent)] opacity-90">
                        {post.category}
                    </span>
                    <h3 className="text-base font-bold text-white line-clamp-2 group-hover:text-[var(--accent)] transition-colors">
                        {post.title}
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)] line-clamp-2">{post.description}</p>
                    <div className="flex items-center justify-between pt-2 border-t border-[var(--border)]">
                        <div className="flex items-center gap-1 text-xs text-[var(--text-secondary)]">
                            <MapPin className="w-3 h-3 text-[var(--accent)]" />
                            <span className="truncate max-w-[100px]">{post.location?.address?.split(',')[0] || "Unknown"}</span>
                        </div>
                        <span className="text-xs text-[var(--text-secondary)]">
                            {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                    </div>
                </div>
            </Link>
        </Card>
    );
}

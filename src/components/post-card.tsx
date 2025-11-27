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
    const sessionEmail = session?.user?.email;
    const postEmail = post.user?.email;

    const isOwner = (sessionUserId && postUserId && sessionUserId === postUserId) || (sessionEmail && postEmail && sessionEmail === postEmail);

    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!confirm("Are you sure you want to delete this post?")) return;

        setIsDeleting(true);
        try {
            const res = await fetch(`/api/posts/${post._id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                if (onDelete) onDelete();
            } else {
                alert("Failed to delete post");
            }
        } catch (error) {
            console.error("Error deleting post:", error);
            alert("Error deleting post");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <Card className="h-full flex flex-col group relative overflow-hidden border-0 bg-[var(--surface-elevated)] p-0 hover:shadow-premium transition-all duration-500">
            {/* Delete Button (Owner Only) */}
            {isOwner && (
                <Button
                    variant="danger"
                    size="icon"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="absolute top-2 left-2 w-8 h-8 rounded-full bg-black/50 hover:bg-[var(--danger)] backdrop-blur-md z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    title="Delete Post"
                >
                    {isDeleting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Trash2 className="w-4 h-4" />
                    )}
                </Button>
            )}

            {/* Card Content */}
            <Link href={`/feed/${post._id}`} className="flex flex-col h-full">
                {/* Image Container */}
                <div className="relative w-full h-52 bg-[var(--surface)] overflow-hidden">
                    {post.images && post.images.length > 0 ? (
                        <img
                            src={post.images[0]}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl opacity-20 grayscale">
                            📦
                        </div>
                    )}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface-elevated)] via-transparent to-transparent opacity-60" />

                    {/* Type Badge */}
                    <div
                        className={`absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase backdrop-blur-md border border-white/10 shadow-lg ${post.type === "lost"
                            ? "bg-red-500/20 text-red-200 border-red-500/20"
                            : "bg-emerald-500/20 text-emerald-200 border-emerald-500/20"
                            }`}
                    >
                        {post.type}
                    </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col relative">
                    {/* Category */}
                    <span className="text-[10px] font-bold tracking-widest text-[var(--accent)] uppercase mb-2">
                        {post.category}
                    </span>

                    {/* Title */}
                    <h3 className="text-lg font-bold leading-tight text-white group-hover:text-[var(--accent)] transition-colors duration-300 mb-3 line-clamp-2">
                        {post.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-[var(--text-secondary)] line-clamp-2 mb-auto leading-relaxed">
                        {post.description}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 mt-4 border-t border-[var(--border)]">
                        <div className="flex items-center gap-1.5 text-[10px] text-[var(--text-dim)] font-medium">
                            <MapPin className="w-3 h-3 text-[var(--accent)]" />
                            <span className="truncate max-w-[120px]">
                                {post.location?.address?.split(',')[0] || "Unknown"}
                            </span>
                        </div>
                        <span className="text-[10px] text-[var(--text-dim)] font-medium bg-[var(--surface)] px-2 py-1 rounded-md">
                            {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                    </div>
                </div>
            </Link>
        </Card>
    );
}

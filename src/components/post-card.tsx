"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Trash2, Loader2 } from "lucide-react";
import { useState } from "react";

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
        <div className="bg-[var(--surface-elevated)] rounded-xl overflow-hidden hover:ring-2 hover:ring-[var(--accent)] transition-all duration-300 h-full flex flex-col group relative">
            {/* Delete Button (Owner Only) */}
            {isOwner && (
                <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="absolute top-2 left-2 p-1.5 rounded-full bg-black/50 hover:bg-[var(--danger)] text-white transition-colors backdrop-blur-sm z-50"
                    title="Delete Post"
                >
                    {isDeleting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Trash2 className="w-4 h-4" />
                    )}
                </button>
            )}

            {/* Card Content - Compact */}
            <Link href={`/feed/${post._id}`} className="flex flex-col h-full">
                {/* Image Container - Compact 4:3 ratio */}
                <div className="relative w-full h-48 bg-[var(--surface)] overflow-hidden">
                    {post.images && post.images.length > 0 ? (
                        <img
                            src={post.images[0]}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl opacity-30">
                            📦
                        </div>
                    )}

                    {/* Type Badge */}
                    <div
                        className={`absolute top-2 right-2 px-2 py-1 rounded-md text-xs font-semibold ${post.type === "lost" ? "bg-[var(--danger)] text-white" : "bg-[var(--success)] text-white"}`}
                    >
                        {post.type}
                    </div>
                </div>

                {/* Card Content - Compact */}
                <div className="p-3 flex-1 flex flex-col">
                    {/* Category - Small tag */}
                    <span className="text-xs text-[var(--accent)] font-medium mb-1.5">
                        {post.category}
                    </span>

                    {/* Title */}
                    <h3 className="text-sm font-semibold line-clamp-2 text-white group-hover:text-[var(--accent)] transition-colors mb-2 min-h-2.5rem">
                        {post.title}
                    </h3>

                    {/* Description - Very subtle */}
                    <p className="text-xs text-[var(--text-dim)] line-clamp-2 mb-auto">
                        {post.description}
                    </p>

                    {/* Footer - Minimal */}
                    <div className="flex items-center justify-between pt-2.5 mt-2.5 border-t border-[var(--border)] text-xs text-[var(--text-dim)]">
                        <span className="flex items-center gap-1 truncate">
                            📍 {post.location?.address?.split(',')[0] || "Unknown"}
                        </span>
                        <span className="whitespace-nowrap ml-2">
                            {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                    </div>
                </div>
            </Link>
        </div>
    );
}

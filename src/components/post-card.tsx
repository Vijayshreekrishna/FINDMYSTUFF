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

    // Determine background style: use image if available, else use a fallback gradient
    const bgStyle = post.images && post.images.length > 0
        ? { backgroundImage: `url(${post.images[0]})` }
        : { backgroundImage: 'linear-gradient(135deg, #F59E0B 0%, #2E6F40 100%)' };

    return (
        <Card className="group relative overflow-hidden rounded-[30px] border-none shadow-lg hover:shadow-xl transition-all aspect-[16/10] w-full bg-cover bg-center p-0" style={bgStyle}>
            {/* Delete Button (Owner Only) */}
            {isOwner && (
                <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 hover:bg-[var(--danger)] backdrop-blur-md z-30 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center text-white"
                >
                    {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                </button>
            )}

            <Link href={`/feed/${post._id}`} className="absolute inset-0 block z-10">
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-300" />

                {/* Content */}
                <div className="absolute inset-0 p-5 flex flex-col justify-between text-white">
                    <div className="flex justify-between items-start">
                        <div className="flex gap-2">
                            {/* Type Badge */}
                            <span className={`px-2 py-1 rounded-lg text-xs font-bold uppercase backdrop-blur-md ${post.type === "lost" ? "bg-red-500/20 text-red-200 border border-red-500/30" : "bg-emerald-500/20 text-emerald-200 border border-emerald-500/30"}`}>
                                {post.type}
                            </span>
                        </div>
                    </div>

                    <div>
                        {/* Category & Date */}
                        <div className="flex items-center gap-2 mb-1 text-xs text-white/70">
                            <span className="font-semibold text-[var(--accent)]">{post.category}</span>
                            <span>•</span>
                            <span>{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                        </div>

                        <h3 className="text-xl font-bold leading-tight mb-1 line-clamp-1 group-hover:text-[var(--accent)] transition-colors">{post.title}</h3>
                        <p className="text-sm text-white/80 font-light mb-2 line-clamp-1">{post.description}</p>

                        {post.location?.address && (
                            <div className="flex items-center gap-1.5 text-xs text-white/60">
                                <MapPin size={12} />
                                <span className="truncate max-w-[200px]">{post.location.address.split(',')[0]}</span>
                            </div>
                        )}
                    </div>
                </div>
            </Link>
        </Card>
    );
}

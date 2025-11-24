"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import PostMap from "@/components/map/PostMap";
import ConfirmDialog from "@/components/ConfirmDialog";
import Link from "next/link";

interface PostDetailClientProps {
    post: any;
}

export default function PostDetailClient({ post }: PostDetailClientProps) {
    const router = useRouter();
    const { data: session } = useSession();
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // @ts-ignore
    const isOwner = session?.user?.id === post.user?._id;

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const res = await fetch(`/api/posts/${post._id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                router.push("/feed");
                router.refresh();
            } else {
                const data = await res.json();
                alert(data.error || "Failed to delete post");
            }
        } catch (error) {
            console.error("Error deleting post:", error);
            alert("Something went wrong");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
            <div className="min-h-screen section-padding">
                <div className="container max-w-5xl">
                    <div className="space-y-6 animate-fade-in">
                        {/* Header with Back and Delete */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                            <Link href="/feed">
                                <button className="premium-button premium-button-ghost">
                                    ← Back to Feed
                                </button>
                            </Link>

                            {isOwner && (
                                <button
                                    onClick={() => setShowDeleteDialog(true)}
                                    className="premium-button premium-button-danger w-full sm:w-auto"
                                    disabled={isDeleting}
                                >
                                    {isDeleting ? "Deleting..." : "Delete Post"}
                                </button>
                            )}
                        </div>

                        {/* Post Content */}
                        <div className="premium-card shadow-premium">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                                {/* Image Section */}
                                <div className="h-64 md:h-80 lg:h-auto bg-[var(--surface)] rounded-xl relative overflow-hidden">
                                    {post.images && post.images.length > 0 ? (
                                        <img
                                            src={post.images[0]}
                                            alt={post.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-5xl md:text-6xl">
                                            📦
                                        </div>
                                    )}
                                </div>

                                {/* Details Section */}
                                <div className="space-y-6">
                                    <div>
                                        <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-3">
                                            <h1 className="text-responsive-2xl md:text-responsive-3xl font-bold text-white">
                                                {post.title}
                                            </h1>
                                            <span className={`px-4 py-1.5 rounded-full text-sm font-bold uppercase whitespace-nowrap ${post.type === 'lost'
                                                    ? 'bg-[var(--danger)] text-white'
                                                    : 'bg-[var(--success)] text-white'
                                                }`}>
                                                {post.type}
                                            </span>
                                        </div>
                                        <p className="text-[var(--text-secondary)] text-responsive-sm">
                                            {post.category}
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <h3 className="font-semibold text-white text-responsive-base">Description</h3>
                                        <p className="text-[var(--text-secondary)] text-responsive-sm leading-relaxed">
                                            {post.description}
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <h3 className="font-semibold text-white text-responsive-base">Location</h3>
                                        <p className="text-responsive-sm text-[var(--text-secondary)] mb-3">
                                            📍 {post.location?.address || "Unknown Address"}
                                        </p>

                                        {post.location?.lat && post.location?.lng && (
                                            <div className="rounded-xl overflow-hidden">
                                                <PostMap
                                                    lat={post.location.lat}
                                                    lng={post.location.lng}
                                                    address={post.location.address}
                                                />
                                            </div>
                                        )}
                                    </div>

                                    <div className="pt-6 border-t border-[var(--border)]">
                                        <p className="text-responsive-sm text-[var(--text-secondary)]">
                                            Posted by <span className="font-semibold text-white">
                                                {post.user?.name || "Anonymous"}
                                            </span> on {new Date(post.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ConfirmDialog
                isOpen={showDeleteDialog}
                onClose={() => setShowDeleteDialog(false)}
                onConfirm={handleDelete}
                title="Delete Post?"
                message="Are you sure you want to delete this post? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                isDanger={true}
            />
        </>
    );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import PostMap from "@/components/map/PostMap";
import Link from "next/link";
import { ArrowLeft, MapPin, Calendar, User, Trash2, Loader2, HandMetal } from "lucide-react";
import ClaimForm from "@/components/claims/ClaimForm";

interface PostDetailClientProps {
    post: any;
}

export default function PostDetailClient({ post }: PostDetailClientProps) {
    const router = useRouter();
    const { data: session } = useSession();
    const [isDeleting, setIsDeleting] = useState(false);
    const [showClaimForm, setShowClaimForm] = useState(false);

    // @ts-ignore
    const sessionUserId = session?.user?.id?.toString();
    const postUserId = post.user?._id?.toString() || post.user?.toString();
    const isOwner = sessionUserId && postUserId && sessionUserId === postUserId;
    // Basic logic: You claim items that are "Found" (because you lost them)
    // Or you can claim a "Lost" item saying "I found it"?
    // Usually "Lost & Found" app:
    // 1. I Lost X -> I Post "Lost X". Use "I Found It" to resolve (handled by owner).
    // 2. I Found Y -> I Post "Found Y". Someone claims "That's mine!" (Claims flow).
    // So Claim button appears on "Found" items for non-owners?
    // User request didn't strictly specify, but "finder <-> owner" implies finder has item.
    // So "Claim" is for items of type 'found'.
    const canClaim = !isOwner && post.type === 'found' && sessionUserId;

    const image = post.images?.[0] || post.image;

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this post?")) return;

        setIsDeleting(true);
        try {
            const res = await fetch(`/api/posts/${post._id}`, { method: "DELETE" });
            if (res.ok) {
                router.push("/feed");
            } else {
                alert("Failed to delete post");
            }
        } catch (error) {
            console.error(error);
            alert("Error deleting post");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                {/* Back Button */}
                <div className="mb-6">
                    <Link
                        href="/feed"
                        className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
                    >
                        <ArrowLeft size={16} className="mr-2" />
                        Back to Feed
                    </Link>
                </div>

                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden relative">

                    {/* Hero Image Section */}
                    {image ? (
                        <div className="w-full bg-gray-100 flex justify-center items-center overflow-hidden h-[400px] sm:h-[500px]">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={image}
                                alt={post.title}
                                className="w-full h-full object-contain"
                            />
                        </div>
                    ) : (
                        <div className="w-full h-48 bg-gray-100 flex flex-col items-center justify-center text-gray-400">
                            <p>No image provided</p>
                        </div>
                    )}

                    {/* Content Section */}
                    <div className="p-6 md:p-10">
                        {/* Header: Type Badge & Date */}
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${post.type === 'lost'
                                ? 'bg-red-50 text-red-600 border border-red-100'
                                : 'bg-green-50 text-green-600 border border-green-100'
                                }`}>
                                {post.type}
                            </span>
                            <span className="flex items-center text-sm text-gray-500">
                                <Calendar size={14} className="mr-1.5" />
                                {new Date(post.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric', month: 'long', day: 'numeric'
                                })}
                            </span>
                            <span className="flex items-center text-sm text-gray-500">
                                <User size={14} className="mr-1.5" />
                                {post.user?.name || "Anonymous"}
                            </span>
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 tracking-tight">
                            {post.title}
                        </h1>

                        {/* Description */}
                        <div className="prose prose-gray max-w-none mb-10">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                                {post.description}
                            </p>
                        </div>

                        {/* Location */}
                        <div className="rounded-2xl bg-gray-50 p-6 border border-gray-100">
                            <h3 className="flex items-center text-lg font-semibold text-gray-900 mb-4">
                                <MapPin size={20} className="mr-2 text-blue-600" />
                                Location
                            </h3>
                            <p className="text-gray-700 mb-4 font-medium">
                                {post.location?.address || "No address provided"}
                            </p>

                            {post.location?.lat && post.location?.lng && (
                                <div className="rounded-xl overflow-hidden h-64 border border-gray-200">
                                    <PostMap
                                        lat={post.location.lat}
                                        lng={post.location.lng}
                                        address={post.location.address}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-8 pt-8 border-t border-gray-100 flex justify-end gap-3">
                            {isOwner && (
                                <button
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    className="px-6 py-2 bg-red-50 text-red-600 font-medium rounded-xl hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {isDeleting ? (
                                        <>
                                            <Loader2 size={16} className="animate-spin" />
                                            Deleting...
                                        </>
                                    ) : (
                                        <>
                                            <Trash2 size={16} />
                                            Delete Post
                                        </>
                                    )}
                                </button>
                            )}

                            {canClaim && (
                                <button
                                    onClick={() => setShowClaimForm(true)}
                                    className="px-6 py-2 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-lg shadow-blue-200"
                                >
                                    <HandMetal size={18} />
                                    Claim This Item
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Claim Modal Overlay */}
                    {showClaimForm && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                            <div className="w-full max-w-lg">
                                <ClaimForm
                                    postId={post._id}
                                    onCancel={() => setShowClaimForm(false)}
                                    onSuccess={(claimId) => {
                                        setShowClaimForm(false);
                                        // Redirect to messages/claim_thread or success?
                                        router.push(`/dashboard/claims`); // Or similar
                                        alert("Claim submitted! Check your dashboard.");
                                    }}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

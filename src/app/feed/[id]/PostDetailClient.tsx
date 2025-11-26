"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import PostMap from "@/components/map/PostMap";
import Link from "next/link";

interface PostDetailClientProps {
    post: any;
}

export default function PostDetailClient({ post }: PostDetailClientProps) {
    const router = useRouter();
    const { data: session } = useSession();

    // @ts-ignore
    const sessionUserId = session?.user?.id?.toString();
    const postUserId = post.user?._id?.toString() || post.user?.toString();
    const isOwner = sessionUserId && postUserId && sessionUserId === postUserId;

    return (
        <>
            <div className="min-h-screen section-padding">
                <div className="container max-w-5xl">
                    <div className="space-y-6 animate-fade-in">
                        {/* Header with Back */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                            <Link href="/feed">
                                <button className="premium-button premium-button-ghost">
                                    ← Back to Feed
                                </button>
                            </Link>
                        </div>

                        {/* Details Section */}
                        <div className="space-y-6">
                            <div>
                                <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-3">
                                    <h1 className="text-responsive-2xl md:text-responsive-3xl font-bold text-white">
                                        {post.title}
                                    </h1>
                                    <span className={`px-4 py-1.5 rounded-full text-sm font-bold uppercase whitespace-nowrap ${post.type === 'lost' ? 'bg-[var(--danger)] text-white' : 'bg-[var(--success)] text-white'}`}>
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
                                    </span> on {new Date(post.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

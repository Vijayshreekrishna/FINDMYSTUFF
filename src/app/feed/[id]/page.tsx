import dbConnect from "@/lib/db";
import Post from "@/models/Post";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import PostMap from "@/components/map/PostMap";
import { notFound } from "next/navigation";

async function getPost(id: string) {
    await dbConnect();
    try {
        const post = await Post.findById(id).populate("user", "name image");
        return post ? JSON.parse(JSON.stringify(post)) : null;
    } catch (error) {
        return null;
    }
}

export default async function PostPage({ params }: { params: { id: string } }) {
    const post = await getPost(params.id);

    if (!post) {
        notFound();
    }

    return (
        <div className="min-h-screen p-4 md:p-8 bg-[var(--background)]">
            <div className="max-w-4xl mx-auto animate-fade-in">
                <Link href="/feed">
                    <Button variant="ghost" className="mb-4">← Back to Feed</Button>
                </Link>

                <div className="glass rounded-xl overflow-hidden">
                    <div className="grid md:grid-cols-2 gap-0">
                        <div className="h-64 md:h-auto bg-gray-200 relative">
                            {post.images && post.images.length > 0 ? (
                                <img src={post.images[0]} alt={post.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-6xl">📦</div>
                            )}
                        </div>

                        <div className="p-6 md:p-8 space-y-6">
                            <div>
                                <div className="flex justify-between items-start">
                                    <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
                                    <span className={`px-3 py-1 rounded-full text-sm font-bold uppercase ${post.type === 'lost' ? 'bg-red-500 text-white' : 'bg-indigo-500 text-white'
                                        }`}>
                                        {post.type}
                                    </span>
                                </div>
                                <p className="text-[var(--secondary-foreground)]">{post.category}</p>
                            </div>

                            <div className="space-y-2">
                                <h3 className="font-semibold">Description</h3>
                                <p className="text-[var(--secondary-foreground)] leading-relaxed">
                                    {post.description}
                                </p>
                            </div>

                            <div className="space-y-2">
                                <h3 className="font-semibold">Location</h3>
                                <p className="text-sm text-[var(--secondary-foreground)] mb-2">
                                    📍 {post.location?.address || "Unknown Address"}
                                </p>

                                {post.location?.lat && post.location?.lng && (
                                    <PostMap
                                        lat={post.location.lat}
                                        lng={post.location.lng}
                                        address={post.location.address}
                                    />
                                )}
                            </div>

                            <div className="pt-4 border-t border-[var(--secondary)]">
                                <p className="text-sm text-[var(--secondary-foreground)]">
                                    Posted by <span className="font-semibold">{post.user?.name || "Anonymous"}</span> on {new Date(post.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

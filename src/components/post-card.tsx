import { Button } from "@/components/ui/button";
import Link from "next/link";

interface PostProps {
    post: any;
}

export default function PostCard({ post }: PostProps) {
    return (
        <div className="glass rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full">
            <div className="relative h-48 bg-gray-200">
                {post.images && post.images.length > 0 ? (
                    <img src={post.images[0]} alt={post.title} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">📦</div>
                )}
                <div className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-bold uppercase ${post.type === 'lost' ? 'bg-red-500 text-white' : 'bg-indigo-500 text-white'
                    }`}>
                    {post.type}
                </div>
            </div>

            <div className="p-4 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold line-clamp-1">{post.title}</h3>
                    <span className="text-xs text-[var(--secondary-foreground)] bg-[var(--secondary)] px-2 py-1 rounded-md">
                        {post.category}
                    </span>
                </div>

                <p className="text-sm text-[var(--secondary-foreground)] line-clamp-2 mb-4 flex-1">
                    {post.description}
                </p>

                <div className="flex items-center text-xs text-[var(--secondary-foreground)] mb-4 gap-2">
                    <span>📍 {post.location?.address || "Unknown Location"}</span>
                    <span>•</span>
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>

                <Link href={`/feed/${post._id}`} className="mt-auto">
                    <Button variant="outline" className="w-full">View Details</Button>
                </Link>
            </div>
        </div>
    );
}

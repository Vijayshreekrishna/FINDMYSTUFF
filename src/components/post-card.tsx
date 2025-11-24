import Link from "next/link";

interface PostProps {
    post: any;
}

export default function PostCard({ post }: PostProps) {
    return (
        <Link href={`/feed/${post._id}`}>
            <div className="bg-[var(--surface-elevated)] rounded-xl overflow-hidden hover:ring-2 hover:ring-[var(--accent)] transition-all duration-300 h-full flex flex-col group">
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

                    {/* Minimal Type Badge */}
                    <div className={`absolute top-2 right-2 px-2 py-1 rounded-md text-xs font-semibold ${post.type === 'lost'
                            ? 'bg-[var(--danger)] text-white'
                            : 'bg-[var(--success)] text-white'
                        }`}>
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
                    <h3 className="text-sm font-semibold line-clamp-2 text-white group-hover:text-[var(--accent)] transition-colors mb-2 min-h-[2.5rem]">
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
            </div>
        </Link>
    );
}

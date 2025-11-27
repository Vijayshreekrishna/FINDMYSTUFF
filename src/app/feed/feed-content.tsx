"use client";

import { useEffect, useState } from "react";
import PostCard from "@/components/post-card";
import { useDebounce } from "@/hooks/useDebounce";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { Plus, Search as SearchIcon, ChevronDown, Layers, Search, CheckCircle } from "lucide-react";
import Link from "next/link";
import SegmentedControl from "@/components/ui/SegmentedControl";
import { Input } from "@/components/ui/Input";

export default function FeedContent() {
    const [posts, setPosts] = useState([]);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [type, setType] = useState("all");
    const [loading, setLoading] = useState(true);

    const debouncedSearch = useDebounce(search, 300);

    useEffect(() => {
        fetchPosts();
    }, [debouncedSearch, category, type]);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (type !== "all") params.append("type", type);
            if (category) params.append("category", category);
            if (debouncedSearch) params.append("search", debouncedSearch);

            const res = await fetch(`/api/posts?${params.toString()}`);
            const data = await res.json();
            setPosts(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const typeSegments = [
        { id: "all", label: "All", icon: Layers },
        { id: "lost", label: "Lost", icon: Search },
        { id: "found", label: "Found", icon: CheckCircle }
    ];

    return (
        <div className="min-h-screen bg-[var(--background)]">
            {/* Header */}
            <div className="container py-6 space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-white">Discover Items</h1>
                        {!loading && <p className="text-sm text-[var(--accent)] mt-1">{posts.length} items found</p>}
                    </div>
                    <Link href="/report">
                        <Button><Plus size={18} className="mr-2" />New Report</Button>
                    </Link>
                </div>

                {/* Filters - Centered */}
                <div className="flex justify-center">
                    <SegmentedControl segments={typeSegments} activeId={type} onChange={setType} />
                </div>

                {/* Search & Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
                    <Input icon={SearchIcon} placeholder="Search items..." value={search} onChange={(e) => setSearch(e.target.value)} />
                    <div className="relative">
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="flex h-[var(--input-height)] w-full rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface-input)] px-4 text-sm text-white focus-visible:outline-none focus-visible:border-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--accent)]/20 transition-all appearance-none cursor-pointer"
                        >
                            <option value="">All Categories</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Clothing">Clothing</option>
                            <option value="Accessories">Accessories</option>
                            <option value="Pets">Pets</option>
                            <option value="Documents">Documents</option>
                            <option value="Other">Other</option>
                        </select>
                        <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Posts Grid */}
            <div className="container pb-8">
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                            <Skeleton key={i} className="h-80 w-full rounded-[var(--radius-lg)]" />
                        ))}
                    </div>
                ) : posts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {posts.map((post: any) => (
                            <PostCard key={post._id} post={post} onDelete={fetchPosts} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <p className="text-6xl mb-4 opacity-20">🔍</p>
                        <h3 className="text-lg font-bold text-white mb-2">No items found</h3>
                        <p className="text-sm text-[var(--text-secondary)]">Try adjusting your filters</p>
                    </div>
                )}
            </div>
        </div>
    );
}

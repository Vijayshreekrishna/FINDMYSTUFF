"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import PostCard from "@/components/post-card";
// import { useDebounce } from "@/hooks/useDebounce"; // No longer needed as SearchBar handles submit
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { Plus, Search as SearchIcon, Layers, Search, CheckCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import SegmentedControl from "@/components/ui/SegmentedControl";
import { SearchBar } from "@/components/SearchBar";
import { PageLoader } from "@/components/ui/NewtonsCradle";

export default function FeedContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    // Derived state from URL
    const search = searchParams.get("q") || "";
    const category = searchParams.get("category") || "";
    // We can keep 'type' (lost/found) as local state or sync it too. User likely wants basic filters first. 
    // Let's keep 'type' local or sync it? Let's sync it for consistency since we are "enhancing".
    const type = searchParams.get("type") || "all";

    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(0);
    const observerTarget = useRef(null);

    // Debounce isn't strictly needed for fetch trigger if we rely on URL changes, 
    // but the SearchBar handles the submission. We just react to URL changes.

    useEffect(() => {
        // Reset and fetch when URL params change
        setPage(0);
        setPosts([]);
        setHasMore(true);
        fetchPosts(0, true);
    }, [search, category, type]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !loading && !loadingMore) {
                    loadMore();
                }
            },
            { threshold: 0.1 }
        );

        if (observerTarget.current) observer.observe(observerTarget.current);
        return () => {
            if (observerTarget.current) observer.unobserve(observerTarget.current);
        };
    }, [hasMore, loading, loadingMore, page]);

    const fetchPosts = async (pageNum: number, isInitial = false) => {
        if (isInitial) setLoading(true);
        else setLoadingMore(true);

        try {
            const params = new URLSearchParams();
            if (type !== "all") params.append("type", type);
            if (category) params.append("category", category);
            if (search) params.append("q", search); // match API expectation
            params.append("skip", (pageNum * 12).toString());
            params.append("limit", "12");

            // Note: Ensure API endpoint handles 'q' or 'search' param correctly. 
            // Previous code used 'search', SearchBar uses 'q'. Let's standardize on 'q' or map it.
            // The API expects 'search' based on previous code `params.append("search", debouncedSearch)`.
            // We should map 'q' to 'search' here if API needs it.
            // Actually, let's fix the API param key in this call:
            const apiParams = new URLSearchParams(params);
            if (search) {
                apiParams.delete("q");
                apiParams.append("search", search);
            }

            const res = await fetch(`/api/posts?${apiParams.toString()}`);
            const data = await res.json();

            const postsData = data.posts || [];

            if (isInitial) {
                setPosts(postsData);
            } else {
                setPosts(prev => {
                    const existingIds = new Set(prev.map((p: any) => p._id));
                    const newPosts = postsData.filter((p: any) => !existingIds.has(p._id));
                    return [...prev, ...newPosts];
                });
            }
            setHasMore(data.hasMore || false);
        } catch (error) {
            console.error("Error fetching posts:", error);
            setPosts([]);
            setHasMore(false);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    const loadMore = useCallback(() => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchPosts(nextPage, false);
    }, [page, type, category, search]);

    const handleTypeChange = (newType: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("type", newType);
        router.push(`${pathname}?${params.toString()}`);
    };

    const handleCategoryChange = (cat: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (category === cat) {
            params.delete("category"); // toggle off
        } else {
            params.set("category", cat);
        }
        router.push(`${pathname}?${params.toString()}`);
    };

    const typeSegments = [
        { id: "all", label: "All", icon: Layers },
        { id: "lost", label: "Lost", icon: Search },
        { id: "found", label: "Found", icon: CheckCircle }
    ];

    const categories = ["Electronics", "Clothing", "Accessories", "Pets", "Documents", "Other"];

    return (
        <div className="min-h-screen bg-[var(--background)]">
            {/* Header */}
            <div className="container mx-auto py-8 space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Discover Items</h1>
                        {!loading && <p className="text-sm text-[var(--text-secondary)] mt-1">{posts.length} results found</p>}
                    </div>
                    <Link href="/report">
                        <Button className="shadow-lg shadow-[var(--accent)]/20"><Plus size={18} className="mr-2" />New Report</Button>
                    </Link>
                </div>

                {/* Search & Filters Area */}
                <div className="space-y-4">
                    {/* Search Bar */}
                    <div className="max-w-2xl mx-auto">
                        <SearchBar />
                    </div>

                    {/* Type Filters (Segmented) */}
                    <div className="flex justify-center">
                        <SegmentedControl segments={typeSegments} activeId={type} onChange={handleTypeChange} />
                    </div>

                    {/* Category Chips */}
                    <div className="flex flex-wrap justify-center gap-2">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => handleCategoryChange(cat)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${category === cat
                                    ? "bg-[var(--accent)] text-white dark:text-white shadow-md shadow-[var(--accent)]/25"
                                    : "bg-[var(--surface)] text-[var(--text-secondary)] hover:bg-[var(--surface-highlight)] border border-[var(--border)]"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 pb-20 max-w-7xl">
                {loading ? (
                    <PageLoader message="Loading posts..." />
                ) : posts.length > 0 ? (
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {posts.map((post: any) => (
                                <PostCard key={post._id} post={post} />
                            ))}
                        </div>

                        {/* Infinite Scroll Trigger & Loading Indicator */}
                        <div ref={observerTarget} className="flex justify-center py-8">
                            {loadingMore && (
                                <div className="flex items-center gap-2 text-[var(--accent)]">
                                    <Loader2 size={20} className="animate-spin" />
                                    <span className="text-sm">Loading more...</span>
                                </div>
                            )}
                            {!hasMore && posts.length > 0 && (
                                <p className="text-sm text-[var(--text-secondary)]">No more items to load</p>
                            )}
                        </div>
                    </>
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

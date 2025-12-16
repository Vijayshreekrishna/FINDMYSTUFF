"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import PostCard from "@/components/post-card";
import { Button } from "@/components/ui/Button";
import { Plus, Layers, Search, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import SegmentedControl from "@/components/ui/SegmentedControl";
import { SearchBar } from "@/components/SearchBar";
import { PageLoader } from "@/components/ui/NewtonsCradle";

export default function FeedContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const search = searchParams.get("q") || "";
    const category = searchParams.get("category") || "";
    const type = searchParams.get("type") || "all";

    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPosts, setTotalPosts] = useState(0);
    const [isMobile, setIsMobile] = useState(false);

    // Responsive posts per page
    const postsPerPage = isMobile ? 12 : 16;
    const totalPages = Math.ceil(totalPosts / postsPerPage);

    // Detect mobile on mount and resize
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        setCurrentPage(1);
        fetchPosts(1);
    }, [search, category, type, postsPerPage]);

    const fetchPosts = async (pageNum: number) => {
        setLoading(true);

        try {
            const params = new URLSearchParams();
            if (type !== "all") params.append("type", type);
            if (category) params.append("category", category);
            if (search) params.append("search", search);

            const skip = (pageNum - 1) * postsPerPage;
            params.append("skip", skip.toString());
            params.append("limit", postsPerPage.toString());

            // Add timestamp to prevent caching
            params.append("_t", Date.now().toString());

            const res = await fetch(`/api/posts?${params.toString()}`, {
                cache: 'no-store',
                headers: {
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache'
                }
            });
            const data = await res.json();

            setPosts(data.posts || []);
            setTotalPosts(data.total || data.posts?.length || 0);
        } catch (error) {
            console.error("Error fetching posts:", error);
            setPosts([]);
            setTotalPosts(0);
        } finally {
            setLoading(false);
        }
    };

    const goToPage = (page: number) => {
        setCurrentPage(page);
        fetchPosts(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleTypeChange = (newType: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("type", newType);
        router.push(`${pathname}?${params.toString()}`);
    };

    const handleCategoryChange = (cat: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (category === cat) {
            params.delete("category");
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
                        {!loading && <p className="text-sm text-[var(--text-secondary)] mt-1">{totalPosts} results found</p>}
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
                                <PostCard
                                    key={post._id}
                                    post={post}
                                    onDelete={() => fetchPosts(currentPage)}
                                />
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-12 flex items-center justify-center gap-2">
                                <button
                                    onClick={() => goToPage(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="p-2 rounded-lg border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-700 dark:text-gray-200"
                                >
                                    <ChevronLeft size={20} />
                                </button>

                                <div className="flex gap-1">
                                    {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                                        let page;
                                        if (totalPages <= 7) {
                                            page = i + 1;
                                        } else if (currentPage <= 4) {
                                            page = i + 1;
                                        } else if (currentPage >= totalPages - 3) {
                                            page = totalPages - 6 + i;
                                        } else {
                                            page = currentPage - 3 + i;
                                        }

                                        return (
                                            <button
                                                key={page}
                                                onClick={() => goToPage(page)}
                                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${currentPage === page
                                                    ? 'bg-blue-600 text-white shadow-md'
                                                    : 'border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-700 text-gray-700 dark:text-gray-200'
                                                    }`}
                                            >
                                                {page}
                                            </button>
                                        );
                                    })}
                                </div>

                                <button
                                    onClick={() => goToPage(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="p-2 rounded-lg border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-700 dark:text-gray-200"
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-16">
                        <p className="text-6xl mb-4 opacity-20">🔍</p>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No items found</h3>
                        <p className="text-sm text-[var(--text-secondary)]">Try adjusting your filters</p>
                    </div>
                )}
            </div>
        </div>
    );
}

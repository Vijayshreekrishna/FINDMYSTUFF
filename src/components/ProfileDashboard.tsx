"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Bell, Send, Package, ChevronLeft, ChevronRight } from "lucide-react";
import { Section } from "@/components/Wrappers";
import PostCard from "@/components/post-card";
import { format } from "date-fns";
import { NewtonsCradle } from "@/components/ui/NewtonsCradle";

const EmptyState = ({ title, action }: { title: string; action?: string }) => (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 dark:border-zinc-700 p-6 text-center text-gray-500 dark:text-gray-400">
        <Send className="mb-2" size={18} />
        <div className="text-sm">{title}</div>
        {action && <Link href="/search" className="mt-2 text-sm text-blue-600 dark:text-blue-400 hover:underline">{action}</Link>}
    </div>
);

interface ProfileDashboardProps {
    posts: any[];
    user: any;
}

export const ProfileDashboard = ({ posts, user }: ProfileDashboardProps) => {
    const [alertsEnabled, setAlertsEnabled] = useState(true);
    const [claims, setClaims] = useState<any[]>([]);
    const [loadingClaims, setLoadingClaims] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 8;

    // Calculate pagination
    const totalPages = Math.ceil(posts.length / postsPerPage);
    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    const currentPosts = posts.slice(startIndex, endIndex);

    useEffect(() => {
        const savedPreference = localStorage.getItem('alertsEnabled');
        if (savedPreference !== null) {
            setAlertsEnabled(savedPreference === 'true');
        } else {
            localStorage.setItem('alertsEnabled', 'true');
        }

        fetchClaims();
    }, []);

    const fetchClaims = async () => {
        try {
            const [receivedRes, myRes] = await Promise.all([
                fetch('/api/claims/received'),
                fetch('/api/claims/my')
            ]);

            const receivedData = await receivedRes.json();
            const myData = await myRes.json();

            const allClaims = [
                ...(Array.isArray(receivedData) ? receivedData : []),
                ...(Array.isArray(myData) ? myData : [])
            ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

            setClaims(allClaims.slice(0, 5));
        } catch (error) {
            console.error('Error fetching claims:', error);
        } finally {
            setLoadingClaims(false);
        }
    };

    const toggleAlerts = () => {
        const newValue = !alertsEnabled;
        setAlertsEnabled(newValue);
        localStorage.setItem('alertsEnabled', String(newValue));
        window.dispatchEvent(new Event('alertsToggled'));
    };

    const goToPage = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <Section
            title={`Hello, ${user?.name?.split(" ")[0] || "User"}`}
            subtitle="Manage your reports and account."
            actions={<Link href="/profile/edit" className="rounded-xl border border-gray-300 dark:border-zinc-600 px-3 py-1.5 text-sm hover:bg-gray-50 dark:hover:bg-zinc-800 bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-200 transition-colors">Edit Profile</Link>}
        >
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="space-y-4 lg:col-span-2">
                    <div className="rounded-2xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-4 shadow-sm">
                        <div className="mb-3 flex items-center justify-between">
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">My Reports</h4>
                            <Link href="/report" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">New report</Link>
                        </div>
                        {posts && posts.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    {currentPosts.map((post) => (
                                        <PostCard key={post._id} post={post} />
                                    ))}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="mt-6 flex items-center justify-center gap-2">
                                        <button
                                            onClick={() => goToPage(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            className="p-2 rounded-lg border border-gray-300 dark:border-zinc-600 hover:bg-gray-50 dark:hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <ChevronLeft size={16} />
                                        </button>

                                        <div className="flex gap-1">
                                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                                <button
                                                    key={page}
                                                    onClick={() => goToPage(page)}
                                                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${currentPage === page
                                                            ? 'bg-blue-600 text-white'
                                                            : 'border border-gray-300 dark:border-zinc-600 hover:bg-gray-50 dark:hover:bg-zinc-700 text-gray-700 dark:text-gray-200'
                                                        }`}
                                                >
                                                    {page}
                                                </button>
                                            ))}
                                        </div>

                                        <button
                                            onClick={() => goToPage(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                            className="p-2 rounded-lg border border-gray-300 dark:border-zinc-600 hover:bg-gray-50 dark:hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <ChevronRight size={16} />
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <EmptyState title="You haven't reported any items yet." action="Report an item" />
                        )}
                    </div>
                </div>
                <aside className="space-y-4">
                    <div className="rounded-2xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-4 shadow-sm">
                        <h4 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">Messages</h4>
                        {loadingClaims ? (
                            <div className="flex justify-center py-4">
                                <NewtonsCradle size={40} color="#84cc16" />
                            </div>
                        ) : claims.length > 0 ? (
                            <div className="space-y-2">
                                {claims.map((claim: any) => (
                                    <Link
                                        key={claim._id}
                                        href={`/profile/claims`}
                                        className="block p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors border border-gray-200 dark:border-zinc-600"
                                    >
                                        <div className="flex items-start gap-2">
                                            <Package size={14} className="text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-medium text-gray-900 dark:text-white truncate">
                                                    {claim.post?.title || 'Item'}
                                                </p>
                                                <p className="text-[10px] text-gray-500 dark:text-gray-400">
                                                    {claim.status === 'pending' ? 'New claim' :
                                                        claim.status === 'awaiting_verification' ? 'Needs review' :
                                                            claim.status}
                                                </p>
                                                <p className="text-[10px] text-gray-400 dark:text-gray-500">
                                                    {format(new Date(claim.createdAt), 'MMM d')}
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                                <Link
                                    href="/profile/claims"
                                    className="block text-center text-xs text-blue-600 dark:text-blue-400 hover:underline mt-2"
                                >
                                    View all
                                </Link>
                            </div>
                        ) : (
                            <EmptyState title="No new messages" action="Go to Search" />
                        )}
                    </div>

                    <div className="rounded-2xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-4 shadow-sm">
                        <h4 className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">Alerts</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">Get notified when similar items are posted nearby.</p>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-700 dark:text-gray-200">Enable alerts</span>
                            <button
                                onClick={toggleAlerts}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-800 ${alertsEnabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-zinc-600'
                                    }`}
                                role="switch"
                                aria-checked={alertsEnabled}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${alertsEnabled ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                />
                            </button>
                        </div>
                    </div>

                    {/* Claim Management - Moved here */}
                    <Link
                        href="/profile/claims"
                        className="block rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-4 hover:bg-gray-50 dark:hover:bg-zinc-700 transition shadow-sm"
                    >
                        <h3 className="font-semibold text-sm text-green-700 dark:text-green-500 flex items-center gap-2 mb-1">
                            🧾 Claim Management
                        </h3>
                        <p className="text-xs text-gray-600 dark:text-gray-300">
                            Track your lost items and manage requests.
                        </p>
                    </Link>
                </aside>
            </div>
        </Section>
    );
};

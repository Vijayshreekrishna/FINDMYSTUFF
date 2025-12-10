import React from "react";
import Link from "next/link";
import { Bell, Send } from "lucide-react";
import { Section } from "@/components/Wrappers";
import PostCard from "@/components/post-card";

const EmptyState = ({ title, action }: { title: string; action?: string }) => (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 p-6 text-center text-gray-500">
        <Send className="mb-2" size={18} />
        <div className="text-sm">{title}</div>
        {action && <Link href="/search" className="mt-2 text-sm text-blue-600 hover:underline">{action}</Link>}
    </div>
);

interface ProfileDashboardProps {
    posts: any[];
    user: any;
}

export const ProfileDashboard = ({ posts, user }: ProfileDashboardProps) => (
    <Section
        title={`Hello, ${user?.name?.split(" ")[0] || "User"}`}
        subtitle="Manage your reports and account."
        actions={<button className="rounded-xl border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50 bg-white text-gray-700">Edit Profile</button>}
    >
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
                <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                    <div className="mb-3 flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-gray-900">My Reports</h4>
                        <Link href="/report" className="text-sm text-blue-600 hover:underline">New report</Link>
                    </div>
                    {posts && posts.length > 0 ? (
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            {posts.map((post) => (
                                <PostCard key={post._id} post={post} />
                            ))}
                        </div>
                    ) : (
                        <EmptyState title="You haven't reported any items yet." action="Report an item" />
                    )}
                </div>
                {/* <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                    <h4 className="mb-3 text-sm font-semibold text-gray-900">Matches</h4>
                    <EmptyState title="No matches found yet" action="Check Search" />
                </div> */}
            </div>
            <aside className="space-y-4">
                <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                    <h4 className="mb-2 text-sm font-semibold text-gray-900">Messages</h4>
                    <EmptyState title="No new messages" action="Go to Search" />
                </div>
                <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                    <h4 className="mb-2 text-sm font-semibold text-gray-900">Alerts</h4>
                    <p className="text-sm text-gray-600">Get notified when similar items are posted nearby.</p>
                    <button className="mt-3 inline-flex items-center gap-2 rounded-2xl border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50 bg-white text-gray-700">
                        <Bell size={16} />Enable alerts
                    </button>
                </div>
            </aside>
        </div>
    </Section>
);

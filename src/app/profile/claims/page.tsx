"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Link as LinkIcon, AlertCircle, CheckCircle2, Clock, XCircle, ArrowLeft, MessageSquare, Bell } from "lucide-react";

export default function UnifiedClaimsPage() {
    const [activeTab, setActiveTab] = useState<'sent' | 'received'>('sent');
    const [myClaims, setMyClaims] = useState<any[] | null>(null);
    const [receivedClaims, setReceivedClaims] = useState<any[] | null>(null);
    const [err, setErr] = useState<string | null>(null);

    useEffect(() => {
        // Fetch Output Claims (My Requests)
        fetch("/api/claims/my")
            .then(r => r.ok ? r.json() : Promise.reject(r))
            .then(data => {
                console.log("My Claims:", data);
                setMyClaims(data);
            })
            .catch(console.error);

        // Fetch Incoming Claims (Received Requests)
        fetch("/api/claims/received")
            .then(r => r.ok ? r.json() : Promise.reject(r))
            .then(data => {
                console.log("Received Claims:", data);
                setReceivedClaims(data);
            })
            .catch(console.error);
    }, []);

    return (
        <div className="p-6 space-y-6 max-w-5xl mx-auto min-h-screen bg-gray-50/50">
            {/* Header with Back Button */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Link href="/profile" className="p-2 bg-white rounded-full border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Claim Management</h1>
                        <p className="text-sm text-gray-500">Track your lost items and manage found items</p>
                    </div>
                </div>

                {/* Tab Switcher */}
                <div className="bg-white p-1 rounded-xl border border-gray-200 flex items-center shadow-sm">
                    <button
                        onClick={() => setActiveTab('sent')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'sent' ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                    >
                        My Requests
                    </button>
                    <button
                        onClick={() => setActiveTab('received')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'received' ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                    >
                        Incoming Claims
                        {receivedClaims && receivedClaims.length > 0 && (
                            <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{receivedClaims.length}</span>
                        )}
                    </button>
                </div>
            </div>

            {activeTab === 'sent' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        🧾 Items You requested
                    </h2>
                    {myClaims === null ? (
                        <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>
                    ) : myClaims.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
                            <p className="text-gray-500 mb-2">You haven't made any claims yet.</p>
                            <Link href="/feed" className="text-blue-600 font-medium hover:underline">Browse Found Items</Link>
                        </div>
                    ) : (
                        <ul className="grid md:grid-cols-2 gap-4">
                            {myClaims.map((c) => (
                                <li key={c._id} className="border border-gray-200 rounded-2xl p-5 bg-white shadow-sm hover:shadow-md transition-all">
                                    <div className="flex items-start justify-between mb-3">
                                        <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">{c.post?.title ?? "Item"}</h3>
                                        <StatusBadge status={c.status} />
                                    </div>
                                    <div className="space-y-2 text-sm text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <Clock size={14} className="text-gray-400" />
                                            <span>Requested on {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : ""}</span>
                                        </div>
                                    </div>
                                    {c.chatThread ? (
                                        <Link href={`/messages/${c.chatThread}`} className="flex items-center justify-center gap-2 mt-4 px-4 py-2 bg-green-50 text-green-700 font-medium rounded-xl hover:bg-green-100 transition-colors w-full">
                                            <LinkIcon size={16} /> Open masked chat
                                        </Link>
                                    ) : (
                                        <div className="mt-4 px-4 py-2 bg-gray-50 text-gray-400 font-medium rounded-xl text-center text-sm">No active chat</div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}

            {activeTab === 'received' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        📬 Claims on your posts
                    </h2>
                    {receivedClaims === null ? (
                        <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>
                    ) : receivedClaims.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
                            <p className="text-gray-500 font-medium">No incoming claims.</p>
                            <p className="text-sm text-gray-400 mt-1">Claims on items you found will appear here.</p>
                        </div>
                    ) : (
                        <ul className="grid gap-4">
                            {receivedClaims.map((c) => (
                                <li key={c._id} className="border border-gray-200 rounded-2xl p-5 bg-white shadow-sm hover:shadow-md transition-all">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between md:justify-start gap-4 mb-2">
                                                <h3 className="font-semibold text-lg text-gray-900">{c.post?.title ?? "Item"}</h3>
                                                <StatusBadge status={c.status} />
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <span className="font-medium">Claimant:</span> {c.claimant?.email || "Anonymous"}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 w-full md:w-auto">
                                            {c.chatThread ? (
                                                <Link href={`/messages/${c.chatThread}`} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200">
                                                    <MessageSquare size={16} /> Chat & Verify
                                                </Link>
                                            ) : (
                                                <span className="text-sm text-gray-400 italic px-2">Chat unavailable</span>
                                            )}
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles: any = {
        pending: "bg-blue-50 text-blue-700 border-blue-200",
        approved: "bg-green-50 text-green-700 border-green-200",
        rejected: "bg-red-50 text-red-700 border-red-200",
        expired: "bg-gray-50 text-gray-600 border-gray-200",
    };
    return (
        <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${styles[status] || styles.pending} capitalize`}>
            {status}
        </span>
    );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MessageSquare, Check, X, Bell } from "lucide-react";

export default function ReceivedClaimsPage() {
    const [claims, setClaims] = useState<any[] | null>(null);
    const [err, setErr] = useState<string | null>(null);

    useEffect(() => {
        fetch("/api/claims/received")
            .then(r => r.ok ? r.json() : Promise.reject(r))
            .then(setClaims)
            .catch(async (e) => {
                try {
                    const msg = await e.text();
                    setErr(msg || "Failed to load");
                } catch {
                    setErr(e?.statusText || "Failed to load");
                }
            });
    }, []);

    if (err) return <div className="p-6 text-red-600 bg-red-50 rounded-xl m-4">{err}</div>;

    return (
        <div className="p-6 space-y-6 max-w-5xl mx-auto">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                    <Bell size={24} />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Incoming Claims</h1>
                    <p className="text-gray-500 text-sm">Review claims on items you found</p>
                </div>
            </div>

            {claims === null ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            ) : claims.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
                    <p className="text-gray-500 font-medium">No active claims yet.</p>
                    <p className="text-sm text-gray-400 mt-1">When someone claims your found item, it will appear here.</p>
                </div>
            ) : (
                <ul className="grid gap-4">
                    {claims.map((c) => (
                        <li key={c._id} className="border border-gray-200 rounded-2xl p-5 bg-white shadow-sm hover:shadow-md transition-all">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center justify-between md:justify-start gap-4 mb-2">
                                        <h3 className="font-semibold text-lg text-gray-900">{c.post?.title ?? "Item"}</h3>
                                        <StatusBadge status={c.status} />
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 overflow-hidden">
                                            {c.claimant?.image ? (
                                                <img src={c.claimant.image} alt={c.claimant.name} className="w-full h-full object-cover" />
                                            ) : (
                                                c.claimant?.name?.[0]?.toUpperCase() || "U"
                                            )}
                                        </div>
                                        <span className="font-medium">Claimant:</span> {c.claimant?.email || "Anonymous"}
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-gray-100">
                                    {c.chatThread ? (
                                        <Link href={`/threads/${c.chatThread}`} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200">
                                            <MessageSquare size={16} /> Chat & Verify
                                        </Link>
                                    ) : (
                                        <span className="text-sm text-gray-400 italic px-2">Chat unavailable</span>
                                    )}
                                    {/* Approval Actions Placeholder - can be enabled later
                  <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Quick Approve">
                    <Check size={20} />
                  </button>
                  <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Quick Reject">
                    <X size={20} />
                  </button>
                  */}
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
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

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Link as LinkIcon, AlertCircle, CheckCircle2, Clock, XCircle } from "lucide-react";

export default function MyClaimsPage() {
    const [claims, setClaims] = useState<any[] | null>(null);
    const [err, setErr] = useState<string | null>(null);

    useEffect(() => {
        fetch("/api/claims/my")
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

    if (err) return <div className="p-6 text-red-600 bg-red-50 rounded-xl m-4 flex items-center gap-2"><AlertCircle size={20} /> {err}</div>;

    return (
        <div className="p-6 space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">My Claim Requests</h1>
                <Link href="/feed" className="text-sm font-medium text-blue-600 hover:underline">Browse Feed</Link>
            </div>

            {claims === null ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            ) : claims.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-300">
                    <p className="text-gray-500 mb-2">No claims submitted yet.</p>
                    <Link href="/feed" className="text-blue-600 font-medium hover:underline">Find something you lost?</Link>
                </div>
            ) : (
                <ul className="grid md:grid-cols-2 gap-4">
                    {claims.map((c) => (
                        <li key={c._id} className="border border-gray-200 rounded-2xl p-5 bg-white shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-3">
                                <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">{c.post?.title ?? "Item"}</h3>
                                <StatusBadge status={c.status} />
                            </div>

                            <div className="space-y-2 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                    <Clock size={14} className="text-gray-400" />
                                    <span>{c.createdAt ? new Date(c.createdAt).toLocaleDateString() : ""}</span>
                                </div>
                                {/* <div>Score: {c.score ?? 0}</div> */}
                            </div>

                            {c.chatThread ? (
                                <Link href={`/threads/${c.chatThread}`} className="flex items-center justify-center gap-2 mt-4 px-4 py-2 bg-green-50 text-green-700 font-medium rounded-xl hover:bg-green-100 transition-colors w-full">
                                    <LinkIcon size={16} /> Open masked chat
                                </Link>
                            ) : (
                                <div className="mt-4 px-4 py-2 bg-gray-50 text-gray-400 font-medium rounded-xl text-center text-sm">
                                    No active chat
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles: any = {
        pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
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

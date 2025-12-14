"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { Check, X, MessageSquare, Shield } from "lucide-react";

interface Claim {
    _id: string;
    post: {
        _id: string;
        title: string;
        images: string[];
    };
    status: string;
    score: number;
    answers: Record<string, any>; // Add answers to interface
    verificationStatus: string; // Add verificationStatus
    createdAt: string;
}

export default function FinderClaimsPage() {
    const [claims, setClaims] = useState<Claim[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // This should actually fetch claims on MY posts
        // We didn't implement GET /api/claims/incoming yet!
        // `GET /api/claims/my` listed claims I MADE.
        // We need `GET /api/claims/incoming` (Claims on my posts).

        // Let's implement that in a separate API call later or assume it exists.
        // For now, I'll mock calling a hypothetical `incoming` endpoint 
        // OR filtering from `GET /api/posts/my/claims` ?

        // Wait, the plan said "Finder Dashboard".
        // I will quick-add endpoint for incoming claims or just mock it here if I missed it.
        // The plan had `GET /api/claims/my` (List claims for current user -> could serve both roles or just claimant).
        // Let's assume we need to fetch claims WHERE post.user == me.
        // I'll add `GET /api/claims/incoming` quickly in next step.
        fetch("/api/claims/incoming")
            .then(async res => {
                if (res.ok) {
                    const data = await res.json();
                    setClaims(data.claims);
                }
            })
            .finally(() => setLoading(false));
    }, []);

    const handleDecision = async (id: string, status: 'approved' | 'rejected') => {
        await fetch(`/api/claims/${id}/decision`, {
            method: 'POST',
            body: JSON.stringify({ status })
        });
        // Refresh
        setClaims(prev => prev.map(c => c._id === id ? { ...c, status } : c));
    };

    if (loading) return <div className="p-8">Loading claims...</div>;

    return (
        <div className="container mx-auto p-4 md:p-8">
            <h1 className="text-3xl font-bold mb-6">Incoming Claims</h1>

            <div className="space-y-6">
                {claims.length === 0 && <p>No active claims on your items.</p>}

                {claims.map(claim => (
                    <div key={claim._id} className="bg-white dark:bg-zinc-900 border rounded-lg p-6 shadow-sm">
                        <div className="flex justify-between items-start">
                            <div className="flex gap-4">
                                {claim.post.images[0] && (
                                    <img src={claim.post.images[0]} className="w-16 h-16 rounded object-cover" alt="" />
                                )}
                                <div>
                                    <h3 className="font-bold text-lg">{claim.post.title}</h3>
                                    <p className="text-sm text-zinc-500">Claimed {format(new Date(claim.createdAt), 'PPP')}</p>
                                    <div className="flex gap-2 mt-2">
                                        <span className={`px-2 py-0.5 rounded text-xs ${claim.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                claim.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                    'bg-red-100 text-red-800'
                                            }`}>
                                            {claim.status.toUpperCase()}
                                        </span>
                                        <span className="px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-800">
                                            Score: {claim.score}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            {claim.status === 'pending' && (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleDecision(claim._id, 'approved')}
                                        className="p-2 border border-green-200 bg-green-50 text-green-600 rounded hover:bg-green-100"
                                    >
                                        <Check size={20} />
                                    </button>
                                    <button
                                        onClick={() => handleDecision(claim._id, 'rejected')}
                                        className="p-2 border border-red-200 bg-red-50 text-red-600 rounded hover:bg-red-100"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Details */}
                        <div className="mt-4 p-4 bg-zinc-50 dark:bg-zinc-800 rounded">
                            <p className="text-sm font-semibold mb-2">Claimant Answers:</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                {Object.entries(claim.answers || {}).map(([k, v]) => (
                                    <div key={k}>
                                        <span className="text-zinc-500 capitalize">{k.replace(/([A-Z])/g, ' $1')}:</span>
                                        <p>{String(v)}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="mt-4 flex justify-between items-center">
                            <p className="text-xs text-zinc-400">Trust Score: {claim.score > 50 ? 'High' : 'Low'}</p>
                            {claim.status !== 'rejected' && (
                                <Link
                                    href={`/messages/${claim._id}`} // Assuming we route to thread
                                    className="flex items-center gap-2 text-blue-600 hover:underline"
                                >
                                    <MessageSquare size={16} />
                                    Open Chat
                                </Link>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

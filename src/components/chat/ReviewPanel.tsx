"use client";

import { useState } from "react";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface ReviewPanelProps {
    claimId: string;
    proof: {
        imageUrl?: string;
        note?: string;
        submittedAt?: Date;
    };
    onDecision?: (decision: 'approved' | 'rejected') => void;
}

export default function ReviewPanel({ claimId, proof, onDecision }: ReviewPanelProps) {
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleDecision = async (decision: 'approved' | 'rejected') => {
        if (!confirm(`Are you sure you want to ${decision} this claim? This cannot be undone.`)) return;

        setProcessing(true);
        setError("");

        try {
            const res = await fetch(`/api/claims/${claimId}/verify`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ decision }),
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || "Failed to verify claim");
            }

            if (onDecision) onDecision(decision);
            router.refresh();
        } catch (e: any) {
            setError(e.message);
            setProcessing(false);
        }
    };

    return (
        <div className="p-4 border border-yellow-200 rounded-2xl bg-yellow-50/50">
            <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <AlertCircle size={18} className="text-yellow-600" />
                Review Proof
            </h3>

            <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm mb-4">
                {proof.imageUrl ? (
                    <img
                        src={proof.imageUrl}
                        alt="Proof"
                        className="w-full h-48 object-cover rounded-lg mb-2 bg-gray-100"
                    />
                ) : (
                    <div className="text-sm text-gray-400 italic text-center py-4 bg-gray-50 rounded-lg">No image provided</div>
                )}

                {proof.note && (
                    <div className="text-sm text-gray-700 bg-gray-50 p-2 rounded-lg mt-2">
                        <span className="font-semibold text-xs text-gray-500 uppercase block mb-1">Note</span>
                        {proof.note}
                    </div>
                )}

                <div className="text-xs text-gray-400 mt-2 text-right">
                    Submitted: {proof.submittedAt ? new Date(proof.submittedAt).toLocaleDateString() : 'N/A'}
                </div>
            </div>

            {error && <div className="text-red-600 text-xs mb-3">{error}</div>}

            <div className="grid grid-cols-2 gap-3">
                <button
                    onClick={() => handleDecision('rejected')}
                    disabled={processing}
                    className="py-2 px-3 border border-red-200 text-red-700 bg-red-50 hover:bg-red-100 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                    <XCircle size={16} /> Reject
                </button>
                <button
                    onClick={() => handleDecision('approved')}
                    disabled={processing}
                    className="py-2 px-3 bg-green-600 text-white hover:bg-green-700 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                    <CheckCircle size={16} /> Approve
                </button>
            </div>
        </div>
    );
}

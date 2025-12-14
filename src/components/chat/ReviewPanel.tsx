"use client";

import { useState } from "react";
import { Check, X, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

interface ReviewPanelProps {
    claimId: string;
    proof: NonNullable<any>['claimerProof'];
    onDecision?: () => void;
}

export default function ReviewPanel({ claimId, proof, onDecision }: ReviewPanelProps) {
    const [status, setStatus] = useState<'idle' | 'submitting'>('idle');
    const router = useRouter();

    const handleDecision = async (decision: 'approved' | 'rejected') => {
        setStatus('submitting');
        try {
            const res = await fetch(`/api/claims/${claimId}/verify`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ decision, reason: `Manually ${decision} by finder.` }),
            });

            if (!res.ok) throw new Error("Failed");

            if (onDecision) onDecision();
            router.refresh();
        } catch (e) {
            alert("Action failed. Try again.");
        } finally {
            setStatus('idle');
        }
    };

    return (
        <div className="p-4 border border-zinc-200 dark:border-zinc-700 rounded-2xl bg-white dark:bg-zinc-800 shadow-sm">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2 text-sm">
                <ShieldCheck size={16} className="text-blue-600" />
                Review Claimant Proof
            </h3>

            <div className="bg-gray-50 dark:bg-zinc-900 rounded-xl p-3 mb-4 border border-gray-100 dark:border-zinc-700">
                {proof.imageUrl && (
                    <div className="mb-2 rounded-lg overflow-hidden border border-gray-200 dark:border-zinc-700 bg-white dark:bg-black">
                        <img
                            src={proof.imageUrl}
                            alt="Proof"
                            className="w-full h-32 object-cover"
                        />
                    </div>
                )}
                <div className="text-xs space-y-1">
                    <p className="text-gray-900 dark:text-gray-100 font-medium">
                        {proof.note || "No note provided."}
                    </p>
                    <div className="text-gray-500 dark:text-gray-400 flex justify-between">
                        <span>Submitted</span>
                        <span>{proof.submittedAt ? format(new Date(proof.submittedAt), 'PP p') : ''}</span>
                    </div>
                </div>
            </div>

            <div className="flex gap-3">
                <button
                    onClick={() => handleDecision('approved')}
                    disabled={status === 'submitting'}
                    className="flex-1 py-2 bg-green-600 text-white rounded-xl font-medium text-sm hover:bg-green-700 disabled:opacity-50 transition-colors flex justify-center items-center gap-2"
                >
                    <Check size={16} />
                    {status === 'submitting' ? "Approving..." : "Approve"}
                </button>
                <button
                    onClick={() => handleDecision('rejected')}
                    disabled={status === 'submitting'}
                    className="flex-1 py-2 bg-red-50 text-red-600 border border-red-200 rounded-xl font-medium text-sm hover:bg-red-100 disabled:opacity-50 transition-colors flex justify-center items-center gap-2"
                >
                    <X size={16} />
                    {status === 'submitting' ? "Rejecting..." : "Reject"}
                </button>
            </div>
        </div>
    );
}

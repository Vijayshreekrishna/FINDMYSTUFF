"use client";

import { useState } from "react";
import { Upload, X, Check } from "lucide-react";
import { useRouter } from "next/navigation";

interface ProofUploadPanelProps {
    claimId: string;
    onSuccess?: () => void;
}

export default function ProofUploadPanel({ claimId, onSuccess }: ProofUploadPanelProps) {
    const [imageUrl, setImageUrl] = useState("");
    const [note, setNote] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    // Mock upload function (replace with real S3/UploadThing in prod)
    // For now, user pastes a URL or we assume an upload handler exists. 
    // Since stage 2 mentioned "Attachments", we can reuse that logic or just simple URL input for prototype.
    // Let's assume URL input for speed as per "free-tier" constraint usually implies avoiding heavy buckets initially.

    const handleSubmit = async () => {
        if (!imageUrl) {
            setError("Please provide an image URL for proof.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const res = await fetch(`/api/claims/${claimId}/proof`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ imageUrl, note }),
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || "Failed to submit proof");
            }

            if (onSuccess) onSuccess();
            router.refresh(); // Refresh server components
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 border border-blue-100 rounded-2xl bg-blue-50/50">
            <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Upload size={18} className="text-blue-600" />
                Submit Proof of Ownership
            </h3>
            <p className="text-sm text-gray-600 mb-4">
                Upload a photo or provide a link to prove this item is yours.
            </p>

            <div className="space-y-3">
                <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Image URL</label>
                    <input
                        type="url"
                        placeholder="https://..."
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        className="w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm p-2 bg-white dark:bg-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                    />
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Note (Optional)</label>
                    <textarea
                        placeholder="Additional details (e.g., serial number, markings)..."
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        className="w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm p-2 bg-white dark:bg-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 h-20"
                    />
                </div>

                {error && <div className="text-red-600 text-xs">{error}</div>}

                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full py-2 bg-blue-600 text-white rounded-xl font-medium text-sm hover:bg-blue-700 disabled:opacity-50 transition-colors flex justify-center items-center gap-2"
                >
                    {loading ? "Submitting..." : <>Submit for Review</>}
                </button>
            </div>
        </div>
    );
}

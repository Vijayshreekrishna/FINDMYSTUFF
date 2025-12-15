"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

// Form Schema
const claimSchema = z.object({
    description: z.string().min(10, "Please provide more detail"),
    dateLost: z.string().min(1, "Required"),
    locationDetails: z.string().min(1, "Required"),
});

type ClaimFormData = z.infer<typeof claimSchema>;

interface ClaimFormProps {
    postId: string;
    onSuccess?: (claimId: string) => void;
    onCancel?: () => void;
}

export default function ClaimForm({ postId, onSuccess, onCancel }: ClaimFormProps) {
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const { register, handleSubmit, formState: { errors } } = useForm<ClaimFormData>({
        resolver: zodResolver(claimSchema)
    });

    const onSubmit = async (data: ClaimFormData) => {
        setIsSubmitting(true);
        try {
            const answers = {
                description: data.description,
                dateLost: data.dateLost,
                locationDetails: data.locationDetails,
            };

            const res = await fetch("/api/claims", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    postId,
                    answers,
                    evidenceImage: "" // Optional: implement upload later if needed
                }),
            });

            if (!res.ok) {
                const err = await res.json();
                alert(err.error || "Failed");
                setIsSubmitting(false);
                return;
            }

            const { claim, threadId } = await res.json();

            // Redirect directly to chat if threadId exists
            if (threadId) {
                router.push(`/messages/${threadId}`);
            } else if (onSuccess) {
                onSuccess(claim._id);
            } else {
                router.push('/profile/claims');
            }

        } catch (e) {
            console.error(e);
            alert("Error submitting claim");
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-lg w-full border border-gray-100">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Claim this Item</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">When did you lose it?</label>
                    <input
                        type="date"
                        {...register("dateLost")}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900"
                    />
                    {errors.dateLost && <p className="text-red-500 text-sm mt-1">{errors.dateLost.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Where did you lose it? (Be specific)</label>
                    <textarea
                        {...register("locationDetails")}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 resize-none"
                        rows={3}
                        placeholder="e.g., Near the main entrance, on the bench..."
                    />
                    {errors.locationDetails && <p className="text-red-500 text-sm mt-1">{errors.locationDetails.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Describe the item (Unique features)</label>
                    <textarea
                        {...register("description")}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 h-24 resize-none"
                        placeholder="Scratches, specific contents, unique marks..."
                    />
                    {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
                </div>

                <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-5 py-2.5 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-lg shadow-blue-200"
                    >
                        {isSubmitting ? "Submitting..." : "Submit Claim"}
                    </button>
                </div>
            </form>
        </div>
    );
}

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

            const { claim } = await res.json();
            if (onSuccess) onSuccess(claim._id);
            else router.refresh();

        } catch (e) {
            console.error(e);
            alert("Error submitting claim");
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-xl max-w-lg w-full">
            <h2 className="text-2xl font-bold mb-4">Claim this Item</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">When did you lose it?</label>
                    <input
                        type="date"
                        {...register("dateLost")}
                        className="w-full p-2 border rounded dark:bg-zinc-800"
                    />
                    {errors.dateLost && <p className="text-red-500 text-sm">{errors.dateLost.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Where did you lose it? (Be specific)</label>
                    <textarea
                        {...register("locationDetails")}
                        className="w-full p-2 border rounded dark:bg-zinc-800"
                        placeholder="e.g., Near the main entrance, on the bench..."
                    />
                    {errors.locationDetails && <p className="text-red-500 text-sm">{errors.locationDetails.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Describe the item (Unique features)</label>
                    <textarea
                        {...register("description")}
                        className="w-full p-2 border rounded dark:bg-zinc-800 h-24"
                        placeholder="Scratches, colors, contents..."
                    />
                    {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 rounded text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                        {isSubmitting ? "Submitting..." : "Submit Claim"}
                    </button>
                </div>
            </form>
        </div>
    );
}

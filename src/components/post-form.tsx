"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { CldUploadWidget } from "next-cloudinary";
import { useRouter } from "next/navigation";
import MapPicker from "./map/MapPicker";

type FormData = {
    title: string;
    description: string;
    category: string;
    type: "lost" | "found";
    location: {
        lat: number;
        lng: number;
        address: string;
    };
    images: string[];
};

export default function PostForm() {
    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
        defaultValues: {
            type: "lost",
            images: [],
            location: { lat: 0, lng: 0, address: "" }
        }
    });
    const [uploading, setUploading] = useState(false);
    const router = useRouter();
    const images = watch("images");
    const selectedType = watch("type");

    const onSubmit = async (data: FormData) => {
        try {
            setUploading(true);
            const res = await fetch("/api/posts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (res.ok) {
                router.push("/feed");
                router.refresh();
            } else {
                alert("Failed to create post");
            }
        } catch (error) {
            console.error(error);
            alert("Something went wrong");
        } finally {
            setUploading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-2xl mx-auto">
            {/* Type Selection */}
            <div className="space-y-3">
                <label className="text-sm font-medium text-[var(--text-secondary)]">Type</label>
                <div className="flex gap-4">
                    <label className={`flex-1 premium-card cursor-pointer transition-all ${selectedType === "lost" ? "border-[var(--danger)] shadow-glow" : ""
                        }`}>
                        <input
                            {...register("type")}
                            type="radio"
                            value="lost"
                            className="sr-only"
                        />
                        <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedType === "lost" ? "border-[var(--danger)]" : "border-[var(--border)]"
                                }`}>
                                {selectedType === "lost" && (
                                    <div className="w-3 h-3 rounded-full bg-[var(--danger)]" />
                                )}
                            </div>
                            <span className="font-medium text-white">Lost Item</span>
                        </div>
                    </label>
                    <label className={`flex-1 premium-card cursor-pointer transition-all ${selectedType === "found" ? "border-[var(--success)] shadow-glow" : ""
                        }`}>
                        <input
                            {...register("type")}
                            type="radio"
                            value="found"
                            className="sr-only"
                        />
                        <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedType === "found" ? "border-[var(--success)]" : "border-[var(--border)]"
                                }`}>
                                {selectedType === "found" && (
                                    <div className="w-3 h-3 rounded-full bg-[var(--success)]" />
                                )}
                            </div>
                            <span className="font-medium text-white">Found Item</span>
                        </div>
                    </label>
                </div>
            </div>

            {/* Title */}
            <div className="space-y-3">
                <label className="text-sm font-medium text-[var(--text-secondary)]">Title</label>
                <input
                    {...register("title", { required: "Title is required" })}
                    className="premium-input w-full"
                    placeholder="e.g. Red Backpack"
                />
                {errors.title && <p className="text-[var(--danger)] text-sm">{errors.title.message}</p>}
            </div>

            {/* Category */}
            <div className="space-y-3">
                <label className="text-sm font-medium text-[var(--text-secondary)]">Category</label>
                <select
                    {...register("category", { required: "Category is required" })}
                    className="premium-input w-full cursor-pointer"
                >
                    <option value="">Select Category</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Pets">Pets</option>
                    <option value="Documents">Documents</option>
                    <option value="Other">Other</option>
                </select>
                {errors.category && <p className="text-[var(--danger)] text-sm">{errors.category.message}</p>}
            </div>

            {/* Description */}
            <div className="space-y-3">
                <label className="text-sm font-medium text-[var(--text-secondary)]">Description</label>
                <textarea
                    {...register("description", { required: "Description is required" })}
                    className="premium-input w-full min-h-[120px] resize-none"
                    placeholder="Describe the item in detail..."
                />
                {errors.description && <p className="text-[var(--danger)] text-sm">{errors.description.message}</p>}
            </div>

            {/* Location */}
            <div className="space-y-3">
                <label className="text-sm font-medium text-[var(--text-secondary)]">Location</label>
                <MapPicker onLocationSelect={(lat, lng) => {
                    setValue("location.lat", lat);
                    setValue("location.lng", lng);
                }} />
                <input
                    onChange={(e) => setValue("location.address", e.target.value)}
                    className="premium-input w-full"
                    placeholder="Add address details (e.g. Central Park, near the fountain)"
                />
            </div>

            {/* Photos */}
            <div className="space-y-3">
                <label className="text-sm font-medium text-[var(--text-secondary)]">Photos</label>
                {process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ? (
                    <>
                        <CldUploadWidget
                            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                            onSuccess={(result: any) => {
                                setValue("images", [...images, result.info.secure_url]);
                            }}
                        >
                            {({ open }) => {
                                return (
                                    <button
                                        type="button"
                                        onClick={() => open()}
                                        className="premium-button premium-button-ghost w-full"
                                    >
                                        📸 Upload Image
                                    </button>
                                );
                            }}
                        </CldUploadWidget>

                        <div className="grid grid-cols-4 gap-3">
                            {images.map((img, i) => (
                                <div key={i} className="relative group">
                                    <img
                                        src={img}
                                        alt="Preview"
                                        className="w-full h-24 object-cover rounded-lg"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setValue("images", images.filter((_, idx) => idx !== i))}
                                        className="absolute top-1 right-1 bg-[var(--danger)] text-white w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="premium-card bg-[var(--danger-dim)] border-[var(--danger)]">
                        <p className="text-sm text-[var(--danger)]">
                            ⚠️ Image upload is disabled. Please configure Cloudinary in your .env.local file.
                            <br />
                            <span className="text-xs">See setup_instructions.md for details.</span>
                        </p>
                    </div>
                )}
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                className="premium-button premium-button-primary w-full py-4 text-lg shadow-glow"
                disabled={uploading}
            >
                {uploading ? "Submitting..." : "Submit Report"}
            </button>
        </form>
    );
}

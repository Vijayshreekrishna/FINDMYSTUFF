"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { CldUploadWidget } from "next-cloudinary";
import { useRouter } from "next/navigation";
import MapPicker from "./map/MapPicker";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Camera, X, MapPin } from "lucide-react";
import { motion } from "framer-motion";

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
                <label className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider ml-1">Type</label>
                <div className="flex gap-4">
                    <label className="flex-1 cursor-pointer">
                        <input
                            {...register("type")}
                            type="radio"
                            value="lost"
                            className="sr-only"
                        />
                        <Card
                            variant={selectedType === "lost" ? "elevated" : "default"}
                            className={`h-full flex items-center justify-center p-4 transition-all ${selectedType === "lost" ? "border-[var(--danger)] shadow-[0_0_20px_rgba(239,68,68,0.2)]" : "opacity-60 hover:opacity-100"}`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedType === "lost" ? "border-[var(--danger)]" : "border-[var(--text-secondary)]"}`}>
                                    {selectedType === "lost" && <div className="w-2 h-2 rounded-full bg-[var(--danger)]" />}
                                </div>
                                <span className="font-medium text-white">Lost Item</span>
                            </div>
                        </Card>
                    </label>
                    <label className="flex-1 cursor-pointer">
                        <input
                            {...register("type")}
                            type="radio"
                            value="found"
                            className="sr-only"
                        />
                        <Card
                            variant={selectedType === "found" ? "elevated" : "default"}
                            className={`h-full flex items-center justify-center p-4 transition-all ${selectedType === "found" ? "border-[var(--success)] shadow-[0_0_20px_rgba(16,185,129,0.2)]" : "opacity-60 hover:opacity-100"}`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedType === "found" ? "border-[var(--success)]" : "border-[var(--text-secondary)]"}`}>
                                    {selectedType === "found" && <div className="w-2 h-2 rounded-full bg-[var(--success)]" />}
                                </div>
                                <span className="font-medium text-white">Found Item</span>
                            </div>
                        </Card>
                    </label>
                </div>
            </div>

            {/* Title */}
            <Input
                label="Title"
                {...register("title", { required: "Title is required" })}
                placeholder="e.g. Red Backpack"
                error={errors.title?.message}
            />

            {/* Category */}
            <div className="space-y-1">
                <label className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider ml-1">Category</label>
                <div className="relative group">
                    <select
                        {...register("category", { required: "Category is required" })}
                        className="flex h-12 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm text-white ring-offset-background focus-visible:outline-none focus-visible:border-[var(--accent)] focus-visible:shadow-[0_0_0_4px_var(--accent-dim)] disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 appearance-none cursor-pointer"
                    >
                        <option value="" className="bg-[var(--surface)] text-white">Select Category</option>
                        <option value="Electronics" className="bg-[var(--surface)] text-white">Electronics</option>
                        <option value="Clothing" className="bg-[var(--surface)] text-white">Clothing</option>
                        <option value="Accessories" className="bg-[var(--surface)] text-white">Accessories</option>
                        <option value="Pets" className="bg-[var(--surface)] text-white">Pets</option>
                        <option value="Documents" className="bg-[var(--surface)] text-white">Documents</option>
                        <option value="Other" className="bg-[var(--surface)] text-white">Other</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--text-secondary)]">
                        ▼
                    </div>
                </div>
                {errors.category && <p className="text-xs text-[var(--danger)] ml-1">{errors.category.message}</p>}
            </div>

            {/* Description */}
            <div className="space-y-1">
                <label className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider ml-1">Description</label>
                <textarea
                    {...register("description", { required: "Description is required" })}
                    className="flex min-h-[120px] w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-white ring-offset-background placeholder:text-[var(--text-dim)] focus-visible:outline-none focus-visible:border-[var(--accent)] focus-visible:shadow-[0_0_0_4px_var(--accent-dim)] disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 resize-none"
                    placeholder="Describe the item in detail..."
                />
                {errors.description && <p className="text-xs text-[var(--danger)] ml-1">{errors.description.message}</p>}
            </div>

            {/* Location */}
            <div className="space-y-3">
                <label className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider ml-1">Location</label>
                <div className="bg-[var(--surface)] rounded-xl border border-[var(--border)] overflow-hidden">
                    <MapPicker
                        onLocationSelect={(lat, lng) => {
                            setValue("location.lat", lat);
                            setValue("location.lng", lng);
                        }}
                        onAddressChange={(address) => {
                            setValue("location.address", address);
                        }}
                    />
                </div>
                <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
                    <input
                        {...register("location.address")}
                        className="flex h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] pl-9 pr-3 text-sm text-white focus:outline-none focus:border-[var(--accent)] transition-colors placeholder:text-[var(--text-dim)]"
                        placeholder="Add address details..."
                    />
                </div>
            </div>

            {/* Photos */}
            <div className="space-y-3">
                <label className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider ml-1">Photos</label>
                {process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ? (
                    <div className="space-y-4">
                        <div className="grid grid-cols-4 gap-3">
                            {images.map((img, i) => (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    key={i}
                                    className="relative group aspect-square"
                                >
                                    <img
                                        src={img}
                                        alt="Preview"
                                        className="w-full h-full object-cover rounded-xl border border-[var(--border)]"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setValue("images", images.filter((_, idx) => idx !== i))}
                                        className="absolute -top-2 -right-2 bg-[var(--danger)] text-white w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg flex items-center justify-center"
                                    >
                                        <X size={14} />
                                    </button>
                                </motion.div>
                            ))}
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
                                            className="aspect-square rounded-xl border-2 border-dashed border-[var(--border)] hover:border-[var(--accent)] hover:bg-[var(--accent-dim)] transition-all flex flex-col items-center justify-center gap-2 text-[var(--text-secondary)] hover:text-[var(--accent)]"
                                        >
                                            <Camera size={24} />
                                            <span className="text-xs font-medium">Add Photo</span>
                                        </button>
                                    );
                                }}
                            </CldUploadWidget>
                        </div>
                    </div>
                ) : (
                    <Card variant="glass" className="border-[var(--danger)] bg-[var(--danger-dim)]">
                        <p className="text-sm text-[var(--danger)] flex items-center gap-2">
                            ⚠️ Image upload disabled. Configure Cloudinary.
                        </p>
                    </Card>
                )}
            </div>

            {/* Submit Button */}
            <Button
                type="submit"
                size="lg"
                className="w-full text-lg font-bold shadow-glow"
                isLoading={uploading}
            >
                Submit Report
            </Button>
        </form>
    );
}

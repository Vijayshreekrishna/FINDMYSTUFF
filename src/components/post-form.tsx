"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { CldUploadWidget } from "next-cloudinary";
import { useRouter } from "next/navigation";
import MapPicker from "./map/MapPicker";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { X, MapPin, Search, CheckCircle, UploadCloud, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SegmentedControl from "@/components/ui/SegmentedControl";

type FormData = {
    title: string;
    description: string;
    category: string;
    type: "lost" | "found";
    location: { lat: number; lng: number; address: string };
    images: string[];
};

export default function PostForm() {
    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
        defaultValues: { type: "lost", images: [], location: { lat: 0, lng: 0, address: "" } }
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
            }
        } catch (error) {
            console.error(error);
        } finally {
            setUploading(false);
        }
    };

    const typeSegments = [
        { id: "lost", label: "Lost", icon: Search },
        { id: "found", label: "Found", icon: CheckCircle }
    ];

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="form-container space-y-6 py-8">
            <input type="hidden" {...register("type")} value={selectedType} />

            {/* Type Toggle */}
            <div className="flex justify-center">
                <SegmentedControl segments={typeSegments} activeId={selectedType} onChange={(id) => setValue("type", id as "lost" | "found")} />
            </div>

            {/* Details */}
            <Card className="space-y-4">
                <h3 className="text-lg font-bold text-white">Item Details</h3>
                <Input label="Title" {...register("title", { required: "Title is required" })} placeholder="e.g. Red Backpack" error={errors.title?.message} />

                <div className="space-y-1">
                    <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Category</label>
                    <div className="relative">
                        <select {...register("category", { required: "Category is required" })} className="flex h-[var(--input-height)] w-full rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface-input)] px-4 text-sm text-white focus-visible:outline-none focus-visible:border-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--accent)]/20 transition-all appearance-none cursor-pointer">
                            <option value="">Select Category</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Clothing">Clothing</option>
                            <option value="Accessories">Accessories</option>
                            <option value="Pets">Pets</option>
                            <option value="Documents">Documents</option>
                            <option value="Other">Other</option>
                        </select>
                        <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] pointer-events-none" />
                    </div>
                    {errors.category && <p className="text-xs text-[var(--danger)]">{errors.category.message}</p>}
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Description</label>
                    <textarea {...register("description", { required: "Description is required" })} className="flex min-h-[120px] w-full rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface-input)] px-4 py-3 text-sm text-white placeholder:text-[var(--text-secondary)]/50 focus-visible:outline-none focus-visible:border-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--accent)]/20 transition-all resize-none" placeholder="Describe the item..." />
                    {errors.description && <p className="text-xs text-[var(--danger)]">{errors.description.message}</p>}
                </div>
            </Card>

            {/* Location */}
            <Card className="space-y-4">
                <h3 className="text-lg font-bold text-white">Location</h3>
                <div className="rounded-[var(--radius-sm)] overflow-hidden border border-[var(--border)] h-[200px]">
                    <MapPicker onLocationSelect={(lat, lng) => { setValue("location.lat", lat); setValue("location.lng", lng); }} onAddressChange={(address) => setValue("location.address", address)} />
                </div>
                <Input icon={MapPin} {...register("location.address")} placeholder="Add address details..." />
            </Card>

            {/* Photos */}
            <Card className="space-y-4">
                <h3 className="text-lg font-bold text-white">Photos</h3>
                {process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ? (
                    <div className="grid grid-cols-3 gap-3">
                        <AnimatePresence>
                            {images.map((img) => (
                                <motion.div key={img} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="relative group aspect-square rounded-[var(--radius-sm)] overflow-hidden border border-[var(--border)]">
                                    <img src={img} alt="Preview" className="w-full h-full object-cover" />
                                    <button type="button" onClick={() => setValue("images", images.filter((i) => i !== img))} className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <div className="w-8 h-8 rounded-full bg-[var(--danger)] flex items-center justify-center text-white">
                                            <X size={16} />
                                        </div>
                                    </button>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        <CldUploadWidget uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET} onSuccess={(result: any) => setValue("images", [...images, result.info.secure_url])}>
                            {({ open }) => (
                                <button type="button" onClick={() => open()} className="aspect-square rounded-[var(--radius-sm)] border-2 border-dashed border-[var(--border)] hover:border-[var(--accent)] hover:bg-[var(--accent)]/5 transition-all flex flex-col items-center justify-center gap-2 text-[var(--text-secondary)] hover:text-[var(--accent)]">
                                    <UploadCloud size={24} />
                                    <span className="text-xs font-semibold">Upload</span>
                                </button>
                            )}
                        </CldUploadWidget>
                    </div>
                ) : (
                    <div className="p-3 rounded-[var(--radius-sm)] border border-[var(--danger)]/20 bg-[var(--danger)]/5 text-[var(--danger)] text-sm">
                        Image upload disabled
                    </div>
                )}
            </Card>

            <Button type="submit" size="lg" className="w-full" isLoading={uploading}>Submit Report</Button>
        </form>
    );
}

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { CldUploadWidget } from "next-cloudinary";
import { Button } from "@/components/ui/button";
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
            location: { lat: 0, lng: 0, address: "" } // Default location for now
        }
    });
    const [uploading, setUploading] = useState(false);
    const router = useRouter();
    const images = watch("images");

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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-xl mx-auto p-6 glass rounded-xl">
            <div className="space-y-2">
                <label className="text-sm font-medium">Type</label>
                <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input {...register("type")} type="radio" value="lost" className="accent-[var(--destructive)]" />
                        <span>Lost Item</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input {...register("type")} type="radio" value="found" className="accent-[var(--primary)]" />
                        <span>Found Item</span>
                    </label>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <input
                    {...register("title", { required: "Title is required" })}
                    className="w-full p-2 rounded-md border border-[var(--secondary)] bg-transparent"
                    placeholder="e.g. Red Backpack"
                />
                {errors.title && <p className="text-red-500 text-xs">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <select
                    {...register("category", { required: "Category is required" })}
                    className="w-full p-2 rounded-md border border-[var(--secondary)] bg-transparent"
                >
                    <option value="">Select Category</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Pets">Pets</option>
                    <option value="Documents">Documents</option>
                    <option value="Other">Other</option>
                </select>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <textarea
                    {...register("description", { required: "Description is required" })}
                    className="w-full p-2 rounded-md border border-[var(--secondary)] bg-transparent min-h-[100px]"
                    placeholder="Describe the item..."
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <MapPicker onLocationSelect={(lat, lng) => {
                    setValue("location.lat", lat);
                    setValue("location.lng", lng);
                }} />
                <input
                    onChange={(e) => setValue("location.address", e.target.value)}
                    className="w-full p-2 rounded-md border border-[var(--secondary)] bg-transparent mt-2"
                    placeholder="Add address details (e.g. Central Park, near the fountain)"
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Photos</label>
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
                                    <Button type="button" variant="outline" onClick={() => open()}>
                                        Upload Image
                                    </Button>
                                );
                            }}
                        </CldUploadWidget>

                        <div className="flex gap-2 mt-2 overflow-x-auto">
                            {images.map((img, i) => (
                                <img key={i} src={img} alt="Preview" className="h-20 w-20 object-cover rounded-md" />
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="p-4 rounded-md bg-yellow-500/10 border border-yellow-500/20">
                        <p className="text-sm text-yellow-600 dark:text-yellow-400">
                            ⚠️ Image upload is disabled. Please configure Cloudinary in your .env.local file.
                            <br />
                            See <code className="text-xs bg-black/20 px-1 py-0.5 rounded">setup_instructions.md</code> for details.
                        </p>
                    </div>
                )}
            </div>

            <Button type="submit" className="w-full" disabled={uploading}>
                {uploading ? "Submitting..." : "Submit Report"}
            </Button>
        </form>
    );
}

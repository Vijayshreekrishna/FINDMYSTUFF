"use client";

import React, { useState } from "react";
import { Camera, Loader2, X, UploadCloud } from "lucide-react";
import { useRouter } from "next/navigation";
import MapPicker from "@/components/map/MapPicker";
import { CldUploadWidget } from "next-cloudinary";

export const ReportForm = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [images, setImages] = useState<string[]>([]);
    const [formData, setFormData] = useState({
        title: "",
        category: "Electronics",
        type: "lost",
        date: new Date().toISOString().split("T")[0],
        description: "",
        location: {
            lat: 51.505,
            lng: -0.09,
            address: "",
        },
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch("/api/posts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, images }),
            });

            if (!res.ok) throw new Error("Failed to create post");

            router.push("/feed");
            router.refresh();
        } catch (error) {
            console.error(error);
            alert("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="mb-3 block text-sm font-semibold text-gray-900 dark:text-gray-100">Type</label>
                <div className="flex gap-4">
                    <label className={formData.type === "lost" ? "radio-label-active" : "radio-label"}>
                        <input
                            type="radio"
                            name="type"
                            value="lost"
                            checked={formData.type === "lost"}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            className="radio-input"
                        />
                        <div className="radio-button">LOST</div>
                    </label>
                    <label className={formData.type === "found" ? "radio-label-active" : "radio-label"}>
                        <input
                            type="radio"
                            name="type"
                            value="found"
                            checked={formData.type === "found"}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            className="radio-input"
                        />
                        <div className="radio-button">FOUND</div>
                    </label>
                </div>
            </div>

            <style jsx>{`
                .radio-label {
                    cursor: pointer;
                }
                .radio-button {
                    width: 75px;
                    height: 38px;
                    background: #1f2937;
                    color: #9ca3af;
                    border: 2px solid #374151;
                    box-shadow: 0 4px #1f2937, 0 8px #111827;
                    font-size: 14px;
                    font-weight: bold;
                    text-align: center;
                    line-height: 38px;
                    cursor: pointer;
                    border-radius: 10px;
                    transition: all 0.2s ease-in-out;
                    position: relative;
                    user-select: none;
                }
                .radio-input {
                    display: none;
                }
                /* LOST button when checked */
                .radio-label-active:has(input[value="lost"]) .radio-button {
                    background: #ef4444;
                    color: white;
                    box-shadow: 0 5px #991b1b, 0 10px #7f1d1d;
                    transform: translateY(3px);
                    border-color: #fca5a5;
                }
                /* FOUND button when checked */
                .radio-label-active:has(input[value="found"]) .radio-button {
                    background: #22c55e;
                    color: white;
                    box-shadow: 0 5px #15803d, 0 10px #166534;
                    transform: translateY(3px);
                    border-color: #86efac;
                }
                /* Hover effects */
                .radio-button:hover {
                    transform: translateY(1px);
                    box-shadow: 0 4px #1f2937, 0 8px #111827;
                }
                .radio-label-active .radio-button:hover {
                    transform: translateY(4px);
                }
                
                /* Upload Button Styles */
                .upload-button {
                    background: #2E2E2E;
                    border: 2px solid transparent;
                    box-shadow: 0 12px 16px 0 rgba(0, 0, 0, 0.24);
                    transition: all 0.3s ease-in-out;
                    cursor: pointer;
                    color: white;
                }
                .upload-button:hover {
                    background: linear-gradient(90deg, #FC466B 0%, #3F5EFB 100%);
                }
                .upload-button:active {
                    transform: translateY(0.2em);
                }
                .upload-text {
                    font-weight: 800;
                    letter-spacing: 2px;
                    font-size: 12px;
                    background: linear-gradient(90deg, #FC466B 0%, #3F5EFB 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    transition: all 0.3s ease-in-out;
                }
                .upload-button:hover .upload-text {
                    background: #2E2E2E;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }
                .upload-button:hover :global(svg) {
                    color: white;
                }
                
                /* Neumorphic Input Styles */
                .neumorphic-input {
                    border: 1px solid rgba(0, 0, 0, 0.1);
                    padding: 1rem;
                    border-radius: 1rem;
                    background: #e8e8e8;
                    /* box-shadow removed for flat design */
                    transition: all 0.3s ease-in-out;
                    color: #2E2E2E;
                    font-size: 14px;
                }
                .neumorphic-input:focus {
                    outline: none;
                    border: 1px solid rgba(63, 94, 251, 0.3);
                    background: #e8e8e8;
                    /* box-shadow removed for flat design */
                }
                .neumorphic-input::placeholder {
                    color: #999;
                }
            `}</style>

            <div>
                <label className="mb-1 block text-sm font-semibold text-gray-900 dark:text-gray-100">Item Name</label>
                <input
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="neumorphic-input w-full"
                    placeholder="e.g., Black backpack"
                />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                    <label className="mb-1 block text-sm font-semibold text-gray-900 dark:text-gray-100">Category</label>
                    <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="neumorphic-input w-full"
                    >
                        <option>Electronics</option>
                        <option>Bags</option>
                        <option>Documents</option>
                        <option>Accessories</option>
                        <option>Pets</option>
                        <option>Other</option>
                    </select>
                </div>
                <div>
                    <label className="mb-1 block text-sm font-semibold text-gray-900 dark:text-gray-100">Date</label>
                    <input
                        type="date"
                        required
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="neumorphic-input w-full"
                    />
                </div>
            </div>

            <div>
                <label className="mb-1 block text-sm font-semibold text-gray-900 dark:text-gray-100">Location</label>
                <div className="rounded-xl border border-gray-300 p-3 bg-white space-y-3">
                    <input
                        readOnly
                        placeholder="Address will appear here..."
                        value={formData.location.address}
                        className="w-full bg-transparent outline-none text-gray-900 text-sm font-medium mb-2"
                    />
                    <MapPicker
                        onLocationSelect={(lat, lng) => setFormData(prev => ({ ...prev, location: { ...prev.location, lat, lng } }))}
                        onAddressChange={(address) => setFormData(prev => ({ ...prev, location: { ...prev.location, address } }))}
                    />
                </div>
            </div>

            <div>
                <label className="mb-1 block text-sm font-semibold text-gray-900 dark:text-gray-100">Description</label>
                <textarea
                    rows={3}
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="neumorphic-input w-full"
                    placeholder="Distinct marks, color, brand, etc."
                />
            </div>

            {/* Image Upload with Cloudinary */}
            <div>
                <label className="mb-1 block text-sm font-semibold text-gray-900 dark:text-gray-100">Upload Images</label>
                {process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ? (
                    <div className="grid grid-cols-3 gap-3">
                        {images.map((img) => (
                            <div key={img} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-300">
                                <img src={img} alt="Preview" className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => setImages(images.filter((i) => i !== img))}
                                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                                >
                                    <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white">
                                        <X size={16} />
                                    </div>
                                </button>
                            </div>
                        ))}
                        <CldUploadWidget
                            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                            onSuccess={(result: any) => setImages([...images, result.info.secure_url])}
                        >
                            {({ open }) => (
                                <button
                                    type="button"
                                    onClick={() => open()}
                                    className="upload-button aspect-square rounded-xl flex flex-col items-center justify-center gap-2"
                                >
                                    <UploadCloud size={24} />
                                    <span className="upload-text">UPLOAD</span>
                                </button>
                            )}
                        </CldUploadWidget>
                    </div>
                ) : (
                    <div className="p-4 rounded-xl border border-red-200 bg-red-50 text-red-600 text-sm">
                        ⚠️ Image upload disabled. Please configure Cloudinary environment variables.
                    </div>
                )}
                <p className="mt-2 text-xs text-gray-500">Click to upload from camera or gallery</p>
            </div>

            <div className="flex items-center justify-between pt-2">
                <div className="text-xs text-gray-500">Posting to public feed</div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="rounded-2xl bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 font-medium shadow-sm transition-colors disabled:opacity-50 inline-flex items-center gap-2"
                >
                    {isLoading && <Loader2 size={16} className="animate-spin" />}
                    Submit
                </button>
            </div>
        </form>
    );
};

"use client";

import React, { useState } from "react";
import { Camera, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import MapPicker from "@/components/map/MapPicker";

export const ReportForm = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
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
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error("Failed to create post");

            router.push("/feed"); // Redirect to feed or matches
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
                <label className="mb-1 block text-sm font-medium text-gray-700">Type</label>
                <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                        <input
                            type="radio"
                            name="type"
                            value="lost"
                            checked={formData.type === "lost"}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            className="text-blue-600"
                        />
                        <span>Lost Item</span>
                    </label>
                    <label className="flex items-center gap-2">
                        <input
                            type="radio"
                            name="type"
                            value="found"
                            checked={formData.type === "found"}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            className="text-blue-600"
                        />
                        <span>Found Item</span>
                    </label>
                </div>
            </div>

            <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Item Name</label>
                <input
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full rounded-xl border border-gray-300 p-3 outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                    placeholder="e.g., Black backpack"
                />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Category</label>
                    <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full rounded-xl border border-gray-300 p-3 outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
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
                    <label className="mb-1 block text-sm font-medium text-gray-700">Date</label>
                    <input
                        type="date"
                        required
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full rounded-xl border border-gray-300 p-3 outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                    />
                </div>
            </div>

            <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Location</label>
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
                <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
                <textarea
                    rows={3}
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full rounded-xl border border-gray-300 p-3 outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                    placeholder="Distinct marks, color, brand, etc."
                />
            </div>

            {/* Image Upload Placeholder - requires configured backend/cloudinary */}
            <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Upload Image</label>
                <div className="flex items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 p-6 text-gray-500 hover:bg-gray-50 cursor-pointer transition-colors">
                    <Camera className="mr-2" size={18} /> Image upload coming soon
                </div>
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

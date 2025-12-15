"use client";

import { useEffect, useState } from "react";
import { Sparkles, Package, Calendar, TrendingUp } from "lucide-react";
import { format } from "date-fns";

interface SuccessStory {
    id: string;
    post: {
        title: string;
        image: string | null;
        type: string;
        category: string;
        location: string;
    };
    finder: string;
    owner: string;
    completedAt: string;
    createdAt: string;
}

export default function SuccessStories() {
    const [stories, setStories] = useState<SuccessStory[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSuccessStories();
    }, []);

    const fetchSuccessStories = async () => {
        try {
            const res = await fetch('/api/claims/success-stories');
            if (res.ok) {
                const data = await res.json();
                setStories(data.slice(0, 8)); // Show only 8 stories
            }
        } catch (error) {
            console.error('Error fetching success stories:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading || stories.length === 0) {
        return null; // Don't show section if no stories
    }

    return (
        <section className="py-16 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-zinc-900 dark:to-zinc-800">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-medium mb-4">
                        <TrendingUp size={16} />
                        Community Success
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
                        Successfully GotMyStuff! 🎉
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Celebrating our community's successful reunions. These items found their way home!
                    </p>
                </div>

                {/* Stories Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stories.map((story, index) => (
                        <div
                            key={story.id}
                            className="bg-white dark:bg-zinc-800 rounded-2xl border border-gray-200 dark:border-zinc-700 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            {/* Image */}
                            <div className="relative h-48 bg-gray-100 dark:bg-zinc-700 overflow-hidden">
                                {story.post.image ? (
                                    <img
                                        src={story.post.image}
                                        alt={story.post.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Package className="text-gray-400 dark:text-gray-500" size={48} />
                                    </div>
                                )}

                                {/* Success Badge */}
                                <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                                    <Sparkles size={12} />
                                    Returned
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-4">
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                                    {story.post.title}
                                </h3>

                                <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400 mb-3">
                                    <div className="flex items-center gap-1">
                                        <Package size={12} />
                                        <span className="capitalize">{story.post.type} • {story.post.category}</span>
                                    </div>

                                    <div className="flex items-center gap-1">
                                        <Calendar size={12} />
                                        <span>{format(new Date(story.completedAt), 'MMM d, yyyy')}</span>
                                    </div>
                                </div>

                                {/* User Info (Masked) */}
                                <div className="pt-3 border-t border-gray-100 dark:border-zinc-700">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                                        <span className="font-medium text-green-600 dark:text-green-400">{story.finder}</span>
                                        {' → '}
                                        <span className="font-medium text-blue-600 dark:text-blue-400">{story.owner}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer Message */}
                {stories.length > 0 && (
                    <div className="text-center mt-12">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            <span className="font-semibold text-green-600 dark:text-green-400">{stories.length}+</span> items successfully returned to their owners
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}

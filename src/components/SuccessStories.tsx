"use client";

import { useEffect, useState } from "react";
import { Sparkles, Package, Calendar, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

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

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const cardVariants = {
        hidden: {
            opacity: 0,
            y: 100,
            rotateX: -15,
            z: -100,
            scale: 0.8
        },
        visible: {
            opacity: 1,
            y: 0,
            rotateX: 0,
            z: 0,
            scale: 1,
            transition: {
                type: "spring" as const,
                stiffness: 80,
                damping: 15,
                duration: 0.8
            }
        }
    } as const;

    const headerVariants = {
        hidden: { opacity: 0, y: -20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6
            }
        }
    } as const;

    return (
        <section className="relative py-16 overflow-hidden">
            {/* Gradient Background Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-50/40 via-emerald-50/30 to-green-50/40 dark:from-green-900/10 dark:via-emerald-900/5 dark:to-green-900/10 pointer-events-none"></div>

            {/* Top Gradient Fade */}
            <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-white dark:from-zinc-950 via-white/50 dark:via-zinc-950/50 to-transparent pointer-events-none z-10"></div>

            {/* Bottom Gradient Fade */}
            <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white dark:from-zinc-950 via-white/50 dark:via-zinc-950/50 to-transparent pointer-events-none z-10"></div>

            <div className="container mx-auto px-4 relative z-20">
                {/* Header */}
                <motion.div
                    className="text-center mb-12"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={headerVariants}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-medium mb-4">
                        <TrendingUp size={16} />
                        Success Stories
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
                        GotMyStuff! 🎉
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Celebrating our community's successful reunions. These items found their way home!
                    </p>
                </motion.div>

                {/* Stories Grid */}
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                    style={{ perspective: "1000px" }}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    variants={containerVariants}
                >
                    {stories.map((story) => (
                        <motion.div
                            key={story.id}
                            variants={cardVariants}
                            whileHover={{
                                y: -12,
                                scale: 1.05,
                                rotateY: 5,
                                z: 50,
                                transition: { duration: 0.3 }
                            }}
                            style={{
                                transformStyle: "preserve-3d",
                                transformPerspective: 1000
                            }}
                            className="bg-white dark:bg-zinc-800 rounded-2xl border border-gray-200 dark:border-zinc-700 overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 group"
                        >
                            {/* Image */}
                            <div className="relative h-48 bg-gray-100 dark:bg-zinc-700 overflow-hidden">
                                {story.post.image ? (
                                    <img
                                        src={story.post.image}
                                        alt={story.post.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Package className="text-gray-400 dark:text-gray-500" size={48} />
                                    </div>
                                )}

                                {/* Success Badge */}
                                <motion.div
                                    className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg"
                                    initial={{ scale: 0, rotate: -180 }}
                                    whileInView={{ scale: 1, rotate: 0 }}
                                    viewport={{ once: true }}
                                    transition={{
                                        delay: 0.3,
                                        type: "spring",
                                        stiffness: 200,
                                        damping: 10
                                    }}
                                >
                                    <Sparkles size={12} />
                                    Returned
                                </motion.div>
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
                        </motion.div>
                    ))}
                </motion.div>

                {/* Footer Message */}
                {stories.length > 0 && (
                    <motion.div
                        className="text-center mt-12"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                    >
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            <span className="font-semibold text-green-600 dark:text-green-400">{stories.length}+</span> items successfully returned to their owners
                        </p>
                    </motion.div>
                )}
            </div>
        </section>
    );
}

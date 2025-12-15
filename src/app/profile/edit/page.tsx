import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function EditProfilePage() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        redirect("/login");
    }

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-zinc-950 py-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
                {/* Back Button */}
                <Link
                    href="/profile"
                    className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
                >
                    <ArrowLeft size={16} />
                    Back to Profile
                </Link>

                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Edit Profile</h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-300">Update your account information</p>
                </div>

                {/* Edit Form */}
                <div className="rounded-2xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-6 shadow-sm">
                    <form className="space-y-6">
                        {/* Name Field */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                                Full Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                defaultValue={session.user.name || ""}
                                className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
                                placeholder="Enter your full name"
                            />
                        </div>

                        {/* Email Field (Read-only) */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                defaultValue={session.user.email || ""}
                                disabled
                                className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-zinc-600 bg-gray-100 dark:bg-zinc-900/50 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                            />
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Email cannot be changed</p>
                        </div>

                        {/* Profile Image URL (Optional) */}
                        <div>
                            <label htmlFor="image" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                                Profile Image URL
                            </label>
                            <input
                                type="url"
                                id="image"
                                name="image"
                                defaultValue={session.user.image || ""}
                                className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
                                placeholder="https://example.com/avatar.jpg"
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-4">
                            <button
                                type="submit"
                                className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors shadow-sm"
                            >
                                Save Changes
                            </button>
                            <Link
                                href="/profile"
                                className="px-4 py-2.5 rounded-xl border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-700 font-medium transition-colors text-center"
                            >
                                Cancel
                            </Link>
                        </div>
                    </form>

                    {/* Info Message */}
                    <div className="mt-6 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                        <p className="text-sm text-blue-800 dark:text-blue-300">
                            <strong>Note:</strong> Profile editing functionality is coming soon. This form is currently for display purposes only.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}

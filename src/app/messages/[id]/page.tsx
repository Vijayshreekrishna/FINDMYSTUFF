import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import MaskedChat from "@/components/chat/MaskedChat";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function MessagePage({ params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    // @ts-ignore
    const userId = session?.user?.id;
    const { id } = await params;

    if (!session) {
        redirect("/login");
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 p-4 sm:p-6">
            <div className="max-w-4xl mx-auto space-y-4">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <Link
                        href="/profile/claims"
                        className="p-2 bg-white dark:bg-zinc-900 rounded-full border dark:border-zinc-800 shadow-sm hover:shadow transition-all text-gray-600 dark:text-gray-300"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Secure Chat</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Anonymous communication channel</p>
                    </div>
                </div>

                {/* Chat Component */}
                <MaskedChat threadId={id} currentUserId={userId} />
            </div>
        </div>
    );
}

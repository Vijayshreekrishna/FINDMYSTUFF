import PostForm from "@/components/post-form";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

// Force dynamic rendering since we need session access
export const dynamic = 'force-dynamic';

export default async function ReportPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/api/auth/signin?callbackUrl=/report");
    }

    return (
        <div className="min-h-screen section-padding">
            <div className="container max-w-4xl">
                <div className="space-y-8 md:space-y-12 animate-fade-in">
                    <div className="text-center space-y-3">
                        <h1 className="text-responsive-3xl md:text-responsive-4xl lg:text-5xl font-bold">
                            <span className="text-gradient">Report an Item</span>
                        </h1>
                        <p className="text-[var(--text-secondary)] text-responsive-base md:text-responsive-lg max-w-2xl mx-auto px-4">
                            Lost something? Found something? Let the community know.
                        </p>
                    </div>

                    <PostForm />
                </div>
            </div>
        </div>
    );
}

import PostForm from "@/components/post-form";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function ReportPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/api/auth/signin?callbackUrl=/report");
    }

    return (
        <div className="min-h-screen p-4 md:p-8 bg-[var(--background)]">
            <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold">Report an Item</h1>
                    <p className="text-[var(--secondary-foreground)]">
                        Lost something? Found something? Let the community know.
                    </p>
                </div>

                <PostForm />
            </div>
        </div>
    );
}

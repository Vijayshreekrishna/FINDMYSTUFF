import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { PageContainer } from "@/components/layout/PageContainer";
import ProfileContent from "./profile-content";

// Force dynamic rendering since we need session access
export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/api/auth/signin?callbackUrl=/profile");
    }

    return (
        <PageContainer>
            <ProfileContent user={session.user} />
        </PageContainer>
    );
}

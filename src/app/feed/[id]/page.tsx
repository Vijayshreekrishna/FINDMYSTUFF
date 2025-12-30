import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import PostDetailClient from "./PostDetailClient";

// Force dynamic rendering since we need database access
export const dynamic = 'force-dynamic';

async function getPost(id: string) {
    try {
        const post = await prisma.post.findUnique({
            where: { id: id },
            include: { user: { select: { name: true, image: true } } }
        });
        return post ? JSON.parse(JSON.stringify(post)) : null;
    } catch (error) {
        return null;
    }
}

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const post = await getPost(id);

    if (!post) {
        notFound();
    }

    return <PostDetailClient post={post} />;
}

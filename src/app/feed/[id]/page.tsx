import dbConnect from "@/lib/db";
import Post from "@/models/Post";
import { notFound } from "next/navigation";
import PostDetailClient from "./PostDetailClient";

// Force dynamic rendering since we need database access
export const dynamic = 'force-dynamic';

async function getPost(id: string) {
    await dbConnect();
    try {
        const post = await Post.findById(id).populate("user", "name image");
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

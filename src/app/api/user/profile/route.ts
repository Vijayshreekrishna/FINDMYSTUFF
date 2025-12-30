import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

// Update user profile
export async function PATCH(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // @ts-ignore
        const userId = session.user.id;
        const body = await req.json();
        const { name, image } = body;

        // Validate input
        if (!name || name.trim().length === 0) {
            return NextResponse.json({ error: "Name is required" }, { status: 400 });
        }

        // Update user
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                name: name.trim(),
                ...(image && { image: image.trim() })
            },
            select: { name: true, email: true, image: true }
        });

        if (!updatedUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            user: {
                name: updatedUser.name,
                email: updatedUser.email,
                image: updatedUser.image
            }
        });

    } catch (error: any) {
        console.error("Error updating user profile:", error);
        return NextResponse.json(
            { error: "Failed to update profile", details: error.message },
            { status: 500 }
        );
    }
}

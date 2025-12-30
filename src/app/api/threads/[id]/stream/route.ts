import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

// Simple polling interval for SSE simulation
const POLL_INTERVAL_MS = 1000;

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    // @ts-ignore
    const userId = session.user.id;
    const { id } = await params;

    // Verify access once
    const thread = await prisma.chatThread.findUnique({
        where: { id: id },
    });

    if (!thread || (thread.finderId !== userId && thread.claimantId !== userId)) {
        return new NextResponse("Forbidden", { status: 403 });
    }

    // Set up SSE stream
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
        async start(controller) {
            let lastCheck = new Date();

            const sendEvent = (data: any) => {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
            };

            // Initial connection event
            sendEvent({ type: "connected" });

            // Polling loop
            const interval = setInterval(async () => {
                try {
                    // Check for messages created after lastCheck
                    const newMessages = await prisma.message.findMany({
                        where: {
                            threadId: id,
                            createdAt: { gt: lastCheck }
                        },
                        orderBy: { createdAt: 'asc' }
                    });

                    if (newMessages.length > 0) {
                        lastCheck = new Date(); // Update watermark
                        sendEvent({ type: "messages", messages: newMessages });
                    }
                } catch (e) {
                    console.error("SSE Error", e);
                }
            }, POLL_INTERVAL_MS);

            // Close connection when client disconnects
            req.signal.addEventListener("abort", () => {
                clearInterval(interval);
                controller.close();
            });
        },
    });

    return new NextResponse(stream, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        },
    });
}

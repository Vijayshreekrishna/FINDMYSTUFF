"use client";

import { useEffect, useState, useRef } from "react";
import { format } from "date-fns";
import { Send, Lock, RotateCcw } from "lucide-react";

interface Message {
    _id: string;
    sender: string;
    content: string;
    createdAt: string;
}

interface Thread {
    _id: string;
    maskedHandleMap: Record<string, string>;
    allowLinks: boolean;
    isClosed: boolean;
    finder: string;
    claim: { _id: string } | string;
}

export default function MaskedChat({ threadId, currentUserId }: { threadId: string, currentUserId: string }) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [thread, setThread] = useState<Thread | null>(null);
    const [newMessage, setNewMessage] = useState("");
    const [handoffCode, setHandoffCode] = useState("");
    const bottomRef = useRef<HTMLDivElement>(null);

    // Initial load
    useEffect(() => {
        fetch(`/api/threads/${threadId}`)
            .then(res => res.json())
            .then(data => {
                setMessages(data.messages);
                setThread(data.thread);
            });
    }, [threadId]);

    // SSE Stream
    useEffect(() => {
        const eventSource = new EventSource(`/api/threads/${threadId}/stream`);

        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'messages') {
                // Determine valid new messages (dedupe)
                setMessages(prev => {
                    const ids = new Set(prev.map(m => m._id));
                    const fresh = data.messages.filter((m: Message) => !ids.has(m._id));
                    return [...prev, ...fresh];
                });
            }
        };

        return () => {
            eventSource.close();
        };
    }, [threadId]);

    // Auto-scroll
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = async () => {
        if (!newMessage.trim()) return;
        const msg = newMessage;
        setNewMessage(""); // Optimistic clear

        await fetch(`/api/threads/${threadId}/messages`, {
            method: 'POST',
            body: JSON.stringify({ content: msg })
        });
        // We rely on SSE to append it to list, or we can append optimistically here
    };

    const handleHandoffGenerate = async () => {
        if (!thread) return;
        const claimId = typeof thread.claim === 'string' ? thread.claim : thread.claim._id;
        const res = await fetch(`/api/claims/${claimId}/handoff`, { method: 'POST' });
        const data = await res.json();
        if (data.code) {
            alert(`Your Handoff Code is: ${data.code}\nShare this with the claimant ONLY when meeting.`);
        }
    };

    const handleHandoffConfirm = async () => {
        if (!thread) return;
        if (!handoffCode) return;
        const claimId = typeof thread.claim === 'string' ? thread.claim : thread.claim._id;
        const res = await fetch(`/api/claims/${claimId}/handoff/confirm`, {
            method: 'POST',
            body: JSON.stringify({ code: handoffCode })
        });
        const data = await res.json();
        if (data.success) {
            alert("Handoff confirmed! Interaction complete.");
            window.location.reload();
        } else {
            alert(data.error || "Invalid code");
        }
    };

    if (!thread) return <div>Loading chat...</div>;

    const myHandle = thread.maskedHandleMap[currentUserId] || "Me";
    const otherHandle = Object.values(thread.maskedHandleMap).find(h => h !== myHandle) || "User";
    const isFinder = thread.finder === currentUserId;

    return (
        <div className="flex flex-col h-[500px] bg-zinc-50 dark:bg-zinc-900 rounded-lg border dark:border-zinc-700">
            {/* Header */}
            <div className="p-4 border-b dark:border-zinc-700 flex justify-between items-center bg-white dark:bg-zinc-800 rounded-t-lg">
                <div>
                    <h3 className="font-bold">Chat with {otherHandle}</h3>
                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                        <Lock size={12} />
                        <span>End-to-end masked • Links {thread.allowLinks ? 'Allowed' : 'Blocked'}</span>
                    </div>
                </div>
                {/* Handoff Actions */}
                <div className="flex gap-2">
                    {isFinder ? (
                        <button
                            onClick={handleHandoffGenerate}
                            className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                        >
                            Generate Code
                        </button>
                    ) : (
                        <div className="flex gap-1">
                            <input
                                value={handoffCode}
                                onChange={e => setHandoffCode(e.target.value)}
                                placeholder="6-digit code"
                                className="w-24 text-sm px-2 border rounded"
                            />
                            <button
                                onClick={handleHandoffConfirm}
                                className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                            >
                                Confirm
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map(msg => {
                    const isMe = msg.sender === currentUserId;
                    return (
                        <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[70%] p-3 rounded-lg ${isMe
                                ? 'bg-blue-600 text-white rounded-br-none'
                                : 'bg-gray-200 dark:bg-zinc-700 text-zinc-900 dark:text-gray-100 rounded-bl-none'
                                }`}>
                                <p>{msg.content}</p>
                                <span className="text-[10px] opacity-70 mt-1 block">
                                    {format(new Date(msg.createdAt), 'h:mm a')}
                                </span>
                            </div>
                        </div>
                    );
                })}
                <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white dark:bg-zinc-800 border-t dark:border-zinc-700 rounded-b-lg">
                <div className="flex gap-2">
                    <input
                        value={newMessage}
                        onChange={e => setNewMessage(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && sendMessage()}
                        placeholder={thread.isClosed ? "Thread is closed" : "Type a message..."}
                        disabled={thread.isClosed}
                        className="flex-1 p-2 border rounded dark:bg-zinc-900"
                    />
                    <button
                        onClick={sendMessage}
                        disabled={thread.isClosed || !newMessage.trim()}
                        className="bg-blue-600 text-white p-2 rounded disabled:opacity-50"
                    >
                        <Send size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}

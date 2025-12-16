"use client";

import { useEffect, useState, useRef } from "react";
import { format } from "date-fns";
import { Send, Lock, RotateCcw } from "lucide-react";
import ProofUploadPanel from "./ProofUploadPanel";
import ReviewPanel from "./ReviewPanel";
import StatusBadge from "./StatusBadge";

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
    claim: {
        _id: string;
        status: 'pending' | 'awaiting_verification' | 'approved' | 'rejected' | 'expired' | 'completed';
        claimerProof?: {
            imageUrl: string;
            note?: string;
            submittedAt: Date;
        };
    };
}

export default function MaskedChat({ threadId, currentUserId }: { threadId: string, currentUserId: string }) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [thread, setThread] = useState<Thread | null>(null);
    const [newMessage, setNewMessage] = useState("");
    const [handoffCode, setHandoffCode] = useState("");
    const [showCodeModal, setShowCodeModal] = useState(false);
    const [generatedCode, setGeneratedCode] = useState("");
    const [notification, setNotification] = useState<{ message: string, type: 'success' | 'info' | 'error' } | null>(null);
    const bottomRef = useRef<HTMLDivElement>(null);

    const refreshThread = async () => {
        const res = await fetch(`/api/threads/${threadId}`);
        const data = await res.json();
        setMessages(data.messages);
        setThread(data.thread);
    };

    // Initial load
    useEffect(() => {
        refreshThread();
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

    // Clear notification after 3s
    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => setNotification(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

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
        const claimId = thread.claim._id;
        const res = await fetch(`/api/claims/${claimId}/handoff`, { method: 'POST' });
        const data = await res.json();

        if (data.alreadyGenerated) {
            setNotification({ message: "Handoff code was already generated for this claim.", type: 'info' });
        } else if (data.code) {
            setGeneratedCode(data.code);
            setShowCodeModal(true);
        } else if (data.error) {
            setNotification({ message: data.error, type: 'error' });
        }
    };

    const handleHandoffConfirm = async () => {
        if (!thread) return;
        if (!handoffCode) return;
        const claimId = thread.claim._id;
        const res = await fetch(`/api/claims/${claimId}/handoff/confirm`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ code: handoffCode })
        });
        const data = await res.json();
        if (data.success) {
            setNotification({ message: "Handoff confirmed! Interaction complete.", type: 'success' });
            setTimeout(() => window.location.reload(), 1500);
        } else {
            setNotification({ message: data.error || "Invalid code", type: 'error' });
        }
    };

    if (!thread) return <div className="p-8 text-center text-gray-500">Loading chat...</div>;

    const myHandle = thread.maskedHandleMap[currentUserId] || "Me";
    const otherHandle = Object.values(thread.maskedHandleMap).find(h => h !== myHandle) || "User";
    const isFinder = thread.finder === currentUserId;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[600px] relative">
            {/* Notification Popup */}
            {notification && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4">
                    <div className={`px-4 py-2 rounded-full shadow-lg text-sm font-medium ${notification.type === 'success' ? 'bg-green-600 text-white' :
                        notification.type === 'error' ? 'bg-red-600 text-white' :
                            'bg-blue-600 text-white'
                        }`}>
                        {notification.message}
                    </div>
                </div>
            )}

            {/* Handoff Code Modal */}
            {showCodeModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Handoff Code Generated</h3>
                        <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500 dark:border-blue-400 rounded-xl p-6 mb-4">
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 text-center">Share this code with the claimant:</p>
                            <div className="text-4xl font-mono font-bold text-center text-blue-600 dark:text-blue-400 tracking-widest">
                                {generatedCode}
                            </div>
                        </div>
                        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-300 dark:border-amber-700 rounded-xl p-3 mb-4">
                            <p className="text-xs text-amber-800 dark:text-amber-300">
                                <strong>⚠️ Important:</strong> Only share this code when you meet the claimant in person. This code can only be used once.
                            </p>
                        </div>
                        <button
                            onClick={() => setShowCodeModal(false)}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-xl transition-colors"
                        >
                            I've Shared the Code
                        </button>
                    </div>
                </div>
            )}

            {/* Main Chat Area */}
            <div className="md:col-span-2 flex flex-col bg-zinc-50 dark:bg-zinc-900 rounded-2xl border dark:border-zinc-700 overflow-hidden shadow-sm">
                {/* Header */}
                <div className="p-4 border-b dark:border-zinc-700 flex justify-between items-center bg-white dark:bg-zinc-800">
                    <div>
                        <div className="flex items-center gap-3">
                            <h3 className="font-bold text-gray-900 dark:text-gray-100">Chat with {otherHandle}</h3>
                            <StatusBadge status={thread.claim.status} />
                        </div>
                        <div className="flex items-center gap-2 text-xs text-zinc-500 mt-1">
                            <Lock size={12} />
                            <span>End-to-end masked • Links {thread.allowLinks ? 'Allowed' : 'Blocked'}</span>
                        </div>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map(msg => {
                        const isMe = msg.sender === currentUserId;
                        return (
                            <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[75%] p-3 rounded-2xl px-4 ${isMe
                                    ? 'bg-blue-600 text-white rounded-br-sm'
                                    : 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-gray-100 border border-gray-200 dark:border-zinc-700 rounded-bl-sm shadow-sm'
                                    }`}>
                                    <p className="text-sm">{msg.content}</p>
                                    <span className="text-[10px] opacity-70 mt-1 block text-right">
                                        {format(new Date(msg.createdAt), 'h:mm a')}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                    <div ref={bottomRef} />
                </div>

                {/* Input */}
                <div className="p-4 bg-white dark:bg-zinc-800 border-t dark:border-zinc-700">
                    <div className="flex gap-2">
                        <input
                            value={newMessage}
                            onChange={e => setNewMessage(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && sendMessage()}
                            placeholder={
                                thread.isClosed ? "Thread is closed" :
                                    thread.claim.status === 'completed' ? "Handoff completed" :
                                        "Type a message..."
                            }
                            disabled={thread.isClosed || thread.claim.status === 'completed'}
                            className="flex-1 px-4 py-2 border rounded-xl bg-gray-50 dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-gray-900 dark:text-gray-100 caret-blue-500 dark:caret-white"
                        />
                        <button
                            onClick={sendMessage}
                            disabled={thread.isClosed || thread.claim.status === 'completed' || !newMessage.trim()}
                            className="bg-blue-600 text-white p-2.5 rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors"
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Side Panel (Verification & Action) */}
            <div className="flex flex-col gap-4 overflow-y-auto">
                {/* 1. Verification Logic */}
                {!isFinder && (thread.claim.status === 'pending' || thread.claim.status === 'awaiting_verification') && (
                    <ProofUploadPanel
                        claimId={thread.claim._id}
                        onSuccess={() => {
                            refreshThread();
                            setNotification({ message: "Proof submitted successfully!", type: 'success' });
                        }}
                    />
                )}

                {isFinder && thread.claim.status === 'awaiting_verification' && thread.claim.claimerProof && (
                    <ReviewPanel
                        claimId={thread.claim._id}
                        proof={thread.claim.claimerProof}
                        onDecision={() => {
                            refreshThread();
                            setNotification({ message: "Decision recorded.", type: 'info' });
                        }}
                    />
                )}

                {/* 2. Handoff Logic (Only show if approved, hide when completed) */}
                {thread.claim.status === 'approved' && (
                    <div className="p-4 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-700 shadow-sm">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 text-sm">Meetup & Handoff</h4>
                        {isFinder ? (
                            <div className="space-y-2">
                                <p className="text-xs text-gray-600 dark:text-gray-400">Generate a secure code when you meet the claimant.</p>
                                <button
                                    onClick={handleHandoffGenerate}
                                    className="w-full bg-green-600 text-white px-3 py-2 rounded-xl text-sm font-medium hover:bg-green-700 transition-colors"
                                >
                                    Generate Handoff Code
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <p className="text-xs text-gray-600 dark:text-gray-400">Enter the code provided by the finder to confirm receipt.</p>
                                <div className="flex gap-2">
                                    <input
                                        value={handoffCode}
                                        onChange={e => setHandoffCode(e.target.value.toUpperCase())}
                                        placeholder="6-digit code"
                                        maxLength={6}
                                        className="flex-1 text-sm px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-xl bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                    <button
                                        onClick={handleHandoffConfirm}
                                        className="bg-green-600 text-white px-3 py-2 rounded-xl text-sm font-bold hover:bg-green-700"
                                    >
                                        Confirm
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* 3. Completion Message */}
                {thread.claim.status === 'completed' && (
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-2xl border-2 border-green-500 dark:border-green-400 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white">
                                ✓
                            </div>
                            <h4 className="font-bold text-green-900 dark:text-green-100 text-sm">Handoff Complete!</h4>
                        </div>
                        <p className="text-xs text-green-800 dark:text-green-200">
                            This item has been successfully returned. Thank you for using FindMyStuff!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

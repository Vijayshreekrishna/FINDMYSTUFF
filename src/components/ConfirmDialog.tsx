"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (e?: React.MouseEvent) => void | Promise<void>;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isDanger?: boolean;
}

export default function ConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    isDanger = false
}: ConfirmDialogProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!mounted || !isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-fade-in">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Dialog */}
            <div
                className="relative glass-elevated rounded-2xl p-8 max-w-md w-full shadow-premium animate-scale-in"
                onClick={(e) => {
                    // Prevent clicks inside dialog from reaching backdrop
                    e.stopPropagation();
                }}
            >
                <h2 className="text-2xl font-bold mb-3 text-white">
                    {title}
                </h2>
                <p className="text-[var(--text-secondary)] mb-8 leading-relaxed">
                    {message}
                </p>

                <div className="flex gap-3 justify-end">
                    <button
                        onClick={onClose}
                        className="premium-button premium-button-ghost px-6"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={(e) => {
                            console.log('🟢 Confirm button clicked in dialog!');
                            e.preventDefault();
                            e.stopPropagation();
                            console.log('Calling onConfirm...');
                            onConfirm();
                            console.log('onConfirm called');
                        }}
                        className={`premium-button px-6 ${isDanger ? 'premium-button-danger' : 'premium-button-primary'
                            }`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}

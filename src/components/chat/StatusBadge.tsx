"use client";

import { CheckCircle, Clock, XCircle, AlertCircle } from "lucide-react";

interface StatusBadgeProps {
    status: 'pending' | 'awaiting_verification' | 'approved' | 'rejected' | 'expired';
}

export default function StatusBadge({ status }: StatusBadgeProps) {
    const config = {
        pending: {
            color: "bg-blue-100 text-blue-700 border-blue-200",
            icon: Clock,
            label: "Pending Proof"
        },
        awaiting_verification: {
            color: "bg-yellow-100 text-yellow-700 border-yellow-200",
            icon: AlertCircle,
            label: "Awaiting Verification"
        },
        approved: {
            color: "bg-green-100 text-green-700 border-green-200",
            icon: CheckCircle,
            label: "Approved"
        },
        rejected: {
            color: "bg-red-100 text-red-700 border-red-200",
            icon: XCircle,
            label: "Rejected"
        },
        expired: {
            color: "bg-gray-100 text-gray-700 border-gray-200",
            icon: XCircle,
            label: "Expired"
        }
    };

    const current = config[status] || config.pending;
    const Icon = current.icon;

    return (
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-medium ${current.color}`}>
            <Icon size={14} />
            {current.label}
        </div>
    );
}

import React from "react";
import { PlusCircle, CheckCircle2, Shield } from "lucide-react";
import { Section } from "@/components/Wrappers";

const Step = ({ n, title, desc, icon }: { n: number; title: string; desc: string; icon: React.ReactNode }) => (
    <div className="flex items-start gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">{icon}</div>
        <div>
            <div className="text-sm font-semibold text-gray-900">{n}. {title}</div>
            <div className="text-sm text-gray-600">{desc}</div>
        </div>
    </div>
);

export const HowItWorks = () => (
    <Section title="How it works" subtitle="Three simple steps to reunite with your belongings.">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Step n={1} title="Report" icon={<PlusCircle size={20} />} desc="Post details with photos & location." />
            <Step n={2} title="Match" icon={<CheckCircle2 size={20} />} desc="We suggest likely matches automatically." />
            <Step n={3} title="Recover" icon={<Shield size={20} />} desc="Chat securely and verify ownership." />
        </div>
    </Section>
);

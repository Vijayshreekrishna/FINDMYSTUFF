import React from "react";
import { PlusCircle, CheckCircle2, Shield } from "lucide-react";
import { Section } from "@/components/Wrappers";

const Step = ({ n, title, desc, icon }: { n: number; title: string; desc: string; icon: React.ReactNode }) => (
    <div className="flex items-start gap-3 rounded-2xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-4 shadow-sm">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">{icon}</div>
        <div>
            <div className="text-sm font-semibold text-gray-900 dark:text-white">{n}. {title}</div>
            <div className="text-sm text-gray-700 dark:text-gray-200 font-medium">{desc}</div>
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

import React from "react";
import { ReportForm } from "@/components/ReportForm";
import { MatchResults } from "@/components/MatchResults";
import { Section } from "@/components/Wrappers";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function ReportPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }
    return (
        <main>
            <Section title="Report an item" subtitle="Lost or found? Fill the details and we'll suggest matches.">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <div className="md:col-span-2">
                        <ReportForm />
                    </div>
                    <aside className="space-y-4">
                        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                            <h4 className="mb-2 text-sm font-semibold text-gray-900">Tips</h4>
                            <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                                <li>Upload a clear photo and mention unique marks.</li>
                                <li>Pin the approximate location if unsure.</li>
                                <li>Keep notifications on for faster matches.</li>
                            </ul>
                        </div>
                    </aside>
                </div>
            </Section>
            <MatchResults />
        </main>
    );
}

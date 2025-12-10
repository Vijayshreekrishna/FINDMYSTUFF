import React from "react";
import { MessageSquare } from "lucide-react";
import { Section } from "@/components/Wrappers";
import { ItemCard } from "@/components/ItemCard";

export const MatchResults = () => (
    <Section title="AI Match Suggestions" subtitle="Based on your recent report.">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <h4 className="mb-2 text-sm font-semibold text-gray-900">Your Report</h4>
                <ItemCard data={{
                    title: "Pending Report",
                    type: "lost",
                    description: "Your item details will appear here...",
                    location: { address: "Selected Location" }
                }} />
            </div>
            <div className="space-y-4">
                <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                    <h4 className="mb-2 text-sm font-semibold text-gray-900">Potential Matches</h4>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <ItemCard data={{
                            title: "Found Keys",
                            type: "found",
                            description: " Bunch of keys found near park bench.",
                            location: { address: "Central Park" }
                        }} />
                        <ItemCard data={{
                            title: "Blue Umbrella",
                            type: "found",
                            description: "Left in the coffee shop.",
                            location: { address: "Starbucks, Main St" }
                        }} />
                    </div>
                    <div className="mt-4 flex justify-end">
                        <button className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition-colors">
                            <MessageSquare size={18} />Contact Finder
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </Section>
);

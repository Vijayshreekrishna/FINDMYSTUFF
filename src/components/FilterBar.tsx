"use client";

interface FilterBarProps {
    category: string;
    type: string;
    onCategoryChange: (category: string) => void;
    onTypeChange: (type: string) => void;
    onClearFilters: () => void;
}

const CATEGORIES = [
    "All Categories",
    "Electronics",
    "Clothing",
    "Accessories",
    "Pets",
    "Documents",
    "Other"
];

export default function FilterBar({
    category,
    type,
    onCategoryChange,
    onTypeChange,
    onClearFilters
}: FilterBarProps) {
    const activeFiltersCount = (category ? 1 : 0) + (type !== "all" ? 1 : 0);

    return (
        <div className="space-y-4">
            {/* Type Filter Pills */}
            <div className="flex flex-wrap gap-2 md:gap-3">
                <button
                    onClick={() => onTypeChange("all")}
                    className={`px-4 py-2 rounded-lg font-medium transition-all text-sm md:text-base ${type === "all"
                            ? "bg-[var(--accent)] text-white shadow-glow"
                            : "bg-[var(--surface)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]"
                        }`}
                >
                    All
                </button>
                <button
                    onClick={() => onTypeChange("lost")}
                    className={`px-4 py-2 rounded-lg font-medium transition-all text-sm md:text-base ${type === "lost"
                            ? "bg-[var(--danger)] text-white shadow-glow"
                            : "bg-[var(--surface)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]"
                        }`}
                >
                    Lost
                </button>
                <button
                    onClick={() => onTypeChange("found")}
                    className={`px-4 py-2 rounded-lg font-medium transition-all text-sm md:text-base ${type === "found"
                            ? "bg-[var(--success)] text-white shadow-glow"
                            : "bg-[var(--surface)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]"
                        }`}
                >
                    Found
                </button>
            </div>

            {/* Category and Clear Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                {/* Category Dropdown */}
                <select
                    value={category}
                    onChange={(e) => onCategoryChange(e.target.value)}
                    className="premium-input flex-1 cursor-pointer"
                >
                    {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat === "All Categories" ? "" : cat}>
                            {cat}
                        </option>
                    ))}
                </select>

                {/* Clear Filters */}
                {activeFiltersCount > 0 && (
                    <button
                        onClick={onClearFilters}
                        className="premium-button premium-button-ghost text-sm whitespace-nowrap"
                    >
                        Clear Filters ({activeFiltersCount})
                    </button>
                )}
            </div>
        </div>
    );
}

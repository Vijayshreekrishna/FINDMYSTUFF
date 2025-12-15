import React from "react";

export const Container = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <div className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>
);

export const Section = ({
    title,
    subtitle,
    children,
    actions
}: {
    title?: string;
    subtitle?: string;
    children: React.ReactNode;
    actions?: React.ReactNode;
}) => (
    <section className="py-8 sm:py-12">
        <Container>
            {(title || subtitle || actions) && (
                <div className="mb-6 flex flex-col gap-2 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        {title && <h2 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">{title}</h2>}
                        {subtitle && <p className="mt-1 text-gray-600 dark:text-gray-300">{subtitle}</p>}
                    </div>
                    {actions && <div className="flex gap-3">{actions}</div>}
                </div>
            )}
            {children}
        </Container>
    </section>
);

import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Install FindMyStuff",
    description: "Install FindMyStuff PWA for the best experience",
};

export default function InstallLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}

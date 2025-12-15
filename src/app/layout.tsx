import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import PWAEnforcer from "@/components/PWAEnforcer";
import ConditionalLayout from "@/components/ConditionalLayout";
import PWAGuard from "@/components/PWAGuard";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#2E6F40",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "FindMyStuff - Lost & Found",
  description: "The premium platform to connect lost items with their owners. Secure, fast, and community-driven.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "FindMyStuff",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#F9FAFB] dark:bg-zinc-950 text-gray-900 dark:text-gray-100`}
        suppressHydrationWarning
      >
        <Providers>
          <PWAEnforcer>
            <PWAGuard>
              <ConditionalLayout>
                {children}
              </ConditionalLayout>
            </PWAGuard>
          </PWAEnforcer>
        </Providers>
      </body>
    </html>
  );
}

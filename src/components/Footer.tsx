import React from "react";
import Link from "next/link";
import { Container } from "@/components/Wrappers";

export const Footer = () => (
    <footer className="border-t border-blue-700 bg-gradient-to-r from-amber-500/70 to-blue-600/70 py-8">
        <Container className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-blue-100">© {new Date().getFullYear()} FindMyStuff</p>
            <div className="flex gap-4 text-sm text-blue-100">
                <Link href="/" className="hover:text-white transition-colors">Home</Link>
                <Link href="/feed" className="hover:text-white transition-colors">Feed</Link>
                <Link href="/report" className="hover:text-white transition-colors">Report</Link>
                <Link href="/profile" className="hover:text-white transition-colors">Profile</Link>
            </div>
        </Container>
    </footer>
);

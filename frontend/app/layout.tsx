import "./globals.css";
import { Inter } from "next/font/google";
import type { Metadata } from "next";
import ThemeClient from "../components/ThemeClient";

export const metadata: Metadata = {
    title: 'Data Analyst Portfolio',
    description: 'Turning Raw Data into Business Strategy',
};

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="dark scroll-smooth" suppressHydrationWarning>
            <body className={`min-h-screen ${inter.className}`}>
                <ThemeClient />
                {children}
            </body>
        </html>
    );
}

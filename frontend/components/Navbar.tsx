"use client";
import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const navLinks = [
        { href: "#about", label: "About me" },
        { href: "#projects", label: "Projects" },
        { href: "#contact", label: "Contact" },
    ];

    return (
        <header className="sticky top-0 z-50 w-full bg-slate-900/80 backdrop-blur-lg border-b border-slate-800">
            <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-6 py-4">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 flex-shrink-0">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center font-bold text-white text-sm">
                        JU
                    </div>
                    <div className="hidden sm:block">
                        <h1 className="text-lg font-bold text-emerald-400">Jeffrey Usman</h1>
                        <p className="text-xs text-slate-400">Data Analyst</p>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            className="text-sm text-slate-300 hover:text-emerald-400 transition-colors font-medium"
                        >
                            {link.label}
                        </a>
                    ))}
                    <ThemeToggle />
                </div>

                {/* Mobile Menu Button & Theme Toggle */}
                <div className="md:hidden flex items-center gap-4">
                    <ThemeToggle />
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="p-2 rounded-lg hover:bg-slate-800 transition-colors"
                        aria-label="Toggle menu"
                    >
                        {isOpen ? (
                            <X className="w-6 h-6 text-slate-300" />
                        ) : (
                            <Menu className="w-6 h-6 text-slate-300" />
                        )}
                    </button>
                </div>
            </nav>

            {/* Mobile Navigation */}
            {isOpen && (
                <div className="md:hidden border-t border-slate-800 bg-slate-900/90 backdrop-blur-sm">
                    <div className="px-4 py-4 space-y-3">
                        {navLinks.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                className="block px-4 py-2 text-sm text-slate-300 hover:text-emerald-400 hover:bg-slate-800/50 rounded-lg transition-colors font-medium"
                                onClick={() => setIsOpen(false)}
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </header>
    );
}

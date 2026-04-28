"use client";
import { useEffect, useState } from "react";
import { Mail, User, Calendar, ArrowLeft, RefreshCw, Phone } from "lucide-react";
import Link from "next/link";
import type { Message } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export default function AdminMessages() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState("");
    const [authError, setAuthError] = useState("");
    const [error, setError] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 20;

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setAuthError("");

        try {
            const res = await fetch(`${API_URL}/api/admin/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password }),
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem("adminToken", data.token);
                setIsAuthenticated(true);
                fetchMessages(data.token, 1);
            } else {
                setAuthError(data.error || "Invalid password");
            }
        } catch (err) {
            setAuthError("Login failed. Please try again.");
        }
    };

    const fetchMessages = async (token?: string, pageNum = page) => {
        setLoading(true);
        setError("");
        const authToken = token || localStorage.getItem("adminToken");

        if (!authToken) {
            setLoading(false);
            return;
        }

        try {
            const res = await fetch(`${API_URL}/api/messages?page=${pageNum}&limit=${limit}`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });

            if (res.ok) {
                const data = await res.json();
                setMessages(data.messages);
                setTotalPages(data.pagination.pages || 1);
                setPage(pageNum);
                setIsAuthenticated(true);
            } else if (res.status === 401) {
                // Token invalid, clear and show login
                localStorage.removeItem("adminToken");
                setIsAuthenticated(false);
            } else {
                setError("Failed to load messages");
            }
        } catch (err) {
            setError("Network error. Please check your connection.");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("adminToken");
        setIsAuthenticated(false);
        setMessages([]);
        setPage(1);
        setTotalPages(1);
    };

    useEffect(() => {
        // Check if already authenticated
        const token = localStorage.getItem("adminToken");
        if (token) {
            fetchMessages(token, 1);
        } else {
            setLoading(false);
        }
    }, []);

    // Login form
    if (!isAuthenticated) {
        return (
            <section className="max-w-md mx-auto py-12 px-4 min-h-screen flex items-center justify-center">
                <div className="w-full bg-cardGlass backdrop-blur-md rounded-glass shadow-glass border border-zinc-800 p-8">
                    <h1 className="text-2xl font-bold mb-6 text-blue-400 text-center">Admin Login</h1>
                    <form onSubmit={handleLogin} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="password" className="text-zinc-200">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="bg-transparent border border-zinc-700 rounded px-3 py-2 text-zinc-100 focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <button
                            type="submit"
                            className="mt-2 px-6 py-2 rounded-full bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-colors"
                        >
                            Login
                        </button>
                        {authError && (
                            <div className="text-red-400 text-center text-sm">{authError}</div>
                        )}
                    </form>
                    <Link
                        href="/"
                        className="mt-6 flex items-center justify-center gap-2 text-zinc-400 hover:text-blue-500 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Link>
                </div>
            </section>
        );
    }

    // Messages view
    return (
        <section className="max-w-4xl mx-auto py-12 px-4">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold text-blue-400">Contact Messages</h1>
                <div className="flex gap-4">
                    <button
                        onClick={() => fetchMessages()}
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-500/20 text-zinc-300 hover:bg-zinc-500/30 transition-colors"
                        aria-label="Refresh messages"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Refresh
                    </button>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                    >
                        Logout
                    </button>
                </div>
            </div>

            <Link
                href="/"
                className="inline-flex items-center gap-2 mb-6 text-zinc-400 hover:text-blue-500 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
            </Link>

            {loading ? (
                <div className="text-zinc-400">Loading...</div>
            ) : error ? (
                <div className="text-red-400">{error}</div>
            ) : messages.length === 0 ? (
                <div className="text-zinc-400 text-center py-8">No messages yet.</div>
            ) : (
                <ul className="space-y-6">
                    {messages.map((msg) => (
                        <li
                            key={msg.id}
                            className="bg-cardGlass backdrop-blur-md rounded-glass p-6 shadow-glass border border-zinc-800"
                        >
                            <div className="flex flex-wrap items-center gap-3 mb-3">
                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4 text-blue-400" />
                                    <span className="font-semibold text-zinc-100">{msg.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-zinc-400" />
                                    <span className="text-zinc-300 text-sm">{msg.email}</span>
                                </div>
                                {msg.phone && (
                                    <div className="flex items-center gap-2">
                                        <Phone className="w-4 h-4 text-zinc-400" />
                                        <span className="text-zinc-300 text-sm">{msg.phone}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2 ml-auto">
                                    <Calendar className="w-4 h-4 text-zinc-400" />
                                    <span className="text-zinc-400 text-xs">
                                        {new Date(msg.date).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                            <div className="text-zinc-100 whitespace-pre-line bg-zinc-900/30 rounded p-4 border border-zinc-700">
                                {msg.message}
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {!loading && !error && messages.length > 0 && (
                <div className="mt-8 flex items-center justify-between border-t border-zinc-800 pt-6">
                    <button
                        onClick={() => fetchMessages(undefined, page - 1)}
                        disabled={page === 1}
                        className="px-4 py-2 rounded-full bg-zinc-800/50 text-zinc-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-700/50 transition-colors"
                    >
                        Previous
                    </button>
                    <span className="text-zinc-400 text-sm">
                        Page {page} of {totalPages}
                    </span>
                    <button
                        onClick={() => fetchMessages(undefined, page + 1)}
                        disabled={page === totalPages}
                        className="px-4 py-2 rounded-full bg-zinc-800/50 text-zinc-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-700/50 transition-colors"
                    >
                        Next
                    </button>
                </div>
            )}
        </section>
    );
}

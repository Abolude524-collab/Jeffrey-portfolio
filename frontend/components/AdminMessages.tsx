"use client";
import { useEffect, useState } from "react";
import { Mail, User, Calendar, ArrowLeft, RefreshCw, Phone } from "lucide-react";
import Link from "next/link";
import type { Message } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function AdminMessages() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState("");
    const [authError, setAuthError] = useState("");
    const [error, setError] = useState("");

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
                fetchMessages(data.token);
            } else {
                setAuthError(data.error || "Invalid password");
            }
        } catch (err) {
            setAuthError("Login failed. Please try again.");
        }
    };

    const fetchMessages = async (token?: string) => {
        setLoading(true);
        setError("");
        const authToken = token || localStorage.getItem("adminToken");

        if (!authToken) {
            setLoading(false);
            return;
        }

        try {
            const res = await fetch(`${API_URL}/api/messages`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });

            if (res.ok) {
                const data = await res.json();
                setMessages(data);
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
    };

    useEffect(() => {
        // Check if already authenticated
        const token = localStorage.getItem("adminToken");
        if (token) {
            fetchMessages(token);
        } else {
            setLoading(false);
        }
    }, []);

    // Login form
    if (!isAuthenticated) {
        return (
            <section className="max-w-md mx-auto py-12 px-4 min-h-screen flex items-center justify-center">
                <div className="w-full bg-cardGlass backdrop-blur-md rounded-glass shadow-glass border border-slate-800 p-8">
                    <h1 className="text-2xl font-bold mb-6 text-emerald-400 text-center">Admin Login</h1>
                    <form onSubmit={handleLogin} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="password" className="text-slate-200">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="bg-transparent border border-slate-700 rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-accent-emerald"
                            />
                        </div>
                        <button
                            type="submit"
                            className="mt-2 px-6 py-2 rounded-full bg-accent-emerald text-white font-semibold hover:bg-emerald-600 transition-colors"
                        >
                            Login
                        </button>
                        {authError && (
                            <div className="text-red-400 text-center text-sm">{authError}</div>
                        )}
                    </form>
                    <Link
                        href="/"
                        className="mt-6 flex items-center justify-center gap-2 text-slate-400 hover:text-accent-emerald transition-colors"
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
                <h1 className="text-2xl font-bold text-emerald-400">Contact Messages</h1>
                <div className="flex gap-4">
                    <button
                        onClick={() => fetchMessages()}
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-accent-slate/20 text-slate-300 hover:bg-accent-slate/30 transition-colors"
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
                className="inline-flex items-center gap-2 mb-6 text-slate-400 hover:text-accent-emerald transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
            </Link>

            {loading ? (
                <div className="text-slate-400">Loading...</div>
            ) : error ? (
                <div className="text-red-400">{error}</div>
            ) : messages.length === 0 ? (
                <div className="text-slate-400 text-center py-8">No messages yet.</div>
            ) : (
                <ul className="space-y-6">
                    {messages.map((msg) => (
                        <li
                            key={msg.id}
                            className="bg-cardGlass backdrop-blur-md rounded-glass p-6 shadow-glass border border-slate-800"
                        >
                            <div className="flex flex-wrap items-center gap-3 mb-3">
                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4 text-emerald-400" />
                                    <span className="font-semibold text-slate-100">{msg.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-slate-400" />
                                    <span className="text-slate-300 text-sm">{msg.email}</span>
                                </div>
                                {msg.phone && (
                                    <div className="flex items-center gap-2">
                                        <Phone className="w-4 h-4 text-slate-400" />
                                        <span className="text-slate-300 text-sm">{msg.phone}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2 ml-auto">
                                    <Calendar className="w-4 h-4 text-slate-400" />
                                    <span className="text-slate-400 text-xs">
                                        {new Date(msg.date).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                            <div className="text-slate-100 whitespace-pre-line bg-slate-900/30 rounded p-4 border border-slate-700">
                                {msg.message}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}

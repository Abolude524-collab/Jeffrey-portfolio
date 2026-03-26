"use client";
import { useState } from "react";
import { Mail, User, MessageSquare, Phone } from "lucide-react";
import type { ContactFormData } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

/**
 * ContactForm component
 * Minimal, accessible, and styled for dark data-centric UI
 */
export default function ContactForm() {
    const [form, setForm] = useState<ContactFormData>({ name: "", phone: "", email: "", message: "" });
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        // Clear error when user starts typing
        if (status === "error") {
            setStatus("idle");
            setErrorMessage("");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatus("idle");
        setErrorMessage("");

        try {
            const res = await fetch(`${API_URL}/api/messages`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (res.ok) {
                setStatus("success");
                setForm({ name: "", phone: "", email: "", message: "" });
                // Auto-clear success message after 5 seconds
                setTimeout(() => setStatus("idle"), 5000);
            } else {
                setStatus("error");
                setErrorMessage(data.error || "Something went wrong");
            }
        } catch (err) {
            setStatus("error");
            setErrorMessage("Network error. Please check your connection and try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-lg mx-auto bg-cardGlass backdrop-blur-md rounded-glass shadow-glass border border-slate-800 p-8 flex flex-col gap-6"
        >
            <h2 className="text-xl font-bold text-emerald-400 mb-2 text-center">Contact</h2>

            <div className="flex flex-col gap-2">
                <label htmlFor="name" className="text-slate-200 flex items-center gap-2">
                    <User className="w-4 h-4 text-accent-emerald" /> Name
                </label>
                <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={handleChange}
                    className="bg-transparent border border-slate-700 rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-accent-emerald transition-colors"
                />
            </div>


            <div className="flex flex-col gap-2">
                <label htmlFor="phone" className="text-slate-200 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-accent-emerald" /> Phone Number
                </label>
                <input
                    id="phone"
                    name="phone"
                    type="text"
                    required
                    value={form.phone}
                    onChange={handleChange}
                    className="bg-transparent border border-slate-700 rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-accent-emerald transition-colors"
                />
            </div>

            <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-slate-200 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-accent-emerald" /> Email
                </label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    className="bg-transparent border border-slate-700 rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-accent-emerald transition-colors"
                />
            </div>

            <div className="flex flex-col gap-2">
                <label htmlFor="message" className="text-slate-200 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-accent-emerald" /> Message
                </label>
                <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    className="bg-transparent border border-slate-700 rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-accent-emerald transition-colors resize-none"
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="mt-2 px-6 py-2 rounded-full bg-accent-emerald text-white font-semibold shadow-glass hover:bg-emerald-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
                {loading ? "Sending..." : "Send Message"}
            </button>

            {status === "success" && (
                <div className="text-emerald-400 text-center mt-2 font-semibold">
                    ✓ Message sent successfully!
                </div>
            )}
            {status === "error" && (
                <div className="text-red-400 text-center mt-2">
                    {errorMessage}
                </div>
            )}
        </form>
    );
}

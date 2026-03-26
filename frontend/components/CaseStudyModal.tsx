"use client";
import { X } from "lucide-react";
import { useEffect } from "react";
import ReactMarkdown from "react-markdown";
import type { Project } from "@/types";

interface CaseStudyModalProps {
    project: Project;
    isOpen: boolean;
    onClose: () => void;
}

/**
 * CaseStudyModal component
 * Displays detailed case study in a modal overlay with glassmorphism design.
 * Uses react-markdown for proper markdown rendering (Fix #4).
 */
export default function CaseStudyModal({ project, isOpen, onClose }: CaseStudyModalProps) {
    // Handle ESC key to close modal
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
            // Prevent body scroll when modal is open
            document.body.style.overflow = "hidden";
        }

        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "unset";
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            <div
                className="bg-cardGlass backdrop-blur-md rounded-glass shadow-glass border border-slate-800 max-w-3xl w-full max-h-[80vh] overflow-y-auto p-8 relative"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-accent-emerald"
                    aria-label="Close modal"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Project title */}
                <h2 id="modal-title" className="text-3xl font-bold text-emerald-400 mb-4 pr-12">
                    {project.title}
                </h2>

                {/* Tech stack */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {project.tags.map((tag) => (
                        <span
                            key={tag}
                            className="px-3 py-1 bg-accent-slate/20 rounded-full text-sm text-accent-slate border border-accent-slate/30 font-medium"
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Case study content rendered with react-markdown (Fix #4) */}
                <div className="prose prose-invert max-w-none
                    prose-headings:text-emerald-400
                    prose-h2:text-xl prose-h2:font-bold prose-h2:mt-6 prose-h2:mb-3
                    prose-p:text-slate-300 prose-p:mb-3
                    prose-li:text-slate-300 prose-li:ml-2
                    prose-ul:list-disc prose-ul:ml-6
                    prose-strong:text-slate-100">
                    <ReactMarkdown>{project.caseStudy}</ReactMarkdown>
                </div>
            </div>
        </div>
    );
}

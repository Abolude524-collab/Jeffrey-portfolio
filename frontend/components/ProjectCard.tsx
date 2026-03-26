"use client";
import React from "react";
import Image from "next/image";
import { BadgeCheck, Database, BarChart2, FileText, Eye } from "lucide-react";
import type { Project } from "@/types";

// Map technology tags to Lucide icons for visual clarity (Fix #6: React.ReactElement replaces deprecated JSX.Element)
const tagIcons: Record<string, React.ReactElement> = {
    SQL: <Database className="w-4 h-4 text-accent-slate" />,
    PowerBI: <BarChart2 className="w-4 h-4 text-accent-emerald" />,
    Pandas: <BadgeCheck className="w-4 h-4 text-accent-emerald" />,
    Python: <FileText className="w-4 h-4 text-accent-slate" />,
};

interface ProjectCardProps {
    project: Project;
    onViewCaseStudy: () => void;
}

/**
 * Glassmorphism Project Card
 * Shows project image, title, description, tech stack icons, and case study button.
 */
export default function ProjectCard({ project, onViewCaseStudy }: ProjectCardProps) {
    return (
        <div
            className="bg-cardGlass backdrop-blur-md rounded-glass shadow-glass border border-slate-800 p-6 flex flex-col gap-4 transition-transform duration-200 hover:-translate-y-1 hover:shadow-2xl focus-within:ring-2 focus-within:ring-accent-emerald group"
            tabIndex={0}
            aria-label={`Project: ${project.title}`}
        >
            {/* Project image */}
            <div className="relative w-full h-40 rounded-lg overflow-hidden mb-2 border border-slate-700 group-hover:border-accent-emerald transition-colors">
                <Image
                    src={project.imageURL}
                    alt={project.title}
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 768px) 100vw, 33vw"
                />
            </div>

            {/* Project title */}
            <h3 className="text-lg font-semibold text-emerald-400 mb-1 group-hover:text-accent-emerald transition-colors">
                {project.title}
            </h3>

            {/* Short description */}
            <p className="text-slate-200 text-sm mb-2 line-clamp-3">{project.description}</p>

            {/* Tech stack icons and tags */}
            <div className="flex flex-wrap gap-2 items-center mt-auto">
                {project.tags.map((tag) => (
                    <span
                        key={tag}
                        className="flex items-center gap-1 px-2 py-1 bg-accent-slate/20 rounded text-xs text-accent-slate border border-accent-slate/30 font-medium"
                    >
                        {tagIcons[tag]}
                        {tag}
                    </span>
                ))}
            </div>

            {/* View Case Study button */}
            <button
                onClick={onViewCaseStudy}
                className="mt-2 w-full px-4 py-2 rounded-lg bg-accent-emerald/10 hover:bg-accent-emerald text-emerald-400 hover:text-white border border-accent-emerald font-semibold text-sm transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-accent-emerald"
            >
                <Eye className="w-4 h-4" />
                View Case Study
            </button>
        </div>
    );
}

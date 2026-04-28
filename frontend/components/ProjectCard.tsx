"use client";
import React from "react";
import Image from "next/image";
import { BadgeCheck, Database, BarChart2, FileText, Eye } from "lucide-react";
import type { Project } from "@/types";
import { motion } from "framer-motion";

// Map technology tags to Lucide icons for visual clarity (Fix #6: React.ReactElement replaces deprecated JSX.Element)
const tagIcons: Record<string, React.ReactElement> = {
    SQL: <Database className="w-4 h-4 text-zinc-500" />,
    PowerBI: <BarChart2 className="w-4 h-4 text-blue-500" />,
    Pandas: <BadgeCheck className="w-4 h-4 text-blue-500" />,
    Python: <FileText className="w-4 h-4 text-zinc-500" />,
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
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.4 }}
            className="bg-cardGlass backdrop-blur-md rounded-glass shadow-glass border border-zinc-800 p-6 flex flex-col gap-4 transition-shadow hover:shadow-2xl focus-within:ring-2 focus-within:ring-blue-500 group"
            tabIndex={0}
            aria-label={`Project: ${project.title}`}
        >
            {/* Project image */}
            <div className="relative w-full h-40 rounded-lg overflow-hidden mb-2 border border-zinc-700 group-hover:border-blue-500 transition-colors">
                <Image
                    src={project.imageURL}
                    alt={project.title}
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 768px) 100vw, 33vw"
                />
            </div>

            {/* Project title */}
            <h3 className="text-lg font-semibold text-blue-400 mb-1 group-hover:text-blue-500 transition-colors">
                {project.title}
            </h3>

            {/* Short description */}
            <p className="text-zinc-200 text-sm mb-2 line-clamp-3">{project.description}</p>

            {/* Tech stack icons and tags */}
            <div className="flex flex-wrap gap-2 items-center mt-auto">
                {project.tags.map((tag) => (
                    <span
                        key={tag}
                        className="flex items-center gap-1 px-2 py-1 bg-zinc-500/20 rounded text-xs text-zinc-500 border border-zinc-500/30 font-medium"
                    >
                        {tagIcons[tag]}
                        {tag}
                    </span>
                ))}
            </div>

            {/* View Case Study button */}
            <button
                onClick={onViewCaseStudy}
                className="mt-2 w-full px-4 py-2 rounded-lg bg-blue-500/10 hover:bg-blue-500 text-blue-400 hover:text-white border border-blue-500 font-semibold text-sm transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <Eye className="w-4 h-4" />
                View Case Study
            </button>
        </motion.div>
    );
}

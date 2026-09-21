"use client";
import Image from "next/image";
import { Eye } from "lucide-react";
import type { Project } from "@/types";
import { splitProjectTags } from "@/utils/projectTagGroups";

interface ProjectCardProps {
    project: Project;
    onViewCaseStudy: () => void;
}

/**
 * Glassmorphism Project Card
 * Shows project image, title, description, tech stack icons, and case study button.
 */
export default function ProjectCard({ project, onViewCaseStudy }: ProjectCardProps) {
    const { techStack, tools, other } = splitProjectTags(project.tags || []);
    const fallbackTechStack = techStack.length ? techStack : other;

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

            {/* Rewired tags: separated into Tech Stack and Tools for easier scanning */}
            <div className="mt-auto space-y-3">
                <div>
                    <p className="text-[11px] uppercase tracking-wide text-slate-400 mb-2">Tech Stack</p>
                    <div className="flex flex-wrap gap-2">
                        {fallbackTechStack.slice(0, 4).map((tag) => (
                            <span
                                key={`stack-${tag}`}
                                className="px-2 py-1 bg-accent-slate/20 rounded text-xs text-accent-slate border border-accent-slate/30 font-medium"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                {tools.length > 0 && (
                    <div>
                        <p className="text-[11px] uppercase tracking-wide text-slate-400 mb-2">Tools</p>
                        <div className="flex flex-wrap gap-2">
                            {tools.slice(0, 4).map((tool) => (
                                <span
                                    key={`tool-${tool}`}
                                    className="px-2 py-1 bg-accent-emerald/10 rounded text-xs text-emerald-400 border border-accent-emerald/30 font-medium"
                                >
                                    {tool}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
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

"use client";
import { useEffect, useState, useMemo } from "react";
import ProjectCard from "./ProjectCard";
import CaseStudyModal from "./CaseStudyModal";
import type { Project } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

/** Animated skeleton placeholder that matches ProjectCard dimensions */
function SkeletonCard() {
    return (
        <div className="bg-cardGlass backdrop-blur-md rounded-glass shadow-glass border border-zinc-800 p-6 flex flex-col gap-4 animate-pulse">
            <div className="w-full h-40 rounded-lg bg-zinc-700/50" />
            <div className="h-5 w-3/4 rounded bg-zinc-700/50" />
            <div className="h-4 w-full rounded bg-zinc-700/40" />
            <div className="h-4 w-5/6 rounded bg-zinc-700/40" />
            <div className="flex gap-2 mt-auto">
                <div className="h-6 w-16 rounded bg-zinc-700/50" />
                <div className="h-6 w-16 rounded bg-zinc-700/50" />
            </div>
            <div className="h-9 w-full rounded-lg bg-zinc-700/40" />
        </div>
    );
}

/**
 * PortfolioGrid component
 * Fetches projects from backend and provides instant client-side filtering.
 * Supports both legacy Project interface and new AdminProject with extended fields.
 */
export default function PortfolioGrid() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [filter, setFilter] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    // Fetch projects from Express API on mount
    useEffect(() => {
        fetch(`${API_URL}/api/projects`)
            .then((res) => {
                if (!res.ok) throw new Error("Failed to fetch projects");
                return res.json();
            })
            .then((data: Project[]) => {
                setProjects(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    // Derive unique tags from fetched projects
    const tags = useMemo(() => {
        const all = projects.flatMap((p) => p.tags || []);
        return Array.from(new Set(all)).sort();
    }, [projects]);

    // Filter projects by selected tag
    const filtered = filter
        ? projects.filter((p) => (p.tags || []).includes(filter))
        : projects;

    return (
        <>
            <section className="max-w-6xl mx-auto py-12 px-4">
                {/* Filter buttons — derived dynamically from project data */}
                <div className="flex flex-wrap gap-4 mb-8 justify-center">
                    {tags.map((tag) => (
                        <button
                            key={tag}
                            className={`px-5 py-2 rounded-full border text-sm font-semibold tracking-wide focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors
                ${filter === tag ? "bg-blue-500 text-white border-blue-500 shadow-glass" : "bg-transparent border-zinc-700 text-zinc-300 hover:bg-blue-500/10 hover:text-blue-500"}`}
                            onClick={() => setFilter(filter === tag ? null : tag)}
                            aria-pressed={filter === tag}
                        >
                            {tag}
                        </button>
                    ))}
                    {/* Clear filter button */}
                    {filter && (
                        <button
                            className="ml-2 px-4 py-2 rounded-full bg-zinc-700 text-zinc-100 text-xs border border-zinc-600 font-semibold hover:bg-blue-500/20 transition-colors"
                            onClick={() => setFilter(null)}
                        >
                            Clear
                        </button>
                    )}
                </div>

                {/* Project grid or skeleton/error/empty state */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        <SkeletonCard />
                        <SkeletonCard />
                        <SkeletonCard />
                    </div>
                ) : error ? (
                    <div className="text-red-400 text-center">
                        <p className="font-semibold mb-2">Error loading projects</p>
                        <p className="text-sm">{error}</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="text-zinc-400 text-center"
                    >
                        No projects found for this filter.
                    </motion.div>
                ) : (
                    <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        <AnimatePresence mode="popLayout">
                            {filtered.map((project) => (
                                <motion.div
                                    key={project.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <ProjectCard
                                        project={project}
                                        onViewCaseStudy={() => setSelectedProject(project)}
                                    />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}
            </section>

            {/* Case Study Modal — only rendered when a project is selected */}
            {selectedProject && (
                <CaseStudyModal
                    project={selectedProject}
                    isOpen={true}
                    onClose={() => setSelectedProject(null)}
                />
            )}
        </>
    );
}

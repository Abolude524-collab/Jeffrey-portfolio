import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import {
  ArrowLeft,
  Github,
  ExternalLink,
  Target,
  AlertTriangle,
  Lightbulb,
  CheckCircle,
  Database,
  Wrench,
  Layers,
} from "lucide-react";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const project = await prisma.project.findUnique({
    where: { slug: params.slug },
  });

  if (!project || !project.published) {
    return { title: "Project Not Found | Jeffrey Usman" };
  }

  return {
    title: `${project.title} | Data Analyst Project | Jeffrey Usman`,
    description: project.shortDescription,
    openGraph: {
      title: `${project.title} | Jeffrey Usman`,
      description: project.shortDescription,
      images: [project.coverImage],
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const project = await prisma.project.findUnique({
    where: { slug: params.slug },
    include: {
      images: { orderBy: { order: "asc" } },
    },
  });

  if (!project || !project.published) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 font-sans">
      <Navbar />

      <main className="pt-36 pb-24 px-6 max-w-5xl mx-auto space-y-12">
        {/* Navigation back */}
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Projects</span>
        </Link>

        {/* Project Header */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3.5 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full text-xs font-bold uppercase tracking-wider">
              {project.category}
            </span>
            {project.featured && (
              <span className="px-3.5 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-full text-xs font-bold uppercase tracking-wider">
                Featured Case Study
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-100 leading-tight">
            {project.title}
          </h1>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            {project.shortDescription}
          </p>

          <div className="flex flex-wrap gap-2 pt-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-md text-xs font-medium text-slate-300"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Action Links */}
          <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-800/80">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 hover:text-emerald-400 font-semibold rounded-lg text-xs transition-all flex items-center gap-2"
              >
                <Github className="w-4 h-4" />
                <span>GitHub Repository</span>
              </a>
            )}

            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg text-xs transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Live Project / Dashboard</span>
              </a>
            )}
          </div>
        </div>

        {/* Hero Cover Image */}
        <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl">
          <img
            src={project.coverImage}
            alt={project.title}
            className="w-full max-h-[500px] object-cover"
          />
        </div>

        {/* Case Study Detailed Breakdown */}
        <div className="space-y-10 pt-6">
          {/* Problem Statement */}
          {project.problem && (
            <section className="bg-slate-900/60 border border-slate-800 rounded-xl p-8 space-y-3">
              <div className="flex items-center gap-2.5 text-amber-400 font-bold text-sm uppercase tracking-wider">
                <AlertTriangle className="w-5 h-5" />
                <h2>Problem Statement</h2>
              </div>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                {project.problem}
              </p>
            </section>
          )}

          {/* Objective */}
          {project.objective && (
            <section className="bg-slate-900/60 border border-slate-800 rounded-xl p-8 space-y-3">
              <div className="flex items-center gap-2.5 text-emerald-400 font-bold text-sm uppercase tracking-wider">
                <Target className="w-5 h-5" />
                <h2>Objective</h2>
              </div>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                {project.objective}
              </p>
            </section>
          )}

          {/* Dataset Description */}
          {project.dataset && (
            <section className="bg-slate-900/60 border border-slate-800 rounded-xl p-8 space-y-3">
              <div className="flex items-center gap-2.5 text-teal-400 font-bold text-sm uppercase tracking-wider">
                <Database className="w-5 h-5" />
                <h2>Dataset Description</h2>
              </div>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                {project.dataset}
              </p>
            </section>
          )}

          {/* Methodology & Execution */}
          {project.methodology && (
            <section className="bg-slate-900/60 border border-slate-800 rounded-xl p-8 space-y-3">
              <div className="flex items-center gap-2.5 text-emerald-400 font-bold text-sm uppercase tracking-wider">
                <Layers className="w-5 h-5" />
                <h2>Methodology & Execution</h2>
              </div>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed whitespace-pre-line font-sans">
                {project.methodology}
              </p>
            </section>
          )}

          {/* Key Insights */}
          {project.insights && (
            <section className="bg-slate-900/60 border border-slate-800 rounded-xl p-8 space-y-3">
              <div className="flex items-center gap-2.5 text-amber-400 font-bold text-sm uppercase tracking-wider">
                <Lightbulb className="w-5 h-5" />
                <h2>Key Business Insights</h2>
              </div>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                {project.insights}
              </p>
            </section>
          )}

          {/* Business Results & Impact */}
          {project.results && (
            <section className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-8 space-y-3">
              <div className="flex items-center gap-2.5 text-emerald-400 font-bold text-sm uppercase tracking-wider">
                <CheckCircle className="w-5 h-5" />
                <h2>Results & Business Impact</h2>
              </div>
              <p className="text-slate-200 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                {project.results}
              </p>
            </section>
          )}

          {/* Project Image Gallery */}
          {project.images.length > 0 && (
            <section className="space-y-4 pt-6 border-t border-slate-800">
              <h2 className="text-lg font-bold text-slate-100">Project Visual Gallery</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {project.images.map((img) => (
                  <div key={img.id} className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                    <img src={img.url} alt={img.altText || project.title} className="w-full h-auto object-cover" />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

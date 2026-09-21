import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { Search, Filter, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Data Analyst Projects & Case Studies | Jeffrey Usman",
  description: "Browse data analysis, exploratory data analysis, SQL queries, and Power BI dashboards built around real business problems.",
};

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: { search?: string; category?: string; tag?: string };
}) {
  const search = searchParams.search || "";
  const selectedCategory = searchParams.category || "All";
  const selectedTag = searchParams.tag || "All";

  const where: any = { published: true };

  if (selectedCategory !== "All") {
    where.category = { equals: selectedCategory, mode: "insensitive" };
  }

  if (selectedTag !== "All") {
    where.tags = { has: selectedTag };
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { shortDescription: { contains: search, mode: "insensitive" } },
      { tags: { has: search } },
    ];
  }

  const [projects, allProjects] = await Promise.all([
    prisma.project.findMany({
      where,
      orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
    }),
    prisma.project.findMany({
      where: { published: true },
      select: { category: true, tags: true },
    }),
  ]);

  // Extract unique categories & tags
  const categories = ["All", ...Array.from(new Set(allProjects.map((p) => p.category)))];
  const allTags = Array.from(new Set(allProjects.flatMap((p) => p.tags)));

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 font-sans">
      <Navbar />

      <main className="pt-36 pb-24 px-6 max-w-7xl mx-auto space-y-12">
        <div className="space-y-4">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">PORTFOLIO CASE STUDIES</span>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-100">
            Data Analysis Projects
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl leading-relaxed">
            Real data projects presenting problem statements, data cleaning procedures, SQL query modeling, and actionable business insights.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-6">
          <form method="GET" className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-6 relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="text"
                name="search"
                defaultValue={search}
                placeholder="Search by keywords, SQL, Power BI, Python..."
                className="w-full bg-slate-950/60 border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="md:col-span-3">
              <select
                name="category"
                defaultValue={selectedCategory}
                className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
              >
                <option value="All">All Categories</option>
                {categories.filter((c) => c !== "All").map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-3 flex gap-2">
              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs rounded-lg transition-all"
              >
                Apply Filters
              </button>
            </div>
          </form>

          {/* Quick Tag Pills */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="text-slate-500 font-medium mr-2">Popular Tags:</span>
            {allTags.slice(0, 8).map((t) => (
              <Link
                key={t}
                href={`/projects?tag=${encodeURIComponent(t)}`}
                className={`px-3 py-1 rounded-full border transition-all ${
                  selectedTag === t
                    ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                    : "bg-slate-950/60 text-slate-400 border-slate-800 hover:text-slate-200"
                }`}
              >
                {t}
              </Link>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.length === 0 ? (
            <div className="col-span-3 text-center py-16 bg-slate-900/40 border border-slate-800 rounded-xl space-y-3">
              <p className="text-slate-400 font-semibold text-sm">No projects matched your criteria.</p>
              <Link href="/projects" className="text-xs text-emerald-400 hover:underline inline-block">
                Clear Filters & View All
              </Link>
            </div>
          ) : (
            projects.map((project) => (
              <div
                key={project.id}
                className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden hover:border-emerald-500/40 transition-all flex flex-col justify-between group shadow-xl"
              >
                <div>
                  <div className="h-52 relative overflow-hidden bg-slate-950">
                    <img
                      src={project.coverImage}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 px-3 py-1 bg-slate-950/80 backdrop-blur-md border border-slate-800 rounded-full text-[10px] font-bold text-emerald-400 uppercase">
                      {project.category}
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <h3 className="font-bold text-slate-100 text-lg group-hover:text-emerald-400 transition-colors line-clamp-1">
                      {project.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                      {project.shortDescription}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 bg-slate-800/80 border border-slate-700/60 rounded-md text-[10px] font-medium text-slate-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <Link
                    href={`/projects/${project.slug}`}
                    className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors pt-4 border-t border-slate-800 w-full"
                  >
                    <span>View Case Study</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

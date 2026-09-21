"use client";
import { useEffect, useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminTourDirector from "@/components/admin/AdminTourDirector";
import Link from "next/link";
import {
  Folder,
  Star,
  Eye,
  Mail,
  Wrench,
  Award,
  Plus,
  ArrowRight,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [stats, setStats] = useState({
    totalProjects: 0,
    featuredProjects: 0,
    publishedProjects: 0,
    unreadMessages: 0,
    totalSkills: 0,
    totalCertifications: 0,
  });
  const [recentProjects, setRecentProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [projRes, msgRes, skillRes, certRes] = await Promise.all([
          fetch("/api/admin/projects"),
          fetch("/api/admin/messages"),
          fetch("/api/admin/skills"),
          fetch("/api/admin/certifications"),
        ]);

        const projData = await projRes.json();
        const msgData = await msgRes.json();
        const skillData = await skillRes.json();
        const certData = await certRes.json();

        const projects = projData.projects || [];
        setRecentProjects(projects.slice(0, 5));

        setStats({
          totalProjects: projects.length,
          featuredProjects: projects.filter((p: any) => p.featured).length,
          publishedProjects: projects.filter((p: any) => p.published).length,
          unreadMessages: msgData.unreadCount || 0,
          totalSkills: (skillData.skills || []).length,
          totalCertifications: (certData.certifications || []).length,
        });
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  return (
    <div className="flex min-h-screen bg-[#0B0F17]">
      <AdminSidebar mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />
      <AdminTourDirector autoStart={true} />

      <main className="flex-1 min-w-0">
        <AdminHeader
          title="Dashboard Overview"
          subtitle="Welcome back, Jeffrey. Here is your portfolio performance summary."
          onOpenMobileNav={() => setMobileOpen(true)}
        />

        <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-7xl mx-auto">
          {/* Stats Grid */}
          <div data-tour="dashboard-stats" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 sm:p-5">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider">Total Projects</span>
                <Folder className="w-4 h-4 text-emerald-400 shrink-0" />
              </div>
              <p className="text-xl sm:text-2xl font-bold text-slate-100">{loading ? "..." : stats.totalProjects}</p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 sm:p-5">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider">Featured</span>
                <Star className="w-4 h-4 text-amber-400 shrink-0" />
              </div>
              <p className="text-xl sm:text-2xl font-bold text-slate-100">{loading ? "..." : stats.featuredProjects}</p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 sm:p-5">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider">Published</span>
                <Eye className="w-4 h-4 text-teal-400 shrink-0" />
              </div>
              <p className="text-xl sm:text-2xl font-bold text-slate-100">{loading ? "..." : stats.publishedProjects}</p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 sm:p-5">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider">Unread Msgs</span>
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
              </div>
              <p className="text-xl sm:text-2xl font-bold text-emerald-400">{loading ? "..." : stats.unreadMessages}</p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 sm:p-5">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider">Skills</span>
                <Wrench className="w-4 h-4 text-slate-400 shrink-0" />
              </div>
              <p className="text-xl sm:text-2xl font-bold text-slate-100">{loading ? "..." : stats.totalSkills}</p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 sm:p-5">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider">Certificates</span>
                <Award className="w-4 h-4 text-slate-400 shrink-0" />
              </div>
              <p className="text-xl sm:text-2xl font-bold text-slate-100">{loading ? "..." : stats.totalCertifications}</p>
            </div>
          </div>

          {/* Quick Action Banner */}
          <div data-tour="create-project-banner" className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/20 rounded-xl p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-100 mb-1">Add a New Case Study</h3>
              <p className="text-xs text-slate-400 max-w-xl">
                Showcase your latest SQL, Python, or Power BI analysis with problem statements, datasets, methodology steps, and key findings.
              </p>
            </div>
            <Link
              href="/admin/projects"
              className="w-full sm:w-auto px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg text-xs transition-all flex items-center justify-center gap-2 shrink-0 shadow-lg shadow-emerald-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>Create Project</span>
            </Link>
          </div>

          {/* Recent Projects Table */}
          <div data-tour="recent-projects" className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-100 text-sm sm:text-base">Recent Portfolio Projects</h3>
                <p className="text-xs text-slate-400 mt-0.5">Manage and update case studies</p>
              </div>
              <Link
                href="/admin/projects"
                className="text-xs text-emerald-400 hover:underline flex items-center gap-1 shrink-0"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loading ? (
              <div className="p-8 text-center text-slate-400 text-xs">Loading projects...</div>
            ) : recentProjects.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">No projects found. Create your first project above.</div>
            ) : (
              <div className="divide-y divide-slate-800/60 overflow-x-auto">
                {recentProjects.map((p) => (
                  <div key={p.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-800/30 transition-colors">
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                      {p.coverImage && (
                        <img
                          src={p.coverImage}
                          alt={p.title}
                          className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover border border-slate-800 shrink-0"
                        />
                      )}
                      <div className="min-w-0">
                        <h4 className="font-semibold text-xs sm:text-sm text-slate-100 truncate">{p.title}</h4>
                        <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5 truncate">{p.category} • {p.tags?.join(", ")}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase ${
                        p.published ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-slate-800 text-slate-400"
                      }`}>
                        {p.published ? "Published" : "Draft"}
                      </span>
                      {p.featured && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          Featured
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}


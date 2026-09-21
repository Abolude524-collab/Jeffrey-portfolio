"use client";
import { useEffect, useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import {
  Plus,
  Edit2,
  Trash2,
  Upload,
  X,
  Star,
  Image as ImageIcon,
} from "lucide-react";

export default function AdminProjectsPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formError, setFormError] = useState("");

  const initialForm = {
    title: "",
    slug: "",
    shortDescription: "",
    category: "Data Analysis",
    tagsStr: "SQL, Python, Power BI",
    coverImage: "",
    coverImagePublicId: "",
    problem: "",
    objective: "",
    dataset: "",
    methodology: "",
    insights: "",
    results: "",
    challenges: "",
    githubUrl: "",
    liveUrl: "",
    featured: false,
    published: true,
    displayOrder: 0,
  };

  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/projects");
      const data = await res.json();
      if (data.projects) {
        setProjects(data.projects);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
  };

  const handleTitleChange = (val: string) => {
    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: editingId ? prev.slug : generateSlug(val),
    }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setFormError("");

    try {
      const body = new FormData();
      body.append("file", file);
      body.append("folder", "jeffrey-portfolio/projects");

      const res = await fetch("/api/admin/uploads", {
        method: "POST",
        body,
      });

      const data = await res.json();
      if (res.ok && data.file) {
        setFormData((prev) => ({
          ...prev,
          coverImage: data.file.url,
          coverImagePublicId: data.file.publicId,
        }));
      } else {
        setFormError(data.error || "Failed to upload cover image");
      }
    } catch (err) {
      setFormError("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleEditClick = (p: any) => {
    setEditingId(p.id);
    setFormData({
      title: p.title || "",
      slug: p.slug || "",
      shortDescription: p.shortDescription || "",
      category: p.category || "Data Analysis",
      tagsStr: p.tags ? p.tags.join(", ") : "",
      coverImage: p.coverImage || "",
      coverImagePublicId: p.coverImagePublicId || "",
      problem: p.problem || "",
      objective: p.objective || "",
      dataset: p.dataset || "",
      methodology: p.methodology || "",
      insights: p.insights || "",
      results: p.results || "",
      challenges: p.challenges || "",
      githubUrl: p.githubUrl || "",
      liveUrl: p.liveUrl || "",
      featured: Boolean(p.featured),
      published: Boolean(p.published),
      displayOrder: p.displayOrder || 0,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      const res = await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchProjects();
      }
    } catch (err) {
      alert("Delete failed");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!formData.coverImage) {
      setFormError("Cover Image URL or uploaded image is required");
      return;
    }

    const payload = {
      title: formData.title,
      slug: formData.slug,
      shortDescription: formData.shortDescription,
      category: formData.category,
      tags: formData.tagsStr.split(",").map((t) => t.trim()).filter(Boolean),
      coverImage: formData.coverImage,
      coverImagePublicId: formData.coverImagePublicId,
      problem: formData.problem,
      objective: formData.objective,
      dataset: formData.dataset,
      methodology: formData.methodology,
      insights: formData.insights,
      results: formData.results,
      challenges: formData.challenges,
      githubUrl: formData.githubUrl,
      liveUrl: formData.liveUrl,
      featured: formData.featured,
      published: formData.published,
      displayOrder: Number(formData.displayOrder),
    };

    try {
      const url = editingId ? `/api/admin/projects/${editingId}` : "/api/admin/projects";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        setShowForm(false);
        setEditingId(null);
        setFormData(initialForm);
        fetchProjects();
      } else {
        setFormError(data.error || "Failed to save project");
      }
    } catch (err) {
      setFormError("An error occurred while saving the project");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0B0F17]">
      <AdminSidebar mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />

      <main className="flex-1 min-w-0">
        <AdminHeader
          title="Project Management"
          subtitle="Create, edit, and publish case studies for your Data Analyst portfolio."
          onOpenMobileNav={() => setMobileOpen(true)}
        />

        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-base sm:text-lg font-bold text-slate-100">All Projects ({projects.length})</h2>
            <button
              onClick={() => {
                setEditingId(null);
                setFormData(initialForm);
                setShowForm(!showForm);
              }}
              className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg text-xs transition-all flex items-center gap-2 shrink-0 shadow-lg shadow-emerald-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>{showForm && !editingId ? "Cancel" : "New Project"}</span>
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleSubmit} className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 sm:p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <h3 className="font-bold text-slate-100 text-sm sm:text-base">{editingId ? "Edit Project" : "Create New Case Study"}</h3>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="text-slate-400 hover:text-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {formError && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-300 text-xs rounded-lg">
                  {formError}
                </div>
              )}

              {/* Basic Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Project Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
                    placeholder="e.g. Sales Data Cleaning & Power BI Dashboard"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Slug (URL string) *</label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category *</label>
                  <input
                    type="text"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Tags (Comma Separated)</label>
                  <input
                    type="text"
                    value={formData.tagsStr}
                    onChange={(e) => setFormData({ ...formData, tagsStr: e.target.value })}
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: Number(e.target.value) })}
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Short Description *</label>
                <textarea
                  required
                  rows={2}
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              {/* Cover Image */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300">Cover Image URL *</label>
                <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                  <input
                    type="text"
                    required
                    value={formData.coverImage}
                    onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                    className="flex-1 bg-slate-950/60 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none min-w-0"
                    placeholder="https://..."
                  />
                  <label className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg cursor-pointer flex items-center justify-center gap-2 font-medium shrink-0">
                    <Upload className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{uploading ? "Uploading..." : "Upload File"}</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                  </label>
                </div>
                {formData.coverImage && (
                  <div className="mt-2 relative w-32 h-20 rounded-lg overflow-hidden border border-slate-800">
                    <img src={formData.coverImage} alt="Cover preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {/* Case Study Storytelling Sections */}
              <div className="space-y-4 pt-4 border-t border-slate-800">
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Case Study Sections</h4>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Problem Statement</label>
                  <textarea
                    rows={2}
                    value={formData.problem}
                    onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Objective</label>
                  <textarea
                    rows={2}
                    value={formData.objective}
                    onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Dataset Description</label>
                  <textarea
                    rows={2}
                    value={formData.dataset}
                    onChange={(e) => setFormData({ ...formData, dataset: e.target.value })}
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Methodology & Execution Steps</label>
                  <textarea
                    rows={3}
                    value={formData.methodology}
                    onChange={(e) => setFormData({ ...formData, methodology: e.target.value })}
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Key Insights</label>
                  <textarea
                    rows={2}
                    value={formData.insights}
                    onChange={(e) => setFormData({ ...formData, insights: e.target.value })}
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Business Results & Impact</label>
                  <textarea
                    rows={2}
                    value={formData.results}
                    onChange={(e) => setFormData({ ...formData, results: e.target.value })}
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Links & Status Toggles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-800">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">GitHub Repository URL</label>
                  <input
                    type="text"
                    value={formData.githubUrl}
                    onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Live Dashboard URL</label>
                  <input
                    type="text"
                    value={formData.liveUrl}
                    onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    className="w-4 h-4 accent-emerald-500 rounded"
                  />
                  <span className="text-xs font-semibold text-slate-200">Published</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 accent-amber-500 rounded"
                  />
                  <span className="text-xs font-semibold text-slate-200">Featured Project</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold rounded-lg shadow-lg shadow-emerald-500/20"
                >
                  {editingId ? "Update Project" : "Create Project"}
                </button>
              </div>
            </form>
          )}

          {/* Project Cards List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {loading ? (
              <p className="text-slate-400 text-xs col-span-full">Loading projects...</p>
            ) : projects.length === 0 ? (
              <p className="text-slate-400 text-xs col-span-full">No projects found.</p>
            ) : (
              projects.map((p) => (
                <div key={p.id} className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden flex flex-col justify-between">
                  <div>
                    <div className="h-44 relative bg-slate-950 border-b border-slate-800">
                      {p.coverImage ? (
                        <img src={p.coverImage} alt={p.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-600">
                          <ImageIcon className="w-8 h-8" />
                        </div>
                      )}
                      <div className="absolute top-3 right-3 flex items-center gap-1.5">
                        {p.featured && (
                          <span className="p-1.5 rounded-md bg-amber-500/20 text-amber-400 border border-amber-500/30">
                            <Star className="w-3.5 h-3.5 fill-amber-400" />
                          </span>
                        )}
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          p.published ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-slate-900/80 text-slate-400"
                        }`}>
                          {p.published ? "Published" : "Draft"}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 sm:p-5 space-y-2">
                      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">{p.category}</span>
                      <h3 className="font-bold text-slate-100 text-sm sm:text-base line-clamp-1">{p.title}</h3>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{p.shortDescription}</p>
                    </div>
                  </div>

                  <div className="p-4 sm:p-5 pt-0 border-t border-slate-800/60 mt-4 flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 font-mono truncate max-w-[150px]">/{p.slug}</span>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleEditClick(p)}
                        className="p-2 text-slate-300 hover:text-emerald-400 hover:bg-slate-800 rounded-lg transition-colors"
                        title="Edit Project"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Delete Project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

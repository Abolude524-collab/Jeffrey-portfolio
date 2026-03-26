"use client";
import { useCallback, useEffect, useState } from "react";
import { ChevronDown, Plus, Upload, ArrowLeft, LogOut } from "lucide-react";
import Link from "next/link";
import type { AuthResponse, AdminProject } from "@/types";

interface AdminUser {
  id: string;
  username: string;
  role: string;
}

type AdminTab = "projects" | "media" | "messages";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function AdminDashboard() {
  const [tab, setTab] = useState<AdminTab>("projects");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState("");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");

    try {
      const res = await fetch(`${API_URL}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data: AuthResponse = await res.json();

      if (res.ok && data.token && data.user) {
        localStorage.setItem("adminToken", data.token);
        setIsAuthenticated(true);
        setAdminUser(data.user);
      } else {
        setAuthError(data.error || "Login failed");
      }
    } catch (err) {
      setAuthError("Login failed. Please check your connection.");
    }
  };

  const handleLogout = async () => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      try {
        await fetch(`${API_URL}/api/admin/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch {
        // ignore
      }
    }
    localStorage.removeItem("adminToken");
    setIsAuthenticated(false);
    setAdminUser(null);
    setTab("projects");
  };

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      setLoading(false);
      return;
    }

    fetch(`${API_URL}/api/admin/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        localStorage.removeItem("adminToken");
        setLoading(false);
        return null;
      })
      .then((data: any) => {
        if (data?.user) {
          setAdminUser(data.user);
          setIsAuthenticated(true);
        }
      })
      .catch(() => {
        localStorage.removeItem("adminToken");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <section className="flex items-center justify-center min-h-screen">
        <div className="text-slate-400">Loading...</div>
      </section>
    );
  }

  if (!isAuthenticated) {
    return (
      <section className="max-w-md mx-auto py-12 px-4 min-h-screen flex items-center justify-center">
        <div className="w-full bg-cardGlass backdrop-blur-md rounded-glass shadow-glass border border-slate-800 p-8">
          <h1 className="text-2xl font-bold mb-2 text-emerald-400 text-center">
            Admin Dashboard
          </h1>
          <p className="text-slate-300 text-sm text-center mb-6">
            Manage your portfolio
          </p>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="username" className="text-slate-200 text-sm">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="bg-transparent border border-slate-700 rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-accent-emerald text-sm"
                placeholder="owner"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-slate-200 text-sm">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-transparent border border-slate-700 rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-accent-emerald text-sm"
              />
            </div>

            <button
              type="submit"
              className="mt-2 px-6 py-2 rounded-full bg-accent-emerald text-white font-semibold hover:bg-emerald-600 transition-colors"
            >
              Login
            </button>

            {authError && (
              <div className="text-red-400 text-center text-sm">{authError}</div>
            )}
          </form>

          <Link
            href="/"
            className="mt-6 flex items-center justify-center gap-2 text-slate-400 hover:text-accent-emerald transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-slate-900">
      <header className="sticky top-0 z-30 bg-cardGlass backdrop-blur-md border-b border-slate-800">
        <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-bold text-emerald-400">Dashboard</h1>
            <p className="text-xs text-slate-400">
              Logged in as {adminUser?.username}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </nav>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-4 mb-8 border-b border-slate-800">
          <button
            onClick={() => setTab("projects")}
            className={`pb-4 px-4 font-semibold transition-colors ${
              tab === "projects"
                ? "text-emerald-400 border-b-2 border-emerald-400"
                : "text-slate-400 hover:text-slate-300"
            }`}
          >
            Projects ({tab === "projects" ? "🔄" : "📋"})
          </button>
          <button
            onClick={() => setTab("media")}
            className={`pb-4 px-4 font-semibold transition-colors ${
              tab === "media"
                ? "text-emerald-400 border-b-2 border-emerald-400"
                : "text-slate-400 hover:text-slate-300"
            }`}
          >
            Media ({tab === "media" ? "🔄" : "📸"})
          </button>
          <button
            onClick={() => setTab("messages")}
            className={`pb-4 px-4 font-semibold transition-colors ${
              tab === "messages"
                ? "text-emerald-400 border-b-2 border-emerald-400"
                : "text-slate-400 hover:text-slate-300"
            }`}
          >
            Messages ({tab === "messages" ? "🔄" : "💬"})
          </button>
        </div>

        {tab === "projects" && <ProjectsTab token={localStorage.getItem("adminToken") || ""} />}
        {tab === "media" && <MediaTab token={localStorage.getItem("adminToken") || ""} />}
        {tab === "messages" && <MessagesTab token={localStorage.getItem("adminToken") || ""} />}

        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 text-slate-400 hover:text-accent-emerald transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Portfolio
        </Link>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Projects Tab Component
// ────────────────────────────────────────────────────────────────────────────
function ProjectsTab({ token }: { token: string }) {
  const [projects, setProjects] = useState<AdminProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/projects`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setProjects(Array.isArray(data) ? data : []);
      } else {
        setError("Failed to load projects");
      }
    } catch {
      setError("Error fetching projects");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-100">Projects</h2>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="flex items-center gap-2 px-4 py-2 bg-accent-emerald text-white rounded-lg hover:bg-emerald-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Project
        </button>
      </div>

      {showCreate && <ProjectForm token={token} onSuccess={() => {setShowCreate(false); fetchProjects();}} />}

      {loading ? (
        <div className="text-slate-400">Loading projects...</div>
      ) : error ? (
        <div className="text-red-400">{error}</div>
      ) : projects.length === 0 ? (
        <div className="text-slate-400 text-center py-8">No projects yet.</div>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              token={token}
              onUpdated={fetchProjects}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Project Form Component (Create/Edit)
// ────────────────────────────────────────────────────────────────────────────
interface ProjectFormProps {
  token: string;
  project?: AdminProject;
  onSuccess: () => void;
}

function ProjectForm({ token, project, onSuccess }: ProjectFormProps) {
  const [formData, setFormData] = useState({
    title: project?.title || "",
    shortDescription: project?.shortDescription || "",
    tags: project?.tags?.join(", ") || "",
    caseStudyMarkdown: project?.caseStudyMarkdown || "",
    projectUrl: project?.projectUrl || "",
    githubUrl: project?.githubUrl || "",
    status: project?.status || "draft",
    displayOrder: project?.displayOrder || 0,
  });

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [coverImage, setCoverImage] = useState(project?.coverImage || null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formDataObj = new FormData();
    formDataObj.set("file", file);

    try {
      setError("");
      const res = await fetch(`${API_URL}/api/admin/uploads/cover`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formDataObj,
      });

      if (res.ok) {
        const data = await res.json();
        if (data.file) {
          setCoverImage(data.file);
        }
      } else {
        const errorData = await res.json();
        setError(errorData.error || "Image upload failed");
      }
    } catch {
      setError("Image upload error. Check your connection.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    if (!coverImage?.url) {
      setError("Cover image is required.");
      setSubmitting(false);
      return;
    }

    const payload = {
      title: formData.title,
      shortDescription: formData.shortDescription,
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      caseStudyMarkdown: formData.caseStudyMarkdown,
      coverImage,
      projectUrl: formData.projectUrl || null,
      githubUrl: formData.githubUrl || null,
      status: formData.status,
      displayOrder: Number(formData.displayOrder),
    };

    try {
      const method = project ? "PUT" : "POST";
      const url = project
        ? `${API_URL}/api/admin/projects/${project.id}`
        : `${API_URL}/api/admin/projects`;

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        onSuccess();
      } else {
        const errorData = await res.json();
        setError(errorData.error || "Failed to save project");
      }
    } catch {
      setError("Error saving project");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-cardGlass backdrop-blur-md rounded-glass p-6 space-y-4 border border-slate-800"
    >
      <h3 className="text-lg font-bold text-emerald-400">
        {project ? "Edit Project" : "New Project"}
      </h3>

      {error && <div className="text-red-400 text-sm">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-slate-200 text-sm">Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            className="w-full mt-1 bg-transparent border border-slate-700 rounded px-3 py-2 text-slate-100"
          />
        </div>

        <div>
          <label className="text-slate-200 text-sm">Display Order</label>
          <input
            type="number"
            name="displayOrder"
            value={formData.displayOrder}
            onChange={handleInputChange}
            className="w-full mt-1 bg-transparent border border-slate-700 rounded px-3 py-2 text-slate-100"
          />
        </div>
      </div>

      <div>
        <label className="text-slate-200 text-sm">Short Description *</label>
        <textarea
          name="shortDescription"
          value={formData.shortDescription}
          onChange={handleInputChange}
          required
          rows={2}
          className="w-full mt-1 bg-transparent border border-slate-700 rounded px-3 py-2 text-slate-100"
        />
      </div>

      <div>
        <label className="text-slate-200 text-sm">Tags (comma-separated) *</label>
        <input
          type="text"
          name="tags"
          value={formData.tags}
          onChange={handleInputChange}
          required
          className="w-full mt-1 bg-transparent border border-slate-700 rounded px-3 py-2 text-slate-100"
          placeholder="SQL, Python, PowerBI"
        />
      </div>

      <div>
        <label className="text-slate-200 text-sm">Cover Image *</label>
        <div className="mt-2 flex items-center gap-4">
          {coverImage?.url && (
            <div className="w-20 h-20 rounded border border-slate-700 overflow-hidden">
              <img
                src={coverImage.url}
                alt="Cover"
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <label className="px-4 py-2 bg-accent-slate/20 text-slate-300 rounded cursor-pointer hover:bg-accent-slate/30 transition-colors flex items-center gap-2">
            <Upload className="w-4 h-4" />
            <span>{coverImage ? "Change" : "Upload"}</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      <div>
        <label className="text-slate-200 text-sm">Case Study (Markdown) *</label>
        <textarea
          name="caseStudyMarkdown"
          value={formData.caseStudyMarkdown}
          onChange={handleInputChange}
          required
          rows={6}
          className="w-full mt-1 bg-transparent border border-slate-700 rounded px-3 py-2 text-slate-100 font-mono text-xs"
          placeholder="## Problem Statement&#10;...&#10;## Solution"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-slate-200 text-sm">Project URL (optional)</label>
          <input
            type="url"
            name="projectUrl"
            value={formData.projectUrl}
            onChange={handleInputChange}
            className="w-full mt-1 bg-transparent border border-slate-700 rounded px-3 py-2 text-slate-100"
          />
        </div>

        <div>
          <label className="text-slate-200 text-sm">GitHub URL (optional)</label>
          <input
            type="url"
            name="githubUrl"
            value={formData.githubUrl}
            onChange={handleInputChange}
            className="w-full mt-1 bg-transparent border border-slate-700 rounded px-3 py-2 text-slate-100"
          />
        </div>
      </div>

      <div>
        <label className="text-slate-200 text-sm">Status</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleInputChange}
          className="w-full mt-1 bg-transparent border border-slate-700 rounded px-3 py-2 text-slate-100"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="scheduled">Scheduled</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="px-6 py-2 bg-accent-emerald text-white rounded-lg hover:bg-emerald-600 transition-colors disabled:bg-slate-600"
      >
        {submitting ? "Saving..." : project ? "Update Project" : "Create Project"}
      </button>
    </form>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Project Card Component
// ────────────────────────────────────────────────────────────────────────────
interface ProjectCardProps {
  project: AdminProject;
  token: string;
  onUpdated: () => void;
}

function ProjectCard({ project, token, onUpdated }: ProjectCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Delete this project?")) return;

    setDeleting(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/projects/${project.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        onUpdated();
      }
    } catch {
      alert("Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="bg-cardGlass backdrop-blur-md rounded-glass p-4 border border-slate-800">
      <div
        className="flex items-start justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex-1">
          <h4 className="font-semibold text-slate-100">{project.title}</h4>
          <p className="text-xs text-slate-400 mt-1">
            Status: <span className="text-emerald-400">{project.status}</span> •
            Order: {project.displayOrder}
          </p>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform ${
            isExpanded ? "rotate-180" : ""
          }`}
        />
      </div>

      {isExpanded && (
        <div className="mt-4 space-y-3 border-t border-slate-700 pt-4">
          {project.coverImage?.url && (
            <div className="w-full h-32 rounded overflow-hidden">
              <img
                src={project.coverImage.url}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div>
            <p className="text-xs font-semibold text-slate-300">Description</p>
            <p className="text-xs text-slate-400">{project.shortDescription}</p>
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-300">Tags</p>
            <div className="flex gap-1 mt-1 flex-wrap">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-1 bg-accent-slate/20 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-2 border-t border-slate-700">
            <button
              onClick={(e) => {
                e.stopPropagation();
                alert("Edit feature coming soon - use form above");
              }}
              className="px-3 py-1 text-xs bg-accent-emerald/20 text-emerald-400 rounded hover:bg-accent-emerald/30"
            >
              Edit
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
              disabled={deleting}
              className="px-3 py-1 text-xs bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 disabled:opacity-50"
            >
              {deleting ? "..." : "Delete"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Media Tab (placeholder for media upload UI)
// ────────────────────────────────────────────────────────────────────────────
function MediaTab({ token }: { token: string }) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-slate-100">Media Library</h2>
      <div className="bg-cardGlass backdrop-blur-md rounded-glass p-8 text-center border border-slate-800">
        <p className="text-slate-400">
          Images are uploaded when creating/editing projects. Media management
          coming soon.
        </p>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Messages Tab Component
// ────────────────────────────────────────────────────────────────────────────
function MessagesTab({ token }: { token: string }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/messages`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setMessages(Array.isArray(data) ? data : []);
      } else {
        setError("Failed to load messages");
      }
    } catch {
      setError("Error fetching messages");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-100">Contact Messages</h2>
        <button
          onClick={fetchMessages}
          className="px-4 py-2 bg-accent-slate/20 text-slate-300 rounded hover:bg-accent-slate/30"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="text-slate-400">Loading messages...</div>
      ) : error ? (
        <div className="text-red-400">{error}</div>
      ) : messages.length === 0 ? (
        <div className="text-slate-400 text-center py-8">No messages yet.</div>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className="bg-cardGlass backdrop-blur-md rounded-glass p-4 border border-slate-800"
            >
              <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
                <div>
                  <p className="font-semibold text-slate-100">{msg.name}</p>
                  <p className="text-xs text-slate-400">{msg.email}</p>
                  {msg.phone && (
                    <p className="text-xs text-slate-400">{msg.phone}</p>
                  )}
                </div>
                <p className="text-xs text-slate-500">
                  {new Date(msg.date).toLocaleString()}
                </p>
              </div>
              <p className="text-slate-300 text-sm whitespace-pre-wrap bg-slate-900/30 rounded p-3">
                {msg.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

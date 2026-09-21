"use client";
import { useEffect, useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import { User, Upload, Check } from "lucide-react";

export default function AdminProfilePage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    name: "Jeffrey Usman",
    title: "Data Analyst",
    bio: "Expert data analyst specialized in SQL, Power BI, and Python. I uncover hidden patterns, clean complex datasets, and drive business impact through analytical clarity.",
    email: "jeffreyusman@gmail.com",
    githubUrl: "https://github.com/jeffrey-wonder06",
    linkedinUrl: "https://www.linkedin.com/in/jeffrey-usman-a0b953352",
    resumeUrl: "/resume.pdf",
    profileImageUrl: "",
    profileImagePublicId: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/profile");
      const data = await res.json();
      if (data.profile) {
        setFormData({
          name: data.profile.name || "Jeffrey Usman",
          title: data.profile.title || "Data Analyst",
          bio: data.profile.bio || "",
          email: data.profile.email || "",
          githubUrl: data.profile.githubUrl || "",
          linkedinUrl: data.profile.linkedinUrl || "",
          resumeUrl: data.profile.resumeUrl || "",
          profileImageUrl: data.profile.profileImageUrl || "",
          profileImagePublicId: data.profile.profileImagePublicId || "",
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("folder", "jeffrey-portfolio/profile");

      const res = await fetch("/api/admin/uploads", { method: "POST", body });
      const data = await res.json();
      if (res.ok && data.file) {
        setFormData((prev) => ({
          ...prev,
          profileImageUrl: data.file.url,
          profileImagePublicId: data.file.publicId,
        }));
      }
    } catch (err) {
      alert("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const res = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setMessage("Profile updated successfully!");
        fetchProfile();
      } else {
        setMessage("Failed to update profile.");
      }
    } catch (err) {
      setMessage("Error saving profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0B0F17]">
      <AdminSidebar mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />
      <main className="flex-1 min-w-0">
        <AdminHeader
          title="Profile & Personal Info"
          subtitle="Update public bio, contact email, social links, and headshot."
          onOpenMobileNav={() => setMobileOpen(true)}
        />

        <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
          {message && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs rounded-lg flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{message}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Professional Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-slate-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Professional Bio *</label>
              <textarea
                required
                rows={4}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-slate-100 leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Contact Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Resume Download Link / Path</label>
                <input
                  type="text"
                  value={formData.resumeUrl}
                  onChange={(e) => setFormData({ ...formData, resumeUrl: e.target.value })}
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-slate-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">GitHub Profile URL</label>
                <input
                  type="text"
                  value={formData.githubUrl}
                  onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">LinkedIn Profile URL</label>
                <input
                  type="text"
                  value={formData.linkedinUrl}
                  onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-slate-100"
                />
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-800">
              <label className="block text-xs font-semibold text-slate-300">Profile Image / Headshot</label>
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                {formData.profileImageUrl ? (
                  <img src={formData.profileImageUrl} alt="Headshot" className="w-16 h-16 rounded-full object-cover border border-emerald-500/30 shrink-0" />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 shrink-0">
                    <User className="w-8 h-8" />
                  </div>
                )}
                <label className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg cursor-pointer flex items-center gap-2 font-medium">
                  <Upload className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{uploading ? "Uploading..." : "Upload Headshot"}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                </label>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={saving}
                className="w-full sm:w-auto px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs rounded-lg shadow-lg shadow-emerald-500/20"
              >
                {saving ? "Saving Profile..." : "Save Profile Changes"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

"use client";
import { useEffect, useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import { Plus, Trash2, Upload } from "lucide-react";

export default function AdminCertificationsPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [certifications, setCertifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    issuer: "",
    issueDate: "2024",
    credentialUrl: "",
    imageUrl: "",
    imagePublicId: "",
  });

  useEffect(() => {
    fetchCertifications();
  }, []);

  const fetchCertifications = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/certifications");
      const data = await res.json();
      if (data.certifications) setCertifications(data.certifications);
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
      body.append("folder", "jeffrey-portfolio/certifications");

      const res = await fetch("/api/admin/uploads", { method: "POST", body });
      const data = await res.json();
      if (res.ok && data.file) {
        setFormData((prev) => ({
          ...prev,
          imageUrl: data.file.url,
          imagePublicId: data.file.publicId,
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
    try {
      const res = await fetch("/api/admin/certifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setShowForm(false);
        setFormData({ title: "", issuer: "", issueDate: "2024", credentialUrl: "", imageUrl: "", imagePublicId: "" });
        fetchCertifications();
      }
    } catch (err) {
      alert("Failed to add certification");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete certification?")) return;
    try {
      await fetch(`/api/admin/certifications?id=${id}`, { method: "DELETE" });
      fetchCertifications();
    } catch (err) {
      alert("Delete failed");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0B0F17]">
      <AdminSidebar mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />
      <main className="flex-1 min-w-0">
        <AdminHeader
          title="Certifications"
          subtitle="Manage professional licenses and certificates."
          onOpenMobileNav={() => setMobileOpen(true)}
        />

        <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
          <div className="flex justify-between items-center gap-4">
            <h2 className="text-base sm:text-lg font-bold text-slate-100">Certifications ({certifications.length})</h2>
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg text-xs flex items-center gap-2 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>{showForm ? "Cancel" : "Add Certification"}</span>
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Certification Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100"
                    placeholder="Google Data Analytics Certificate"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Issuing Organization *</label>
                  <input
                    type="text"
                    required
                    value={formData.issuer}
                    onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100"
                    placeholder="Coursera / Google"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Issue Year *</label>
                  <input
                    type="text"
                    required
                    value={formData.issueDate}
                    onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Credential URL</label>
                  <input
                    type="text"
                    value={formData.credentialUrl}
                    onChange={(e) => setFormData({ ...formData, credentialUrl: e.target.value })}
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300">Certificate Image</label>
                <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                  <input
                    type="text"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="flex-1 bg-slate-950/60 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100 min-w-0"
                    placeholder="https://..."
                  />
                  <label className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg cursor-pointer flex items-center justify-center gap-2 shrink-0">
                    <Upload className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{uploading ? "Uploading..." : "Upload Image"}</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                  </label>
                </div>
              </div>

              <div className="flex justify-end">
                <button type="submit" className="px-5 py-2 bg-emerald-500 text-white font-semibold text-xs rounded-lg">
                  Save Certificate
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {loading ? (
              <p className="text-xs text-slate-400 col-span-full">Loading certifications...</p>
            ) : certifications.length === 0 ? (
              <p className="text-xs text-slate-400 col-span-full">No certifications added yet.</p>
            ) : (
              certifications.map((cert) => (
                <div key={cert.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    {cert.imageUrl && (
                      <img src={cert.imageUrl} alt={cert.title} className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg object-cover border border-slate-800 shrink-0" />
                    )}
                    <div className="min-w-0">
                      <h3 className="font-bold text-slate-100 text-xs sm:text-sm truncate">{cert.title}</h3>
                      <p className="text-xs text-slate-400 mt-0.5 truncate">{cert.issuer} • {cert.issueDate}</p>
                    </div>
                  </div>
                  <button onClick={() => handleDelete(cert.id)} className="p-2 text-slate-400 hover:text-red-400 rounded-lg shrink-0">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

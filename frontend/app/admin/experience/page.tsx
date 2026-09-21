"use client";
import { useEffect, useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import { Plus, Trash2, Briefcase } from "lucide-react";

export default function AdminExperiencePage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [experiences, setExperiences] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    role: "",
    organization: "",
    location: "Remote",
    startDate: "2024",
    endDate: "Present",
    current: true,
    description: "",
    bulletsStr: "",
  });

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/experience");
      const data = await res.json();
      if (data.experiences) setExperiences(data.experiences);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        role: formData.role,
        organization: formData.organization,
        location: formData.location,
        startDate: formData.startDate,
        endDate: formData.endDate,
        current: formData.current,
        description: formData.description,
        bulletPoints: formData.bulletsStr.split("\n").filter(Boolean),
      };

      const res = await fetch("/api/admin/experience", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setShowForm(false);
        setFormData({
          role: "",
          organization: "",
          location: "Remote",
          startDate: "2024",
          endDate: "Present",
          current: true,
          description: "",
          bulletsStr: "",
        });
        fetchExperiences();
      }
    } catch (err) {
      alert("Failed to save experience entry");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete experience entry?")) return;
    try {
      await fetch(`/api/admin/experience?id=${id}`, { method: "DELETE" });
      fetchExperiences();
    } catch (err) {
      alert("Delete failed");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0B0F17]">
      <AdminSidebar mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />
      <main className="flex-1 min-w-0">
        <AdminHeader
          title="Experience Management"
          subtitle="Manage your work history timeline."
          onOpenMobileNav={() => setMobileOpen(true)}
        />

        <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
          <div className="flex justify-between items-center gap-4">
            <h2 className="text-base sm:text-lg font-bold text-slate-100">Work Timeline Entries ({experiences.length})</h2>
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg text-xs transition-all flex items-center gap-2 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>{showForm ? "Cancel" : "Add Experience"}</span>
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Role / Job Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
                    placeholder="Senior Data Analyst"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Organization / Company *</label>
                  <input
                    type="text"
                    required
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
                    placeholder="Freelance / Company Name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Start Date *</label>
                  <input
                    type="text"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">End Date</label>
                  <input
                    type="text"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Summary Description *</label>
                <textarea
                  required
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Bullet Points (One per line)</label>
                <textarea
                  rows={3}
                  value={formData.bulletsStr}
                  onChange={(e) => setFormData({ ...formData, bulletsStr: e.target.value })}
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none font-mono text-xs"
                  placeholder="Architected SQL queries&#10;Automated reporting"
                />
              </div>

              <div className="flex justify-end">
                <button type="submit" className="px-5 py-2 bg-emerald-500 text-white font-semibold text-xs rounded-lg">
                  Save Entry
                </button>
              </div>
            </form>
          )}

          <div className="space-y-4">
            {loading ? (
              <p className="text-xs text-slate-400">Loading timeline...</p>
            ) : experiences.length === 0 ? (
              <p className="text-xs text-slate-400">No experience records found.</p>
            ) : (
              experiences.map((exp) => (
                <div key={exp.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-6 flex justify-between items-start gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Briefcase className="w-4 h-4 text-emerald-400 shrink-0" />
                      <h3 className="font-bold text-slate-100 text-sm sm:text-base">{exp.role}</h3>
                      <span className="text-xs text-slate-400">@ {exp.organization}</span>
                    </div>
                    <p className="text-xs text-emerald-400 font-mono mt-1">{exp.startDate} - {exp.endDate || "Present"}</p>
                    <p className="text-xs text-slate-300 mt-2 leading-relaxed">{exp.description}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(exp.id)}
                    className="p-2 text-slate-400 hover:text-red-400 rounded-lg transition-colors shrink-0"
                  >
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

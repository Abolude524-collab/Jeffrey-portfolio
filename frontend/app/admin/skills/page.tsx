"use client";
import { useEffect, useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import { Plus, Trash2 } from "lucide-react";

export default function AdminSkillsPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [skills, setSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "Data Analysis",
    proficiency: 90,
  });

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/skills");
      const data = await res.json();
      if (data.skills) setSkills(data.skills);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          category: formData.category,
          proficiency: Number(formData.proficiency),
        }),
      });

      if (res.ok) {
        setShowForm(false);
        setFormData({ name: "", category: "Data Analysis", proficiency: 90 });
        fetchSkills();
      }
    } catch (err) {
      alert("Failed to add skill");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete skill?")) return;
    try {
      await fetch(`/api/admin/skills?id=${id}`, { method: "DELETE" });
      fetchSkills();
    } catch (err) {
      alert("Delete failed");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0B0F17]">
      <AdminSidebar mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />
      <main className="flex-1 min-w-0">
        <AdminHeader
          title="Skills & Tools"
          subtitle="Manage technical competencies and tools."
          onOpenMobileNav={() => setMobileOpen(true)}
        />

        <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
          <div className="flex justify-between items-center gap-4">
            <h2 className="text-base sm:text-lg font-bold text-slate-100">Technical Skills ({skills.length})</h2>
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg text-xs transition-all flex items-center gap-2 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>{showForm ? "Cancel" : "Add Skill"}</span>
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Skill Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
                    placeholder="e.g. SQL, Python, Power BI"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="Data Analysis">Data Analysis</option>
                    <option value="Data Visualization">Data Visualization</option>
                    <option value="Database">Database</option>
                    <option value="Business Intelligence">Business Intelligence</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Proficiency %</label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={formData.proficiency}
                    onChange={(e) => setFormData({ ...formData, proficiency: Number(e.target.value) })}
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button type="submit" className="px-5 py-2 bg-emerald-500 text-white font-semibold text-xs rounded-lg">
                  Save Skill
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {loading ? (
              <p className="text-xs text-slate-400 col-span-full">Loading skills...</p>
            ) : skills.length === 0 ? (
              <p className="text-xs text-slate-400 col-span-full">No skills added yet.</p>
            ) : (
              skills.map((skill) => (
                <div key={skill.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">{skill.category}</span>
                    <h3 className="font-bold text-slate-100 text-sm mt-0.5 truncate">{skill.name}</h3>
                  </div>
                  <button onClick={() => handleDelete(skill.id)} className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg shrink-0">
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

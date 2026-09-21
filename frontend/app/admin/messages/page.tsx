"use client";
import { useEffect, useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import { Mail, CheckCircle2, Trash2, Clock, Phone } from "lucide-react";

export default function AdminMessagesPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/messages");
      const data = await res.json();
      if (data.messages) {
        setMessages(data.messages);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleReadStatus = async (id: string, currentRead: boolean) => {
    try {
      const res = await fetch("/api/admin/messages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, read: !currentRead }),
      });
      if (res.ok) fetchMessages();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete message?")) return;
    try {
      await fetch(`/api/admin/messages?id=${id}`, { method: "DELETE" });
      fetchMessages();
    } catch (err) {
      alert("Delete failed");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0B0F17]">
      <AdminSidebar mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />
      <main className="flex-1 min-w-0">
        <AdminHeader
          title="Inquiries & Messages"
          subtitle={`View client and recruiter inquiries (${unreadCount} unread).`}
          onOpenMobileNav={() => setMobileOpen(true)}
        />

        <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
          {loading ? (
            <p className="text-xs text-slate-400">Loading messages...</p>
          ) : messages.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 sm:p-12 text-center text-slate-400 text-xs">
              No messages received yet.
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`bg-slate-900 border rounded-xl p-4 sm:p-6 transition-all ${
                  !msg.read ? "border-emerald-500/40 bg-emerald-950/10" : "border-slate-800"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4 mb-4">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <h3 className="font-bold text-slate-100 text-sm sm:text-base truncate">{msg.name}</h3>
                      {!msg.read && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase shrink-0">
                          New
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1.5 min-w-0 truncate">
                        <Mail className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="truncate">{msg.email}</span>
                      </span>
                      {msg.phone && (
                        <span className="flex items-center gap-1.5 shrink-0">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          {msg.phone}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <span className="text-[10px] sm:text-[11px] text-slate-500 flex items-center gap-1 font-mono mr-2">
                      <Clock className="w-3 h-3" />
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => toggleReadStatus(msg.id, msg.read)}
                      className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                        msg.read ? "text-slate-400 hover:text-slate-200" : "text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20"
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{msg.read ? "Mark Unread" : "Mark Read"}</span>
                    </button>
                    <button
                      onClick={() => handleDelete(msg.id)}
                      className="p-2 text-slate-400 hover:text-red-400 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {msg.subject && (
                  <p className="text-xs font-bold text-emerald-400 mb-2">Subject: {msg.subject}</p>
                )}
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap bg-slate-950/50 p-3.5 sm:p-4 rounded-lg border border-slate-800/50">
                  {msg.message}
                </p>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

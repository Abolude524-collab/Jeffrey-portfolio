"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Folder,
  Briefcase,
  Wrench,
  Award,
  Mail,
  User,
  LogOut,
  ExternalLink,
  X,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/projects", label: "Projects", icon: Folder },
  { href: "/admin/experience", label: "Experience", icon: Briefcase },
  { href: "/admin/skills", label: "Skills", icon: Wrench },
  { href: "/admin/certifications", label: "Certifications", icon: Award },
  { href: "/admin/messages", label: "Messages", icon: Mail },
  { href: "/admin/profile", label: "Profile", icon: User },
];

interface AdminSidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export default function AdminSidebar({ mobileOpen, onCloseMobile }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [unreadCount, setUnreadCount] = useState<number>(0);

  useEffect(() => {
    fetch("/api/admin/messages")
      .then((res) => res.json())
      .then((data) => {
        if (typeof data?.unreadCount === "number") {
          setUnreadCount(data.unreadCount);
        }
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // ignore
    }
    router.push("/admin/login");
    router.refresh();
  };

  const navContent = (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h2 className="font-bold text-lg text-slate-100 tracking-tight">JEFFREY CMS</h2>
          <p className="text-xs text-emerald-400 font-medium">Portfolio Admin</p>
        </div>
        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
            aria-label="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          const isMessages = item.href === "/admin/messages";

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onCloseMobile}
              className={`flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </div>

              {isMessages && unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500 text-slate-950 shadow-sm shadow-emerald-500/40 shrink-0">
                  {unreadCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800 space-y-2">
        <Link
          href="/"
          target="_blank"
          onClick={onCloseMobile}
          className="flex items-center gap-2.5 px-4 py-2 rounded-lg text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-all"
        >
          <ExternalLink className="w-4 h-4 text-emerald-400" />
          <span>View Public Site</span>
        </Link>
        <button
          onClick={() => {
            onCloseMobile?.();
            handleLogout();
          }}
          className="w-full flex items-center gap-2.5 px-4 py-2 rounded-lg text-xs text-red-400 hover:bg-red-500/10 transition-all font-medium"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-slate-900 border-r border-slate-800 flex-col h-screen sticky top-0 shrink-0">
        {navContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />
          <aside className="fixed inset-y-0 left-0 w-72 bg-slate-900 border-r border-slate-800 shadow-2xl z-50">
            {navContent}
          </aside>
        </div>
      )}
    </>
  );
}

"use client";
import { useEffect, useState } from "react";
import { Menu, Compass } from "lucide-react";
import { startAdminTour } from "@/components/admin/AdminTourDirector";

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  onOpenMobileNav?: () => void;
}

export default function AdminHeader({ title, subtitle, onOpenMobileNav }: AdminHeaderProps) {
  const [adminName, setAdminName] = useState("Jeffrey Usman");

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data?.user?.name) {
          setAdminName(data.user.name);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <header className="bg-slate-900 border-b border-slate-800 px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-3">
        {onOpenMobileNav && (
          <button
            onClick={onOpenMobileNav}
            className="lg:hidden p-2 text-slate-300 hover:bg-slate-800 hover:text-emerald-400 rounded-lg transition-colors"
            aria-label="Open mobile navigation"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div>
          <h1 className="text-base sm:text-xl font-bold text-slate-100 tracking-tight">{title}</h1>
          {subtitle && <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5 line-clamp-1">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-2.5 sm:gap-3">
        <button
          onClick={() => startAdminTour()}
          data-tour="tour-director-btn"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition-all shadow-sm shadow-emerald-500/10 active:scale-95"
          title="Start Admin Guided Tour"
        >
          <Compass className="w-4 h-4 animate-spin-slow text-emerald-400" />
          <span className="hidden sm:inline">Take Tour</span>
        </button>

        <div className="flex items-center gap-2.5 bg-slate-800/60 border border-slate-700/60 rounded-full py-1 px-3 sm:py-1.5 sm:px-4">
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">
            {adminName.charAt(0)}
          </div>
          <span className="text-xs font-semibold text-slate-200 hidden sm:inline">{adminName}</span>
        </div>
      </div>
    </header>
  );
}


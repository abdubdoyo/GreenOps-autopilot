"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  PlusSquare,
  Leaf,
  Settings,
  ChevronRight,
  Zap,
  FileText,
  Globe,
  BarChart3,
  Bell,
  Search,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/planner", label: "New Job", icon: PlusSquare },
  { href: "/plan/demo-llm-training", label: "Plan Results", icon: FileText },
  { href: "/dashboard#regions", label: "Regions", icon: Globe },
  { href: "/dashboard#analytics", label: "Analytics", icon: BarChart3 },
];

export function Sidebar() {
  const path = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-[#0a0f0a] border-r border-[rgba(34,197,94,0.1)] flex flex-col z-40">
      {/* Logo */}
      <div className="p-6 border-b border-[rgba(34,197,94,0.1)]">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg bg-[#22c55e] flex items-center justify-center glow-green">
            <Leaf className="w-5 h-5 text-[#0a0f0a]" strokeWidth={2.5} />
          </div>
          <div>
            <div className="text-sm font-bold text-white tracking-tight">GreenOps</div>
            <div className="text-[10px] text-[#6b8f6b] tracking-widest uppercase">Autopilot</div>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = path === href || (href !== "/" && path.startsWith(href.split("#")[0]));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 group",
                active
                  ? "bg-[rgba(34,197,94,0.12)] text-[#22c55e] border border-[rgba(34,197,94,0.2)]"
                  : "text-[#6b8f6b] hover:text-white hover:bg-[rgba(255,255,255,0.04)]"
              )}
            >
              <Icon className={cn("w-4 h-4", active ? "text-[#22c55e]" : "text-[#4a6b4a] group-hover:text-[#6b8f6b]")} />
              <span className="flex-1">{label}</span>
              {active && <ChevronRight className="w-3 h-3 opacity-60" />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-[rgba(34,197,94,0.1)] space-y-3">
        {/* Live status */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[rgba(34,197,94,0.06)]">
          <div className="w-2 h-2 rounded-full bg-[#22c55e] pulse-green" />
          <span className="text-xs text-[#6b8f6b]">Grid data live</span>
          <span className="ml-auto text-[10px] text-[#22c55e] font-mono">15m</span>
        </div>

        <Link
          href="/settings"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[#6b8f6b] hover:text-white hover:bg-[rgba(255,255,255,0.04)] transition-all"
        >
          <Settings className="w-4 h-4" />
          Settings
        </Link>
      </div>
    </aside>
  );
}

export function TopBar({ title }: { title?: string }) {
  return (
    <header className="h-16 border-b border-[rgba(34,197,94,0.1)] flex items-center justify-between px-6 bg-[#0a0f0a]/80 backdrop-blur-sm sticky top-0 z-30">
      <div className="flex items-center gap-3">
        {title && <h1 className="text-lg font-semibold text-white">{title}</h1>}
        <span className="flex items-center gap-1.5 text-xs text-[#22c55e] bg-[rgba(34,197,94,0.1)] px-2.5 py-1 rounded-full border border-[rgba(34,197,94,0.2)]">
          <Zap className="w-3 h-3" />
          Carbon Aware Mode Active
        </span>
      </div>

      <div className="flex items-center gap-3">
        <button className="p-2 text-[#6b8f6b] hover:text-white hover:bg-[rgba(255,255,255,0.05)] rounded-lg transition-all">
          <Search className="w-4 h-4" />
        </button>
        <button className="relative p-2 text-[#6b8f6b] hover:text-white hover:bg-[rgba(255,255,255,0.05)] rounded-lg transition-all">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
        </button>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#22c55e] to-[#0ea5e9] flex items-center justify-center text-xs font-bold text-[#0a0f0a]">
          AK
        </div>
      </div>
    </header>
  );
}

export function DashboardLayout({ children, title }: { children: React.ReactNode; title?: string }) {
  return (
    <div className="min-h-screen bg-[#0a0f0a]">
      <Sidebar />
      <div className="pl-64 flex flex-col min-h-screen">
        <TopBar title={title} />
        <main className="flex-1 p-6 grid-bg">{children}</main>
      </div>
    </div>
  );
}

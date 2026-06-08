"use client";
import { Icon } from "@iconify/react";

export type CRMView = "dashboard" | "accounts" | "contacts" | "pipeline" | "aireview" | "cases" | "reports" | "contracts";

interface SidebarProps {
  active: CRMView;
  onNav: (v: CRMView) => void;
  collapsed: boolean;
  onToggle: () => void;
}

const NAV = [
  { id: "dashboard", label: "Home", icon: "lucide:layout-dashboard" },
  { id: "accounts", label: "Accounts", icon: "lucide:building-2" },
  { id: "contacts", label: "Contacts", icon: "lucide:users" },
  { id: "pipeline", label: "Opportunities", icon: "lucide:kanban" },
  { id: "aireview", label: "AI Deal Review", icon: "lucide:brain-circuit", badge: "AI" },
  { id: "cases", label: "Cases", icon: "lucide:ticket" },
  { id: "reports", label: "Reports", icon: "lucide:bar-chart-2" },
  { id: "contracts", label: "Contract Analyzer", icon: "lucide:file-search", badge: "AI" },
] as const;

export default function Sidebar({ active, onNav, collapsed, onToggle }: SidebarProps) {
  return (
    <aside
      style={{ width: collapsed ? 56 : 220, background: "#032D60", transition: "width 200ms ease", flexShrink: 0 }}
      className="flex flex-col h-full select-none"
    >
      {/* Logo */}
      <div className="flex items-center gap-2 px-3 py-4 border-b border-white/10" style={{ minHeight: 56 }}>
        <div className="flex items-center justify-center rounded-lg shrink-0" style={{ width: 30, height: 30, background: "#0176D3" }}>
          <Icon icon="lucide:cloud" width={16} height={16} style={{ color: "#fff" }} />
        </div>
        {!collapsed && (
          <div className="flex flex-col leading-none">
            <span className="text-white font-bold text-sm tracking-tight">SalesForce</span>
            <span style={{ color: "#7EB5E5", fontSize: 10 }}>CRM · AI Edition</span>
          </div>
        )}
        <button
          onClick={onToggle}
          className="ml-auto flex items-center justify-center rounded hover:bg-white/10 transition-colors"
          style={{ width: 24, height: 24, color: "#7EB5E5" }}
          aria-label="Toggle sidebar"
        >
          <Icon icon={collapsed ? "lucide:chevron-right" : "lucide:chevron-left"} width={14} height={14} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-2 overflow-y-auto">
        {NAV.map((item) => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNav(item.id as CRMView)}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors relative"
              style={{
                color: isActive ? "#fff" : "#7EB5E5",
                background: isActive ? "rgba(1, 118, 211, 0.35)" : "transparent",
                borderLeft: isActive ? "3px solid #0176D3" : "3px solid transparent",
              }}
              onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)"; }}
              onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
            >
              <Icon icon={item.icon} width={18} height={18} className="shrink-0" />
              {!collapsed && (
                <span className="text-sm font-medium truncate flex-1">{item.label}</span>
              )}
              {!collapsed && "badge" in item && item.badge && (
                <span className="text-xs font-bold px-1.5 py-0.5 rounded-full" style={{ background: "#0176D3", color: "#fff", fontSize: 9 }}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom user section */}
      <div className="border-t border-white/10 p-3">
        <div className="flex items-center gap-2">
          <div className="rounded-full flex items-center justify-center shrink-0 font-bold text-white text-xs" style={{ width: 30, height: 30, background: "#0176D3" }}>
            JD
          </div>
          {!collapsed && (
            <div className="flex flex-col leading-tight">
              <span className="text-white text-sm font-medium">James Dela Cruz</span>
              <span style={{ color: "#7EB5E5", fontSize: 11 }}>Sales Rep</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
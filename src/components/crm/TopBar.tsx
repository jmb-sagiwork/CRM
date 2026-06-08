"use client";
import { Icon } from "@iconify/react";
import { CRMView } from "./Sidebar";
import { useState } from "react";

const TITLES: Record<CRMView, string> = {
  dashboard: "Home",
  accounts: "Accounts",
  contacts: "Contacts",
  pipeline: "Opportunities",
  aireview: "AI Deal Review",
  cases: "Cases",
  reports: "Reports & Analytics",
  contracts: "Contract Analyzer",
};

interface TopBarProps {
  view: CRMView;
}

export default function TopBar({ view }: TopBarProps) {
  const [search, setSearch] = useState("");

  return (
    <header
      className="flex items-center gap-3 px-4 shrink-0"
      style={{ height: 48, background: "#fff", borderBottom: "1px solid #E5E7EB" }}
    >
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 mr-2">
        <span style={{ color: "#6B7280", fontSize: 13 }}>CRM</span>
        <Icon icon="lucide:chevron-right" width={12} height={12} style={{ color: "#D1D5DB" }} />
        <span style={{ color: "#111827", fontSize: 13, fontWeight: 600 }}>{TITLES[view]}</span>
      </div>

      {/* Search */}
      <div className="relative flex-1 max-w-xs">
        <Icon icon="lucide:search" width={14} height={14} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: "#9CA3AF" }} />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search accounts, contacts, deals…"
          className="w-full pl-8 pr-3 py-1.5 rounded-lg text-sm outline-none focus:ring-2"
          style={{
            background: "#F9FAFB",
            border: "1px solid #E5E7EB",
            color: "#111827",
            fontSize: 13,
          }}
        />
      </div>

      <div className="flex-1" />

      {/* Actions */}
      <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-white transition-colors hover:brightness-110"
        style={{ background: "#0176D3", fontSize: 13 }}>
        <Icon icon="lucide:plus" width={14} height={14} />
        New
      </button>

      <button className="relative flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
        style={{ width: 34, height: 34, color: "#6B7280" }}>
        <Icon icon="lucide:bell" width={18} height={18} />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: "#EF4444" }} />
      </button>

      <button className="flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
        style={{ width: 34, height: 34, color: "#6B7280" }}>
        <Icon icon="lucide:settings" width={18} height={18} />
      </button>

      <div className="flex items-center gap-2 pl-2 border-l" style={{ borderColor: "#E5E7EB" }}>
        <div className="rounded-full flex items-center justify-center font-bold text-white text-xs" style={{ width: 30, height: 30, background: "#0176D3" }}>
          JD
        </div>
        <Icon icon="lucide:chevron-down" width={14} height={14} style={{ color: "#9CA3AF" }} />
      </div>
    </header>
  );
}
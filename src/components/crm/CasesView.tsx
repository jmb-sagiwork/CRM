"use client";
import { Icon } from "@iconify/react";
import { useState } from "react";

const CASES = [
  { id: "CS-1042", account: "Acme Healthcare", subject: "Login failure after SSO update", priority: "P1", status: "Open", assigned: "CS Team", created: "Jun 5, 2026", updated: "2h ago", channel: "Email" },
  { id: "CS-1041", account: "LogiPro Transport", subject: "API rate limiting causing sync errors", priority: "P2", status: "In Progress", assigned: "Tech Support", created: "Jun 4, 2026", updated: "5h ago", channel: "Slack" },
  { id: "CS-1040", account: "CloudScale Solutions", subject: "Dashboard reports not loading for EU region", priority: "P2", status: "In Progress", assigned: "Engineering", created: "Jun 3, 2026", updated: "1d ago", channel: "Portal" },
  { id: "CS-1039", account: "RetailCore International", subject: "Bulk import feature timing out on large files", priority: "P2", status: "Open", assigned: "CS Team", created: "Jun 2, 2026", updated: "2d ago", channel: "Email" },
  { id: "CS-1038", account: "Horizon Manufacturing", subject: "PDF export formatting broken", priority: "P3", status: "Open", assigned: "CS Team", created: "Jun 1, 2026", updated: "3d ago", channel: "Portal" },
  { id: "CS-1037", account: "FinTech Global Corp", subject: "MFA bypass request for service account", priority: "P3", status: "Pending", assigned: "Security Team", created: "May 30, 2026", updated: "5d ago", channel: "Email" },
  { id: "CS-1036", account: "MedTech Systems", subject: "Custom field mapping not saving", priority: "P3", status: "Resolved", assigned: "CS Team", created: "May 28, 2026", updated: "6d ago", channel: "Portal" },
  { id: "CS-1035", account: "EduTech Philippines", subject: "Webhook events delayed by 30min", priority: "P2", status: "Resolved", assigned: "Engineering", created: "May 25, 2026", updated: "1wk ago", channel: "Slack" },
];

const STATUS_STYLE: Record<string, { bg: string; text: string }> = {
  Open: { bg: "#FEE2E2", text: "#DC2626" },
  "In Progress": { bg: "#DBEAFE", text: "#1D4ED8" },
  Pending: { bg: "#FEF3C7", text: "#D97706" },
  Resolved: { bg: "#DCFCE7", text: "#16A34A" },
};

const PRIORITY_STYLE: Record<string, { bg: string; text: string }> = {
  P1: { bg: "#FEE2E2", text: "#DC2626" },
  P2: { bg: "#FEF3C7", text: "#D97706" },
  P3: { bg: "#F3F4F6", text: "#6B7280" },
};

const CHANNEL_ICON: Record<string, string> = {
  Email: "lucide:mail",
  Slack: "simple-icons:slack",
  Portal: "lucide:globe",
};

export default function CasesView() {
  const [filter, setFilter] = useState("all");

  const filtered = CASES.filter(c => {
    if (filter === "open") return c.status === "Open" || c.status === "In Progress";
    if (filter === "p1p2") return c.priority === "P1" || c.priority === "P2";
    if (filter === "resolved") return c.status === "Resolved";
    return true;
  });

  const openCount = CASES.filter(c => c.status === "Open").length;
  const inProgressCount = CASES.filter(c => c.status === "In Progress").length;
  const resolvedCount = CASES.filter(c => c.status === "Resolved").length;
  const p1Count = CASES.filter(c => c.priority === "P1").length;

  return (
    <div className="p-6 space-y-4">
      {/* Stats row */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Open Cases", value: openCount, color: "#DC2626", bg: "#FEE2E2", icon: "lucide:alert-circle" },
          { label: "In Progress", value: inProgressCount, color: "#1D4ED8", bg: "#DBEAFE", icon: "lucide:loader-circle" },
          { label: "P1 Critical", value: p1Count, color: "#DC2626", bg: "#FFF0F0", icon: "lucide:siren" },
          { label: "Resolved (7d)", value: resolvedCount, color: "#16A34A", bg: "#DCFCE7", icon: "lucide:check-circle-2" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl p-4 flex items-center gap-3" style={{ background: "#fff", border: "1px solid #E5E7EB", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
            <div className="rounded-lg flex items-center justify-center shrink-0" style={{ width: 38, height: 38, background: s.bg }}>
              <Icon icon={s.icon} width={18} height={18} style={{ color: s.color }} />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: "#111827" }}>{s.value}</p>
              <p className="text-xs" style={{ color: "#6B7280" }}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="rounded-xl p-4 flex items-center gap-3" style={{ background: "#fff", border: "1px solid #E5E7EB", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
        <div className="flex rounded-lg overflow-hidden border" style={{ borderColor: "#E5E7EB" }}>
          {[["all", "All Cases"], ["open", "Open"], ["p1p2", "P1/P2"], ["resolved", "Resolved"]].map(([id, label]) => (
            <button key={id} onClick={() => setFilter(id)} className="px-3 py-2 text-xs font-medium transition-colors"
              style={{ background: filter === id ? "#0176D3" : "#fff", color: filter === id ? "#fff" : "#6B7280", borderRight: "1px solid #E5E7EB" }}>
              {label}
            </button>
          ))}
        </div>
        <div className="flex-1" />
        <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-white" style={{ background: "#0176D3" }}>
          <Icon icon="lucide:plus" width={13} height={13} />
          New Case
        </button>
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden" style={{ background: "#fff", border: "1px solid #E5E7EB", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
        <table className="w-full">
          <thead>
            <tr style={{ background: "#F9FAFB", borderBottom: "1px solid #E5E7EB" }}>
              {["Case #", "Account", "Subject", "Priority", "Status", "Assigned", "Channel", "Updated", ""].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold" style={{ color: "#6B7280", whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => {
              const ss = STATUS_STYLE[c.status] || { bg: "#F3F4F6", text: "#6B7280" };
              const ps = PRIORITY_STYLE[c.priority] || { bg: "#F3F4F6", text: "#6B7280" };
              return (
                <tr key={c.id} className="border-t hover:bg-gray-50 transition-colors cursor-pointer" style={{ borderColor: "#F3F4F6" }}>
                  <td className="px-4 py-3 text-sm font-mono font-semibold" style={{ color: "#0176D3" }}>{c.id}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="rounded-md flex items-center justify-center shrink-0" style={{ width: 24, height: 24, background: "#EFF6FF" }}>
                        <Icon icon="lucide:building-2" width={12} height={12} style={{ color: "#0176D3" }} />
                      </div>
                      <span className="text-sm" style={{ color: "#374151" }}>{c.account}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm max-w-xs" style={{ color: "#111827" }}>
                    <span className="line-clamp-1">{c.subject}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded text-xs font-bold" style={{ background: ps.bg, color: ps.text }}>{c.priority}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: ss.bg, color: ss.text }}>{c.status}</span>
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ color: "#6B7280" }}>{c.assigned}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 text-xs" style={{ color: "#6B7280" }}>
                      <Icon icon={CHANNEL_ICON[c.channel] || "lucide:message-square"} width={13} height={13} />
                      {c.channel}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: "#9CA3AF" }}>{c.updated}</td>
                  <td className="px-4 py-3">
                    <button className="p-1 rounded hover:bg-gray-100 transition-colors" style={{ color: "#6B7280" }}>
                      <Icon icon="lucide:more-horizontal" width={14} height={14} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
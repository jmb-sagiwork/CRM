"use client";
import { Icon } from "@iconify/react";
import { useState } from "react";

const ACCOUNTS = [
  { id: 1, name: "Acme Healthcare Solutions", industry: "Healthcare", arr: "$280K", stage: "Renewal", risk: "Medium", score: 82, owner: "J. Dela Cruz", tickets: 4, lastContact: "2d ago" },
  { id: 2, name: "FinTech Global Corp", industry: "Finance", arr: "$540K", stage: "Expansion", risk: "Low", score: 91, owner: "S. Reyes", tickets: 1, lastContact: "1d ago" },
  { id: 3, name: "LogiPro Transport Ltd", industry: "Logistics", arr: "$120K", stage: "New Business", risk: "High", score: 54, owner: "A. Santos", tickets: 9, lastContact: "7d ago" },
  { id: 4, name: "MedTech Systems Inc", industry: "MedTech", arr: "$390K", stage: "Upsell", risk: "Low", score: 88, owner: "J. Dela Cruz", tickets: 2, lastContact: "3h ago" },
  { id: 5, name: "CloudScale Solutions", industry: "SaaS", arr: "$670K", stage: "Renewal", risk: "Medium", score: 70, owner: "M. Garcia", tickets: 5, lastContact: "5d ago" },
  { id: 6, name: "RetailCore International", industry: "Retail", arr: "$210K", stage: "Renewal", risk: "High", score: 48, owner: "S. Reyes", tickets: 12, lastContact: "10d ago" },
  { id: 7, name: "EduTech Philippines", industry: "Education", arr: "$95K", stage: "Upsell", risk: "Low", score: 94, owner: "A. Santos", tickets: 0, lastContact: "1d ago" },
  { id: 8, name: "GovTech Solutions", industry: "Government", arr: "$1.1M", stage: "Renewal", risk: "Medium", score: 77, owner: "J. Dela Cruz", tickets: 3, lastContact: "2d ago" },
  { id: 9, name: "BioLabs Asia Pacific", industry: "Biotech", arr: "$450K", stage: "Expansion", risk: "Low", score: 85, owner: "M. Garcia", tickets: 1, lastContact: "6h ago" },
  { id: 10, name: "Horizon Manufacturing", industry: "Manufacturing", arr: "$330K", stage: "New Business", risk: "High", score: 61, owner: "S. Reyes", tickets: 7, lastContact: "4d ago" },
];

function RiskBadge({ risk }: { risk: string }) {
  const map: Record<string, { bg: string; text: string }> = {
    High: { bg: "#FEE2E2", text: "#DC2626" },
    Medium: { bg: "#FEF3C7", text: "#D97706" },
    Low: { bg: "#DCFCE7", text: "#16A34A" },
  };
  const s = map[risk] || { bg: "#F3F4F6", text: "#6B7280" };
  return (
    <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: s.bg, color: s.text }}>
      {risk}
    </span>
  );
}

export default function AccountsView() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<number[]>([]);

  const filtered = ACCOUNTS.filter(a => {
    if (filter === "high_risk") return a.risk === "High";
    if (filter === "upsell") return a.score >= 80;
    if (search) return a.name.toLowerCase().includes(search.toLowerCase());
    return true;
  });

  return (
    <div className="p-6 space-y-4">
      {/* Toolbar */}
      <div className="rounded-xl p-4 flex items-center gap-3" style={{ background: "#fff", border: "1px solid #E5E7EB", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
        <div className="relative flex-1 max-w-xs">
          <Icon icon="lucide:search" width={14} height={14} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: "#9CA3AF" }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search accounts…"
            className="w-full pl-8 pr-3 py-2 rounded-lg text-sm outline-none"
            style={{ background: "#F9FAFB", border: "1px solid #E5E7EB", color: "#111827", fontSize: 13 }}
          />
        </div>
        <div className="flex rounded-lg overflow-hidden border" style={{ borderColor: "#E5E7EB" }}>
          {[["all", "All"], ["high_risk", "High Risk"], ["upsell", "Upsell Ready"]].map(([id, label]) => (
            <button key={id} onClick={() => setFilter(id)} className="px-3 py-2 text-xs font-medium transition-colors"
              style={{ background: filter === id ? "#0176D3" : "#fff", color: filter === id ? "#fff" : "#6B7280", borderRight: "1px solid #E5E7EB" }}>
              {label}
            </button>
          ))}
        </div>
        <div className="flex-1" />
        <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium" style={{ background: "#F3F4F6", color: "#374151" }}>
          <Icon icon="lucide:sliders-horizontal" width={13} height={13} />
          Filter
        </button>
        <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium" style={{ background: "#F3F4F6", color: "#374151" }}>
          <Icon icon="lucide:download" width={13} height={13} />
          Export
        </button>
        <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-white" style={{ background: "#0176D3" }}>
          <Icon icon="lucide:plus" width={13} height={13} />
          Add Account
        </button>
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden" style={{ background: "#fff", border: "1px solid #E5E7EB", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
        <table className="w-full">
          <thead>
            <tr style={{ background: "#F9FAFB", borderBottom: "1px solid #E5E7EB" }}>
              <th className="px-4 py-3 w-8">
                <input type="checkbox" className="rounded" />
              </th>
              {["Account Name", "Industry", "ARR", "Stage", "Risk", "AI Score", "Open Tickets", "Owner", "Last Contact", ""].map(h => (
                <th key={h} className="px-3 py-3 text-left text-xs font-semibold" style={{ color: "#6B7280", whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((a) => (
              <tr key={a.id} className="border-t hover:bg-blue-50/40 transition-colors cursor-pointer" style={{ borderColor: "#F3F4F6" }}>
                <td className="px-4 py-3">
                  <input type="checkbox" className="rounded" checked={selected.includes(a.id)} onChange={e => setSelected(e.target.checked ? [...selected, a.id] : selected.filter(s => s !== a.id))} />
                </td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2">
                    <div className="rounded-lg flex items-center justify-center shrink-0" style={{ width: 30, height: 30, background: "#EFF6FF" }}>
                      <Icon icon="lucide:building-2" width={14} height={14} style={{ color: "#0176D3" }} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: "#111827" }}>{a.name}</p>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3 text-sm" style={{ color: "#6B7280" }}>{a.industry}</td>
                <td className="px-3 py-3 text-sm font-semibold" style={{ color: "#111827" }}>{a.arr}</td>
                <td className="px-3 py-3 text-sm" style={{ color: "#6B7280" }}>{a.stage}</td>
                <td className="px-3 py-3"><RiskBadge risk={a.risk} /></td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2">
                    <div className="rounded-full h-1.5" style={{ width: 48, background: "#E5E7EB" }}>
                      <div className="h-full rounded-full" style={{ width: `${a.score}%`, background: a.score > 80 ? "#22C55E" : a.score > 60 ? "#F59E0B" : "#EF4444" }} />
                    </div>
                    <span className="text-xs font-bold" style={{ color: "#374151" }}>{a.score}</span>
                  </div>
                </td>
                <td className="px-3 py-3">
                  <span className="flex items-center gap-1 text-sm" style={{ color: a.tickets > 5 ? "#DC2626" : "#6B7280" }}>
                    <Icon icon="lucide:ticket" width={12} height={12} />
                    {a.tickets}
                  </span>
                </td>
                <td className="px-3 py-3 text-sm" style={{ color: "#6B7280" }}>{a.owner}</td>
                <td className="px-3 py-3 text-sm" style={{ color: "#6B7280" }}>{a.lastContact}</td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-1">
                    <button className="p-1 rounded hover:bg-gray-100 transition-colors" style={{ color: "#6B7280" }}>
                      <Icon icon="lucide:brain-circuit" width={14} height={14} />
                    </button>
                    <button className="p-1 rounded hover:bg-gray-100 transition-colors" style={{ color: "#6B7280" }}>
                      <Icon icon="lucide:more-horizontal" width={14} height={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex items-center justify-between px-4 py-3 border-t" style={{ borderColor: "#F3F4F6", background: "#F9FAFB" }}>
          <span className="text-xs" style={{ color: "#6B7280" }}>Showing {filtered.length} of {ACCOUNTS.length} accounts</span>
          <div className="flex items-center gap-1">
            {[1, 2, 3].map(p => (
              <button key={p} className="w-7 h-7 rounded text-xs font-medium" style={{ background: p === 1 ? "#0176D3" : "#fff", color: p === 1 ? "#fff" : "#374151", border: "1px solid #E5E7EB" }}>{p}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
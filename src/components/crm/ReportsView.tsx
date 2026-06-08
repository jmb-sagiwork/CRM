"use client";
import { Icon } from "@iconify/react";

const METRICS = [
  { label: "Customers Reviewed", value: "2,847", sub: "of 10,000 total", pct: 28, color: "#0176D3" },
  { label: "High Churn Risk Accounts", value: "138", sub: "1.4% of base", pct: 14, color: "#DC2626" },
  { label: "Upsell-Ready Accounts", value: "312", sub: "3.1% of base", pct: 31, color: "#22C55E" },
  { label: "Deals Missing Key Info", value: "94", sub: "3.3% of reviewed", pct: 33, color: "#F59E0B" },
  { label: "Avg Qualification Score", value: "73%", sub: "+2pts MoM", pct: 73, color: "#8B5CF6" },
  { label: "Manager Review Queue", value: "29", sub: "Pending approval", pct: 29, color: "#0EA5E9" },
  { label: "Revenue Opportunity", value: "$8.4M", sub: "Upsell pipeline", pct: 84, color: "#059669" },
  { label: "AI Reviews Run Today", value: "148", sub: "Auto + manual", pct: 60, color: "#6366F1" },
];

const TOP_REPS = [
  { name: "J. Dela Cruz", reviews: 42, score: 81, upsells: 12 },
  { name: "S. Reyes", reviews: 38, score: 77, upsells: 9 },
  { name: "M. Garcia", reviews: 35, score: 84, upsells: 14 },
  { name: "A. Santos", reviews: 33, score: 71, upsells: 7 },
];

const RISK_DIST = [
  { label: "Low Risk", count: 1820, pct: 64, color: "#22C55E" },
  { label: "Medium Risk", count: 640, pct: 22, color: "#F59E0B" },
  { label: "High Risk", count: 387, pct: 14, color: "#EF4444" },
];

export default function ReportsView() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div>
          <h2 className="font-bold text-base" style={{ color: "#111827" }}>Analytics & Reporting</h2>
          <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>AI Deal Review · June 2026 · 10,000 customer base</p>
        </div>
        <div className="flex-1" />
        <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium" style={{ background: "#F3F4F6", color: "#374151" }}>
          <Icon icon="lucide:calendar" width={13} height={13} />
          June 2026
        </button>
        <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-white" style={{ background: "#0176D3" }}>
          <Icon icon="lucide:download" width={13} height={13} />
          Export Report
        </button>
      </div>

      {/* KPI grid */}
      <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
        {METRICS.map((m) => (
          <div key={m.label} className="rounded-xl p-4" style={{ background: "#fff", border: "1px solid #E5E7EB", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
            <p className="text-xs font-medium mb-2" style={{ color: "#6B7280" }}>{m.label}</p>
            <p className="text-2xl font-bold mb-1" style={{ color: "#111827" }}>{m.value}</p>
            <div className="h-1.5 rounded-full mb-1" style={{ background: "#F3F4F6" }}>
              <div className="h-full rounded-full" style={{ width: `${m.pct}%`, background: m.color }} />
            </div>
            <p className="text-xs" style={{ color: "#9CA3AF" }}>{m.sub}</p>
          </div>
        ))}
      </div>

      {/* Bottom row */}
      <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 1fr" }}>
        {/* Churn risk distribution */}
        <div className="rounded-xl p-5" style={{ background: "#fff", border: "1px solid #E5E7EB", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
          <h3 className="font-semibold text-sm mb-4" style={{ color: "#111827" }}>Churn Risk Distribution</h3>
          <div className="space-y-3">
            {RISK_DIST.map((r) => (
              <div key={r.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium" style={{ color: "#374151" }}>{r.label}</span>
                  <span className="text-xs font-bold" style={{ color: r.color }}>{r.count.toLocaleString()} accounts ({r.pct}%)</span>
                </div>
                <div className="h-3 rounded-full" style={{ background: "#F3F4F6" }}>
                  <div className="h-full rounded-full" style={{ width: `${r.pct}%`, background: r.color }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t grid grid-cols-3 gap-3" style={{ borderColor: "#F3F4F6" }}>
            {RISK_DIST.map(r => (
              <div key={r.label} className="text-center p-2 rounded-lg" style={{ background: r.color + "12" }}>
                <p className="text-base font-bold" style={{ color: r.color }}>{r.count.toLocaleString()}</p>
                <p className="text-xs" style={{ color: "#6B7280" }}>{r.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Top reps leaderboard */}
        <div className="rounded-xl p-5" style={{ background: "#fff", border: "1px solid #E5E7EB", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
          <h3 className="font-semibold text-sm mb-4" style={{ color: "#111827" }}>Rep Leaderboard · AI Reviews</h3>
          <div className="space-y-3">
            {TOP_REPS.map((r, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg" style={{ background: i === 0 ? "#FFFBEB" : "#F9FAFB" }}>
                <div className="rounded-full flex items-center justify-center shrink-0 font-bold text-sm" style={{ width: 32, height: 32, background: i === 0 ? "#F59E0B" : "#E5E7EB", color: i === 0 ? "#fff" : "#6B7280" }}>
                  {i + 1}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold" style={{ color: "#111827" }}>{r.name}</p>
                  <p className="text-xs" style={{ color: "#6B7280" }}>{r.reviews} reviews · {r.upsells} upsells identified</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold" style={{ color: "#0176D3" }}>Avg {r.score}%</p>
                  <p className="text-xs" style={{ color: "#9CA3AF" }}>Qual. Score</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
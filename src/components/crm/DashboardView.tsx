"use client";
import { Icon } from "@iconify/react";

const KPI = [
  { label: "Total Pipeline", value: "$4.2M", change: "+12%", up: true, icon: "lucide:trending-up", color: "#0176D3" },
  { label: "Accounts Reviewed", value: "2,847", change: "+8%", up: true, icon: "lucide:building-2", color: "#22C55E" },
  { label: "High Churn Risk", value: "138", change: "+24", up: false, icon: "lucide:alert-triangle", color: "#EF4444" },
  { label: "Upsell Ready", value: "312", change: "+47", up: true, icon: "lucide:rocket", color: "#F59E0B" },
  { label: "Avg Qual. Score", value: "73%", change: "+2pts", up: true, icon: "lucide:brain-circuit", color: "#8B5CF6" },
  { label: "Manager Queue", value: "29", change: "-5", up: true, icon: "lucide:clipboard-list", color: "#0EA5E9" },
];

const RECENT_ACCOUNTS = [
  { name: "Acme Healthcare Solutions", stage: "Renewal", risk: "Medium", score: 82, rep: "J. Dela Cruz" },
  { name: "FinTech Global Corp", stage: "Expansion", risk: "Low", score: 91, rep: "S. Reyes" },
  { name: "LogiPro Transport", stage: "New Business", risk: "High", score: 54, rep: "A. Santos" },
  { name: "MedTech Systems", stage: "Upsell", risk: "Low", score: 88, rep: "J. Dela Cruz" },
  { name: "CloudScale Solutions", stage: "Renewal", risk: "Medium", score: 70, rep: "M. Garcia" },
];

const ACTIVITIES = [
  { icon: "lucide:brain-circuit", text: "AI flagged LogiPro Transport as high churn risk", time: "2m ago", color: "#EF4444" },
  { icon: "lucide:slack", text: "Slack alert sent to manager for Acme Healthcare", time: "15m ago", color: "#4A154B" },
  { icon: "lucide:check-circle-2", text: "Deal review completed: FinTech Global Corp", time: "1h ago", color: "#22C55E" },
  { icon: "lucide:file-text", text: "Contract gap detected: MedTech Systems", time: "2h ago", color: "#F59E0B" },
  { icon: "lucide:rocket", text: "Upsell opportunity identified: CloudScale", time: "3h ago", color: "#0176D3" },
  { icon: "lucide:phone", text: "Call transcript analyzed: 4 accounts", time: "4h ago", color: "#8B5CF6" },
];

const PIPELINE_STAGES = [
  { label: "Prospecting", value: 18, color: "#E5E7EB" },
  { label: "Qualification", value: 32, color: "#93C5FD" },
  { label: "Proposal", value: 24, color: "#60A5FA" },
  { label: "Negotiation", value: 14, color: "#3B82F6" },
  { label: "Closed Won", value: 12, color: "#22C55E" },
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

export default function DashboardView() {
  return (
    <div className="p-6 space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-3 gap-4" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        {KPI.map((k) => (
          <div key={k.label} className="rounded-xl p-4 flex items-start gap-3" style={{ background: "#fff", border: "1px solid #E5E7EB", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
            <div className="rounded-lg flex items-center justify-center shrink-0" style={{ width: 40, height: 40, background: k.color + "18" }}>
              <Icon icon={k.icon} width={20} height={20} style={{ color: k.color }} />
            </div>
            <div>
              <p className="text-xs font-medium mb-1" style={{ color: "#6B7280" }}>{k.label}</p>
              <p className="text-2xl font-bold" style={{ color: "#111827", lineHeight: 1 }}>{k.value}</p>
              <p className="text-xs mt-1 font-medium" style={{ color: k.up ? "#16A34A" : "#DC2626" }}>
                {k.up ? "↑" : "↓"} {k.change} vs last month
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Middle row */}
      <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 320px" }}>
        {/* Recent accounts */}
        <div className="rounded-xl" style={{ background: "#fff", border: "1px solid #E5E7EB", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
          <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "#F3F4F6" }}>
            <h3 className="font-semibold text-sm" style={{ color: "#111827" }}>Recent Account Reviews</h3>
            <button className="text-xs font-medium" style={{ color: "#0176D3" }}>View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ background: "#F9FAFB" }}>
                  {["Account", "Stage", "Risk", "AI Score", "Rep"].map(h => (
                    <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold" style={{ color: "#6B7280" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {RECENT_ACCOUNTS.map((a, i) => (
                  <tr key={i} className="border-t hover:bg-gray-50 transition-colors cursor-pointer" style={{ borderColor: "#F3F4F6" }}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="rounded-lg flex items-center justify-center shrink-0" style={{ width: 28, height: 28, background: "#EFF6FF" }}>
                          <Icon icon="lucide:building-2" width={13} height={13} style={{ color: "#0176D3" }} />
                        </div>
                        <span className="text-sm font-medium" style={{ color: "#111827" }}>{a.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm" style={{ color: "#6B7280" }}>{a.stage}</td>
                    <td className="px-4 py-3"><RiskBadge risk={a.risk} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full" style={{ background: "#E5E7EB", maxWidth: 60 }}>
                          <div className="h-full rounded-full" style={{ width: `${a.score}%`, background: a.score > 80 ? "#22C55E" : a.score > 60 ? "#F59E0B" : "#EF4444" }} />
                        </div>
                        <span className="text-xs font-semibold" style={{ color: "#374151" }}>{a.score}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm" style={{ color: "#6B7280" }}>{a.rep}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Activity feed */}
        <div className="rounded-xl" style={{ background: "#fff", border: "1px solid #E5E7EB", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
          <div className="flex items-center justify-between px-4 py-4 border-b" style={{ borderColor: "#F3F4F6" }}>
            <h3 className="font-semibold text-sm" style={{ color: "#111827" }}>AI Activity Feed</h3>
            <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: "#EFF6FF", color: "#0176D3" }}>Live</span>
          </div>
          <div className="divide-y" style={{ divideColor: "#F3F4F6" }}>
            {ACTIVITIES.map((a, i) => (
              <div key={i} className="flex items-start gap-3 px-4 py-3">
                <div className="rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ width: 28, height: 28, background: a.color + "15" }}>
                  <Icon icon={a.icon} width={13} height={13} style={{ color: a.color }} />
                </div>
                <div>
                  <p className="text-xs leading-snug" style={{ color: "#374151" }}>{a.text}</p>
                  <p className="text-xs mt-0.5" style={{ color: "#9CA3AF" }}>{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pipeline chart */}
      <div className="rounded-xl p-5" style={{ background: "#fff", border: "1px solid #E5E7EB", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-sm" style={{ color: "#111827" }}>Pipeline Distribution</h3>
          <span className="text-xs" style={{ color: "#6B7280" }}>Total: 100 deals · $4.2M</span>
        </div>
        <div className="flex items-end gap-3" style={{ height: 120 }}>
          {PIPELINE_STAGES.map((s) => (
            <div key={s.label} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-xs font-semibold" style={{ color: "#374151" }}>{s.value}</span>
              <div className="w-full rounded-t-md" style={{ height: s.value * 2.8, background: s.color }} />
              <span className="text-xs text-center leading-tight" style={{ color: "#6B7280", fontSize: 11 }}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
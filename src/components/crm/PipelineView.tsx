"use client";
import { Icon } from "@iconify/react";

const STAGES = [
  {
    id: "prospecting", label: "Prospecting", color: "#6B7280", deals: [
      { name: "Sunrise Pharma", arr: "$80K", company: "Pharma", rep: "A. Santos", daysInStage: 5 },
      { name: "Pacific Logistics", arr: "$150K", company: "Logistics", rep: "S. Reyes", daysInStage: 2 },
    ]
  },
  {
    id: "qualification", label: "Qualification", color: "#3B82F6", deals: [
      { name: "NexGen Cloud", arr: "$320K", company: "SaaS", rep: "J. Dela Cruz", daysInStage: 8 },
      { name: "Horizon Retail", arr: "$95K", company: "Retail", rep: "M. Garcia", daysInStage: 11 },
      { name: "Apex Financial", arr: "$210K", company: "Finance", rep: "A. Santos", daysInStage: 4 },
    ]
  },
  {
    id: "proposal", label: "Proposal / Demo", color: "#8B5CF6", deals: [
      { name: "Acme Healthcare", arr: "$280K", company: "Health", rep: "J. Dela Cruz", daysInStage: 6 },
      { name: "CloudScale Corp", arr: "$670K", company: "SaaS", rep: "M. Garcia", daysInStage: 3 },
    ]
  },
  {
    id: "negotiation", label: "Negotiation", color: "#F59E0B", deals: [
      { name: "FinTech Global", arr: "$540K", company: "Finance", rep: "S. Reyes", daysInStage: 14 },
      { name: "GovTech Solutions", arr: "$1.1M", company: "Gov", rep: "J. Dela Cruz", daysInStage: 9 },
    ]
  },
  {
    id: "closed", label: "Closed Won", color: "#22C55E", deals: [
      { name: "BioLabs APAC", arr: "$450K", company: "Biotech", rep: "M. Garcia", daysInStage: 0 },
      { name: "EduTech PH", arr: "$95K", company: "Education", rep: "A. Santos", daysInStage: 0 },
      { name: "MedTech Systems", arr: "$390K", company: "MedTech", rep: "J. Dela Cruz", daysInStage: 0 },
    ]
  },
];

const REPS = ["All Reps", "J. Dela Cruz", "S. Reyes", "M. Garcia", "A. Santos"];

export default function PipelineView() {
  return (
    <div className="p-6 flex flex-col gap-4" style={{ height: "100%" }}>
      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <h2 className="font-bold text-base" style={{ color: "#111827" }}>Q2 2026 Pipeline</h2>
        <span className="text-xs px-2 py-1 rounded-full font-semibold" style={{ background: "#EFF6FF", color: "#0176D3" }}>14 Deals · $4.2M</span>
        <div className="flex-1" />
        <select className="px-3 py-1.5 rounded-lg text-xs font-medium outline-none" style={{ background: "#fff", border: "1px solid #E5E7EB", color: "#374151" }}>
          {REPS.map(r => <option key={r}>{r}</option>)}
        </select>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: "#F3F4F6", color: "#374151" }}>
          <Icon icon="lucide:sliders-horizontal" width={12} height={12} />
          Filter
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white" style={{ background: "#0176D3" }}>
          <Icon icon="lucide:plus" width={12} height={12} />
          New Deal
        </button>
      </div>

      {/* Kanban */}
      <div className="flex gap-4 overflow-x-auto pb-4" style={{ flex: 1 }}>
        {STAGES.map((stage) => (
          <div key={stage.id} className="rounded-xl flex flex-col shrink-0" style={{ width: 240, background: "#F9FAFB", border: "1px solid #E5E7EB" }}>
            {/* Stage header */}
            <div className="flex items-center gap-2 px-3 py-3 rounded-t-xl border-b" style={{ borderColor: "#E5E7EB", borderTop: `3px solid ${stage.color}` }}>
              <span className="text-xs font-bold" style={{ color: "#374151" }}>{stage.label}</span>
              <span className="ml-auto text-xs px-1.5 py-0.5 rounded-full font-semibold" style={{ background: stage.color + "20", color: stage.color }}>
                {stage.deals.length}
              </span>
            </div>

            {/* Deal cards */}
            <div className="flex-1 p-2 space-y-2 overflow-y-auto">
              {stage.deals.map((deal, i) => (
                <div key={i} className="rounded-lg p-3 cursor-pointer hover:shadow-md transition-shadow" style={{ background: "#fff", border: "1px solid #E5E7EB", boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}>
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-sm font-semibold leading-tight" style={{ color: "#111827" }}>{deal.name}</p>
                    <button style={{ color: "#9CA3AF" }}><Icon icon="lucide:more-horizontal" width={14} height={14} /></button>
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                    <Icon icon="lucide:tag" width={11} height={11} style={{ color: "#9CA3AF" }} />
                    <span className="text-xs" style={{ color: "#6B7280" }}>{deal.company}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold" style={{ color: "#0176D3" }}>{deal.arr}</span>
                    <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: "#F3F4F6", color: "#6B7280" }}>
                      {deal.rep}
                    </span>
                  </div>
                  {deal.daysInStage > 7 && (
                    <div className="mt-2 flex items-center gap-1">
                      <Icon icon="lucide:clock" width={11} height={11} style={{ color: "#F59E0B" }} />
                      <span className="text-xs" style={{ color: "#F59E0B" }}>{deal.daysInStage}d in stage</span>
                    </div>
                  )}
                </div>
              ))}
              {/* Add card button */}
              <button className="w-full py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1 border-dashed border transition-colors hover:bg-white" style={{ borderColor: "#D1D5DB", color: "#9CA3AF" }}>
                <Icon icon="lucide:plus" width={12} height={12} />
                Add deal
              </button>
            </div>

            {/* Stage total */}
            <div className="px-3 py-2 border-t rounded-b-xl" style={{ borderColor: "#E5E7EB", background: "#F3F4F6" }}>
              <span className="text-xs font-semibold" style={{ color: "#374151" }}>
                ${stage.deals.reduce((sum, d) => sum + parseInt(d.arr.replace(/[$K M]/g, "")) * (d.arr.includes("M") ? 1000 : 1), 0)}K total
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
"use client";
import { Icon } from "@iconify/react";

const CONTACTS = [
  { name: "Sarah Jenkins", title: "VP of Sales", account: "CloudScale Solutions", email: "s.jenkins@cloudscale.com", phone: "+1 (415) 555-0182", lastContact: "1d ago", stage: "Renewal" },
  { name: "David Vance", title: "Director, Revenue Ops", account: "FinTech Global Corp", email: "d.vance@fintechglobal.com", phone: "+1 (212) 555-0193", lastContact: "3d ago", stage: "Expansion" },
  { name: "Elena Rostova", title: "Head of Customer Success", account: "MedTech Systems Inc", email: "e.rostova@medtech.com", phone: "+63 917 555 0101", lastContact: "6h ago", stage: "Upsell" },
  { name: "Marcus Brody", title: "Senior Account Executive", account: "Acme Healthcare", email: "m.brody@acmehealthcare.com", phone: "+1 (650) 555-0147", lastContact: "2d ago", stage: "Renewal" },
  { name: "Anya Patel", title: "VP Customer Experience", account: "LogiPro Transport", email: "a.patel@logipro.com", phone: "+63 916 555 0202", lastContact: "7d ago", stage: "New Business" },
  { name: "James Chen", title: "CTO", account: "EduTech Philippines", email: "j.chen@edutech.ph", phone: "+63 918 555 0303", lastContact: "1d ago", stage: "Upsell" },
  { name: "Maria Santos", title: "Procurement Manager", account: "GovTech Solutions", email: "m.santos@govtech.gov.ph", phone: "+63 919 555 0404", lastContact: "4d ago", stage: "Renewal" },
  { name: "Kevin Park", title: "CFO", account: "BioLabs Asia Pacific", email: "k.park@biolabs.apac", phone: "+65 555 0505", lastContact: "2d ago", stage: "Expansion" },
];

const INITIALS_COLORS = ["#0176D3", "#7C3AED", "#059669", "#D97706", "#DC2626", "#0EA5E9", "#6366F1", "#EC4899"];

export default function ContactsView() {
  return (
    <div className="p-6 space-y-4">
      {/* Toolbar */}
      <div className="rounded-xl p-4 flex items-center gap-3" style={{ background: "#fff", border: "1px solid #E5E7EB", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
        <div className="relative flex-1 max-w-xs">
          <Icon icon="lucide:search" width={14} height={14} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: "#9CA3AF" }} />
          <input placeholder="Search contacts…" className="w-full pl-8 pr-3 py-2 rounded-lg text-sm outline-none"
            style={{ background: "#F9FAFB", border: "1px solid #E5E7EB", color: "#111827", fontSize: 13 }} />
        </div>
        <div className="flex-1" />
        <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium" style={{ background: "#F3F4F6", color: "#374151" }}>
          <Icon icon="lucide:sliders-horizontal" width={13} height={13} />
          Filter
        </button>
        <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-white" style={{ background: "#0176D3" }}>
          <Icon icon="lucide:user-plus" width={13} height={13} />
          Add Contact
        </button>
      </div>

      {/* Cards grid */}
      <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
        {CONTACTS.map((c, i) => {
          const initials = c.name.split(" ").map(w => w[0]).join("").slice(0, 2);
          const color = INITIALS_COLORS[i % INITIALS_COLORS.length];
          return (
            <div key={i} className="rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer" style={{ background: "#fff", border: "1px solid #E5E7EB", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
              <div className="flex items-start gap-3 mb-3">
                <div className="rounded-full flex items-center justify-center shrink-0 font-bold text-sm text-white" style={{ width: 42, height: 42, background: color }}>
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate" style={{ color: "#111827" }}>{c.name}</p>
                  <p className="text-xs truncate" style={{ color: "#6B7280" }}>{c.title}</p>
                  <p className="text-xs font-medium truncate" style={{ color: "#0176D3" }}>{c.account}</p>
                </div>
                <button className="p-1 rounded hover:bg-gray-100 transition-colors" style={{ color: "#9CA3AF" }}>
                  <Icon icon="lucide:more-horizontal" width={14} height={14} />
                </button>
              </div>
              <div className="space-y-1.5 border-t pt-3" style={{ borderColor: "#F3F4F6" }}>
                <div className="flex items-center gap-2 text-xs" style={{ color: "#6B7280" }}>
                  <Icon icon="lucide:mail" width={12} height={12} className="shrink-0" />
                  <span className="truncate">{c.email}</span>
                </div>
                <div className="flex items-center gap-2 text-xs" style={{ color: "#6B7280" }}>
                  <Icon icon="lucide:phone" width={12} height={12} className="shrink-0" />
                  {c.phone}
                </div>
              </div>
              <div className="flex items-center justify-between mt-3 pt-2 border-t" style={{ borderColor: "#F3F4F6" }}>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: "#EFF6FF", color: "#0176D3" }}>{c.stage}</span>
                <span className="text-xs" style={{ color: "#9CA3AF" }}>Last: {c.lastContact}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
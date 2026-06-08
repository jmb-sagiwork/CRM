"use client";
import { Icon } from "@iconify/react";
import { useState } from "react";

const ACCOUNTS = [
  "Acme Healthcare Solutions",
  "FinTech Global Corp",
  "LogiPro Transport Ltd",
  "MedTech Systems Inc",
  "CloudScale Solutions",
];

const REVIEW_DATA = {
  customer: "Acme Healthcare Solutions",
  stage: "Renewal / Expansion",
  score: 82,
  churnRisk: "Medium",
  churnRiskColor: "#D97706",
  churnRiskBg: "#FEF3C7",
  upsell: "High",
  upsellColor: "#16A34A",
  upsellBg: "#DCFCE7",
  sentiment: "Cautiously Positive",
  sentimentScore: 68,
  missing: ["Budget owner", "Timeline confirmation", "Renewal blocker reason"],
  risks: ["3 unresolved support tickets (P2 severity)", "Contract pricing concern flagged by AE", "Decision maker changed 30 days ago"],
  contractGaps: ["SLA terms not updated for 2026", "Payment schedule clause missing", "Auto-renewal clause ambiguous"],
  managerQuestions: [
    "What is the customer's renewal decision date?",
    "Has the pricing concern been addressed by the AE?",
    "Is there a confirmed executive sponsor?",
    "Were the P2 support tickets resolved before renewal discussion?",
  ],
  nextActions: [
    { action: "Schedule renewal alignment call", owner: "J. Dela Cruz", priority: "High", icon: "lucide:phone" },
    { action: "Send upgrade proposal deck", owner: "J. Dela Cruz", priority: "High", icon: "lucide:file-text" },
    { action: "Review open support tickets with CS team", owner: "CS Team", priority: "Medium", icon: "lucide:ticket" },
    { action: "Notify sales manager via Slack", owner: "Auto", priority: "Immediate", icon: "lucide:slack" },
    { action: "Confirm executive sponsor contact", owner: "J. Dela Cruz", priority: "Medium", icon: "lucide:user-check" },
  ],
  inputs: {
    opportunityNotes: true,
    discoveryNotes: true,
    callTranscript: true,
    opportunityExport: true,
    ticketHistory: true,
    activityLogs: true,
    contractDetails: true,
    chatHistory: false,
    customerProfile: true,
    renewalStatus: true,
  },
  followUpMessage: `Hi Sarah,\n\nThank you for our conversation last week regarding your upcoming renewal. I wanted to follow up on a few items — specifically the SLA terms and your team's timeline for the renewal decision.\n\nI've also prepared an upgrade proposal that addresses the pricing concerns you raised, along with a summary of the improvements we've made to the platform this quarter.\n\nCould we schedule a 30-minute call this week to walk through this together?\n\nBest regards,\nJames`,
};

const INPUT_LABELS: Record<string, string> = {
  opportunityNotes: "Opportunity Notes",
  discoveryNotes: "Discovery Notes",
  callTranscript: "Call Transcript",
  opportunityExport: "Opportunity Export",
  ticketHistory: "Ticketing History",
  activityLogs: "Sales Activity Logs",
  contractDetails: "Contract Details",
  chatHistory: "Chat History",
  customerProfile: "Customer Profile",
  renewalStatus: "Renewal / Upgrade Status",
};

function PriorityBadge({ p }: { p: string }) {
  const m: Record<string, { bg: string; text: string }> = {
    Immediate: { bg: "#FEE2E2", text: "#DC2626" },
    High: { bg: "#FEF3C7", text: "#D97706" },
    Medium: { bg: "#DBEAFE", text: "#1D4ED8" },
  };
  const s = m[p] || { bg: "#F3F4F6", text: "#6B7280" };
  return <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: s.bg, color: s.text }}>{p}</span>;
}

export default function AIReviewView() {
  const [account, setAccount] = useState(ACCOUNTS[0]);
  const [running, setRunning] = useState(false);
  const [showResult, setShowResult] = useState(true);
  const [tab, setTab] = useState<"insights" | "inputs" | "followup">("insights");

  const handleRun = () => {
    setRunning(true);
    setShowResult(false);
    setTimeout(() => { setRunning(false); setShowResult(true); }, 1800);
  };

  const d = REVIEW_DATA;

  return (
    <div className="p-6 flex gap-5" style={{ height: "100%", overflow: "auto" }}>
      {/* Left: Config panel */}
      <div className="shrink-0 flex flex-col gap-4" style={{ width: 280 }}>
        {/* Account selector */}
        <div className="rounded-xl p-4" style={{ background: "#fff", border: "1px solid #E5E7EB", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
          <h3 className="text-xs font-bold mb-3 uppercase tracking-wide" style={{ color: "#6B7280" }}>Account</h3>
          <select
            value={account}
            onChange={e => setAccount(e.target.value)}
            className="w-full px-3 py-2 rounded-lg text-sm outline-none"
            style={{ background: "#F9FAFB", border: "1px solid #E5E7EB", color: "#111827" }}
          >
            {ACCOUNTS.map(a => <option key={a}>{a}</option>)}
          </select>
          <div className="mt-3 flex items-center gap-2 p-2 rounded-lg" style={{ background: "#EFF6FF" }}>
            <div className="rounded-lg flex items-center justify-center shrink-0" style={{ width: 32, height: 32, background: "#0176D3" }}>
              <Icon icon="lucide:building-2" width={16} height={16} style={{ color: "#fff" }} />
            </div>
            <div>
              <p className="text-xs font-semibold" style={{ color: "#111827" }}>Acme Healthcare</p>
              <p className="text-xs" style={{ color: "#6B7280" }}>Renewal · $280K ARR</p>
            </div>
          </div>
        </div>

        {/* Data inputs */}
        <div className="rounded-xl p-4" style={{ background: "#fff", border: "1px solid #E5E7EB", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
          <h3 className="text-xs font-bold mb-3 uppercase tracking-wide" style={{ color: "#6B7280" }}>Data Sources</h3>
          <div className="space-y-2">
            {Object.entries(d.inputs).map(([key, available]) => (
              <div key={key} className="flex items-center gap-2">
                <div className="rounded-full flex items-center justify-center shrink-0" style={{ width: 18, height: 18, background: available ? "#DCFCE7" : "#FEE2E2" }}>
                  <Icon icon={available ? "lucide:check" : "lucide:x"} width={10} height={10} style={{ color: available ? "#16A34A" : "#DC2626" }} />
                </div>
                <span className="text-xs" style={{ color: available ? "#374151" : "#9CA3AF" }}>{INPUT_LABELS[key]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Run button */}
        <button
          onClick={handleRun}
          disabled={running}
          className="w-full py-3 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 transition-all"
          style={{ background: running ? "#93C5FD" : "#0176D3", cursor: running ? "wait" : "pointer" }}
        >
          {running ? (
            <>
              <Icon icon="lucide:loader-circle" width={16} height={16} className="animate-spin" />
              Analyzing…
            </>
          ) : (
            <>
              <Icon icon="lucide:brain-circuit" width={16} height={16} />
              Run AI Review
            </>
          )}
        </button>

        {/* Slack notify */}
        <button className="w-full py-2.5 rounded-xl font-medium text-sm flex items-center justify-center gap-2 border transition-colors hover:bg-purple-50"
          style={{ background: "#fff", border: "1px solid #E5E7EB", color: "#4A154B" }}>
          <Icon icon="simple-icons:slack" width={15} height={15} style={{ color: "#4A154B" }} />
          Notify Manager in Slack
        </button>
      </div>

      {/* Right: Results */}
      {showResult && (
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          {/* Header */}
          <div className="rounded-xl p-4 flex items-center gap-4" style={{ background: "#fff", border: "1px solid #E5E7EB", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
            <div className="rounded-xl flex items-center justify-center shrink-0" style={{ width: 44, height: 44, background: "#EFF6FF" }}>
              <Icon icon="lucide:building-2" width={22} height={22} style={{ color: "#0176D3" }} />
            </div>
            <div className="flex-1">
              <h2 className="font-bold text-base" style={{ color: "#111827" }}>{d.customer}</h2>
              <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>Stage: {d.stage} · AI Deal Review</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-1 rounded-full font-semibold" style={{ background: "#DCFCE7", color: "#16A34A" }}>
                <Icon icon="lucide:check-circle-2" width={10} height={10} className="inline mr-1" />
                Review Complete
              </span>
              <span className="text-xs" style={{ color: "#9CA3AF" }}>Just now</span>
            </div>
          </div>

          {/* Score row */}
          <div className="grid grid-cols-4 gap-3">
            {/* Qual score */}
            <div className="rounded-xl p-4 text-center" style={{ background: "#fff", border: "1px solid #E5E7EB", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
              <p className="text-xs font-semibold mb-2" style={{ color: "#6B7280" }}>Qualification Score</p>
              <div className="relative flex items-center justify-center" style={{ width: 72, height: 72, margin: "0 auto" }}>
                <svg width="72" height="72" viewBox="0 0 72 72">
                  <circle cx="36" cy="36" r="28" fill="none" stroke="#E5E7EB" strokeWidth="7" />
                  <circle cx="36" cy="36" r="28" fill="none" stroke="#22C55E" strokeWidth="7"
                    strokeDasharray={`${2 * Math.PI * 28 * d.score / 100} ${2 * Math.PI * 28}`}
                    strokeLinecap="round" transform="rotate(-90 36 36)" />
                </svg>
                <span className="absolute text-lg font-bold" style={{ color: "#111827" }}>{d.score}</span>
              </div>
              <p className="text-xs mt-1 font-medium" style={{ color: "#22C55E" }}>Strong</p>
            </div>

            {/* Churn risk */}
            <div className="rounded-xl p-4" style={{ background: "#fff", border: "1px solid #E5E7EB", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
              <p className="text-xs font-semibold mb-2" style={{ color: "#6B7280" }}>Churn Risk</p>
              <div className="flex items-center gap-2 mb-2">
                <Icon icon="lucide:alert-triangle" width={22} height={22} style={{ color: d.churnRiskColor }} />
                <span className="text-xl font-bold" style={{ color: d.churnRiskColor }}>{d.churnRisk}</span>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: d.churnRiskBg, color: d.churnRiskColor }}>{d.churnRisk} Risk</span>
            </div>

            {/* Upsell */}
            <div className="rounded-xl p-4" style={{ background: "#fff", border: "1px solid #E5E7EB", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
              <p className="text-xs font-semibold mb-2" style={{ color: "#6B7280" }}>Upsell Potential</p>
              <div className="flex items-center gap-2 mb-2">
                <Icon icon="lucide:trending-up" width={22} height={22} style={{ color: d.upsellColor }} />
                <span className="text-xl font-bold" style={{ color: d.upsellColor }}>{d.upsell}</span>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: d.upsellBg, color: d.upsellColor }}>Upgrade Ready</span>
            </div>

            {/* Sentiment */}
            <div className="rounded-xl p-4" style={{ background: "#fff", border: "1px solid #E5E7EB", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
              <p className="text-xs font-semibold mb-2" style={{ color: "#6B7280" }}>Customer Sentiment</p>
              <p className="text-sm font-bold mb-2" style={{ color: "#374151" }}>{d.sentiment}</p>
              <div className="h-2 rounded-full" style={{ background: "#E5E7EB" }}>
                <div className="h-full rounded-full" style={{ width: `${d.sentimentScore}%`, background: "linear-gradient(90deg,#EF4444,#F59E0B,#22C55E)" }} />
              </div>
              <p className="text-xs mt-1 text-right" style={{ color: "#6B7280" }}>{d.sentimentScore}/100</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="rounded-xl overflow-hidden" style={{ background: "#fff", border: "1px solid #E5E7EB", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
            <div className="flex border-b" style={{ borderColor: "#E5E7EB" }}>
              {([["insights", "AI Insights"], ["inputs", "Source Data"], ["followup", "Follow-Up Message"]] as const).map(([id, label]) => (
                <button key={id} onClick={() => setTab(id)}
                  className="px-5 py-3 text-sm font-medium border-b-2 transition-colors"
                  style={{ borderColor: tab === id ? "#0176D3" : "transparent", color: tab === id ? "#0176D3" : "#6B7280", background: "transparent" }}>
                  {label}
                </button>
              ))}
            </div>

            {tab === "insights" && (
              <div className="p-5 grid grid-cols-2 gap-5">
                {/* Risks */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wide mb-3 flex items-center gap-1.5" style={{ color: "#DC2626" }}>
                    <Icon icon="lucide:shield-alert" width={13} height={13} />
                    Risks
                  </h4>
                  <ul className="space-y-2">
                    {d.risks.map((r, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm p-2 rounded-lg" style={{ background: "#FFF7F7", color: "#374151" }}>
                        <Icon icon="lucide:circle-dot" width={13} height={13} className="mt-0.5 shrink-0" style={{ color: "#DC2626" }} />
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Missing info */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wide mb-3 flex items-center gap-1.5" style={{ color: "#D97706" }}>
                    <Icon icon="lucide:circle-help" width={13} height={13} />
                    Missing Information
                  </h4>
                  <ul className="space-y-2">
                    {d.missing.map((m, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm p-2 rounded-lg" style={{ background: "#FFFBEB", color: "#374151" }}>
                        <Icon icon="lucide:minus-circle" width={13} height={13} className="mt-0.5 shrink-0" style={{ color: "#D97706" }} />
                        {m}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Contract gaps */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wide mb-3 flex items-center gap-1.5" style={{ color: "#7C3AED" }}>
                    <Icon icon="lucide:file-warning" width={13} height={13} />
                    Contract Gaps
                  </h4>
                  <ul className="space-y-2">
                    {d.contractGaps.map((c, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm p-2 rounded-lg" style={{ background: "#F5F3FF", color: "#374151" }}>
                        <Icon icon="lucide:file-x" width={13} height={13} className="mt-0.5 shrink-0" style={{ color: "#7C3AED" }} />
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Manager questions */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wide mb-3 flex items-center gap-1.5" style={{ color: "#0176D3" }}>
                    <Icon icon="lucide:message-circle-question" width={13} height={13} />
                    Manager Questions
                  </h4>
                  <ul className="space-y-2">
                    {d.managerQuestions.map((q, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm p-2 rounded-lg" style={{ background: "#EFF6FF", color: "#374151" }}>
                        <span className="text-xs font-bold shrink-0 mt-0.5" style={{ color: "#0176D3" }}>{i + 1}.</span>
                        {q}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Next best actions — full width */}
                <div className="col-span-2">
                  <h4 className="text-xs font-bold uppercase tracking-wide mb-3 flex items-center gap-1.5" style={{ color: "#059669" }}>
                    <Icon icon="lucide:zap" width={13} height={13} />
                    Next Best Actions
                  </h4>
                  <div className="grid grid-cols-2 gap-2 lg:grid-cols-3">
                    {d.nextActions.map((a, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-lg border" style={{ background: "#F0FDF4", borderColor: "#BBF7D0" }}>
                        <div className="rounded-lg flex items-center justify-center shrink-0" style={{ width: 32, height: 32, background: "#fff" }}>
                          <Icon icon={a.icon} width={15} height={15} style={{ color: "#059669" }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold leading-tight" style={{ color: "#111827" }}>{a.action}</p>
                          <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>{a.owner}</p>
                        </div>
                        <PriorityBadge p={a.priority} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {tab === "inputs" && (
              <div className="p-5">
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(d.inputs).map(([key, available]) => (
                    <div key={key} className="flex items-center gap-3 p-3 rounded-lg border" style={{ background: available ? "#F0FDF4" : "#FFF7F7", borderColor: available ? "#BBF7D0" : "#FECACA" }}>
                      <div className="rounded-full flex items-center justify-center shrink-0" style={{ width: 32, height: 32, background: available ? "#DCFCE7" : "#FEE2E2" }}>
                        <Icon icon={available ? "lucide:database" : "lucide:database-zap"} width={15} height={15} style={{ color: available ? "#16A34A" : "#DC2626" }} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold" style={{ color: "#111827" }}>{INPUT_LABELS[key]}</p>
                        <p className="text-xs" style={{ color: available ? "#16A34A" : "#DC2626" }}>
                          {available ? "Data available · Connected" : "Missing · Not available"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === "followup" && (
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Icon icon="lucide:sparkles" width={16} height={16} style={{ color: "#8B5CF6" }} />
                  <span className="text-sm font-semibold" style={{ color: "#374151" }}>AI-Generated Follow-Up Message</span>
                </div>
                <div className="rounded-lg p-4 mb-3" style={{ background: "#F9FAFB", border: "1px solid #E5E7EB", fontFamily: "monospace", fontSize: 13, color: "#374151", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
                  {d.followUpMessage}
                </div>
                <div className="flex gap-2">
                  <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ background: "#0176D3" }}>
                    <Icon icon="lucide:send" width={14} height={14} />
                    Send via CRM
                  </button>
                  <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium" style={{ background: "#F3F4F6", color: "#374151" }}>
                    <Icon icon="lucide:copy" width={14} height={14} />
                    Copy
                  </button>
                  <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium" style={{ background: "#F3F4F6", color: "#374151" }}>
                    <Icon icon="lucide:refresh-cw" width={14} height={14} />
                    Regenerate
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Loading state */}
      {running && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="rounded-2xl p-8 mx-auto mb-4 inline-flex items-center justify-center" style={{ background: "#EFF6FF", width: 80, height: 80 }}>
              <Icon icon="lucide:brain-circuit" width={40} height={40} style={{ color: "#0176D3" }} className="animate-pulse" />
            </div>
            <h3 className="font-bold text-lg mb-1" style={{ color: "#111827" }}>AI Analyzing…</h3>
            <p className="text-sm" style={{ color: "#6B7280" }}>Mining CRM, tickets, contracts, and call transcripts</p>
            <div className="mt-4 flex gap-2 justify-center">
              {["Salesforce CRM", "Zendesk Tickets", "Contract Repo", "Call Transcripts"].map((s, i) => (
                <span key={i} className="text-xs px-2 py-1 rounded-full font-medium animate-pulse" style={{ background: "#EFF6FF", color: "#0176D3", animationDelay: `${i * 0.2}s` }}>{s}</span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
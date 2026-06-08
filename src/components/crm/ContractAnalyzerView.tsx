"use client";
import { Icon } from "@iconify/react";
import { useState, useRef } from "react";

type Message = { role: "user" | "ai"; text: string };

const SAMPLE_QA: Record<string, string> = {
  "what is the contract value": "The total contract value is **$280,000 USD** for a 24-month term, with a scheduled annual increase of 5% beginning in Year 2 (effective January 1, 2027).",
  "when does the contract expire": "The contract has an effective date of **January 1, 2026** and expires on **December 31, 2027** unless renewed or terminated pursuant to Section 12.1.",
  "what are the payment terms": "Per Section 5.2, payment is due **Net 30** from invoice date. Late payments accrue interest at 1.5% per month. Invoices are issued quarterly in advance.",
  "is there an auto renewal clause": "Yes. Section 12.3 includes an **automatic renewal clause** — the contract auto-renews for successive 12-month terms unless either party provides written notice of non-renewal at least **60 days prior** to the expiration date.",
  "what are the termination conditions": "Section 12.1 allows termination for cause with **30 days written notice** if a material breach is not cured. Section 12.2 allows termination for convenience with **90 days written notice**, subject to an early termination fee of 20% of remaining contract value.",
  "are there any sla commitments": "Section 8 outlines SLA commitments: **99.5% uptime** guarantee per calendar month, **4-hour response time** for P1 incidents, and **8-hour resolution target** for P2 incidents. Credits are issued for SLA breaches at 5% of monthly fees per incident.",
  "what are the data privacy obligations": "Section 10 references compliance with **GDPR**, **CCPA**, and **Data Privacy Act of 2012 (Philippines)**. The vendor agrees to maintain a Data Processing Agreement (DPA) and notify the customer within **72 hours** of any confirmed data breach.",
  "identify contract gaps": "I identified **3 potential contract gaps**:\n1. **Budget owner** is not named — the signatory is listed as the VP of IT, but no procurement or finance approver is identified.\n2. **Renewal blocker clause** is missing — there is no provision addressing what happens if the customer is in dispute at renewal time.\n3. **Scope of use limitation** is vague in Section 3.1 — the number of licensed users is not capped, which could create billing ambiguity.",
};

function simulateAIResponse(question: string): string {
  const q = question.toLowerCase().trim();
  for (const [key, answer] of Object.entries(SAMPLE_QA)) {
    if (q.includes(key.split(" ")[0]) || key.split(" ").some(w => q.includes(w))) {
      return answer;
    }
  }
  return `Based on the uploaded contract, I was unable to find a specific clause directly answering "${question}". This may be an area where the contract is silent or ambiguous. I recommend flagging this as a **contract gap** and consulting with your legal team or account manager.`;
}

const SUGGESTED_QUESTIONS = [
  "What is the contract value?",
  "When does the contract expire?",
  "Is there an auto-renewal clause?",
  "What are the payment terms?",
  "Identify contract gaps",
  "What are the SLA commitments?",
  "What are the termination conditions?",
  "What are the data privacy obligations?",
];

function MarkdownText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <span>
      {parts.map((p, i) =>
        p.startsWith("**") && p.endsWith("**")
          ? <strong key={i}>{p.slice(2, -2)}</strong>
          : p.split("\n").map((line, j) => (
            <span key={j}>{j > 0 && <br />}{line}</span>
          ))
      )}
    </span>
  );
}

export default function ContractAnalyzerView() {
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const handleFile = (f: File) => {
    setFile(f);
    setMessages([{
      role: "ai",
      text: `Contract uploaded successfully: **${f.name}**\n\nI've analyzed the document and I'm ready to answer questions. You can ask me about contract value, expiry dates, payment terms, SLA commitments, termination conditions, data privacy clauses, or ask me to identify any contract gaps.`,
    }]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const sendMessage = (text: string) => {
    if (!text.trim() || thinking) return;
    const userMsg: Message = { role: "user", text };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setThinking(true);
    setTimeout(() => {
      const aiResponse = simulateAIResponse(text);
      setMessages(prev => [...prev, { role: "ai", text: aiResponse }]);
      setThinking(false);
      setTimeout(() => chatBottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    }, 900 + Math.random() * 600);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div className="p-6 flex gap-5" style={{ height: "100%", overflow: "hidden" }}>
      {/* Left panel */}
      <div className="flex flex-col gap-4 shrink-0" style={{ width: 300 }}>
        {/* Upload card */}
        <div className="rounded-xl p-5" style={{ background: "#fff", border: "1px solid #E5E7EB", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
          <div className="flex items-center gap-2 mb-4">
            <div className="rounded-lg flex items-center justify-center" style={{ width: 34, height: 34, background: "#EFF6FF" }}>
              <Icon icon="lucide:file-text" width={17} height={17} style={{ color: "#0176D3" }} />
            </div>
            <div>
              <h3 className="font-semibold text-sm" style={{ color: "#111827" }}>Contract Upload</h3>
              <p className="text-xs" style={{ color: "#9CA3AF" }}>PDF, DOCX, TXT</p>
            </div>
          </div>

          {!file ? (
            <div
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors"
              style={{
                height: 140,
                borderColor: dragging ? "#0176D3" : "#D1D5DB",
                background: dragging ? "#EFF6FF" : "#F9FAFB",
              }}
            >
              <div className="rounded-full flex items-center justify-center" style={{ width: 44, height: 44, background: dragging ? "#DBEAFE" : "#E5E7EB" }}>
                <Icon icon="lucide:upload-cloud" width={22} height={22} style={{ color: dragging ? "#0176D3" : "#9CA3AF" }} />
              </div>
              <p className="text-sm font-medium text-center" style={{ color: "#374151" }}>
                {dragging ? "Drop to upload" : "Drop contract here"}
              </p>
              <p className="text-xs" style={{ color: "#9CA3AF" }}>or click to browse</p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.txt,.doc"
                className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
              />
            </div>
          ) : (
            <div className="rounded-xl p-3 flex items-center gap-3" style={{ background: "#F0FDF4", border: "1px solid #BBF7D0" }}>
              <div className="rounded-lg flex items-center justify-center shrink-0" style={{ width: 36, height: 36, background: "#DCFCE7" }}>
                <Icon icon="lucide:file-check-2" width={18} height={18} style={{ color: "#16A34A" }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate" style={{ color: "#111827" }}>{file.name}</p>
                <p className="text-xs" style={{ color: "#16A34A" }}>Analyzed · Ready</p>
              </div>
              <button
                onClick={() => { setFile(null); setMessages([]); }}
                className="p-1 rounded hover:bg-green-200 transition-colors"
                style={{ color: "#16A34A" }}
              >
                <Icon icon="lucide:x" width={13} height={13} />
              </button>
            </div>
          )}
        </div>

        {/* Document info */}
        {file && (
          <div className="rounded-xl p-4" style={{ background: "#fff", border: "1px solid #E5E7EB", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
            <h4 className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: "#6B7280" }}>Document Info</h4>
            <div className="space-y-2">
              {[
                { label: "Customer", value: "Acme Healthcare Solutions" },
                { label: "Contract Type", value: "Enterprise SaaS Agreement" },
                { label: "Contract Value", value: "$280,000 USD" },
                { label: "Start Date", value: "Jan 1, 2026" },
                { label: "End Date", value: "Dec 31, 2027" },
                { label: "Auto-Renewal", value: "Yes – 60 days notice" },
                { label: "Payment Terms", value: "Net 30, Quarterly" },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-start justify-between gap-2">
                  <span className="text-xs" style={{ color: "#9CA3AF", flexShrink: 0 }}>{label}</span>
                  <span className="text-xs font-semibold text-right" style={{ color: "#374151" }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contract health */}
        {file && (
          <div className="rounded-xl p-4" style={{ background: "#fff", border: "1px solid #E5E7EB", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
            <h4 className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: "#6B7280" }}>Contract Health</h4>
            <div className="space-y-2">
              {[
                { label: "Completeness", score: 78, color: "#F59E0B" },
                { label: "Compliance", score: 92, color: "#22C55E" },
                { label: "Risk Score", score: 34, color: "#22C55E" },
              ].map(({ label, score, color }) => (
                <div key={label}>
                  <div className="flex justify-between mb-0.5">
                    <span className="text-xs" style={{ color: "#6B7280" }}>{label}</span>
                    <span className="text-xs font-bold" style={{ color }}>{score}%</span>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ background: "#F3F4F6" }}>
                    <div className="h-full rounded-full" style={{ width: `${score}%`, background: color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right: chat panel */}
      <div className="flex-1 flex flex-col rounded-xl overflow-hidden" style={{ background: "#fff", border: "1px solid #E5E7EB", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
        {/* Chat header */}
        <div className="flex items-center gap-3 px-5 py-3.5 border-b shrink-0" style={{ borderColor: "#F3F4F6" }}>
          <div className="rounded-lg flex items-center justify-center shrink-0" style={{ width: 34, height: 34, background: "#EFF6FF" }}>
            <Icon icon="lucide:brain-circuit" width={17} height={17} style={{ color: "#0176D3" }} />
          </div>
          <div>
            <h3 className="font-semibold text-sm" style={{ color: "#111827" }}>Contract AI Assistant</h3>
            <p className="text-xs" style={{ color: "#9CA3AF" }}>
              {file ? `Analyzing: ${file.name}` : "Upload a contract to get started"}
            </p>
          </div>
          {file && (
            <span className="ml-auto text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: "#DCFCE7", color: "#16A34A" }}>
              <Icon icon="lucide:circle" width={7} height={7} className="inline mr-1" style={{ fill: "#16A34A" }} />
              Active
            </span>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4" style={{ minHeight: 240 }}>
              <div className="rounded-2xl flex items-center justify-center" style={{ width: 64, height: 64, background: "#F3F4F6" }}>
                <Icon icon="lucide:file-search" width={30} height={30} style={{ color: "#9CA3AF" }} />
              </div>
              <div>
                <p className="font-semibold text-sm" style={{ color: "#374151" }}>
                  {file ? "Contract ready — ask anything" : "No contract uploaded yet"}
                </p>
                <p className="text-xs mt-1" style={{ color: "#9CA3AF" }}>
                  {file
                    ? "Ask about terms, clauses, risks, or payment details"
                    : "Upload a contract on the left to start analyzing"}
                </p>
              </div>
              {file && (
                <div className="flex flex-wrap justify-center gap-2 max-w-sm">
                  {SUGGESTED_QUESTIONS.slice(0, 4).map(q => (
                    <button
                      key={q}
                      onClick={() => sendMessage(q)}
                      className="px-3 py-1.5 rounded-full text-xs font-medium border transition-colors hover:border-blue-400 hover:text-blue-600"
                      style={{ background: "#F9FAFB", borderColor: "#E5E7EB", color: "#374151" }}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              {m.role === "ai" && (
                <div className="rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ width: 30, height: 30, background: "#EFF6FF" }}>
                  <Icon icon="lucide:brain-circuit" width={14} height={14} style={{ color: "#0176D3" }} />
                </div>
              )}
              <div
                className="rounded-xl px-4 py-3 text-sm leading-relaxed max-w-lg"
                style={{
                  background: m.role === "user" ? "#0176D3" : "#F9FAFB",
                  color: m.role === "user" ? "#fff" : "#374151",
                  border: m.role === "ai" ? "1px solid #E5E7EB" : "none",
                }}
              >
                <MarkdownText text={m.text} />
              </div>
              {m.role === "user" && (
                <div className="rounded-full flex items-center justify-center shrink-0 mt-0.5 font-bold text-white text-xs" style={{ width: 30, height: 30, background: "#0176D3" }}>
                  JD
                </div>
              )}
            </div>
          ))}

          {thinking && (
            <div className="flex gap-3 justify-start">
              <div className="rounded-full flex items-center justify-center shrink-0" style={{ width: 30, height: 30, background: "#EFF6FF" }}>
                <Icon icon="lucide:brain-circuit" width={14} height={14} style={{ color: "#0176D3" }} />
              </div>
              <div className="rounded-xl px-4 py-3 flex items-center gap-1.5" style={{ background: "#F9FAFB", border: "1px solid #E5E7EB" }}>
                {[0, 1, 2].map(i => (
                  <div key={i} className="rounded-full" style={{ width: 7, height: 7, background: "#D1D5DB", animation: `bounce 1.2s ${i * 0.2}s infinite` }} />
                ))}
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Suggested questions */}
        {file && messages.length > 0 && (
          <div className="px-5 py-2 border-t flex gap-2 overflow-x-auto shrink-0" style={{ borderColor: "#F3F4F6" }}>
            {SUGGESTED_QUESTIONS.map(q => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                className="px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition-colors hover:border-blue-400 hover:text-blue-600 shrink-0"
                style={{ background: "#F9FAFB", borderColor: "#E5E7EB", color: "#374151" }}
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Input area */}
        <div className="px-5 py-4 border-t shrink-0" style={{ borderColor: "#F3F4F6" }}>
          <div className="flex items-end gap-3 rounded-xl border px-4 py-3" style={{ borderColor: "#E5E7EB", background: "#F9FAFB" }}>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={file ? "Ask a question about this contract…" : "Upload a contract first to ask questions"}
              disabled={!file || thinking}
              rows={1}
              className="flex-1 resize-none text-sm outline-none leading-relaxed"
              style={{ background: "transparent", color: "#111827", maxHeight: 100, minHeight: 22 }}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || !file || thinking}
              className="flex items-center justify-center rounded-lg shrink-0 transition-colors"
              style={{
                width: 34, height: 34,
                background: input.trim() && file && !thinking ? "#0176D3" : "#E5E7EB",
                color: input.trim() && file && !thinking ? "#fff" : "#9CA3AF",
              }}
            >
              <Icon icon="lucide:send" width={15} height={15} />
            </button>
          </div>
          <p className="text-xs mt-2 text-center" style={{ color: "#D1D5DB" }}>
            AI responses are based on the uploaded contract document. Press Enter to send.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-5px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
"use client";

import { Icon } from "@iconify/react";
import { useEffect, useRef, useState } from "react";

import { extractContract } from "@/lib/contracts/extract-contract";
import type { LoadedContract } from "@/lib/contracts/loaded-contracts";
import { CONTRACT_QUESTIONS, GAP_ANALYSIS_BASELINE } from "@/lib/contracts/questions";
import type {
  ContractAnalysis,
  ContractCitation,
  ContractFinding,
  ExtractedContract,
  RiskLevel,
} from "@/lib/contracts/types";

type Message =
  | { role: "user"; text: string }
  | { role: "ai"; analysis: ContractAnalysis };

const riskStyle: Record<RiskLevel, { bg: string; color: string }> = {
  low: { bg: "#DCFCE7", color: "#166534" },
  medium: { bg: "#FEF3C7", color: "#92400E" },
  high: { bg: "#FEE2E2", color: "#991B1B" },
};

async function requestAnalysis(
  contract: ExtractedContract,
  mode: "initial_analysis" | "question",
  question?: string,
) {
  const response = await fetch("/api/contracts/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      mode,
      question,
      filename: contract.filename,
      contractText: contract.text,
    }),
  });
  const body = await response.json();
  if (!response.ok) throw new Error(body.error || "Contract analysis failed.");
  return body as ContractAnalysis;
}

function RiskBadge({ risk }: { risk: RiskLevel }) {
  const style = riskStyle[risk];
  return (
    <span
      style={{
        background: style.bg,
        color: style.color,
        borderRadius: 999,
        padding: "3px 8px",
        fontSize: 10,
        fontWeight: 700,
        textTransform: "uppercase",
      }}
    >
      {risk}
    </span>
  );
}

function CitationList({ citations }: { citations: ContractCitation[] }) {
  if (!citations.length) return null;
  return (
    <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
      <p style={{ margin: 0, color: "#6B7280", fontSize: 11, fontWeight: 700 }}>
        Evidence
      </p>
      {citations.map((citation, index) => (
        <div
          key={`${citation.quote}-${index}`}
          style={{
            borderLeft: "3px solid #93C5FD",
            background: "#EFF6FF",
            borderRadius: "0 7px 7px 0",
            padding: "7px 9px",
          }}
        >
          <p style={{ margin: "0 0 2px", color: "#1D4ED8", fontSize: 10, fontWeight: 700 }}>
            {citation.section || "Unnumbered section"}
            {citation.page ? ` · Page ${citation.page}` : ""}
          </p>
          <p style={{ margin: 0, color: "#374151", fontSize: 11, lineHeight: 1.45 }}>
            “{citation.quote}”
          </p>
        </div>
      ))}
    </div>
  );
}

function FindingList({
  title,
  findings,
}: {
  title: string;
  findings: ContractFinding[];
}) {
  if (!findings.length) return null;
  return (
    <section style={{ marginTop: 14 }}>
      <p style={{ margin: "0 0 7px", color: "#374151", fontSize: 12, fontWeight: 700 }}>
        {title}
      </p>
      <div style={{ display: "grid", gap: 7 }}>
        {findings.map((finding, index) => (
          <details
            key={`${finding.title}-${index}`}
            style={{
              background: "#fff",
              border: "1px solid #E5E7EB",
              borderRadius: 8,
              padding: "8px 10px",
            }}
          >
            <summary style={{ cursor: "pointer", color: "#111827", fontSize: 12, fontWeight: 600 }}>
              <span style={{ marginRight: 7 }}>{finding.title}</span>
              <RiskBadge risk={finding.risk} />
            </summary>
            <p style={{ color: "#4B5563", fontSize: 12, lineHeight: 1.55 }}>{finding.summary}</p>
            <p style={{ color: "#374151", fontSize: 11, lineHeight: 1.5 }}>
              <strong>Recommendation:</strong> {finding.recommendation}
            </p>
            <CitationList citations={finding.citations} />
          </details>
        ))}
      </div>
    </section>
  );
}

function AnalysisMessage({ analysis }: { analysis: ContractAnalysis }) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 8 }}>
        <RiskBadge risk={analysis.overallRisk} />
        <span style={{ color: "#6B7280", fontSize: 11 }}>{analysis.contractType}</span>
      </div>
      <p style={{ margin: 0, whiteSpace: "pre-wrap", color: "#1F2937", fontSize: 13, lineHeight: 1.6 }}>
        {analysis.simpleAnswer}
      </p>
      <details style={{ marginTop: 10 }}>
        <summary style={{ cursor: "pointer", color: "#0176D3", fontSize: 11, fontWeight: 700 }}>
          Technical analysis
        </summary>
        <p style={{ whiteSpace: "pre-wrap", color: "#4B5563", fontSize: 12, lineHeight: 1.6 }}>
          {analysis.technicalAnalysis}
        </p>
      </details>
      {analysis.warning && (
        <div
          style={{
            marginTop: 10,
            border: "1px solid #FDE68A",
            background: "#FFFBEB",
            borderRadius: 8,
            padding: 8,
            color: "#92400E",
            fontSize: 11,
          }}
        >
          {analysis.warning}
        </div>
      )}
      <FindingList title="Material findings" findings={analysis.findings} />
      <FindingList title="Potential gaps" findings={analysis.gaps} />
      {!!analysis.deadlines.length && (
        <section style={{ marginTop: 14 }}>
          <p style={{ margin: "0 0 7px", color: "#374151", fontSize: 12, fontWeight: 700 }}>
            Deadlines and actions
          </p>
          {analysis.deadlines.map((deadline, index) => (
            <div
              key={`${deadline.label}-${index}`}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr auto",
                gap: 6,
                borderTop: "1px solid #E5E7EB",
                padding: "7px 0",
                fontSize: 11,
              }}
            >
              <div>
                <strong style={{ color: "#111827" }}>{deadline.label}</strong>
                <p style={{ margin: "2px 0 0", color: "#6B7280" }}>{deadline.action}</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <RiskBadge risk={deadline.risk} />
                <p style={{ margin: "3px 0 0", color: "#374151" }}>{deadline.dateOrPeriod}</p>
              </div>
            </div>
          ))}
        </section>
      )}
      <CitationList citations={analysis.citations} />
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string | null }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 8, marginBottom: 5 }}>
      <span style={{ color: "#9CA3AF", fontSize: 11 }}>{label}</span>
      <span
        title={value || "Not found"}
        style={{
          color: value ? "#374151" : "#9CA3AF",
          fontSize: 11,
          fontWeight: 600,
          textAlign: "right",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          maxWidth: 135,
        }}
      >
        {value || "Not found"}
      </span>
    </div>
  );
}

export default function ContractAnalyzerView({ section }: { section: "loaded" | "upload" }) {
  const [contract, setContract] = useState<ExtractedContract | null>(null);
  const [loadedContracts, setLoadedContracts] = useState<LoadedContract[]>([]);
  const [loadingContracts, setLoadingContracts] = useState(false);
  const [initial, setInitial] = useState<ContractAnalysis | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [stage, setStage] = useState<"idle" | "extracting" | "analyzing" | "ready">("idle");
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const height = "calc(100vh - 48px)";

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, busy]);

  useEffect(() => {
    reset();
  }, [section]);

  useEffect(() => {
    if (section !== "loaded") return;
    setLoadingContracts(true);
    fetch("/api/contracts")
      .then(async response => {
        const body = await response.json();
        if (!response.ok) throw new Error(body.error || "Unable to load contracts.");
        setLoadedContracts(body.contracts);
      })
      .catch(caught => setError(caught instanceof Error ? caught.message : "Unable to load contracts."))
      .finally(() => setLoadingContracts(false));
  }, [section]);

  async function pick(file: File) {
    setError(null);
    setStage("extracting");
    setContract(null);
    setInitial(null);
    setMessages([]);
    try {
      const extracted = await extractContract(file);
      setContract(extracted);
      setStage("analyzing");
      const analysis = await requestAnalysis(extracted, "initial_analysis");
      setInitial(analysis);
      setMessages([{ role: "ai", analysis }]);
      setStage("ready");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to process the contract.");
      setStage("idle");
    }
  }

  async function openLoadedContract(loaded: LoadedContract) {
    setError(null);
    setStage("extracting");
    try {
      const response = await fetch(loaded.downloadUrl);
      if (!response.ok) throw new Error("Unable to download the loaded contract.");
      const blob = await response.blob();
      await pick(new File([blob], loaded.filename, { type: loaded.mimeType }));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to open the loaded contract.");
      setStage("idle");
    }
  }

  async function send(question: string) {
    const trimmed = question.trim();
    if (!contract || !trimmed || busy) return;
    setMessages((current) => [...current, { role: "user", text: trimmed }]);
    setInput("");
    setBusy(true);
    setError(null);
    try {
      const analysis = await requestAnalysis(contract, "question", trimmed);
      setMessages((current) => [...current, { role: "ai", analysis }]);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to answer the question.");
    } finally {
      setBusy(false);
    }
  }

  function reset() {
    setContract(null);
    setInitial(null);
    setMessages([]);
    setError(null);
    setStage("idle");
    if (fileInput.current) fileInput.current.value = "";
  }

  if (stage === "idle") {
    if (section === "loaded") {
      return (
        <div style={{ height, overflowY: "auto", background: "#F3F4F6", padding: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div style={{ width: 42, height: 42, borderRadius: 11, background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon icon="lucide:library" width={21} height={21} style={{ color: "#0176D3" }} />
            </div>
            <div>
              <h2 style={{ margin: 0, color: "#111827", fontSize: 18, fontWeight: 700 }}>Loaded Contracts</h2>
              <p style={{ margin: "3px 0 0", color: "#6B7280", fontSize: 12 }}>
                Select a preloaded contract to analyze with Contract AI.
              </p>
            </div>
            <span style={{ marginLeft: "auto", borderRadius: 999, background: "#EFF6FF", color: "#0176D3", padding: "5px 10px", fontSize: 11, fontWeight: 700 }}>
              {loadedContracts.length} contracts
            </span>
          </div>

          {loadingContracts ? (
            <div style={{ height: 260, display: "flex", alignItems: "center", justifyContent: "center", gap: 9, color: "#6B7280", fontSize: 12 }}>
              <Icon icon="lucide:loader-circle" width={18} height={18} className="animate-spin" style={{ color: "#0176D3" }} />
              Loading contracts from Supabase...
            </div>
          ) : error ? (
            <div style={{ border: "1px solid #FECACA", background: "#FEF2F2", borderRadius: 10, padding: 12, color: "#B91C1C", fontSize: 12 }}>{error}</div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
              {loadedContracts.map(loaded => (
                <button
                  key={loaded.id}
                  onClick={() => void openLoadedContract(loaded)}
                  style={{ border: "1px solid #E5E7EB", borderRadius: 12, background: "#fff", padding: 16, textAlign: "left", cursor: "pointer", boxShadow: "0 1px 3px rgba(0,0,0,.05)", fontFamily: "inherit" }}
                >
                  <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <div style={{ width: 36, height: 36, flexShrink: 0, borderRadius: 9, background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon icon="lucide:file-text" width={17} height={17} style={{ color: "#0176D3" }} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ margin: 0, color: "#111827", fontSize: 13, fontWeight: 700, lineHeight: 1.4 }}>{loaded.companyName}</p>
                      <p style={{ margin: "3px 0 0", color: "#0176D3", fontSize: 11, fontWeight: 600 }}>{loaded.contractType}</p>
                    </div>
                  </div>
                  <div style={{ marginTop: 14, paddingTop: 10, borderTop: "1px solid #F3F4F6", display: "flex", justifyContent: "space-between", color: "#9CA3AF", fontSize: 10 }}>
                    <span>PDF · {(loaded.sizeBytes / 1024).toFixed(1)} KB</span>
                    <span style={{ color: "#0176D3", fontWeight: 700 }}>Open analyzer →</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <div
        style={{
          height,
          overflowY: "auto",
          background: "#fff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 40,
        }}
      >
        <div
          style={{
            width: 68,
            height: 68,
            background: "#EFF6FF",
            borderRadius: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 18,
          }}
        >
          <Icon icon="lucide:file-search" width={34} height={34} style={{ color: "#0176D3" }} />
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: "0 0 8px" }}>
          Contract Analyzer
        </h2>
        <p
          style={{
            fontSize: 14,
            color: "#6B7280",
            maxWidth: 420,
            textAlign: "center",
            margin: "0 0 22px",
          }}
        >
          Upload a text-based SaaS agreement. GPT-4.1 mini will summarize it, flag risks and
          gaps, track deadlines, and answer questions using contract evidence only.
        </p>
        <div
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragging(false);
            const file = event.dataTransfer.files[0];
            if (file) void pick(file);
          }}
          onClick={() => fileInput.current?.click()}
          style={{
            width: "100%",
          maxWidth: 460,
          minHeight: 200,
            border: `2px dashed ${dragging ? "#0176D3" : "#D1D5DB"}`,
            borderRadius: 16,
            background: dragging ? "#EFF6FF" : "#F9FAFB",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 13,
            cursor: "pointer",
            padding: 22,
          }}
        >
          <Icon icon="lucide:upload-cloud" width={34} height={34} style={{ color: "#0176D3" }} />
          <div style={{ textAlign: "center" }}>
            <p style={{ margin: "0 0 4px", color: "#374151", fontSize: 15, fontWeight: 600 }}>
              {dragging ? "Release to analyze" : "Drag and drop a contract here"}
            </p>
            <p style={{ margin: 0, color: "#9CA3AF", fontSize: 12 }}>
              PDF or DOCX · Up to 20 MB
            </p>
          </div>
          <button
            onClick={(event) => {
              event.stopPropagation();
              fileInput.current?.click();
            }}
            style={{
              border: 0,
              borderRadius: 9,
              background: "#0176D3",
              color: "#fff",
              padding: "9px 20px",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Browse files
          </button>
          <input
            ref={fileInput}
            type="file"
            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            style={{ display: "none" }}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void pick(file);
            }}
          />
        </div>
        <a
          href="/samples/demo-saas-agreement.docx"
          download
          style={{ marginTop: 14, color: "#0176D3", fontSize: 12, fontWeight: 600 }}
        >
          Download synthetic SaaS agreement for testing
        </a>
        {error && (
          <p
            style={{
              maxWidth: 500,
              margin: "14px 0 0",
              padding: "9px 12px",
              borderRadius: 8,
              background: "#FEF2F2",
              color: "#B91C1C",
              fontSize: 12,
            }}
          >
            {error}
          </p>
        )}
        <p style={{ margin: "16px 0 0", maxWidth: 540, color: "#9CA3AF", fontSize: 11, textAlign: "center" }}>
          Demo limitation: scanned PDFs are not supported. Files are analyzed in memory and are
          not saved by this application.
        </p>
      </div>
    );
  }

  if (stage === "extracting" || stage === "analyzing") {
    return (
      <div
        style={{
          height,
          background: "#fff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 15,
        }}
      >
        <Icon icon="lucide:loader-circle" width={38} height={38} className="animate-spin" style={{ color: "#0176D3" }} />
        <p style={{ margin: 0, color: "#374151", fontSize: 15, fontWeight: 600 }}>
          {stage === "extracting" ? "Extracting contract text..." : "Running initial contract review..."}
        </p>
        <p style={{ margin: 0, color: "#9CA3AF", fontSize: 12 }}>
          {stage === "extracting"
            ? "Preserving PDF page markers and DOCX content"
            : "Checking the SaaS clause baseline, risks, gaps, and deadlines"}
        </p>
      </div>
    );
  }

  return (
    <div style={{ height, display: "flex", background: "#fff", overflow: "hidden" }}>
      <aside
        style={{
          width: 252,
          flexShrink: 0,
          borderRight: "1px solid #E5E7EB",
          overflowY: "auto",
          padding: 14,
        }}
      >
        <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 10, padding: 10 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <Icon icon="lucide:file-check-2" width={17} height={17} style={{ color: "#16A34A" }} />
            <div style={{ minWidth: 0, flex: 1 }}>
              <p
                style={{
                  margin: 0,
                  color: "#111827",
                  fontSize: 11,
                  fontWeight: 700,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {contract?.filename}
              </p>
              <p style={{ margin: "2px 0 0", color: "#16A34A", fontSize: 10 }}>
                {contract?.pageCount ? `${contract.pageCount} pages` : "DOCX"} ·{" "}
                {contract?.characterCount.toLocaleString()} characters
              </p>
            </div>
            <button onClick={reset} aria-label="Remove contract" style={{ border: 0, background: "transparent", cursor: "pointer" }}>
              <Icon icon="lucide:x" width={14} height={14} style={{ color: "#16A34A" }} />
            </button>
          </div>
        </div>

        <div style={{ marginTop: 10, border: "1px solid #E5E7EB", borderRadius: 10, padding: 10 }}>
          <p style={{ margin: "0 0 8px", color: "#9CA3AF", fontSize: 10, fontWeight: 700, textTransform: "uppercase" }}>
            Document info
          </p>
          <InfoRow label="Type" value={initial?.contractType || null} />
          <InfoRow label="Title" value={initial?.metadata.title || null} />
          <InfoRow label="Value" value={initial?.metadata.contractValue || null} />
          <InfoRow label="Effective" value={initial?.metadata.effectiveDate || null} />
          <InfoRow label="Expires" value={initial?.metadata.expirationDate || null} />
          <InfoRow label="Payment" value={initial?.metadata.paymentTerms || null} />
        </div>

        <div style={{ marginTop: 10, border: "1px solid #E5E7EB", borderRadius: 10, padding: 10 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <p style={{ margin: 0, color: "#9CA3AF", fontSize: 10, fontWeight: 700, textTransform: "uppercase" }}>
              Overall risk
            </p>
            {initial && <RiskBadge risk={initial.overallRisk} />}
          </div>
          <p style={{ margin: "8px 0 0", color: "#6B7280", fontSize: 10 }}>
            {initial?.findings.length || 0} findings · {initial?.gaps.length || 0} gaps ·{" "}
            {initial?.deadlines.length || 0} deadlines
          </p>
        </div>

        <div style={{ marginTop: 12 }}>
          <p style={{ margin: "0 0 6px", color: "#9CA3AF", fontSize: 10, fontWeight: 700, textTransform: "uppercase" }}>
            Quick questions
          </p>
          {CONTRACT_QUESTIONS.map((question) => (
            <button
              key={question}
              onClick={() => void send(question)}
              disabled={busy}
              style={{
                width: "100%",
                marginBottom: 4,
                padding: "7px 8px",
                border: "1px solid #E5E7EB",
                borderRadius: 7,
                background: "#F9FAFB",
                color: "#374151",
                cursor: busy ? "not-allowed" : "pointer",
                textAlign: "left",
                fontFamily: "inherit",
                fontSize: 11,
                lineHeight: 1.35,
              }}
            >
              {question}
            </button>
          ))}
        </div>

        <details style={{ marginTop: 10 }}>
          <summary style={{ cursor: "pointer", color: "#6B7280", fontSize: 10, fontWeight: 700 }}>
            SaaS gap-analysis baseline
          </summary>
          <ul style={{ margin: "7px 0 0", paddingLeft: 18, color: "#6B7280", fontSize: 10, lineHeight: 1.6 }}>
            {GAP_ANALYSIS_BASELINE.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </details>
      </aside>

      <section style={{ minWidth: 0, flex: 1, display: "flex", flexDirection: "column" }}>
        <header
          style={{
            display: "flex",
            alignItems: "center",
            gap: 9,
            padding: "10px 18px",
            borderBottom: "1px solid #E5E7EB",
          }}
        >
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon icon="lucide:brain-circuit" width={16} height={16} style={{ color: "#0176D3" }} />
          </div>
          <div>
            <p style={{ margin: 0, color: "#111827", fontSize: 13, fontWeight: 700 }}>Contract AI</p>
            <p style={{ margin: 0, color: "#9CA3AF", fontSize: 10 }}>GPT-4.1 mini · evidence-only answers</p>
          </div>
          <span style={{ marginLeft: "auto", color: "#16A34A", fontSize: 10, fontWeight: 700 }}>● Ready</span>
        </header>

        <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px", display: "flex", flexDirection: "column", gap: 13 }}>
          {messages.map((message, index) => (
            <div key={index} style={{ display: "flex", justifyContent: message.role === "user" ? "flex-end" : "flex-start", gap: 8 }}>
              {message.role === "ai" && (
                <div style={{ width: 28, height: 28, flexShrink: 0, borderRadius: "50%", background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon icon="lucide:brain-circuit" width={13} height={13} style={{ color: "#0176D3" }} />
                </div>
              )}
              <div
                style={{
                  maxWidth: message.role === "user" ? "72%" : "82%",
                  padding: message.role === "user" ? "9px 13px" : "12px 14px",
                  background: message.role === "user" ? "#0176D3" : "#F9FAFB",
                  color: message.role === "user" ? "#fff" : "#374151",
                  border: message.role === "ai" ? "1px solid #E5E7EB" : 0,
                  borderRadius: message.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                  fontSize: 13,
                  lineHeight: 1.55,
                }}
              >
                {message.role === "user" ? message.text : <AnalysisMessage analysis={message.analysis} />}
              </div>
            </div>
          ))}
          {busy && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#6B7280", fontSize: 11 }}>
              <Icon icon="lucide:loader-circle" width={15} height={15} className="animate-spin" style={{ color: "#0176D3" }} />
              Reviewing contract evidence...
            </div>
          )}
          {error && (
            <div style={{ border: "1px solid #FECACA", background: "#FEF2F2", borderRadius: 8, padding: 9, color: "#B91C1C", fontSize: 11 }}>
              {error}
            </div>
          )}
          <div ref={endRef} />
        </div>

        <footer style={{ padding: "11px 18px 14px", borderTop: "1px solid #E5E7EB" }}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8, border: "1px solid #D1D5DB", borderRadius: 10, background: "#F9FAFB", padding: "8px 10px" }}>
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  void send(input);
                }
              }}
              placeholder="Ask any question about this contract..."
              disabled={busy}
              rows={1}
              style={{ minHeight: 22, maxHeight: 90, flex: 1, resize: "none", border: 0, outline: 0, background: "transparent", color: "#111827", fontFamily: "inherit", fontSize: 13 }}
            />
            <button
              onClick={() => void send(input)}
              disabled={!input.trim() || busy}
              style={{ width: 34, height: 34, border: 0, borderRadius: 8, background: input.trim() && !busy ? "#0176D3" : "#E5E7EB", color: input.trim() && !busy ? "#fff" : "#9CA3AF", cursor: input.trim() && !busy ? "pointer" : "not-allowed" }}
            >
              <Icon icon="lucide:send" width={14} height={14} />
            </button>
          </div>
          <p style={{ margin: "5px 0 0", color: "#9CA3AF", fontSize: 10, textAlign: "center" }}>
            Evidence-only contract review · AI output requires human verification
          </p>
        </footer>
      </section>
    </div>
  );
}

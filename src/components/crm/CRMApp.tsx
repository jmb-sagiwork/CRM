"use client";
import { useState } from "react";
import Sidebar, { ContractSection, CRMView } from "./Sidebar";
import TopBar from "./TopBar";
import DashboardView from "./DashboardView";
import AccountsView from "./AccountsView";
import PipelineView from "./PipelineView";
import AIReviewView from "./AIReviewView";
import CasesView from "./CasesView";

import ReportsView from "./ReportsView";
import ContractAnalyzerView from "./ContractAnalyzerView";

export default function CRMApp() {
  const [view, setView] = useState<CRMView>("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [contractSection, setContractSection] = useState<ContractSection>("loaded");

  const renderView = () => {
    switch (view) {
      case "dashboard":  return <DashboardView />;
      case "accounts":   return <AccountsView />;
      
      case "pipeline":   return <PipelineView />;
      case "aireview":   return <AIReviewView />;
      case "cases":      return <CasesView />;
      case "reports":    return <ReportsView />;
      case "contracts":  return <ContractAnalyzerView section={contractSection} />;
      default:           return <DashboardView />;
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw", overflow: "hidden", background: "#F3F4F6", fontFamily: "Inter, system-ui, sans-serif" }}>
      <Sidebar active={view} onNav={setView} collapsed={collapsed} onToggle={() => setCollapsed(p => !p)} contractSection={contractSection} onContractSection={setContractSection} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
        <TopBar view={view} />
        <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minHeight: 0 }}>
          {renderView()}
        </main>
      </div>
    </div>
  );
}

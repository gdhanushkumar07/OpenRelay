// src/components/NetworkDashboardModals.tsx
"use client";

import React from "react";
import { Scenario } from "../lib/scenarios";
import ErrorBoundary from "./ErrorBoundary";
import BriefingPanel from "./BriefingPanel";
import CooHealthMonitor from "./CooHealthMonitor";
import { X, Activity, ArrowRight } from "lucide-react";

interface NetworkDashboardModalsProps {
  showBriefingModal: boolean;
  setShowBriefingModal: (show: boolean) => void;
  showHealthModal: boolean;
  setShowHealthModal: (show: boolean) => void;
  heartbeatAlert: string | null;
  setHeartbeatAlert: (alert: string | null) => void;
  activeScenario: Scenario | null;
  currentStepIndex: number;
  handleSignOff: () => void;
}

export default function NetworkDashboardModals({
  showBriefingModal,
  setShowBriefingModal,
  showHealthModal,
  setShowHealthModal,
  heartbeatAlert,
  setHeartbeatAlert,
  activeScenario,
  currentStepIndex,
  handleSignOff
}: NetworkDashboardModalsProps) {
  return (
    <>
      {/* Contextual Human Escalation Briefing Modal */}
      {showBriefingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-cream border border-charcoal/20 w-full max-w-3xl rounded-2xl overflow-hidden shadow-xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-5 border-b border-charcoal/10 bg-cream-dark/20">
              <h3 className="font-syne text-sm font-bold uppercase tracking-wide text-charcoal">Human Briefing / Escalation Desk</h3>
              <button onClick={() => setShowBriefingModal(false)} className="text-charcoal/40 hover:text-charcoal p-1">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 bg-cream grid-bg">
              <ErrorBoundary fallbackTitle="Briefing Panel Error">
                <BriefingPanel />
              </ErrorBoundary>
            </div>
            <div className="p-4 border-t border-charcoal/10 bg-cream-dark/10 flex justify-end">
              <button
                onClick={handleSignOff}
                className="px-5 py-2.5 bg-yellow hover:bg-yellow-dark text-charcoal font-syne font-bold uppercase text-xs rounded-xl border border-yellow-dark shadow-sm"
              >
                Sign Off & Complete Requisition
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contextual System Health sweep logs Modal */}
      {showHealthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-cream border border-charcoal/20 w-full max-w-3xl rounded-2xl overflow-hidden shadow-xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-5 border-b border-charcoal/10 bg-cream-dark/20">
              <h3 className="font-syne text-sm font-bold uppercase tracking-wide text-charcoal">Network Monitor Dashboard</h3>
              <button onClick={() => setShowHealthModal(false)} className="text-charcoal/40 hover:text-charcoal p-1">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 bg-cream grid-bg border-collapse">
              <ErrorBoundary fallbackTitle="Network Monitor Error">
                <CooHealthMonitor
                  scenario={activeScenario}
                  currentStepIndex={currentStepIndex}
                />
              </ErrorBoundary>
            </div>
          </div>
        </div>
      )}

      {/* Notification Toast Trigger for Heartbeat Sweeper */}
      {heartbeatAlert && (
        <div className="fixed bottom-6 right-6 z-50 bg-charcoal text-cream border border-yellow/20 px-5 py-4 rounded-2xl shadow-2xl flex items-start gap-3.5 max-w-sm animate-in slide-in-from-bottom-5 duration-300">
          <div className="bg-yellow/15 p-2 rounded-xl border border-yellow/20 text-yellow animate-pulse mt-0.5">
            <Activity className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-syne uppercase font-bold text-yellow tracking-wider">Network Monitor Alert</h4>
            <p className="text-[11px] text-cream-dark leading-relaxed font-semibold mt-1">
              {heartbeatAlert}
            </p>
            <button
              onClick={() => { setShowHealthModal(true); setHeartbeatAlert(null); }}
              className="inline-flex items-center gap-1 text-[10px] font-syne font-bold uppercase tracking-wider text-yellow underline hover:text-yellow-dark pt-1.5"
            >
              <span>Inspect Network Monitor</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <button onClick={() => setHeartbeatAlert(null)} className="text-white/40 hover:text-white/80 p-0.5 mt-0.5">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </>
  );
}

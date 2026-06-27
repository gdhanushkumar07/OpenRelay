// src/components/CooExplorationPanel.tsx
"use client";

import React from "react";
import { Scenario, ScenarioStep } from "../lib/scenarios";
import { Info, ShieldAlert, Cpu, ArrowRightLeft, Key, Database } from "lucide-react";

interface CooExplorationPanelProps {
  scenario?: Scenario | null;
  currentStepIndex: number;
}

export default function CooExplorationPanel({ scenario, currentStepIndex }: CooExplorationPanelProps) {
  const steps = scenario ? scenario.steps : [];
  const currentStep = currentStepIndex >= 0 && currentStepIndex < steps.length ? steps[currentStepIndex] : null;

  return (
    <div className="flex flex-col bg-cream border border-charcoal/10 rounded-2xl overflow-hidden shadow-sm h-full min-h-[300px]">
      {/* Header */}
      <div className="flex justify-between items-center px-5 py-4 border-b border-charcoal/10 bg-cream-dark/20">
        <div className="flex items-center gap-2">
          <span className="text-xs font-syne uppercase tracking-wider text-yellow-dark bg-yellow/10 px-2 py-0.5 rounded font-bold">Aicoo Audit</span>
          <div className="flex items-center gap-1.5 text-xs font-syne uppercase font-bold text-charcoal">
            <Info className="w-4 h-4 text-yellow-dark" />
            <span>Coordination Inspector</span>
          </div>
        </div>
      </div>

      {/* Inspector Details */}
      <div className="flex-1 p-5 overflow-y-auto max-h-[300px] space-y-4 grid-bg min-h-[220px]">
        {!currentStep ? (
          <div className="flex flex-col items-center justify-center h-full text-charcoal/30 py-12 text-center select-none">
            <Cpu className="w-8 h-8 opacity-25 mb-1.5" />
            <p className="font-syne text-xs uppercase tracking-wider font-bold">Inspector Idle</p>
            <p className="text-[10px] mt-0.5 opacity-80 leading-relaxed max-w-[200px]">
              Select a coordination step or run a workflow to inspect secure API handoffs and routing.
            </p>
          </div>
        ) : (
          <div className="space-y-4 text-xs font-semibold text-charcoal/80 animate-in fade-in duration-200">
            {/* Step metadata */}
            <div className="flex justify-between items-center border-b border-charcoal/5 pb-2">
              <span className="text-[10px] font-mono text-charcoal/40 uppercase">Audit ID: {currentStep.glowNode}-{currentStep.stepIndex}</span>
              <span className="text-[9px] font-syne uppercase font-bold bg-charcoal/5 text-charcoal px-2 py-0.5 rounded">
                Step {currentStep.stepIndex + 1} of {steps.length}
              </span>
            </div>

            {/* Organizations Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-[9px] font-syne uppercase text-charcoal/40 font-bold block">Sender COO</span>
                <span className="bg-charcoal text-cream text-[10px] font-syne font-extrabold uppercase px-2 py-1 rounded inline-block truncate max-w-full">
                  {currentStep.senderName}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-[9px] font-syne uppercase text-charcoal/40 font-bold block">Receiver COO</span>
                <span className="bg-yellow text-charcoal text-[10px] font-syne font-extrabold uppercase px-2 py-1 rounded border border-yellow-dark inline-block truncate max-w-full">
                  {currentStep.receiverName}
                </span>
              </div>
            </div>

            {/* Routing Reason */}
            <div className="space-y-1">
              <span className="text-[9px] font-syne uppercase text-charcoal/40 font-bold block">Routing Reason</span>
              <div className="p-3 bg-cream border border-charcoal/5 rounded-xl text-charcoal font-semibold leading-relaxed">
                {currentStep.reason}
              </div>
            </div>

            {/* Shared Context */}
            <div className="space-y-1">
              <span className="text-[9px] font-syne uppercase text-charcoal/40 font-bold block">Shared Context Scope</span>
              <div className="flex items-center gap-2 p-2 bg-charcoal/5 rounded-lg font-mono text-[10px] text-charcoal">
                <Database className="w-3.5 h-3.5 text-charcoal/50" />
                <span>{currentStep.badge || "Identity Context metadata"}</span>
              </div>
            </div>

            {/* Aicoo API & Permissions */}
            <div className="space-y-2">
              <span className="text-[9px] font-syne uppercase text-charcoal/40 font-bold block">Aicoo API Transaction</span>
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div className="flex items-center gap-1.5 p-2 bg-charcoal/5 rounded-lg">
                  <ArrowRightLeft className="w-3.5 h-3.5 text-charcoal/40" />
                  <span className="font-mono">{currentStep.apiCallName}</span>
                </div>
                <div className="flex items-center gap-1.5 p-2 bg-charcoal/5 rounded-lg">
                  <Key className="w-3.5 h-3.5 text-charcoal/40" />
                  <span>{currentStep.capability === 'Permission' || currentStep.capability === 'Context Share' ? 'Read-Only Permissioned' : 'Identity Context'}</span>
                </div>
              </div>
            </div>

            {/* Escalation Summary */}
            {currentStep.capability === 'Briefing' && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl space-y-1">
                <div className="flex items-center gap-1.5 font-bold uppercase text-[9px] tracking-wide">
                  <ShieldAlert className="w-4 h-4 shrink-0 text-red-600" />
                  <span>Aicoo Briefing Generated</span>
                </div>
                <p className="text-[10px] leading-relaxed font-semibold">
                  Unresolvable transaction flags successfully compiled and dispatched to human triage matrix.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

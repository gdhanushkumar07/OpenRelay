// src/components/CustomerJourney.tsx
"use client";

import React from "react";
import { Scenario, ScenarioStep } from "../lib/scenarios";
import { Check, Info, ShieldAlert, RotateCcw, AlertTriangle, ArrowRight, Play, CheckCircle2 } from "lucide-react";
import Link from "next/link";

interface CustomerJourneyProps {
  scenario: Scenario;
  currentStepIndex: number;
  onStepClick: (index: number) => void;
  onReset: () => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  onOpenBriefing?: () => void;
}

export default function CustomerJourney({
  scenario,
  currentStepIndex,
  onStepClick,
  onReset,
  isPlaying,
  setIsPlaying,
  onOpenBriefing
}: CustomerJourneyProps) {
  const steps = scenario.steps;
  const currentStep = currentStepIndex >= 0 ? steps[currentStepIndex] : null;
  const isComplete = currentStepIndex === steps.length - 1;

  const milestones = [
    { label: "Request Submitted", triggerIdx: 0 },
    { label: "Suppliers Located", triggerIdx: 1 },
    { label: "Inventory Reserved", triggerIdx: 3 },
    { label: "Shipment Planned", triggerIdx: 5 },
    { label: "Delivery Scheduled", triggerIdx: 6 },
    { label: "Order Confirmed", triggerIdx: 7 }
  ];

  // Triggers human sign-off alert if this is the high-value review scenario on step 3
  const hasEscalated = scenario.id === "high-value-procurement" && currentStepIndex === 3;

  return (
    <div className="bg-cream border border-charcoal/10 rounded-2xl p-6 flex flex-col justify-between h-full shadow-sm">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start border-b border-charcoal/10 pb-4">
          <div className="space-y-1">
            <span className="text-[9px] font-syne uppercase tracking-wider text-yellow-dark bg-yellow/10 px-2 py-0.5 rounded font-bold">
              Perspective A
            </span>
            <h3 className="font-syne text-sm font-extrabold uppercase text-charcoal tracking-wide">
              Customer Journey View
            </h3>
          </div>
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-charcoal/10 rounded-lg text-[10px] font-syne font-bold uppercase hover:bg-charcoal/5 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>New Order</span>
          </button>
        </div>

        {/* Live Narration Banner */}
        <div className="bg-charcoal text-cream p-4 rounded-xl space-y-2 border border-charcoal grid-bg-dark">
          <div className="flex items-center justify-between">
            <span className="text-[8px] font-syne uppercase tracking-wider text-yellow font-bold">
              Procurement Timeline
            </span>
            <span className="text-[8px] font-mono text-white/40">Step {currentStepIndex + 1} / {steps.length}</span>
          </div>
          <p className="text-[11px] text-cream-dark leading-relaxed font-semibold">
            {currentStep 
              ? currentStep.narration 
              : "Requisition active. Your organization's AI COO is coordinating context with suppliers."}
          </p>
        </div>

        {/* Vertical Stepper Progress */}
        <div className="space-y-3.5 pl-2">
          {milestones
            .filter(m => m.triggerIdx < steps.length)
            .map((m, idx) => {
              const isMilestoneComplete = currentStepIndex >= m.triggerIdx;
              const isMilestoneActive = currentStepIndex === m.triggerIdx && !isComplete;
              return (
                <div key={idx} className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center border text-[9px] font-bold transition-all ${
                    isMilestoneComplete 
                      ? "bg-yellow text-charcoal border-yellow-dark" 
                      : isMilestoneActive 
                        ? "bg-charcoal text-yellow border-charcoal animate-pulse" 
                        : "bg-transparent text-charcoal/20 border-charcoal/10"
                  }`}>
                    {isMilestoneComplete ? <Check className="w-3 h-3 stroke-[3]" /> : idx + 1}
                  </div>
                  <span className={`text-[11px] font-bold ${
                    isMilestoneComplete ? "text-charcoal" : isMilestoneActive ? "text-yellow-dark" : "text-charcoal/30"
                  }`}>
                    {m.label}
                  </span>
                </div>
              );
            })}
        </div>

        {/* Human Escalation Alert */}
        {hasEscalated && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4.5 h-4.5 shrink-0 text-red-600 animate-pulse" />
              <h4 className="text-xs font-syne font-extrabold uppercase text-red-800">Human Approval Required</h4>
            </div>
            <p className="text-[10px] leading-relaxed font-medium text-red-700/80">
              Sourcing request exceeds the model's autonomous authorization threshold ($1,000,000). The transaction has paused pending executive briefcase review.
            </p>
            <button
              type="button"
              onClick={onOpenBriefing}
              className="inline-flex items-center gap-1 text-[10px] font-syne font-bold uppercase tracking-wider text-red-750 underline hover:text-red-900 pt-1"
            >
              <span>Verify Briefing Dossier</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Final Receipt */}
        {isComplete && (
          <div className="bg-yellow/15 border border-yellow-dark/20 p-4 rounded-xl space-y-3 animate-in fade-in duration-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-yellow-dark shrink-0" />
              <h4 className="text-xs font-syne font-extrabold uppercase text-charcoal">Requisition Confirmed</h4>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[10px] font-semibold text-charcoal/70">
              <div>Fulfillment: <strong className="text-charcoal">Secure Aicoo Mesh</strong></div>
              <div>Estimated Transit: <strong className="text-charcoal">Standard Window</strong></div>
              <div>Security Hash: <strong className="text-charcoal">AICOO-OK</strong></div>
              <div>Negotiations: <strong className="text-charcoal">Completed</strong></div>
            </div>
          </div>
        )}
      </div>

      {/* Replay Timeline Controls */}
      <div className="border-t border-charcoal/10 pt-4 mt-6 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-syne uppercase font-bold text-charcoal/50">Educational Coordination Replay</span>
          <span className="text-[9px] text-charcoal/40 font-bold uppercase">Click to audit</span>
        </div>
        <p className="text-[9px] text-charcoal/50 leading-relaxed font-semibold">
          Click any step to inspect who shared context, why permissions were granted, and how the Aicoo protocol secured the coordination.
        </p>

        <div className="flex items-center justify-between px-1">
          {steps.map((step, idx) => {
            const isPassed = currentStepIndex >= idx;
            const isCurrent = currentStepIndex === idx;
            return (
              <button
                key={idx}
                onClick={() => { setIsPlaying(false); onStepClick(idx); }}
                className={`w-3.5 h-3.5 rounded-full border transition-all ${
                  isCurrent 
                    ? "bg-yellow border-yellow-dark scale-125 ring-2 ring-yellow/30" 
                    : isPassed 
                      ? "bg-charcoal border-charcoal" 
                      : "bg-cream-dark/40 border-charcoal/10 hover:border-charcoal/30"
                }`}
                title={`Inspect Step ${idx + 1}`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

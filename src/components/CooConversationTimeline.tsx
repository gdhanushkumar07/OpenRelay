// src/components/CooConversationTimeline.tsx
"use client";

import React, { useEffect, useRef } from "react";
import { Scenario } from "../lib/scenarios";
import { MessageSquare, Shield, HelpCircle, Layers } from "lucide-react";

interface CooConversationTimelineProps {
  scenario: Scenario;
  currentStepIndex: number;
}

function getSenderColor(name: string) {
  if (name.includes("Buyer") || name.includes("Customer")) return "bg-charcoal text-cream border-charcoal";
  if (name.includes("Supplier") || name.includes("Warehouse")) return "bg-yellow text-charcoal border-yellow-dark";
  if (name.includes("Logistics")) return "bg-blue-600 text-white border-blue-800";
  if (name.includes("Insurance")) return "bg-orange-600 text-white border-orange-850";
  return "bg-charcoal/10 text-charcoal border-charcoal/20";
}

function getCapabilityBadge(cap: string) {
  const capsMap: Record<string, string> = {
    Identity: "bg-purple-100 text-purple-700 border-purple-200",
    Routing: "bg-blue-100 text-blue-700 border-blue-200",
    "Context Share": "bg-green-100 text-green-700 border-green-200",
    Permission: "bg-yellow/20 text-yellow-dark border-yellow/30",
    Briefing: "bg-red-100 text-red-700 border-red-200",
    Heartbeat: "bg-teal-100 text-teal-700 border-teal-200"
  };
  return capsMap[cap] || "bg-charcoal/5 text-charcoal/60 border-charcoal/10";
}

export default function CooConversationTimeline({ scenario, currentStepIndex }: CooConversationTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const steps = scenario ? scenario.steps : [];
  const visibleSteps = Array.isArray(steps) ? steps.slice(0, currentStepIndex + 1) : [];

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [currentStepIndex, visibleSteps.length]);

  return (
    <div className="flex flex-col bg-cream border border-charcoal/10 rounded-2xl overflow-hidden shadow-sm h-full min-h-[300px]">
      {/* Header */}
      <div className="flex justify-between items-center px-5 py-4 border-b border-charcoal/10 bg-cream-dark/20">
        <div className="flex items-center gap-2">
          <span className="text-xs font-syne uppercase tracking-wider text-yellow-dark bg-yellow/10 px-2 py-0.5 rounded font-bold">Aicoo Timeline</span>
          <div className="flex items-center gap-1.5 text-xs font-syne uppercase font-bold text-charcoal">
            <MessageSquare className="w-4 h-4 text-yellow-dark" />
            <span>AI COO Conversation Timeline</span>
          </div>
        </div>
      </div>

      {/* Timeline Chat */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-y-auto p-4 space-y-3.5 max-h-[300px] grid-bg min-h-[220px]"
      >
        {visibleSteps.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-charcoal/30 py-12 text-center select-none">
            <MessageSquare className="w-8 h-8 opacity-25 mb-1.5" />
            <p className="font-syne text-xs uppercase tracking-wider font-bold">Awaiting Dispatch</p>
            <p className="text-[10px] mt-0.5 opacity-80 leading-relaxed max-w-[200px]">
              Requisition pipeline inactive. Submit order to initialize secure organizational chat.
            </p>
          </div>
        ) : (
          visibleSteps.map((step, idx) => (
            <div 
              key={idx}
              className="p-3 bg-cream border border-charcoal/5 rounded-xl space-y-2 hover:border-charcoal/15 transition-all shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-200"
            >
              {/* Header row: sender, receiver, capability */}
              <div className="flex justify-between items-start gap-2 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <span className={`text-[9px] font-syne font-extrabold uppercase px-2 py-0.5 rounded border ${getSenderColor(step.senderName)}`}>
                    {step.senderName}
                  </span>
                  <span className="text-[8px] text-charcoal/40 font-bold uppercase">➔</span>
                  <span className="text-[9px] text-charcoal/60 font-bold">{step.receiverName}</span>
                </div>
                
                <span className={`text-[8px] font-syne font-extrabold uppercase px-1.5 py-0.5 rounded border ${getCapabilityBadge(step.capability)}`}>
                  Aicoo: {step.capability}
                </span>
              </div>

              {/* Chat Dialogue */}
              <p className="text-[11px] text-charcoal leading-relaxed font-semibold">
                "{step.dialogue}"
              </p>

              {/* Routing metadata footer */}
              <div className="flex justify-between items-center text-[8px] text-charcoal/40 font-bold uppercase border-t border-charcoal/5 pt-1.5 mt-1">
                <span>Task: {step.apiCallPath}</span>
                <span>Reason: {step.reason}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

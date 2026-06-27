// src/components/landing/WhyAgentMesh.tsx
"use client";

import React from "react";
import { 
  Headphones, CreditCard, Scale, Settings, Cpu, Globe, Crown, User 
} from "lucide-react";

export default function WhyAgentMesh() {
  const agents = [
    {
      id: "V-01",
      icon: Headphones,
      name: "Procurement Agent",
      role: "Workflow Triage",
      desc: "Autonomously receives issues (e.g., delays), checks SLA directories, and forwards requests with full context via Aicoo.",
      style: "bg-cream text-charcoal border-charcoal/10"
    },
    {
      id: "V-02",
      icon: CreditCard,
      name: "Finance Agent",
      role: "Accounting & Credits",
      desc: "Audits Stripe transactions, approves credit payouts, and posts billing ledger summaries to persistent workspaces.",
      style: "bg-yellow text-charcoal border-yellow-dark"
    },
    {
      id: "V-03",
      icon: Scale,
      name: "Insurance Agent",
      role: "Liability Audit",
      desc: "Validates damage claims against contract policy logs, reviews gdpr flags, and compiles escalated claims.",
      style: "bg-charcoal text-cream border-white/5"
    },
    {
      id: "V-04",
      icon: Cpu,
      name: "Warehouse Agent",
      role: "Inventory Scan",
      desc: "Scans stock forecasting levels and flags broken cargo incidents directly to Aicoo memory folders.",
      style: "bg-cream text-charcoal border-charcoal/10"
    },
    {
      id: "V-05",
      icon: Settings,
      name: "Shipping Agent",
      role: "Logistics Sync",
      desc: "Monitors transit delay signals and reroutes delivery paths using active routing tool integrations.",
      style: "bg-yellow text-charcoal border-yellow-dark"
    },
    {
      id: "V-06",
      icon: Globe,
      name: "Supplier Agent",
      role: "External Supplier",
      desc: "Validates shipping weights and accesses folder-scoped share links safely across company borders.",
      style: "bg-cream text-charcoal border-charcoal/10"
    },
    {
      id: "V-07",
      icon: Crown,
      name: "CEO Agent",
      role: "Corporate Executive",
      desc: "Consolidates all department briefing matrix cards into a priority Eisenhower grid for immediate human review.",
      style: "bg-charcoal text-cream border-white/5"
    },
    {
      id: "V-08",
      icon: User,
      name: "Customer Agent",
      role: "Customer Persona",
      desc: "Initializes complaints and coordinates directly with support endpoints to receive real-time ETA briefings.",
      style: "bg-yellow text-charcoal border-yellow-dark"
    }
  ];

  return (
    <section id="agents" className="py-20 bg-cream border-t border-charcoal/10 relative">
      <div className="max-w-7xl mx-auto px-6 space-y-12">
        {/* Header */}
        <div className="space-y-3 max-w-2xl">
          <span className="text-xs font-syne uppercase tracking-wider text-yellow-dark bg-yellow/10 px-2.5 py-0.5 rounded border border-yellow/20 inline-block font-bold">
            S-05 / Meet VendorFlow
          </span>
          <h2 className="font-syne text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-charcoal leading-none">
            Meet VendorFlow
          </h2>
          <p className="text-xs text-charcoal/60 leading-relaxed font-semibold">
            Today's companies already use AI. Tomorrow's companies will coordinate AI COOs across organizations. VendorFlow demonstrates how independent companies securely communicate using Aicoo. The dashboard exists to visualize that invisible coordination.
          </p>
        </div>

        {/* Agents Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {agents.map((agent) => {
            const Icon = agent.icon;
            const isDark = agent.style.includes("bg-charcoal");
            return (
              <div 
                key={agent.id}
                className={`border rounded-2xl p-6 flex flex-col justify-between min-h-[260px] transition-all hover:-translate-y-1 hover:shadow-sm group ${agent.style}`}
              >
                <div className="flex justify-between items-start">
                  <span className={`font-syne text-sm font-bold opacity-30 group-hover:opacity-100 transition-opacity`}>
                    {agent.id}
                  </span>
                  <div className={`p-2 rounded-lg border ${
                    isDark 
                      ? "bg-white/10 border-white/5 text-cream" 
                      : "bg-charcoal/5 border-charcoal/5 text-charcoal group-hover:bg-charcoal group-hover:text-yellow transition-all"
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <div className="space-y-2 mt-12">
                  <span className={`text-[9px] font-syne font-bold uppercase tracking-wider ${
                    isDark ? "text-yellow" : "text-yellow-dark"
                  }`}>
                    {agent.role}
                  </span>
                  <h3 className="font-syne text-xs uppercase font-extrabold">
                    {agent.name}
                  </h3>
                  <p className={`text-[11px] leading-relaxed font-medium ${
                    isDark ? "text-white/60" : "text-charcoal/60"
                  }`}>
                    {agent.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

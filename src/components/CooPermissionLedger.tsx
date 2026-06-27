// src/components/CooPermissionLedger.tsx
"use client";

import React from "react";
import { Scenario } from "../lib/scenarios";
import { ShieldCheck, Calendar, Info, Clock } from "lucide-react";

interface CooPermissionLedgerProps {
  scenario: Scenario;
  currentStepIndex: number;
}

export default function CooPermissionLedger({ scenario, currentStepIndex }: CooPermissionLedgerProps) {
  const steps = scenario ? scenario.steps : [];
  
  // Filter steps executed so far that represent sharing context or permissions
  const activePermissions = Array.isArray(steps) 
    ? steps
        .slice(0, currentStepIndex + 1)
        .filter(s => s.capability === 'Context Share' || s.capability === 'Permission')
    : [];

  return (
    <div className="flex flex-col bg-cream border border-charcoal/10 rounded-2xl overflow-hidden shadow-sm h-full min-h-[300px]">
      {/* Header */}
      <div className="flex justify-between items-center px-5 py-4 border-b border-charcoal/10 bg-cream-dark/20">
        <div className="flex items-center gap-2">
          <span className="text-xs font-syne uppercase tracking-wider text-yellow-dark bg-yellow/10 px-2 py-0.5 rounded font-bold">Ledger Ledger</span>
          <div className="flex items-center gap-1.5 text-xs font-syne uppercase font-bold text-charcoal">
            <ShieldCheck className="w-4.5 h-4.5 text-yellow-dark" />
            <span>Active Permission Ledger</span>
          </div>
        </div>
      </div>

      {/* Permissions List */}
      <div className="flex-1 p-5 overflow-y-auto max-h-[300px] space-y-3 grid-bg min-h-[220px]">
        {activePermissions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-charcoal/30 py-8 text-center select-none">
            <ShieldCheck className="w-8 h-8 opacity-25 mb-1.5" />
            <p className="font-syne text-xs uppercase tracking-wider font-bold">Secure Isolation</p>
            <p className="text-[10px] mt-0.5 opacity-80 leading-relaxed max-w-[200px]">
              No active cross-company context shares or authorization tokens registered. Data is isolated.
            </p>
          </div>
        ) : (
          activePermissions.map((perm, idx) => (
            <div
              key={idx}
              className="p-3.5 bg-cream border border-charcoal/5 hover:border-charcoal/15 rounded-xl space-y-3.5 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-200"
            >
              {/* Top row: Sender ➔ Receiver */}
              <div className="flex items-center justify-between border-b border-charcoal/5 pb-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] font-syne font-extrabold uppercase bg-charcoal text-cream px-1.5 py-0.5 rounded">
                    {perm.senderName}
                  </span>
                  <span className="text-[8px] text-charcoal/40 font-bold uppercase">➔</span>
                  <span className="text-[9px] font-syne font-extrabold uppercase bg-yellow text-charcoal px-1.5 py-0.5 rounded border border-yellow-dark">
                    {perm.receiverName}
                  </span>
                </div>
                <span className="text-[8px] font-syne font-extrabold uppercase tracking-wider text-green-700 bg-green-50 px-1.5 py-0.5 rounded border border-green-150 animate-pulse">
                  Active Share
                </span>
              </div>

              {/* Middle row: Shared Context Details */}
              <div className="space-y-1">
                <div className="text-[9px] font-syne uppercase font-bold text-charcoal/45">Authorized Context Data</div>
                <div className="text-[11px] font-bold text-charcoal flex items-center gap-1.5">
                  <span className="inline-block w-1.5 h-1.5 bg-yellow-dark rounded-full"></span>
                  <span>{perm.badge || 'Folder context logs'}</span>
                </div>
                <p className="text-[10px] text-charcoal/60 leading-relaxed font-semibold">
                  Purpose: {perm.reason}
                </p>
              </div>

              {/* Bottom row: Expiry, Permission Level */}
              <div className="flex justify-between items-center text-[9px] text-charcoal/50 font-bold uppercase pt-1 border-t border-charcoal/5">
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-charcoal/40" />
                  <span>Expires in: 2 Hours</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>Scope:</span>
                  <span className="bg-charcoal/5 px-1.5 py-0.5 rounded font-mono text-[8px] text-charcoal/70">
                    {perm.capability === 'Permission' ? 'Execute Tool' : 'Read-Only'}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

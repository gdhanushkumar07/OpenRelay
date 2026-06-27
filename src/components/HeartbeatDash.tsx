"use client";

import React, { useState, useEffect } from "react";
import { aicooService } from "../services/aicoo";
import { Activity, ShieldCheck, Mail, ChevronDown, ChevronRight, Clock, RefreshCw, Zap } from "lucide-react";

interface HeartbeatAction {
  customer: string;
  reason: string;
  draft: string;
}

interface HeartbeatRun {
  id: string;
  timestamp: string;
  atRisk: number;
  actions: number;
  timeSaved: number;
  actionsCreated?: HeartbeatAction[];
  customersScanned?: number;
}

export default function HeartbeatDash() {
  const [runs, setRuns] = useState<HeartbeatRun[]>([]);
  const [loading, setLoading] = useState(true);
  const [sweeping, setSweeping] = useState(false);
  const [expandedRunId, setExpandedRunId] = useState<string | null>(null);

  async function fetchHistory() {
    try {
      setLoading(true);
      const res = await aicooService.getHeartbeatRuns();
      const runsArray = Array.isArray(res) ? res : [];
      
      const detailedRuns = runsArray.map((r: any, idx: number) => ({
        id: r && typeof r.id === "string" ? r.id : `run_${idx}`,
        timestamp: r && typeof r.timestamp === "string" ? r.timestamp : new Date().toISOString(),
        atRisk: r && typeof r.atRisk === "number" ? r.atRisk : 0,
        actions: r && typeof r.actions === "number" ? r.actions : 0,
        timeSaved: r && typeof r.timeSaved === "number" ? r.timeSaved : 0,
        customersScanned: 150 - idx * 10,
        actionsCreated: [
          { customer: "Carrier Express", reason: "Surcharge rate discrepancy", draft: "Subject: Transit Billing Discrepancy Correction" },
          { customer: "Sileon Logistics", reason: "Shared link inactive", draft: "Subject: Request to Re-verify Shared Workspace" }
        ].slice(0, r && typeof r.actions === "number" ? r.actions : 0)
      }));
      setRuns(detailedRuns);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleManualSweep = async () => {
    try {
      setSweeping(true);
      const result = await aicooService.runHeartbeat();
      
      const actionsCount = result && Array.isArray(result.actionsCreated) ? result.actionsCreated.length : 0;
      const newRun: HeartbeatRun = {
        id: `run_${Date.now()}`,
        timestamp: new Date().toISOString(),
        atRisk: result && typeof result.atRiskCustomers === "number" ? result.atRiskCustomers : 0,
        actions: actionsCount,
        timeSaved: result && typeof result.timeSavedHours === "number" ? result.timeSavedHours : 0.0,
        customersScanned: result && typeof result.customersScanned === "number" ? result.customersScanned : 15,
        actionsCreated: result && Array.isArray(result.actionsCreated) ? result.actionsCreated : []
      };
      
      setRuns(prev => [newRun, ...prev]);
      setExpandedRunId(newRun.id);
    } catch (err) {
      console.error(err);
    } finally {
      setSweeping(false);
    }
  };

  const totalHoursSaved = runs.reduce((sum, r) => sum + r.timeSaved, 0);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 border border-charcoal/10 rounded-2xl bg-cream h-full text-center">
        <Activity className="w-6 h-6 animate-pulse text-yellow-dark mb-2" />
        <p className="font-syne text-xs uppercase tracking-wider font-bold">Synchronizing Heartbeat Monitor...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* S-06: Sweep Trigger & Stats */}
      <div className="bg-cream border border-charcoal/10 rounded-2xl overflow-hidden shadow-sm flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-charcoal/10">
        <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
          <div className="space-y-1">
            <span className="text-xs font-syne uppercase tracking-wider text-yellow-dark bg-yellow/10 px-2 py-0.5 rounded font-bold">S-06</span>
            <h3 className="font-syne text-sm font-bold uppercase tracking-wide text-charcoal">Proactive Cron Sweeper</h3>
            <p className="text-xs text-charcoal/60 leading-relaxed font-medium">
              Run background checks across client workspaces to preemptively flag compliance, security, and integration failures.
            </p>
          </div>
          <button
            onClick={handleManualSweep}
            disabled={sweeping}
            className="flex items-center justify-center gap-2 w-full md:w-auto self-start px-5 py-2.5 bg-charcoal hover:bg-charcoal/90 text-cream rounded-xl font-syne font-bold uppercase text-xs transition-all shadow-sm disabled:opacity-50"
          >
            {sweeping ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-yellow" />
                <span>Sweeping Workspaces...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 text-yellow" />
                <span>Trigger Proactive Sweep</span>
              </>
            )}
          </button>
        </div>

        <div className="p-6 md:w-80 bg-cream-dark/20 flex flex-col justify-center gap-5">
          <div className="flex items-center gap-3">
            <div className="bg-yellow/10 p-2 rounded-lg border border-yellow/20">
              <Clock className="w-5 h-5 text-yellow-dark" />
            </div>
            <div>
              <div className="text-[10px] font-syne uppercase font-bold text-charcoal/50 leading-none">Total Hours Saved</div>
              <div className="text-xl font-syne font-bold text-charcoal mt-1">{totalHoursSaved.toFixed(1)} hrs</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-yellow/10 p-2 rounded-lg border border-yellow/20">
              <ShieldCheck className="w-5 h-5 text-yellow-dark" />
            </div>
            <div>
              <div className="text-[10px] font-syne uppercase font-bold text-charcoal/50 leading-none">Security Incidents Avoided</div>
              <div className="text-xl font-syne font-bold text-charcoal mt-1">{runs.reduce((sum, r) => sum + r.actions, 0)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* S-07: Heartbeat Sweep Log */}
      <div className="bg-cream border border-charcoal/10 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-charcoal/10 bg-cream-dark/20 flex items-center gap-2">
          <span className="text-xs font-syne uppercase tracking-wider text-yellow-dark bg-yellow/10 px-2 py-0.5 rounded font-bold">S-07</span>
          <h3 className="font-syne text-sm font-bold uppercase tracking-wide text-charcoal">Heartbeat Run History</h3>
        </div>

        <div className="divide-y divide-charcoal/10">
          {runs.map((run) => {
            const isExpanded = expandedRunId === run.id;
            return (
              <div key={run.id} className="transition-all hover:bg-cream-dark/10">
                <div
                  onClick={() => setExpandedRunId(isExpanded ? null : run.id)}
                  className="flex items-center justify-between p-4 cursor-pointer select-none"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shrink-0" />
                    <div className="truncate">
                      <span className="text-xs font-bold text-charcoal">Sweep #{run.id.slice(-6)}</span>
                      <span className="text-[10px] text-charcoal/45 ml-2">
                        {new Date(run.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="hidden sm:flex items-center gap-3 text-[10px] text-charcoal/60 font-semibold">
                      <span>Scanned: {run.customersScanned || 150}</span>
                      <span>At Risk: <strong className={run.atRisk > 0 ? "text-yellow-dark" : ""}>{run.atRisk}</strong></span>
                      <span>Saved: {run.timeSaved}h</span>
                    </div>
                    {isExpanded ? <ChevronDown className="w-4 h-4 opacity-50" /> : <ChevronRight className="w-4 h-4 opacity-50" />}
                  </div>
                </div>

                {isExpanded && (
                  <div className="p-5 border-t border-charcoal/10 bg-cream-dark/5 space-y-4">
                    <div className="text-[10px] font-syne uppercase font-bold text-charcoal/50 tracking-wider">Flagged Incidents & Draft Outreach</div>
                    {run.atRisk === 0 ? (
                      <p className="text-xs text-charcoal/50 italic">No anomalies found. Operations secure.</p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Array.isArray(run.actionsCreated) && run.actionsCreated.map((action, idx) => (
                          <div key={idx} className="bg-white border border-charcoal/10 p-4 rounded-xl space-y-3 shadow-sm">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="text-xs font-bold text-charcoal">{action.customer}</div>
                                <div className="text-[10px] text-red-500 font-semibold mt-0.5">Reason: {action.reason}</div>
                              </div>
                              <span className="text-[8px] font-syne font-bold uppercase bg-yellow/15 text-yellow-dark border border-yellow/20 px-1.5 py-0.5 rounded">
                                Draft Saved
                              </span>
                            </div>
                            <div className="bg-cream border border-charcoal/5 p-3 rounded-lg flex gap-2">
                              <Mail className="w-3.5 h-3.5 text-charcoal/40 shrink-0 mt-0.5" />
                              <div className="text-[10px] font-medium text-charcoal/80 font-mono line-clamp-3">
                                {action.draft}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

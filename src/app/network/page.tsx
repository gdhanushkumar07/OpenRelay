// src/app/network/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import ProcurementPortal from "../../components/ProcurementPortal";
import CustomerJourney from "../../components/CustomerJourney";
import AgentNetwork from "../../components/AgentNetwork";
import CooConversationTimeline from "../../components/CooConversationTimeline";
import CooPermissionLedger from "../../components/CooPermissionLedger";
import CooExplorationPanel from "../../components/CooExplorationPanel";
import NetworkDashboardModals from "../../components/NetworkDashboardModals";
import { Scenario } from "../../lib/scenarios";
import { aicooService } from "../../services/aicoo";
import { clearApiLogs } from "../../lib/aicoo";
import ErrorBoundary from "../../components/ErrorBoundary";
import { Play, Pause, ShieldCheck } from "lucide-react";

export default function NetworkPage() {
  const [activeScenario, setActiveScenario] = useState<Scenario | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [coordinationState, setCoordinationState] = useState<'idle' | 'submitting' | 'center'>('idle');
  const [submittingStatus, setSubmittingStatus] = useState<string>("");

  // Modal & notification states
  const [showBriefingModal, setShowBriefingModal] = useState<boolean>(false);
  const [showHealthModal, setShowHealthModal] = useState<boolean>(false);
  const [heartbeatAlert, setHeartbeatAlert] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'permissions' | 'inspector'>('permissions');

  const runLiveWorkflow = async (sc: Scenario) => {
    setActiveScenario(sc);
    setCurrentStepIndex(-1);
    setIsPlaying(false);
    setHeartbeatAlert(null);
    setIsExecuting(true);
    setCoordinationState('submitting');

    // Clear logs from previous sessions
    clearApiLogs();

    const transitionStatusMessages = [
      "Establishing Aicoo Identity certificates...",
      "Exchanging cryptographic handshakes with Supplier AI COOs...",
      "Resolving secure routing context boundaries...",
      "Activating B2B Coordination Center..."
    ];

    for (let i = 0; i < transitionStatusMessages.length; i++) {
      setSubmittingStatus(transitionStatusMessages[i]);
      await new Promise(r => setTimeout(r, 700));
    }

    setCoordinationState('center');

    try {
      for (let idx = 0; idx < sc.steps.length; idx++) {
        const step = sc.steps[idx];
        setCurrentStepIndex(idx);

        if (step.apiCallPath) {
          if (step.apiCallMethod === 'POST') {
            if (step.apiCallPath === '/init') {
              await aicooService.init();
            } else if (step.apiCallPath === '/accumulate') {
              await aicooService.accumulate(step.payload);
            } else if (step.apiCallPath === '/chat') {
              await aicooService.chat(step.payload.message);
            } else if (step.apiCallPath === '/briefing') {
              await aicooService.generateBriefing(step.payload);
            } else if (step.apiCallPath === '/briefing/matrix') {
              await aicooService.getMatrix(step.payload);
            } else if (step.apiCallPath === '/share/create') {
              await aicooService.createShareLink(step.payload);
            } else if (step.apiCallPath === '/tools') {
              await aicooService.executeTool(step.payload.tool, step.payload.params);
            }
          } else if (step.apiCallMethod === 'DELETE') {
            await aicooService.revokeShareLink('link_abc789');
          } else if (step.apiCallMethod === 'GET') {
            await aicooService.contextStatus();
          }
        }

        // Outage Failover heartbeat trigger alert
        if (sc.id === "supplier-outage-recovery" && idx === 2) {
          setHeartbeatAlert("Supplier Alpha heartbeat failure. Sourcing failover initiated to backup Supplier Beta AI COO.");
        }

        // High-Value Escalation (Step 3)
        if (sc.id === "high-value-procurement" && idx === 3) {
          setIsExecuting(false);
          setShowBriefingModal(true);
          return; 
        }

        await new Promise((resolve) => setTimeout(resolve, 2400));
      }
    } catch (err) {
      console.error("Error executing live workflow:", err);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleSignOff = async () => {
    setShowBriefingModal(false);
    if (activeScenario && activeScenario.id === "high-value-procurement") {
      setIsExecuting(true);
      try {
        for (let idx = 4; idx < activeScenario.steps.length; idx++) {
          const step = activeScenario.steps[idx];
          setCurrentStepIndex(idx);
          if (step.apiCallPath) {
            await aicooService.executeTool(step.payload.tool, step.payload.params);
          }
          await new Promise(r => setTimeout(r, 2200));
        }
      } catch (err) {
        console.error("Error executing post-escalation steps:", err);
      } finally {
        setIsExecuting(false);
      }
    }
  };

  const handleReset = () => {
    setActiveScenario(null);
    setCurrentStepIndex(-1);
    setIsPlaying(false);
    setIsExecuting(false);
    setHeartbeatAlert(null);
    setShowBriefingModal(false);
    setShowHealthModal(false);
    setCoordinationState('idle');
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col relative">
      {/* Top Navigation */}
      <Navbar />

      <main className="flex-1 p-6 max-w-7xl w-full mx-auto flex flex-col gap-6">
        {coordinationState === 'idle' ? (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-cream border border-charcoal/10 rounded-2xl p-5 flex gap-3 shadow-sm items-start">
              <div className="bg-yellow/10 p-2 rounded-lg border border-yellow/20 text-yellow-dark mt-0.5">
                <ShieldCheck className="w-4.5 h-4.5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-syne uppercase font-bold text-charcoal">VendorFlow Enterprise Sourcing</h4>
                <p className="text-xs text-charcoal/60 leading-relaxed font-semibold">
                  Select and submit high-volume requisition orders. Independent corporate AI COOs will coordinate context, secure permissions, and manage logistics automatically using Aicoo.
                </p>
              </div>
            </div>

            <ErrorBoundary fallbackTitle="Procurement Portal Error">
              <ProcurementPortal onSelectScenario={runLiveWorkflow} />
            </ErrorBoundary>
          </div>
        ) : coordinationState === 'submitting' ? (
          <div className="flex-1 flex flex-col items-center justify-center py-32 space-y-6 animate-in fade-in duration-300 text-center max-w-md mx-auto">
            <div className="w-10 h-10 border-4 border-yellow-dark border-t-transparent rounded-full animate-spin"></div>
            <div className="space-y-2">
              <h3 className="font-syne text-xs uppercase font-extrabold text-charcoal">Procurement Request Submitted</h3>
              <p className="text-xs text-charcoal/60 leading-relaxed font-semibold">
                Your organization's AI COO is now coordinating with external organizations.
              </p>
              <p className="text-[10px] font-mono text-yellow-dark uppercase font-bold animate-pulse pt-3">
                {submittingStatus}
              </p>
            </div>
          </div>
        ) : (
          /* Split Screen Layout */
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-cream border border-charcoal/10 px-5 py-3 rounded-2xl">
              <div className="flex items-center gap-2.5">
                <span className="text-[9px] font-mono bg-charcoal/5 px-2 py-0.5 rounded font-bold text-charcoal/40 uppercase">Coordination Center</span>
                <h3 className="font-syne text-xs uppercase font-extrabold text-charcoal">{activeScenario?.name}</h3>
              </div>

              {isExecuting ? (
                <div className="flex items-center gap-2.5 text-xs font-semibold text-charcoal/70 bg-charcoal/5 px-3.5 py-1.5 rounded-lg border border-charcoal/10">
                  <div className="w-3.5 h-3.5 border-2 border-charcoal border-t-transparent rounded-full animate-spin"></div>
                  <span className="font-mono text-[10px] tracking-tight uppercase">Executing Live Aicoo API...</span>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-syne font-bold text-charcoal/50 uppercase">Visual Replay:</span>
                  <button
                    onClick={() => {
                      if (activeScenario && currentStepIndex === activeScenario.steps.length - 1) {
                        setCurrentStepIndex(-1);
                      }
                      setIsPlaying(!isPlaying);
                    }}
                    className="flex items-center gap-1.5 px-4 py-1.5 bg-yellow text-charcoal rounded-lg hover:bg-yellow-dark transition-all font-syne font-bold uppercase text-[10px] shadow-sm border border-yellow-dark"
                  >
                    {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{isPlaying ? "Pause Replay" : "Start Replay"}</span>
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* Left Side: Customer Timeline */}
              <div className="lg:col-span-4">
                <ErrorBoundary fallbackTitle="Customer Timeline Error">
                  <CustomerJourney
                    scenario={activeScenario as Scenario}
                    currentStepIndex={currentStepIndex}
                    onStepClick={(idx) => {
                      setCurrentStepIndex(idx);
                      setActiveTab('inspector');
                    }}
                    onReset={handleReset}
                    isPlaying={isPlaying}
                    setIsPlaying={setIsPlaying}
                    onOpenBriefing={() => setShowBriefingModal(true)}
                  />
                </ErrorBoundary>
              </div>

              {/* Right Side: Operations Control Room */}
              <div className="lg:col-span-8 flex flex-col gap-6">
                <div className="flex-1">
                  <ErrorBoundary fallbackTitle="Agent Network Topology Error">
                    <AgentNetwork
                      activeScenario={activeScenario as Scenario}
                      currentStepIndex={currentStepIndex}
                      isPlaying={isPlaying}
                      setIsPlaying={setIsPlaying}
                      setCurrentStepIndex={setCurrentStepIndex}
                      hideControls={true}
                    />
                  </ErrorBoundary>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="min-h-[220px]">
                    <ErrorBoundary fallbackTitle="Conversation Timeline Error">
                      <CooConversationTimeline
                        scenario={activeScenario as Scenario}
                        currentStepIndex={currentStepIndex}
                      />
                    </ErrorBoundary>
                  </div>
                  
                  <div className="min-h-[220px] flex flex-col bg-cream border border-charcoal/10 rounded-2xl overflow-hidden shadow-sm">
                    {/* Tab Header bar */}
                    <div className="flex border-b border-charcoal/10 bg-cream-dark/10 text-xs font-syne font-bold uppercase select-none">
                      <button
                        onClick={() => setActiveTab('permissions')}
                        className={`flex-1 py-3 text-center border-r border-charcoal/10 transition-all ${
                          activeTab === 'permissions' ? 'bg-cream text-yellow-dark' : 'text-charcoal/50 hover:bg-cream-dark/5'
                        }`}
                      >
                        Permission Ledger
                      </button>
                      <button
                        onClick={() => setActiveTab('inspector')}
                        className={`flex-1 py-3 text-center transition-all ${
                          activeTab === 'inspector' ? 'bg-cream text-yellow-dark' : 'text-charcoal/50 hover:bg-cream-dark/5'
                        }`}
                      >
                        Coordination Inspector
                      </button>
                    </div>
                    {/* Tab Content */}
                    <div className="flex-1 min-h-[180px]">
                      {activeTab === 'permissions' ? (
                        <ErrorBoundary fallbackTitle="Permission Ledger Error">
                          <CooPermissionLedger
                            scenario={activeScenario as Scenario}
                            currentStepIndex={currentStepIndex}
                          />
                        </ErrorBoundary>
                      ) : (
                        <ErrorBoundary fallbackTitle="Coordination Inspector Error">
                          <CooExplorationPanel
                            scenario={activeScenario as Scenario}
                            currentStepIndex={currentStepIndex}
                          />
                        </ErrorBoundary>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <NetworkDashboardModals
        showBriefingModal={showBriefingModal}
        setShowBriefingModal={setShowBriefingModal}
        showHealthModal={showHealthModal}
        setShowHealthModal={setShowHealthModal}
        heartbeatAlert={heartbeatAlert}
        setHeartbeatAlert={setHeartbeatAlert}
        activeScenario={activeScenario}
        currentStepIndex={currentStepIndex}
        handleSignOff={handleSignOff}
      />
    </div>
  );
}

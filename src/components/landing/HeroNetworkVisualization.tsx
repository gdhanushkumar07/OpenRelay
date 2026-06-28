// src/components/landing/HeroNetworkVisualization.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Building2, ShoppingCart, ShieldCheck, Truck, Warehouse, 
  CreditCard, Shield, RefreshCw, Lock
} from "lucide-react";

interface Node {
  id: string;
  name: string;
  role: string;
  icon: React.ElementType;
  x: number; // percentage
  y: number; // percentage
  color: string;
}

const NODES: Node[] = [
  { id: "buyer", name: "Buyer Company", role: "Procurement Agent", icon: Building2, x: 15, y: 22, color: "from-blue-600 to-indigo-600" },
  { id: "marketplace", name: "Marketplace", role: "Order Gateway", icon: ShoppingCart, x: 48, y: 18, color: "from-amber-500 to-yellow-500" },
  { id: "alpha", name: "Supplier Alpha", role: "Primary Stock", icon: ShieldCheck, x: 82, y: 22, color: "from-emerald-600 to-teal-600" },
  { id: "beta", name: "Supplier Beta", role: "Failover Stock", icon: RefreshCw, x: 82, y: 52, color: "from-purple-600 to-indigo-600" },
  { id: "warehouse", name: "Warehouse", role: "Storage Agent", icon: Warehouse, x: 50, y: 52, color: "from-orange-500 to-amber-600" },
  { id: "courier", name: "Courier", role: "Logistics Agent", icon: Truck, x: 18, y: 54, color: "from-cyan-600 to-blue-600" },
  { id: "finance", name: "Finance", role: "Billing Agent", icon: CreditCard, x: 30, y: 82, color: "from-green-600 to-emerald-600" },
  { id: "insurance", name: "Insurance", role: "Risk Underwriter", icon: Shield, x: 70, y: 82, color: "from-rose-600 to-pink-600" }
];

interface CoordinationStep {
  from: string;
  to: string;
  label: string;
  status: string;
}

const COORDINATION_FLOW: CoordinationStep[] = [
  { from: "buyer", to: "marketplace", label: "01 / Requisition", status: "Buyer submits order requisition context" },
  { from: "marketplace", to: "alpha", label: "02 / Stock Audit", status: "Auditing inventory at Supplier Alpha" },
  { from: "alpha", to: "warehouse", label: "03 / Allocation", status: "Allocating warehouse packing items" },
  { from: "warehouse", to: "finance", label: "04 / Settlement", status: "Finance Agent verifying escrow deposit" },
  { from: "finance", to: "insurance", label: "05 / Underwriting", status: "Generating cargo transit policy coverage" },
  { from: "insurance", to: "courier", label: "06 / Scheduling", status: "Courier scheduling express delivery route" },
  { from: "courier", to: "marketplace", label: "07 / Transit Active", status: "Updating Marketplace routing status log" },
  { from: "marketplace", to: "buyer", label: "08 / Handshake Complete", status: "Order verified and handshaked securely" }
];

const PIPELINE_STEPS = [
  "Identity Verified",
  "Policy Validated",
  "Session Created",
  "Inventory Reserved",
  "Payment Approved",
  "Insurance Generated",
  "Courier Assigned",
  "Handshake Completed"
];

interface Packet {
  id: number;
  fromNode: Node;
  toNode: Node;
  label: string;
  progress: number;
}

export default function HeroNetworkVisualization() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const [flowIndex, setFlowIndex] = useState(0);
  const [packet, setPacket] = useState<Packet | null>(null);
  
  // Hover and Telemetry states
  const [hoveredNode, setHoveredNode] = useState<Node | null>(null);
  const [latency, setLatency] = useState(8);
  const [reqsPerSec, setReqsPerSec] = useState(13.5);
  const [messagesRouted, setMessagesRouted] = useState(482);
  const [secureSessions, setSecureSessions] = useState(128);

  // Mouse Parallax effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const moveX = (e.clientX - centerX) / 30;
    const moveY = (e.clientY - centerY) / 30;
    setParallax({ x: moveX, y: moveY });
  };

  const handleMouseLeave = () => {
    setParallax({ x: 0, y: 0 });
  };

  // Telemetry fluctuation effect
  useEffect(() => {
    const timer = setInterval(() => {
      setLatency(Math.floor(Math.random() * 6) + 6);
      setReqsPerSec(12.4 + Math.random() * 2.1);
      setMessagesRouted(prev => prev + Math.floor(Math.random() * 2) + 1);
      setSecureSessions(prev => prev + (Math.random() > 0.85 ? 1 : 0));
    }, 1800);
    return () => clearInterval(timer);
  }, []);

  // Structured coordination flow sequence loop
  useEffect(() => {
    let packetId = 0;

    const startPacketAnimation = (stepIdx: number) => {
      const step = COORDINATION_FLOW[stepIdx];
      const fromNode = NODES.find(n => n.id === step.from);
      const toNode = NODES.find(n => n.id === step.to);

      if (fromNode && toNode) {
        setPacket({
          id: packetId++,
          fromNode,
          toNode,
          label: step.label.split(" / ")[1],
          progress: 0
        });
      }
    };

    // Initialize first step
    startPacketAnimation(0);

    const interval = setInterval(() => {
      setFlowIndex((prevIdx) => {
        const nextIdx = (prevIdx + 1) % COORDINATION_FLOW.length;
        startPacketAnimation(nextIdx);
        return nextIdx;
      });
    }, 3200);

    // Frame rate progress updater
    const progressTimer = setInterval(() => {
      setPacket((prev) => {
        if (!prev) return null;
        if (prev.progress >= 1) return prev;
        return { ...prev, progress: prev.progress + 0.015 };
      });
    }, 25);

    return () => {
      clearInterval(interval);
      clearInterval(progressTimer);
    };
  }, []);

  const checkConnection = (id1: string, id2: string) => {
    const validPairs = [
      ["buyer", "marketplace"], ["buyer", "courier"], ["buyer", "insurance"],
      ["marketplace", "alpha"], ["marketplace", "beta"], ["marketplace", "warehouse"],
      ["alpha", "beta"], ["warehouse", "courier"], ["courier", "finance"],
      ["finance", "insurance"], ["insurance", "alpha"]
    ];
    return validPairs.some(
      ([p1, p2]) => (p1 === id1 && p2 === id2) || (p1 === id2 && p2 === id1)
    );
  };

  const activeStep = COORDINATION_FLOW[flowIndex];

  const getNodeState = (nodeId: string) => {
    if (activeStep.from === nodeId) return "Responding";
    if (activeStep.to === nodeId) return "Processing";
    
    const fromIdx = COORDINATION_FLOW.findIndex(s => s.from === nodeId);
    if (fromIdx !== -1 && fromIdx < flowIndex) return "Completed";
    
    return "Idle";
  };

  const getActiveOperation = (nodeId: string) => {
    const state = getNodeState(nodeId);
    if (state === "Processing" || state === "Responding") {
      switch (nodeId) {
        case "buyer": return "Creating Purchase Intent";
        case "marketplace": return "Routing Secure Session";
        case "alpha": return "Checking Inventory";
        case "warehouse": return "Allocating Stock";
        case "finance": return "Verifying Payment";
        case "insurance": return "Generating Coverage";
        case "courier": return "Scheduling Delivery";
        default: return "Standby";
      }
    }
    return state === "Completed" ? "Context Shared" : "Standby";
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="w-full h-full min-h-[460px] lg:min-h-[540px] flex items-center justify-center p-2 sm:p-4 perspective-1000 select-none"
    >
      {/* CSS stylesheet inline injection */}
      <style>{`
        @keyframes node-breathe {
          0%, 100% { transform: scale(1); filter: drop-shadow(0 0 5px rgba(242, 201, 76, 0.08)); }
          50% { transform: scale(1.02); filter: drop-shadow(0 0 12px rgba(242, 201, 76, 0.3)); }
        }
        @keyframes active-dash {
          to {
            stroke-dashoffset: -20;
          }
        }
        .animate-node-pulse {
          animation: node-breathe 4s ease-in-out infinite;
        }
        .animated-mesh-path {
          animation: active-dash 1.2s linear infinite;
        }
        .grid-mesh-glow {
          background-size: 20px 20px;
          background-image: radial-gradient(circle, rgba(255,255,255,0.015) 1px, transparent 1px);
        }
      `}</style>

      {/* Browser mockup window style frame */}
      <div
        className="w-full max-w-[760px] bg-charcoal text-cream rounded-2xl border border-white/15 shadow-2xl overflow-hidden transition-transform duration-300 ease-out flex flex-col relative"
        style={{
          transform: `rotateY(${parallax.x}deg) rotateX(${-parallax.y}deg) translateY(${parallax.y * 0.4}px)`
        }}
      >
        {/* Browser Header Bar */}
        <div className="bg-charcoal-light px-4 py-3 border-b border-white/10 flex items-center justify-between z-20">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            <span className="ml-2 text-[11px] font-mono text-white/45 font-medium hidden sm:inline">
              openrelay.network/coordination-stream
            </span>
          </div>
          
          <div className="flex items-center gap-2.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-[10px] font-bold text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
            <span>LIVE</span>
            <span className="text-white/20">|</span>
            <span className="text-white/70 font-semibold">AICOO Protocol Active</span>
            <span className="text-white/20">|</span>
            <span className="text-yellow font-extrabold uppercase">Encrypted</span>
            <span className="text-white/20">|</span>
            <span className="text-white/50 font-mono">RTT: {latency}ms</span>
          </div>
        </div>

        {/* Visualized Canvas Area */}
        <div className="relative w-full h-[400px] sm:h-[460px] lg:h-[500px] bg-[#0b0c0e] grid-mesh-glow overflow-hidden p-4">
          
          {/* Radial ambient lighting effects */}
          <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-yellow/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

          {/* Live Protocol Pipeline Checklist */}
          <div className="absolute top-4 left-4 z-20 p-4 bg-charcoal/90 border border-white/10 backdrop-blur-md rounded-2xl shadow-xl text-[10px] space-y-2.5 min-w-[155px]">
            <div className="flex items-center gap-1.5 text-[8px] font-mono text-yellow font-extrabold uppercase tracking-widest border-b border-white/5 pb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow animate-ping shrink-0" />
              <span>Aicoo Pipeline</span>
            </div>
            <div className="space-y-1.5">
              {PIPELINE_STEPS.map((stepName, idx) => {
                const isActive = flowIndex === idx;
                const isCompleted = flowIndex > idx;
                return (
                  <div key={idx} className={`flex items-center gap-2 transition-all duration-300 ${
                    isActive ? "text-yellow font-extrabold scale-[1.02]" : isCompleted ? "text-emerald-400" : "text-white/30"
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                      isActive ? "bg-yellow animate-pulse" : isCompleted ? "bg-emerald-400" : "bg-white/10"
                    }`} />
                    <span className="truncate text-[9.5px]">{stepName}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Live Enterprise Metrics Telemetry */}
          <div className="absolute bottom-4 right-4 z-20 p-4 bg-charcoal/90 border border-white/10 backdrop-blur-md rounded-2xl shadow-xl text-[10px] space-y-3 min-w-[190px]">
            <div className="flex items-center justify-between text-[8px] font-mono text-blue-400 font-extrabold uppercase tracking-widest border-b border-white/5 pb-2">
              <span>Telemetry Monitor</span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-3 font-semibold text-white/70">
              <div>
                <div className="text-[7.5px] text-white/35 uppercase">Latency</div>
                <div className="text-white font-mono text-[11px] mt-0.5">{latency}ms</div>
              </div>
              <div>
                <div className="text-[7.5px] text-white/35 uppercase">Req / Sec</div>
                <div className="text-white font-mono text-[11px] mt-0.5">{reqsPerSec.toFixed(1)}</div>
              </div>
              <div>
                <div className="text-[7.5px] text-white/35 uppercase">Routed Msg</div>
                <div className="text-white font-mono text-[11px] mt-0.5">{messagesRouted}</div>
              </div>
              <div>
                <div className="text-[7.5px] text-white/35 uppercase">Sessions</div>
                <div className="text-white font-mono text-[11px] mt-0.5">{secureSessions}</div>
              </div>
            </div>

            <div className="border-t border-white/5 pt-2 flex items-center justify-between text-[8.5px] text-white/40">
              <span>Security: <span className="text-emerald-400 font-mono">99.8%</span></span>
              <span>v1.2.4-active</span>
            </div>
          </div>

          {/* SVG Pipelines & Packets */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            {/* Draw pipeline connections */}
            {NODES.map((node, i) =>
              NODES.slice(i + 1).map((target) => {
                const isConnected = checkConnection(node.id, target.id);
                if (!isConnected) return null;

                // Check if connection is actively routing current step
                const isActivePath = 
                  (activeStep.from === node.id && activeStep.to === target.id) ||
                  (activeStep.from === target.id && activeStep.to === node.id);

                return (
                  <g key={`${node.id}-${target.id}`}>
                    {/* Base connection line */}
                    <line
                      x1={`${node.x}%`}
                      y1={`${node.y}%`}
                      x2={`${target.x}%`}
                      y2={`${target.y}%`}
                      stroke={isActivePath ? "rgba(242, 201, 76, 0.4)" : "rgba(255, 255, 255, 0.08)"}
                      strokeWidth={isActivePath ? "2" : "1.5"}
                      strokeDasharray={isActivePath ? "none" : "4 4"}
                      className={isActivePath ? "animated-mesh-path" : ""}
                    />
                    {/* Secondary glow trace */}
                    {isActivePath && (
                      <line
                        x1={`${node.x}%`}
                        y1={`${node.y}%`}
                        x2={`${target.x}%`}
                        y2={`${target.y}%`}
                        stroke="rgba(242, 201, 76, 0.45)"
                        strokeWidth="7"
                        className="blur-xs opacity-75"
                      />
                    )}
                  </g>
                );
              })
            )}

            {/* Render moving packets */}
            {packet && (
              <g key={packet.id}>
                {/* Linear interpolation for coordinate calculation */}
                {(() => {
                  const x = packet.fromNode.x + (packet.toNode.x - packet.fromNode.x) * packet.progress;
                  const y = packet.fromNode.y + (packet.toNode.y - packet.fromNode.y) * packet.progress;
                  return (
                    <>
                      <circle cx={`${x}%`} cy={`${y}%`} r="6" fill="#f2c94c" className="animate-ping opacity-75" />
                      <circle cx={`${x}%`} cy={`${y}%`} r="4.5" fill="#f2c94c" className="shadow-lg" />
                      <circle cx={`${x}%`} cy={`${y}%`} r="2" fill="#0e0f12" />
                    </>
                  );
                })()}
              </g>
            )}
          </svg>

          {/* Floating Nodes */}
          {NODES.map((node) => {
            const Icon = node.icon;
            const state = getNodeState(node.id);
            const isActive = state === "Processing" || state === "Responding";
            const isCompleted = state === "Completed";

            let borderClass = "border-white/10";
            let glowShadow = "";
            let dotColor = "bg-white/10";
            let nodeOpacity = "opacity-40 scale-95";
            
            if (state === "Processing") {
              borderClass = "border-blue-400";
              glowShadow = "shadow-lg shadow-blue-500/10";
              dotColor = "bg-blue-400";
              nodeOpacity = "opacity-100 scale-105 animate-node-pulse";
            } else if (state === "Responding") {
              borderClass = "border-yellow";
              glowShadow = "shadow-lg shadow-yellow/10";
              dotColor = "bg-yellow";
              nodeOpacity = "opacity-100 scale-105 animate-node-pulse";
            } else if (isCompleted) {
              borderClass = "border-emerald-500/30";
              glowShadow = "";
              dotColor = "bg-emerald-400";
              nodeOpacity = "opacity-85 scale-100";
            }

            return (
              <div
                key={node.id}
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 z-10 transition-all duration-500 ${nodeOpacity}`}
                onMouseEnter={() => setHoveredNode(node)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                <div
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl bg-charcoal/95 border ${borderClass} ${glowShadow} backdrop-blur-md transition-all relative cursor-pointer`}
                >
                  {/* Status Indicator Dot */}
                  {isActive && (
                    <span className={`absolute -top-1 -right-1 w-2.5 h-2.5 ${dotColor} border border-charcoal rounded-full animate-ping z-30`} />
                  )}
                  {(isActive || isCompleted) && (
                    <span className={`absolute -top-1 -right-1 w-2.5 h-2.5 ${dotColor} border border-charcoal rounded-full z-30`} />
                  )}

                  {/* Marketplace live activity ring */}
                  {node.id === "marketplace" && (
                    <span className="absolute inset-0 rounded-xl border border-yellow/30 animate-ping opacity-25" style={{ animationDuration: '3s' }} />
                  )}

                  <div className={`p-1.5 rounded-lg bg-gradient-to-br ${node.color} text-white shrink-0 shadow-sm`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0 pr-1">
                    <div className="text-[11px] font-bold text-white tracking-tight leading-none truncate">
                      {node.name}
                    </div>
                    <div className="text-[8.5px] font-medium text-white/50 leading-none mt-1 truncate">
                      {isActive ? getActiveOperation(node.id) : node.role}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Floating Data Badge */}
          {packet && packet.progress > 0.15 && packet.progress < 0.85 && (
            <div
              style={{
                left: `${packet.fromNode.x + (packet.toNode.x - packet.fromNode.x) * packet.progress}%`,
                top: `${packet.fromNode.y + (packet.toNode.y - packet.fromNode.y) * packet.progress - 7}%`
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none animate-in fade-in duration-200"
            >
              <div className="px-2.5 py-1 rounded-full bg-yellow text-charcoal font-bold text-[9px] uppercase tracking-wider shadow-lg border border-yellow-dark flex items-center gap-1.5">
                <Lock className="w-2.5 h-2.5 text-charcoal" />
                <span>{packet.label}</span>
              </div>
            </div>
          )}

          {/* Lightweight Floating Tooltip */}
          {hoveredNode && (
            <div 
              className="absolute z-30 p-3 bg-charcoal/95 border border-white/10 backdrop-blur-md rounded-xl shadow-2xl text-[9.5px] space-y-1.5 text-white/80 pointer-events-none transition-all duration-200 w-48 font-semibold"
              style={{
                left: `${hoveredNode.x > 50 ? hoveredNode.x - 22 : hoveredNode.x + 2}%`,
                top: `${hoveredNode.y > 50 ? hoveredNode.y - 12 : hoveredNode.y + 2}%`,
              }}
            >
              <div className="font-extrabold text-white border-b border-white/5 pb-1">
                {hoveredNode.name}
              </div>
              <div><span className="text-white/40">Role:</span> {hoveredNode.role}</div>
              <div><span className="text-white/40">Current Op:</span> {getActiveOperation(hoveredNode.id)}</div>
              <div><span className="text-white/40">Status:</span> {getNodeState(hoveredNode.id)}</div>
              <div>
                <span className="text-white/40">Scope:</span>{" "}
                <span className="text-yellow font-mono text-[9px]">
                  {hoveredNode.id === "buyer" ? "Read/Write" : "Read-Scoped"}
                </span>
              </div>
              <div className="flex justify-between border-t border-white/5 pt-1 text-[8.5px] text-white/40">
                <span>RTT: {latency + (hoveredNode.id === "buyer" ? 0 : 2)}ms</span>
                <span>STATUS 200 OK</span>
              </div>
            </div>
          )}

        </div>

        {/* Browser Footer Status Bar */}
        <div className="bg-charcoal-light px-4 py-3 border-t border-white/10 flex items-center justify-between text-[11px] z-20 flex-wrap gap-2">
          <div className="flex items-center gap-3 text-white/50 flex-wrap">
            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
              <Lock className="w-3.5 h-3.5 shrink-0" />
              <span>Context Isolated</span>
            </span>
            <span className="text-white/20">•</span>
            <span className="flex items-center gap-1">
              <span>✓ Identity Verified</span>
            </span>
            <span className="text-white/20">•</span>
            <span className="flex items-center gap-1">
              <span>✓ Policy Verified</span>
            </span>
            <span className="text-white/20">•</span>
            <span className="flex items-center gap-1 text-yellow">
              <span>⚡ Secure Relay Active</span>
            </span>
            <span className="text-white/20">•</span>
            <span className="font-mono text-white/40">256-bit AES</span>
            <span className="text-white/20">•</span>
            <span className="text-white/40">8 Nodes Mesh Connected</span>
          </div>
          <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest">
            Protocol v1.2
          </div>
        </div>
      </div>
    </div>
  );
}

// src/components/landing/HeroNetworkVisualization.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Building2, ShoppingCart, ShieldCheck, Truck, Warehouse, 
  CreditCard, Shield, RefreshCw, CheckCircle2, Zap, Lock
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
  { from: "buyer", to: "marketplace", label: "01 / Requisition Submitted", status: "Buyer Procurement Agent requests 2x Headphones" },
  { from: "marketplace", to: "alpha", label: "02 / Primary Stock Audit", status: "Checking inventory at Supplier Alpha (1 unit found, 1 deficit)" },
  { from: "marketplace", to: "beta", label: "03 / Stock Failover Routing", status: "Aicoo securely borrows backup stock from Supplier Beta" },
  { from: "marketplace", to: "warehouse", label: "04 / Warehouse Allocation", status: "Vision Warehouse assigns storage aisle A-12 for packaging" },
  { from: "warehouse", to: "courier", label: "05 / Transit Route Dispatch", status: "Prime Logistics schedules express freight delivery" },
  { from: "courier", to: "finance", label: "06 / Smart Escrow Settlement", status: "Clearing payment verification via cryptographic proof" },
  { from: "finance", to: "insurance", label: "07 / Transit Risk Underwrite", status: "Sky Insurance applies SLA cargo transit policy coverage" },
  { from: "insurance", to: "buyer", label: "08 / Handshake Finalized", status: "End-to-End workflow completed securely under Aicoo" }
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
          0%, 100% { transform: scale(1); filter: drop-shadow(0 0 5px rgba(242, 201, 76, 0.1)); }
          50% { transform: scale(1.03); filter: drop-shadow(0 0 15px rgba(242, 201, 76, 0.35)); }
        }
        @keyframes pulse-active-connection {
          0%, 100% { stroke-opacity: 0.2; }
          50% { stroke-opacity: 0.8; stroke: #f2c94c; }
        }
        .animate-node-pulse {
          animation: node-breathe 4s ease-in-out infinite;
        }
        .animate-active-path {
          animation: pulse-active-connection 2s ease-in-out infinite;
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
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-yellow uppercase">
              <Zap className="w-3 h-3 text-yellow animate-pulse shrink-0" />
              <span>Aicoo Mesh Live</span>
            </div>
            <div className="text-[10px] font-mono text-white/35 hidden md:inline">
              RTT: 8ms
            </div>
          </div>
        </div>

        {/* Visualized Canvas Area */}
        <div className="relative w-full h-[400px] sm:h-[460px] lg:h-[500px] bg-[#0b0c0e] grid-mesh-glow overflow-hidden p-4">
          
          {/* Radial ambient lighting effects */}
          <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-yellow/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

          {/* Active Flow Status Overlay Box */}
          <div className="absolute top-4 left-4 z-20 px-3.5 py-2.5 bg-charcoal/90 border border-yellow/20 backdrop-blur-md rounded-xl shadow-lg text-[10px] font-semibold text-white max-w-[270px] animate-in fade-in duration-300">
            <div className="flex items-center gap-1.5 text-[8px] font-mono text-yellow font-extrabold uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow animate-ping shrink-0" />
              <span>Aicoo Pipeline Status</span>
            </div>
            <p className="mt-1 font-bold text-white uppercase text-[9px] tracking-wide leading-tight">
              {activeStep.label}
            </p>
            <p className="text-[9px] text-white/60 font-semibold leading-normal mt-1">
              {activeStep.status}
            </p>
          </div>

          {/* SVG Pipelines & Packets */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            {/* Draw pipeline connections */}
            {NODES.map((node, i) =>
              NODES.slice(i + 1).map((target, j) => {
                const isConnected = checkConnection(node.id, target.id);
                if (!isConnected) return null;

                // Check if connection is actively routing current step
                const isActivePath = 
                  (activeStep.from === node.id && activeStep.to === target.id) ||
                  (activeStep.from === target.id && activeStep.to === node.id);

                return (
                  <g key={`${node.id}-${target.id}`}>
                    {/* Base grey line */}
                    <line
                      x1={`${node.x}%`}
                      y1={`${node.y}%`}
                      x2={`${target.x}%`}
                      y2={`${target.y}%`}
                      stroke={isActivePath ? "rgba(242, 201, 76, 0.3)" : "rgba(255, 255, 255, 0.08)"}
                      strokeWidth={isActivePath ? "2.5" : "1.5"}
                      strokeDasharray={isActivePath ? "none" : "4 4"}
                      className={isActivePath ? "animate-active-path" : ""}
                    />
                    {/* Secondary thick glow trace */}
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
            const isActive = activeStep.from === node.id || activeStep.to === node.id;
            const isSender = activeStep.from === node.id;
            const isReceiver = activeStep.to === node.id;

            return (
              <div
                key={node.id}
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 z-10 transition-all duration-500 ${
                  isActive ? "scale-105 opacity-100 animate-node-pulse" : "scale-95 opacity-65"
                }`}
              >
                <div
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl bg-charcoal/95 border ${
                    isSender ? "border-yellow shadow-lg shadow-yellow/10" :
                    isReceiver ? "border-blue-400 shadow-lg shadow-blue-500/10" :
                    "border-white/10"
                  } backdrop-blur-md transition-all relative`}
                >
                  {/* Status Indicator Dot */}
                  {isActive && (
                    <span className={`absolute -top-1 -right-1 w-2.5 h-2.5 ${isSender ? "bg-yellow" : "bg-blue-400"} border border-charcoal rounded-full animate-ping z-30`} />
                  )}
                  {isActive && (
                    <span className={`absolute -top-1 -right-1 w-2.5 h-2.5 ${isSender ? "bg-yellow" : "bg-blue-400"} border border-charcoal rounded-full z-30`} />
                  )}

                  <div className={`p-1.5 rounded-lg bg-gradient-to-br ${node.color} text-white shrink-0 shadow-sm`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0 pr-1">
                    <div className="text-[11px] font-bold text-white tracking-tight leading-none truncate">
                      {node.name}
                    </div>
                    <div className="text-[8.5px] font-medium text-white/50 leading-none mt-1 truncate">
                      {node.role}
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

        </div>

        {/* Browser Footer Activity Status Bar */}
        <div className="bg-charcoal-light px-4 py-3 border-t border-white/10 flex items-center justify-between text-[11px] z-20">
          <div className="flex items-center gap-2 text-white/60">
            <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="font-semibold text-white/80">Context Isolation Protected</span>
            <span className="text-white/30">•</span>
            <span className="text-white/50 hidden sm:inline">Permissioned Cryptographic Relays</span>
          </div>
          <div className="flex items-center gap-1 text-yellow font-bold text-[10px] tracking-wide">
            <span>AICOO PROTOCOL</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 ml-1 shrink-0" />
          </div>
        </div>
      </div>
    </div>
  );
}

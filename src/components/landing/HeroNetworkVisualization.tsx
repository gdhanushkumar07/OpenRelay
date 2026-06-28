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
  isRequest: boolean; // Request (Gold) vs Response (Blue/Green)
}

const COORDINATION_FLOW: CoordinationStep[] = [
  { from: "buyer", to: "marketplace", label: "Purchase Intent", isRequest: true },
  { from: "marketplace", to: "alpha", label: "Secure Routing", isRequest: true },
  { from: "alpha", to: "warehouse", label: "Inventory Check", isRequest: true },
  { from: "warehouse", to: "finance", label: "Reserve Stock", isRequest: true },
  { from: "finance", to: "insurance", label: "Verify Payment", isRequest: true },
  { from: "insurance", to: "courier", label: "Generate Coverage", isRequest: true },
  { from: "courier", to: "marketplace", label: "Assign Delivery", isRequest: false },
  { from: "marketplace", to: "buyer", label: "Order Confirmed", isRequest: false }
];

interface Packet {
  id: number;
  fromNode: Node;
  toNode: Node;
  progress: number;
  isRequest: boolean;
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
    const moveX = (e.clientX - centerX) / 40;
    const moveY = (e.clientY - centerY) / 40;
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
          progress: 0,
          isRequest: step.isRequest
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
    }, 3000);

    // Frame rate progress updater
    const progressTimer = setInterval(() => {
      setPacket((prev) => {
        if (!prev) return null;
        if (prev.progress >= 1) return prev;
        return { ...prev, progress: prev.progress + 0.018 };
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
  const activeNodeId = activeStep.to;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="w-full h-full min-h-[460px] lg:min-h-[540px] flex items-center justify-center p-2 sm:p-4 perspective-1000 select-none"
    >
      <style>{`
        @keyframes node-glow-pulse {
          0%, 100% { filter: drop-shadow(0 0 3px rgba(242, 201, 76, 0.05)); }
          50% { filter: drop-shadow(0 0 10px rgba(242, 201, 76, 0.25)); }
        }
        .animate-active-node {
          animation: node-glow-pulse 3s ease-in-out infinite;
        }
        .grid-mesh-glow {
          background-size: 24px 24px;
          background-image: radial-gradient(circle, rgba(255,255,255,0.012) 1px, transparent 1px);
        }
      `}</style>

      {/* Browser mockup window style frame */}
      <div
        className="w-full max-w-[760px] bg-[#0c0d10] text-cream rounded-2xl border border-white/5 shadow-2xl overflow-hidden transition-transform duration-300 ease-out flex flex-col relative"
        style={{
          transform: `rotateY(${parallax.x}deg) rotateX(${-parallax.y}deg) translateY(${parallax.y * 0.25}px)`
        }}
      >
        {/* Browser Header Bar */}
        <div className="bg-[#0e0f12] px-4 py-3 border-b border-white/5 flex items-center justify-between z-20">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-rose-500/80" />
            <div className="w-2 h-2 rounded-full bg-amber-500/80" />
            <div className="w-2 h-2 rounded-full bg-emerald-500/80" />
            <span className="ml-2 text-[10px] font-mono text-white/20 font-medium hidden sm:inline">
              openrelay.network/observability
            </span>
          </div>
          <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#f2c94c] animate-pulse" />
            <span>Secure Relay</span>
          </div>
        </div>

        {/* Visualized Canvas Area */}
        <div className="relative w-full h-[380px] sm:h-[420px] lg:h-[440px] bg-[#08090b] grid-mesh-glow overflow-hidden p-4">
          
          {/* Subtle soft vignette */}
          <div className="absolute inset-0 bg-radial-gradient pointer-events-none z-10 opacity-30" />

          {/* SVG Pipelines & Packets */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            {NODES.map((node, i) =>
              NODES.slice(i + 1).map((target) => {
                const isConnected = checkConnection(node.id, target.id);
                if (!isConnected) return null;

                const isActivePath = 
                  (activeStep.from === node.id && activeStep.to === target.id) ||
                  (activeStep.from === target.id && activeStep.to === node.id);

                return (
                  <line
                    key={`${node.id}-${target.id}`}
                    x1={`${node.x}%`}
                    y1={`${node.y}%`}
                    x2={`${target.x}%`}
                    y2={`${target.y}%`}
                    stroke={isActivePath ? (activeStep.isRequest ? "rgba(242, 201, 76, 0.5)" : "rgba(56, 189, 248, 0.5)") : "rgba(255, 255, 255, 0.03)"}
                    strokeWidth={isActivePath ? "1.5" : "1"}
                    strokeDasharray={isActivePath ? "none" : "3 3"}
                    className="transition-all duration-300"
                  />
                );
              })
            )}

            {/* Packet Gliding Strictly on Line */}
            {packet && (
              <g key={packet.id}>
                {(() => {
                  const x = packet.fromNode.x + (packet.toNode.x - packet.fromNode.x) * packet.progress;
                  const y = packet.fromNode.y + (packet.toNode.y - packet.fromNode.y) * packet.progress;
                  return (
                    <circle 
                      cx={`${x}%`} 
                      cy={`${y}%`} 
                      r="3" 
                      fill={packet.isRequest ? "#f2c94c" : "#38bdf8"} 
                    />
                  );
                })()}
              </g>
            )}
          </svg>

          {/* Floating Nodes */}
          {NODES.map((node) => {
            const Icon = node.icon;
            const isActive = activeNodeId === node.id;
            const isMarketplace = node.id === "marketplace";

            let borderClass = isMarketplace ? "border-yellow/20" : "border-white/5";
            let nodeScale = isMarketplace ? "scale-105" : "scale-95";
            let nodeOpacity = "opacity-45";
            let activeStyles = "";

            if (isActive) {
              borderClass = activeStep.isRequest ? "border-yellow" : "border-blue-400";
              nodeOpacity = "opacity-100";
              nodeScale = isMarketplace ? "scale-110" : "scale-100";
              activeStyles = "animate-active-node";
            }

            return (
              <div
                key={node.id}
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 z-10 transition-all duration-500 ${nodeScale} ${nodeOpacity} ${activeStyles}`}
              >
                {/* Active Floating Status Chip */}
                {isActive && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-0.5 bg-[#0e0f12] border border-white/10 rounded-full shadow-lg text-[8.5px] text-white/90 font-bold whitespace-nowrap animate-in slide-in-from-bottom-1 duration-200">
                    {activeStep.label}
                  </div>
                )}

                <div
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl bg-[#0e0f12]/95 border ${borderClass} backdrop-blur-md transition-all`}
                >
                  <div className={`p-1.5 rounded-lg bg-gradient-to-br ${node.color} text-white shrink-0`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0 pr-0.5">
                    <div className="text-[10px] font-bold text-white tracking-tight leading-none truncate">
                      {node.name}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Minimal Bottom-Left Legend */}
          <div className="absolute bottom-4 left-4 z-20 p-2.5 bg-[#0e0f12]/80 border border-white/5 backdrop-blur-md rounded-lg text-[8px] font-semibold text-white/40 space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f2c94c]" />
              <span>Gold = Request</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8]" />
              <span>Blue = Response</span>
            </div>
            <div className="flex items-center gap-1.5 pt-0.5">
              <Lock className="w-2.5 h-2.5 text-white/55" />
              <span>Lock = Secure Relay</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

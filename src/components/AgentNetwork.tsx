// src/components/AgentNetwork.tsx
"use client";

import React, { useState, useEffect } from "react";
import { SCENARIOS, Scenario, ScenarioStep } from "../lib/scenarios";
import { 
  Crown, Headphones, CreditCard, Scale, Cpu, Settings, Globe, User, 
  Play, RotateCcw, ChevronRight, ArrowRightLeft, ShieldCheck
} from "lucide-react";

interface Node {
  id: string;
  label: string;
  x: number;
  y: number;
  icon: React.ComponentType<any>;
}

const NODES: Record<string, Node> = {
  customer: { id: "customer", label: "Customer Client", x: 60, y: 220, icon: User } as any,
  support: { id: "support", label: "Buyer AI COO", x: 220, y: 220, icon: Headphones } as any,
  billing: { id: "billing", label: "Finance AI COO", x: 400, y: 220, icon: CreditCard } as any,
  legal: { id: "legal", label: "Insurance AI COO", x: 580, y: 220, icon: Scale } as any,
  ceo: { id: "ceo", label: "Supplier Beta AI COO", x: 400, y: 80, icon: Crown } as any,
  devops: { id: "devops", label: "Warehouse AI COO", x: 220, y: 360, icon: Cpu } as any,
  operations: { id: "operations", label: "Logistics AI COO", x: 400, y: 360, icon: Settings } as any,
  partner: { id: "partner", label: "Supplier Alpha AI COO", x: 740, y: 220, icon: Globe } as any,
};

const EDGES = [
  { from: "customer", to: "support", dashed: false },
  { from: "support", to: "billing", dashed: false },
  { from: "billing", to: "legal", dashed: true },
  { from: "legal", to: "ceo", dashed: true },
  { from: "devops", to: "operations", dashed: true },
  { from: "operations", to: "support", dashed: true },
  { from: "devops", to: "support", dashed: false },
  { from: "billing", to: "partner", dashed: true },
  { from: "partner", to: "devops", dashed: false },
  { from: "operations", to: "ceo", dashed: true },
  { from: "ceo", to: "support", dashed: true },
];

function getNodeColors(id: string) {
  const colorMap: Record<string, { bg: string; fg: string; stroke: string }> = {
    customer: { bg: "#4b5563", fg: "#f4f4f0", stroke: "#4b5563" },     // Grey
    support: { bg: "#121212", fg: "#f4f4f0", stroke: "#121212" },      // Charcoal
    billing: { bg: "#16a34a", fg: "#f4f4f0", stroke: "#16a34a" },      // Green
    legal: { bg: "#ea580c", fg: "#f4f4f0", stroke: "#ea580c" },        // Orange
    partner: { bg: "#eab308", fg: "#121212", stroke: "#eab308" },      // Yellow
    ceo: { bg: "#a855f7", fg: "#f4f4f0", stroke: "#a855f7" },          // Purple
    devops: { bg: "#06b6d4", fg: "#f4f4f0", stroke: "#06b6d4" },       // Cyan
    operations: { bg: "#2563eb", fg: "#f4f4f0", stroke: "#2563eb" }    // Blue
  };
  return colorMap[id] || { bg: "#4b5563", fg: "#f4f4f0", stroke: "#4b5563" };
}

interface AgentNetworkProps {
  onStepTriggered?: (step: ScenarioStep) => void;
  onScenarioReset?: () => void;
  activeScenario?: Scenario | null;
  currentStepIndex?: number;
  isPlaying?: boolean;
  setIsPlaying?: (playing: boolean) => void;
  setCurrentStepIndex?: (index: number) => void;
  hideControls?: boolean;
  activeStats?: { calls: number; syncs: number; links: number };
}

export default function AgentNetwork({ 
  onStepTriggered, 
  onScenarioReset,
  activeScenario,
  currentStepIndex: propStepIndex,
  isPlaying: propIsPlaying,
  setIsPlaying: propSetIsPlaying,
  setCurrentStepIndex: propSetStepIndex,
  hideControls = false,
  activeStats
}: AgentNetworkProps) {
  const [localScenario, setLocalScenario] = useState<Scenario>(SCENARIOS[0]);
  const [localStepIndex, setLocalStepIndex] = useState<number>(-1);
  const [localIsPlaying, setLocalIsPlaying] = useState(false);

  const selectedScenario = activeScenario || localScenario;
  const currentStepIndex = propStepIndex !== undefined ? propStepIndex : localStepIndex;
  const isPlaying = propIsPlaying !== undefined ? propIsPlaying : localIsPlaying;

  const setIsPlaying = propSetIsPlaying || setLocalIsPlaying;
  const setCurrentStepIndex = propSetStepIndex || setLocalStepIndex;

  // Trigger step callback presentationally
  useEffect(() => {
    if (currentStepIndex >= 0 && currentStepIndex < selectedScenario.steps.length) {
      const step = selectedScenario.steps[currentStepIndex];
      if (onStepTriggered) onStepTriggered(step);
    }
  }, [currentStepIndex, selectedScenario]);

  // Autoplay handler (used for replay presentation)
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      if (currentStepIndex < selectedScenario.steps.length - 1) {
        timer = setTimeout(() => {
          setCurrentStepIndex(currentStepIndex + 1);
        }, 2200);
      } else {
        setIsPlaying(false);
      }
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIndex]);

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(-1);
    if (onScenarioReset) onScenarioReset();
  };

  const currentStep = currentStepIndex >= 0 ? selectedScenario.steps[currentStepIndex] : null;

  // Presentational stats fallback if not loaded dynamically from parent controller
  const displayStats = activeStats || {
    calls: currentStepIndex >= 0 ? currentStepIndex + 1 : 0,
    syncs: currentStepIndex >= 2 ? Math.min(2, Math.floor(currentStepIndex / 2)) : 0,
    links: currentStepIndex >= 1 ? (currentStepIndex >= 5 ? 0 : 1) : 0
  };

  return (
    <div className="flex flex-col bg-cream border border-charcoal/10 rounded-2xl overflow-hidden shadow-sm h-full">
      {/* Top metrics bar */}
      <div className="flex justify-between items-center px-6 py-4 bg-cream border-b border-charcoal/10">
        <div className="flex items-center gap-2">
          <span className="text-xs font-syne uppercase tracking-wider text-yellow-dark bg-yellow/10 px-2 py-0.5 rounded font-bold">
            Perspective B
          </span>
          <h2 className="text-sm font-syne uppercase tracking-wide text-charcoal font-bold">Coordination Center</h2>
        </div>
        <div className="flex items-center gap-6 text-xs font-medium text-charcoal/60">
          <div className="flex items-center gap-1.5"><ArrowRightLeft className="w-3.5 h-3.5 text-yellow-dark" /><span>API Calls: <strong>{displayStats.calls}</strong></span></div>
          <div className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-yellow-dark" /><span>Shares: <strong>{displayStats.links}</strong></span></div>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative flex-1 bg-cream-dark/40 grid-bg min-h-[360px] flex items-center justify-center p-4">
        <svg viewBox="0 0 800 440" className="w-full h-full max-w-[800px]">
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="24" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#121212" fillOpacity="0.25" />
            </marker>
            <marker id="arrow-active" viewBox="0 0 10 10" refX="24" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#f2c94c" />
            </marker>
          </defs>

          {/* Render Connections */}
          {EDGES.map((edge, idx) => {
            const fromNode = NODES[edge.from];
            const toNode = NODES[edge.to];
            const isActive = currentStep && (
              (currentStep.source === edge.from && currentStep.target === edge.to) ||
              (currentStep.source === edge.to && currentStep.target === edge.from)
            );
            return (
              <path
                key={`${edge.from}-${edge.to}-${idx}`}
                d={`M ${fromNode.x} ${fromNode.y} L ${toNode.x} ${toNode.y}`}
                stroke={isActive ? "#f2c94c" : "#121212"}
                strokeOpacity={isActive ? 0.9 : 0.15}
                strokeWidth={isActive ? 2.5 : 1.5}
                markerEnd={isActive ? "url(#arrow-active)" : "url(#arrow)"}
                className={edge.dashed ? "animate-dash" : ""}
                strokeDasharray={edge.dashed ? "5,5" : undefined}
              />
            );
          })}

          {/* Render Animated Packets */}
          {currentStep && currentStep.source !== currentStep.target && (
            <g key={`packet-${currentStepIndex}`}>
              <circle r="6" fill="#f2c94c" className="shadow-lg">
                <animateMotion
                  dur="1.2s"
                  repeatCount="indefinite"
                  path={`M ${NODES[currentStep.source].x} ${NODES[currentStep.source].y} L ${NODES[currentStep.target].x} ${NODES[currentStep.target].y}`}
                />
              </circle>
              {currentStep.badge && (
                <g>
                  <animateMotion
                    dur="1.2s"
                    repeatCount="indefinite"
                    path={`M ${NODES[currentStep.source].x} ${NODES[currentStep.source].y} L ${NODES[currentStep.target].x} ${NODES[currentStep.target].y}`}
                  />
                  <rect x="-45" y="-22" width="90" height="14" rx="3" fill="#121212" opacity="0.85" />
                  <text x="0" y="-12" fill="#f2c94c" fontSize="8" textAnchor="middle" fontWeight="bold">
                    {currentStep.badge}
                  </text>
                </g>
              )}
            </g>
          )}

          {/* Render Nodes */}
          {Object.values(NODES).map((node) => {
            const NodeIcon = node.icon;
            const isGlow = currentStep && currentStep.glowNode === node.id;
            const isTarget = currentStep && currentStep.target === node.id;
            const isSource = currentStep && currentStep.source === node.id;
            const isNodeActive = isGlow || isTarget || isSource;
            const colors = getNodeColors(node.id);

            return (
              <g key={node.id} transform={`translate(${node.x}, ${node.y})`} className="cursor-pointer">
                {isNodeActive && (
                  <circle r="34" fill="none" stroke="#f2c94c" strokeWidth="2" strokeDasharray="3,3" className="animate-spin" style={{ animationDuration: '6s' }} />
                )}
                <circle
                  r="24"
                  fill={colors.bg}
                  stroke={isNodeActive ? '#f2c94c' : colors.stroke}
                  strokeWidth={isNodeActive ? 2.5 : 1.5}
                  strokeOpacity={isNodeActive ? 1 : 0.8}
                  className="transition-all duration-300"
                />
                <g transform="translate(-10, -10)" style={{ color: colors.fg }}>
                  <NodeIcon className="w-5 h-5" />
                </g>
                <text y="38" textAnchor="middle" fill="#121212" className="text-[10px] font-syne uppercase font-bold tracking-wider opacity-80 select-none">
                  {node.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Replay Autoplay Control panel */}
      {!hideControls && (
        <div className="flex gap-4 justify-end items-center p-4 border-t border-charcoal/10 bg-cream">
          <button
            onClick={handleReset}
            className="p-2 border border-charcoal/10 rounded-lg hover:border-charcoal/30 text-charcoal hover:bg-charcoal/5 transition-all"
            title="Reset"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-4 py-2 bg-yellow text-charcoal rounded-lg hover:bg-yellow-dark transition-all font-syne font-bold uppercase text-xs shadow-sm border border-yellow-dark"
          >
            <Play className="w-3.5 h-3.5" /> {isPlaying ? "PAUSE" : "AUTO REPLAY"}
          </button>
        </div>
      )}
    </div>
  );
}

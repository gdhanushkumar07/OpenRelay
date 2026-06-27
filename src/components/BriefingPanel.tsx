// src/components/BriefingPanel.tsx
"use client";

import React, { useState, useEffect } from "react";
import { aicooService } from "../services/aicoo";
import { ClipboardList, ShieldAlert, Sparkles, CheckCircle2, ListTodo, Layers, ArrowUpRight } from "lucide-react";

interface Briefing {
  summary: string;
  actionItems: string[];
  riskScore: string;
}

interface MatrixItem {
  id: string;
  title: string;
  desc: string;
}

interface Matrix {
  q1: MatrixItem[];
  q2: MatrixItem[];
  q3: MatrixItem[];
  q4: MatrixItem[];
}

export default function BriefingPanel() {
  const [briefing, setBriefing] = useState<Briefing | null>(null);
  const [matrix, setMatrix] = useState<Matrix | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [briefRes, matrixRes] = await Promise.all([
          aicooService.generateBriefing(),
          aicooService.getMatrix({})
        ]);
        
        // Robust runtime validation of API responses
        const safeBriefing: Briefing = {
          summary: briefRes && typeof briefRes.summary === "string" ? briefRes.summary : "No briefing details available.",
          actionItems: briefRes && Array.isArray(briefRes.actionItems) ? briefRes.actionItems : [],
          riskScore: briefRes && typeof briefRes.riskScore === "string" ? briefRes.riskScore : "Low"
        };

        const ensureArray = (arr: any): MatrixItem[] => {
          if (!Array.isArray(arr)) return [];
          return arr.map((item: any, idx: number) => ({
            id: item && typeof item.id === "string" ? item.id : `fallback_${idx}`,
            title: item && typeof item.title === "string" ? item.title : String(item),
            desc: item && typeof item.desc === "string" ? item.desc : "No description provided"
          }));
        };

        const safeMatrix: Matrix = {
          q1: ensureArray(matrixRes?.q1),
          q2: ensureArray(matrixRes?.q2),
          q3: ensureArray(matrixRes?.q3),
          q4: ensureArray(matrixRes?.q4)
        };

        setBriefing(safeBriefing);
        setMatrix(safeMatrix);
      } catch (err) {
        console.error("Error fetching briefing info:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 border border-charcoal/10 rounded-2xl bg-cream h-full text-center">
        <Sparkles className="w-6 h-6 animate-pulse text-yellow-dark mb-2" />
        <p className="font-syne text-xs uppercase tracking-wider font-bold">Synthesizing Briefing Context...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* S-04: Briefing Summary */}
      {briefing && (
        <div className="bg-cream border border-charcoal/10 rounded-2xl overflow-hidden shadow-sm">
          <div className="flex justify-between items-center px-5 py-4 border-b border-charcoal/10 bg-cream-dark/20">
            <div className="flex items-center gap-2">
              <span className="text-xs font-syne uppercase tracking-wider text-yellow-dark bg-yellow/10 px-2 py-0.5 rounded font-bold">S-04</span>
              <div className="flex items-center gap-1.5 text-xs font-syne uppercase font-bold text-charcoal">
                <ClipboardList className="w-4 h-4 text-yellow-dark" />
                <span>AI Briefing for Human Sign-off</span>
              </div>
            </div>
            <div className={`text-[10px] font-syne font-bold uppercase px-2.5 py-0.5 rounded-full border ${
              briefing.riskScore === 'High' 
                ? 'bg-red-50 text-red-700 border-red-200' 
                : 'bg-yellow/10 text-yellow-dark border-yellow/30'
            }`}>
              Risk: {briefing.riskScore}
            </div>
          </div>

          <div className="p-5 space-y-4">
            <div>
              <h4 className="text-[10px] font-syne uppercase font-bold text-charcoal/50 tracking-wider mb-1.5">Executive Summary</h4>
              <p className="text-xs text-charcoal leading-relaxed font-medium bg-cream-dark/25 p-4 rounded-xl border border-charcoal/5">
                {briefing.summary}
              </p>
            </div>

            <div>
              <h4 className="text-[10px] font-syne uppercase font-bold text-charcoal/50 tracking-wider mb-2">Recommended Next Actions</h4>
              <ul className="space-y-2">
                {briefing.actionItems.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs font-medium text-charcoal">
                    <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* S-05: Eisenhower Triage Matrix */}
      {matrix && (
        <div className="bg-cream border border-charcoal/10 rounded-2xl overflow-hidden shadow-sm">
          <div className="flex justify-between items-center px-5 py-4 border-b border-charcoal/10 bg-cream-dark/20">
            <div className="flex items-center gap-2">
              <span className="text-xs font-syne uppercase tracking-wider text-yellow-dark bg-yellow/10 px-2 py-0.5 rounded font-bold">S-05</span>
              <div className="flex items-center gap-1.5 text-xs font-syne uppercase font-bold text-charcoal">
                <Layers className="w-4 h-4 text-yellow-dark" />
                <span>Eisenhower Triage Matrix</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 border-collapse">
            {/* Q1: Do Now */}
            <div className="p-5 border-r border-b border-charcoal/10 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-syne uppercase font-bold text-red-600 tracking-wider">Q1: DO NOW</span>
                <ShieldAlert className="w-4 h-4 text-red-600" />
              </div>
              <div className="space-y-2">
                {matrix.q1.map((item) => (
                  <div key={item.id} className="p-3 bg-red-50/50 border border-red-200 rounded-xl">
                    <div className="text-xs font-bold text-charcoal flex justify-between items-center">
                      <span>{item.title}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-red-600 cursor-pointer" />
                    </div>
                    <p className="text-[10px] text-charcoal/60 mt-1 font-medium">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Q2: Schedule */}
            <div className="p-5 border-b border-charcoal/10 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-syne uppercase font-bold text-yellow-dark tracking-wider">Q2: SCHEDULE</span>
                <ListTodo className="w-4 h-4 text-yellow-dark" />
              </div>
              <div className="space-y-2">
                {matrix.q2.map((item) => (
                  <div key={item.id} className="p-3 bg-yellow/5 border border-yellow/20 rounded-xl">
                    <div className="text-xs font-bold text-charcoal flex justify-between items-center">
                      <span>{item.title}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-yellow-dark cursor-pointer" />
                    </div>
                    <p className="text-[10px] text-charcoal/60 mt-1 font-medium">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Q3: Delegate */}
            <div className="p-5 border-r border-charcoal/10 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-syne uppercase font-bold text-charcoal/60 tracking-wider">Q3: DELEGATE</span>
                <Layers className="w-4 h-4 text-charcoal/40" />
              </div>
              <div className="space-y-2">
                {matrix.q3.map((item) => (
                  <div key={item.id} className="p-3 bg-cream-dark/20 border border-charcoal/5 rounded-xl">
                    <div className="text-xs font-bold text-charcoal/80 flex justify-between items-center">
                      <span>{item.title}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-charcoal/40 cursor-pointer" />
                    </div>
                    <p className="text-[10px] text-charcoal/50 mt-1 font-medium">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Q4: Eliminate */}
            <div className="p-5 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-syne uppercase font-bold text-charcoal/40 tracking-wider">Q4: ARTIFACT / LOG</span>
                <Layers className="w-4 h-4 text-charcoal/20" />
              </div>
              <div className="space-y-2">
                {matrix.q4.map((item) => (
                  <div key={item.id} className="p-3 bg-cream-dark/10 border border-dashed border-charcoal/10 rounded-xl opacity-60">
                    <div className="text-xs font-bold text-charcoal/60">{item.title}</div>
                    <p className="text-[10px] text-charcoal/40 mt-1 font-medium">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

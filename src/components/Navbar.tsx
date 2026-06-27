// src/components/Navbar.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Network, UserCheck, Activity, Key, Globe, Layout, ShieldCheck, X } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [apiKey, setApiKey] = useState("");
  const [isLive, setIsLive] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedKey = localStorage.getItem("aicoo_api_key") || "";
      if (savedKey) {
        setApiKey(savedKey);
        (window as any).__AICOO_API_KEY = savedKey;
        setIsLive(true);
      }
    }
  }, []);

  const handleSaveKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      if (apiKey.trim()) {
        localStorage.setItem("aicoo_api_key", apiKey);
        (window as any).__AICOO_API_KEY = apiKey;
        setIsLive(true);
      } else {
        localStorage.removeItem("aicoo_api_key");
        delete (window as any).__AICOO_API_KEY;
        setIsLive(false);
      }
    }
    setShowKeyModal(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-cream border-b border-charcoal/10 px-6 py-4 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 select-none group">
          <div className="bg-charcoal text-yellow p-1.5 rounded-lg border border-charcoal transition-all group-hover:scale-105">
            <Globe className="w-5 h-5 animate-spin" style={{ animationDuration: '15s' }} />
          </div>
          <div className="flex flex-col">
            <span className="font-syne text-sm font-bold uppercase tracking-wider text-charcoal leading-none">VendorFlow</span>
            <span className="text-[9px] uppercase tracking-widest text-charcoal/50 font-bold mt-0.5">by Aicoo Protocol</span>
          </div>
        </Link>

        {/* Action CTA & Status */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowKeyModal(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-syne font-bold uppercase transition-all border ${
              isLive
                ? "bg-yellow/10 text-yellow-dark border-yellow/30"
                : "bg-charcoal/5 text-charcoal/60 border-charcoal/10 hover:bg-charcoal/10"
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>{isLive ? "Aicoo: LIVE" : "Aicoo: MOCK"}</span>
          </button>

          <Link
            href="/network"
            className="hidden sm:flex items-center gap-1.5 px-4 py-1.5 bg-charcoal border border-charcoal text-cream hover:bg-charcoal/90 rounded-lg text-xs font-syne font-bold uppercase transition-all shadow-sm"
          >
            <Layout className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </Link>
        </div>
      </header>

      {/* Key Config Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/40 backdrop-blur-sm p-4">
          <div className="bg-cream border border-charcoal/20 w-full max-w-md rounded-2xl overflow-hidden shadow-xl animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex justify-between items-center p-5 border-b border-charcoal/10 bg-cream-dark/20">
              <h3 className="font-syne text-sm font-bold uppercase tracking-wide text-charcoal">Configure Aicoo API Key</h3>
              <button onClick={() => setShowKeyModal(false)} className="text-charcoal/40 hover:text-charcoal p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveKey} className="p-5 space-y-4">
              <p className="text-xs text-charcoal/70 leading-relaxed font-medium">
                By default, VendorFlow runs in <strong>Mock Mode</strong> (perfect for immediate evaluation). Paste your Aicoo API key below to route actual messages, shares, and briefings to the Aicoo protocol.
              </p>
              
              <div className="space-y-1.5">
                <label className="text-[10px] font-syne uppercase font-bold text-charcoal/60">Aicoo API Key</label>
                <input
                  type="password"
                  placeholder="ac_key_..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full px-3 py-2 border border-charcoal/20 rounded-lg text-xs focus:outline-none focus:border-yellow bg-white text-charcoal font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => { setApiKey(""); localStorage.removeItem("aicoo_api_key"); delete (window as any).__AICOO_API_KEY; setIsLive(false); setShowKeyModal(false); }}
                  className="px-3 py-2 text-xs font-syne font-bold uppercase text-red-500 hover:bg-red-50 rounded-lg border border-transparent transition-all"
                >
                  Clear Key
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-yellow hover:bg-yellow-dark text-charcoal font-syne font-bold uppercase text-xs rounded-lg transition-all border border-yellow-dark"
                >
                  Apply & Sync
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

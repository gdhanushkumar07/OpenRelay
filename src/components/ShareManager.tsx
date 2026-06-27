// src/components/ShareManager.tsx
"use client";

import React, { useState, useEffect } from "react";
import { subscribeToShareLinks, clearMockShares } from "../lib/aicoo";
import { aicooService } from "../services/aicoo";
import { Share2, Trash2, Shield, Calendar, Copy, Check, Eye } from "lucide-react";

interface ShareLink {
  id: string;
  url: string;
  scope: string;
  access: string;
  folderIds: number[];
  label: string;
  expiresAt: string;
}

export default function ShareManager() {
  const [shares, setShares] = useState<ShareLink[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    return subscribeToShareLinks((updatedShares) => {
      setShares(updatedShares);
    });
  }, []);

  const handleRevoke = async (id: string) => {
    await aicooService.revokeShareLink(id);
  };

  const handleCopy = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col bg-cream border border-charcoal/10 rounded-2xl overflow-hidden shadow-sm h-full min-h-[260px]">
      {/* Header */}
      <div className="flex justify-between items-center px-5 py-4 border-b border-charcoal/10 bg-cream-dark/20">
        <div className="flex items-center gap-2">
          <span className="text-xs font-syne uppercase tracking-wider text-yellow-dark bg-yellow/10 px-2 py-0.5 rounded font-bold">S-03</span>
          <div className="flex items-center gap-1.5 text-xs font-syne uppercase font-bold text-charcoal">
            <Share2 className="w-4 h-4 text-yellow-dark" />
            <span>Active Share Permissions</span>
          </div>
        </div>
        {shares.length > 0 && (
          <button
            onClick={clearMockShares}
            className="text-charcoal/50 hover:text-red-500 text-[10px] font-syne font-bold uppercase transition-all"
          >
            Revoke All
          </button>
        )}
      </div>

      {/* Sharing list */}
      <div className="flex-1 p-5 overflow-y-auto max-h-[300px] space-y-3">
        {shares.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-charcoal/30 py-8 text-center">
            <Shield className="w-8 h-8 opacity-25 mb-1.5" />
            <p className="font-syne text-xs uppercase tracking-wider font-bold">Secure Zone</p>
            <p className="text-[10px] mt-0.5 opacity-80 leading-relaxed max-w-[220px]">
              No active cross-agent or partner sharing links. Context is fully isolated.
            </p>
          </div>
        ) : (
          shares.map((share) => (
            <div
              key={share.id}
              className="p-3.5 bg-cream-dark/30 rounded-xl border border-charcoal/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-charcoal/15 transition-all"
            >
              <div className="space-y-1.5 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-charcoal truncate">{share.label}</span>
                  <span className="text-[9px] font-syne font-bold uppercase bg-charcoal text-cream px-1.5 py-0.5 rounded tracking-wide">
                    {share.scope === 'folders' && Array.isArray(share.folderIds) && share.folderIds.length > 0
                      ? `/Folder (${share.folderIds[0] === 2 ? 'Billing' : 'Scoped'})`
                      : share.scope === 'folders'
                        ? 'Scoped Folder'
                        : 'Full Workspace'}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[10px] text-charcoal/50">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>Expires: {share.expiresAt ? new Date(share.expiresAt).toLocaleDateString() : '1 Hour'}</span>
                  </div>
                  <div className="flex items-center gap-1 font-mono text-[9px] bg-charcoal/5 px-1 rounded truncate max-w-[120px]">
                    ID: {share.id}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <button
                  onClick={() => handleCopy(share.id, share.url)}
                  className="p-2 border border-charcoal/10 rounded-lg hover:border-charcoal/30 text-charcoal bg-white transition-all shadow-sm"
                  title="Copy URL"
                >
                  {copiedId === share.id ? (
                    <Check className="w-3.5 h-3.5 text-green-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
                <button
                  onClick={() => handleRevoke(share.id)}
                  className="px-3 py-2 bg-charcoal text-cream text-[10px] font-syne font-bold uppercase rounded-lg hover:bg-red-600 transition-all shadow-sm border border-charcoal hover:border-red-600"
                >
                  Revoke
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

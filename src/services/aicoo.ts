// src/services/aicoo.ts
import { addLog, addMockShare } from "../lib/aicoo";

const BASE_URL = 'https://www.aicoo.io/api/v1';

function getHeaders() {
  const key = typeof window !== 'undefined'
    ? (window as any).__AICOO_API_KEY || process.env.NEXT_PUBLIC_AICOO_API_KEY
    : process.env.NEXT_PUBLIC_AICOO_API_KEY;
  return {
    'Authorization': `Bearer ${key || 'aicoo_sk_live_DGHX380fLHdMyAYMB_Clb-L5tn6eOrWG'}`,
    'Content-Type': 'application/json'
  };
}

function getFallbackResponse(path: string, body?: any) {
  if (path === '/init') {
    return { success: true, workspaceId: 'ws_abc123', status: 'initialized', created_at: new Date().toISOString() };
  }
  if (path === '/context/status') {
    return { totalItems: 42, folders: ['Procurement', 'Finance', 'Insurance', 'Warehouse', 'Shipping', 'Supplier'] };
  }
  if (path === '/accumulate') {
    return { status: 'accumulated', count: body?.files?.length || 1, details: 'Context stored in Aicoo memory store.' };
  }
  if (path === '/chat') {
    return { response: 'Checked billing database and escalated to Insurance Agent for claim approval.' };
  }
  if (path === '/briefing') {
    return { 
      summary: "Supplier invoice surcharge dispute. Pricing exception requires manual approval.",
      actionItems: ["Approve air freight carrier surcharge", "Sign off on transit insurance claim"],
      riskScore: "High"
    };
  }
  if (path === '/briefing/matrix') {
    return {
      q1: [{ id: "t1", title: "Approve Cargo Reroute", desc: "Air freight carrier surcharge clearance required" }],
      q2: [{ id: "t2", title: "Sign transit claim forms", desc: "Insurance Agent claim approval finalized" }],
      q3: [{ id: "t3", title: "Supplier Capacity Check", desc: "Scan Q3 capacity trends report" }],
      q4: [{ id: "t4", title: "Archive shipping receipts", desc: "Standard warehousing cleanup logs" }]
    };
  }
  if (path === '/share/create') {
    return {
      success: true,
      shareId: 'link_share_' + Math.random().toString(36).substring(2, 9),
      url: 'https://www.aicoo.io/share/s_' + Math.random().toString(36).substring(2, 12),
      scope: body?.scope || 'folders',
      access: body?.access || 'read',
      folderIds: body?.folderIds || [2],
      label: body?.label || 'Cross-Company Connection',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };
  }
  if (path === '/tools') {
    return { status: 'tool_executed', result: 'Route changed to Express Air' };
  }
  if (path.startsWith('/heartbeat/runs')) {
    return [
      { id: "run_1", timestamp: new Date().toISOString(), atRisk: 1, actions: 1, timeSaved: 1.5 }
    ];
  }
  return { success: true };
}

async function apiRequest(method: 'GET' | 'POST' | 'DELETE', path: string, body?: any) {
  const startTime = Date.now();
  const headers = getHeaders();
  
  try {
    const options: RequestInit = {
      method,
      headers,
    };
    if (body) {
      options.body = JSON.stringify(body);
    }
    const res = await fetch(`${BASE_URL}${path}`, options);
    const duration = Date.now() - startTime;
    
    if (!res.ok) {
      throw new Error(`Aicoo API returned status ${res.status}`);
    }
    
    let data;
    try {
      data = await res.json();
    } catch {
      data = { text: await res.text() };
    }
    
    // Add real logs with duration to the global store
    addLog(method, path, body, data, res.status);
    return data;
  } catch (error: any) {
    // Fallback adapter triggers for robust demo experience
    const fallbackResponse = getFallbackResponse(path, body);
    addLog(method, path, body, {
      ...fallbackResponse,
      _adapter_status: "LIVE_OFFLINE_FALLBACK",
      _api_error: error.message
    }, 200);
    return fallbackResponse;
  }
}

export const aicooService = {
  init: () => apiRequest('POST', '/init', {}),
  contextStatus: () => apiRequest('GET', '/context/status'),
  createFolder: (name: string, parentId?: number) => apiRequest('POST', '/context/folders', { name, parentId }),
  accumulate: (body: { files?: any[]; texts?: any[]; folders?: any }) => apiRequest('POST', '/accumulate', body),
  chat: (message: string, conversationId?: number) => apiRequest('POST', '/chat', { message, conversationId }),
  generateBriefing: (opts?: any) => apiRequest('POST', '/briefing', opts || {}),
  getStrategies: (summaries: any) => apiRequest('POST', '/briefing/strategies', summaries),
  getMatrix: (summaries: any) => apiRequest('POST', '/briefing/matrix', summaries),
  createShareLink: (opts: any) => apiRequest('POST', '/share/create', opts).then(res => {
    if (res && (res.success || res.shareId || res.id)) {
      addMockShare({
        id: res.shareId || res.id || 'link_' + Math.random().toString(36).substring(2, 9),
        url: res.url || 'https://www.aicoo.io/share/s_' + Math.random().toString(36).substring(2, 12),
        scope: opts.scope || 'folders',
        access: opts.access || 'read',
        folderIds: opts.folderIds || [2],
        label: opts.label || 'Temporary Context Share',
        expiresAt: res.expiresAt || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      });
    }
    return res;
  }),
  listShareLinks: (status = 'active') => apiRequest('GET', `/share/list?status=${status}`),
  revokeShareLink: (id: string) => apiRequest('DELETE', `/share/${id}`),
  setHeartbeatPolicy: (tier: 'ACTIONS' | 'MESSAGES') => apiRequest('POST', '/heartbeat/policy', { tier }),
  runHeartbeat: (dryRun = false) => apiRequest('POST', '/heartbeat/run', { dryRun }),
  getHeartbeatRuns: (limit = 20) => apiRequest('GET', `/heartbeat/runs?limit=${limit}`),
  discoverTools: () => apiRequest('GET', '/tools'),
  executeTool: (tool: string, params: object) => apiRequest('POST', '/tools', { tool, params }),
};

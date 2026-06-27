// src/lib/aicoo.ts

export interface ApiLog {
  id: string;
  timestamp: string;
  method: 'GET' | 'POST' | 'DELETE';
  endpoint: string;
  payload?: any;
  response?: any;
  status: number;
}

// Global log store for live network log visualizer
let apiLogs: ApiLog[] = [];
const logListeners = new Set<(logs: ApiLog[]) => void>();

export function subscribeToApiLogs(listener: (logs: ApiLog[]) => void) {
  logListeners.add(listener);
  listener([...apiLogs]);
  return () => {
    logListeners.delete(listener);
  };
}

export function clearApiLogs() {
  apiLogs = [];
  logListeners.forEach(listener => listener([]));
}

export function addLog(method: 'GET' | 'POST' | 'DELETE', endpoint: string, payload: any, response: any, status = 200) {
  const newLog: ApiLog = {
    id: Math.random().toString(36).substring(2, 9),
    timestamp: new Date().toLocaleTimeString(),
    method,
    endpoint,
    payload,
    response,
    status
  };
  apiLogs = [newLog, ...apiLogs].slice(0, 50); // Keep last 50
  logListeners.forEach(listener => listener([...apiLogs]));
}

// Stateful shares mock store
let mockShares: any[] = [];
const shareListeners = new Set<(shares: any[]) => void>();

export function subscribeToShareLinks(listener: (shares: any[]) => void) {
  shareListeners.add(listener);
  listener([...mockShares]);
  return () => {
    shareListeners.delete(listener);
  };
}

export function addMockShare(share: any) {
  mockShares = [share, ...mockShares];
  shareListeners.forEach(listener => listener([...mockShares]));
}

export function clearMockShares() {
  mockShares = [];
  shareListeners.forEach(listener => listener([]));
}

const BASE_URL = 'https://www.aicoo.io/api/v1';

function getHeaders() {
  const key = typeof window !== 'undefined' 
    ? (window as any).__AICOO_API_KEY || process.env.NEXT_PUBLIC_AICOO_API_KEY 
    : process.env.NEXT_PUBLIC_AICOO_API_KEY;
  return {
    'Authorization': `Bearer ${key || 'demo-mock-key'}`,
    'Content-Type': 'application/json'
  };
}

async function request(method: 'GET' | 'POST' | 'DELETE', path: string, body?: any) {
  const isMock = typeof window !== 'undefined' && !(window as any).__AICOO_API_KEY && !process.env.NEXT_PUBLIC_AICOO_API_KEY;
  
  if (isMock) {
    // Generate simulated response
    await new Promise(resolve => setTimeout(resolve, 300));
    let mockResponse: any = { success: true };
    
    if (path === '/init') {
      mockResponse = { success: true, workspaceId: 'ws_abc123', status: 'initialized', created_at: new Date().toISOString() };
    } else if (path === '/context/status') {
      mockResponse = { totalItems: 42, folders: ['Procurement', 'Finance', 'Insurance', 'Warehouse', 'Shipping', 'Supplier'], lastSync: new Date().toISOString() };
    } else if (path === '/accumulate') {
      mockResponse = { status: 'accumulated', count: body?.files?.length || 1, details: 'Context stored in Aicoo memory store.' };
    } else if (path === '/chat') {
      mockResponse = { response: `Analyzed supplier delay. Checked billing database and escalated to Insurance Agent for claim approval.` };
    } else if (path === '/briefing') {
      mockResponse = { 
        summary: "Supplier shipment delayed due to carrier freight limits. Finance Agent has validated the invoice adjustment and Insurance Agent approved the transit risk claim. Human signature required to finalize shipment rerouting.",
        actionItems: ["Approve air freight carrier surcharge", "Sign off on transit insurance claim", "Notify Supplier of delivery ETA updates"],
        riskScore: "High"
      };
    } else if (path === '/briefing/strategies') {
      mockResponse = {
        strategies: [
          { priority: 1, title: "Resolve shipping delay", description: "Escalated by Shipping Agent. Cargo held at customs." },
          { priority: 2, title: "Update transit insurance claim", description: "Insurance Agent flagged carrier surcharge mismatch." },
          { priority: 3, title: "Scan warehouse inventory forecast", description: "Warehouse Agent reports capacity limits." }
        ]
      };
    } else if (path === '/briefing/matrix') {
      mockResponse = {
        q1: [{ id: "t1", title: "Approve Cargo Reroute", desc: "Air freight carrier surcharge clearance required" }],
        q2: [{ id: "t2", title: "Sign transit claim forms", desc: "Insurance Agent claim approval finalized" }],
        q3: [{ id: "t3", title: "Supplier Capacity Check", desc: "Scan Q3 capacity trends report" }],
        q4: [{ id: "t4", title: "Archive shipping receipts", desc: "Standard warehousing cleanup logs" }]
      };
    } else if (path === '/share/create') {
      const id = 'link_' + Math.random().toString(36).substring(2, 9);
      mockResponse = {
        id,
        url: `https://www.aicoo.io/share/s_` + Math.random().toString(36).substring(2, 12),
        scope: body.scope || 'folders',
        access: body.access || 'read',
        folderIds: body.folderIds || [2],
        label: body.label || 'Cross-Company Connection',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      };
      mockShares = [mockResponse, ...mockShares];
      shareListeners.forEach(listener => listener([...mockShares]));
    } else if (path.startsWith('/share/list')) {
      mockResponse = mockShares;
    } else if (method === 'DELETE' && path.startsWith('/share/')) {
      const id = path.split('/').pop() || '';
      mockShares = mockShares.filter(s => s.id !== id);
      shareListeners.forEach(listener => listener([...mockShares]));
      mockResponse = { success: true, revoked: id };
    } else if (path === '/heartbeat/run') {
      mockResponse = {
        status: "success",
        timestamp: new Date().toISOString(),
        customersScanned: 15,
        atRiskCustomers: 1,
        actionsCreated: [
          { customer: "Carrier Express", reason: "Surcharge mismatch", draft: "Subject: Transit Billing Discrepancy Correction" }
        ],
        timeSavedHours: 6.0
      };
    } else if (path.startsWith('/heartbeat/runs')) {
      mockResponse = [
        { id: "run_1", timestamp: new Date(Date.now() - 4 * 3600000).toISOString(), atRisk: 1, actions: 1, timeSaved: 1.5 },
        { id: "run_2", timestamp: new Date(Date.now() - 8 * 3600000).toISOString(), atRisk: 2, actions: 2, timeSaved: 3.0 },
        { id: "run_3", timestamp: new Date(Date.now() - 12 * 3600000).toISOString(), atRisk: 0, actions: 0, timeSaved: 0.5 }
      ];
    } else if (path === '/tools') {
      if (method === 'GET') {
        mockResponse = {
          tools: [
            { name: "send_message_to_human", description: "Notify human and provide details" },
            { name: "search_pulse_contact", description: "Search correct agent contact" }
          ]
        };
      } else {
        mockResponse = { status: "tool_executed", result: `Successfully executed tool ${body?.tool}.` };
      }
    }
    
    addLog(method, path, body, mockResponse, 200);
    return mockResponse;
  }

  // Live HTTP Mode
  try {
    const options: RequestInit = {
      method,
      headers: getHeaders(),
    };
    if (body) {
      options.body = JSON.stringify(body);
    }
    const res = await fetch(`${BASE_URL}${path}`, options);
    let data;
    try {
      data = await res.json();
    } catch {
      data = { text: await res.text() };
    }
    addLog(method, path, body, data, res.status);
    return data;
  } catch (error) {
    const errorDetails = { error: error instanceof Error ? error.message : String(error) };
    addLog(method, path, body, errorDetails, 500);
    throw error;
  }
}

export const aicoo = {
  // Workspace API
  init: () => request('POST', '/init', {}),
  contextStatus: () => request('GET', '/context/status'),
  createFolder: (name: string, parentId?: number) => request('POST', '/context/folders', { name, parentId }),

  // Context API
  accumulate: (body: { files?: any[]; texts?: any[]; folders?: any }) => request('POST', '/accumulate', body),

  // Reasoning API
  chat: (message: string, conversationId?: number) => request('POST', '/chat', { message, conversationId }),

  // Human Escalation & Triage
  generateBriefing: (opts?: any) => request('POST', '/briefing', opts || {}),
  getStrategies: (summaries: any) => request('POST', '/briefing/strategies', summaries),
  getMatrix: (summaries: any) => request('POST', '/briefing/matrix', summaries),

  // Sharing API
  createShareLink: (opts: { 
    scope?: string; 
    access?: string; 
    expiresIn?: string; 
    folderIds?: number[]; 
    notesAccess?: string; 
    label?: string; 
    identity?: any; 
  }) => request('POST', '/share/create', opts),
  listShareLinks: (status = 'active') => request('GET', `/share/list?status=${status}`),
  revokeShareLink: (id: string) => request('DELETE', `/share/${id}`),

  // Proactive Cron (Heartbeat)
  setHeartbeatPolicy: (tier: 'ACTIONS' | 'MESSAGES') => request('POST', '/heartbeat/policy', { tier }),
  runHeartbeat: (dryRun = false) => request('POST', '/heartbeat/run', { dryRun }),
  getHeartbeatRuns: (limit = 20) => request('GET', `/heartbeat/runs?limit=${limit}`),

  // Custom Tools
  discoverTools: () => request('GET', '/tools'),
  executeTool: (tool: string, params: object) => request('POST', '/tools', { tool, params }),
};


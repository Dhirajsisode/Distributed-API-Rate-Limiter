export interface User {
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
  apiKey?: string;
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface RequestLog {
  id: string;
  method: HttpMethod;
  url: string;
  status: number;
  statusText: string;
  responseTime: number; // in milliseconds
  timestamp: string; // ISO string
  headers: Record<string, string>;
  requestHeaders?: Record<string, string>;
  requestBody?: string;
  responseBody: string;
  allowed: boolean;
  clientIp: string;
  type: 'API_TEST' | 'MONITOR' | 'DASHBOARD_TRIGGER' | 'BACKGROUND';
}

export interface SystemMetrics {
  totalRequests: number;
  allowedRequests: number;
  blockedRequests: number;
  remainingRequests: number;
  windowTimeMs: number; // Window size in ms (e.g. 60000)
  windowTimeRemainingSec: number; // Seconds remaining in current window
  apiHealth: 'Healthy' | 'Degraded' | 'Offline';
  serverStatus: 'Online' | 'Offline';
  avgResponseTimeMs: number;
  clientIp: string;
  activeConnections: number;
}

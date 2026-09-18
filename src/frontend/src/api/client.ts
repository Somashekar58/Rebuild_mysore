import {
  ApiResponse,
  UserProfile,
  Report,
  CollectionAssignment,
  CollectionTeam,
  JurisdictionZone,
  ProcessingBatch,
  RecycledProduct,
  ImpactMetrics,
  NotificationItem,
  UserRole
} from '../types';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const currentRole = localStorage.getItem('rebuild_demo_role') || 'CITIZEN';
  const currentUserId = localStorage.getItem('rebuild_demo_user_id') || 'usr-cit-01';

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'x-demo-role': currentRole,
    'x-user-id': currentUserId,
    ...(options.headers as Record<string, string>)
  };

  const url = `${BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers
  });

  const json: ApiResponse<T> = await response.json();

  if (!response.ok || !json.success) {
    const message = json.error?.message || `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return json.data as T;
}

export const authApi = {
  getMe: () => request<UserProfile>('/auth/me'),
  getUsers: () => request<UserProfile[]>('/auth/users'),
  switchUser: (role?: UserRole, userId?: string) =>
    request<UserProfile>('/auth/switch-demo-user', {
      method: 'POST',
      body: JSON.stringify({ role, userId })
    })
};

export const reportsApi = {
  getAll: (filters?: Record<string, string | undefined>) => {
    const query = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([k, v]) => {
        if (v !== undefined && v !== '') query.append(k, v);
      });
    }
    const qStr = query.toString() ? `?${query.toString()}` : '';
    return request<Report[]>(`/reports${qStr}`);
  },
  getById: (id: string) => request<Report>(`/reports/${id}`),
  create: (data: any) =>
    request<Report>('/reports', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  update: (id: string, data: any) =>
    request<Report>(`/reports/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    }),
  analyze: (id: string) =>
    request<any>(`/reports/${id}/analyze`, {
      method: 'POST'
    }),
  verify: (id: string, data: { status: string; notes?: string }) =>
    request<Report>(`/reports/${id}/verify`, {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  calculatePriority: (id: string) =>
    request<any>(`/reports/${id}/calculate-priority`, {
      method: 'POST'
    }),
  getRouting: (id: string) => request<any>(`/reports/${id}/routing`),
  assign: (id: string, collection_team_id: string) =>
    request<{ report: Report; assignment: CollectionAssignment }>(`/reports/${id}/assign`, {
      method: 'POST',
      body: JSON.stringify({ collection_team_id })
    })
};

export const collectionsApi = {
  getAll: (teamId?: string) => {
    const q = teamId ? `?team_id=${teamId}` : '';
    return request<CollectionAssignment[]>(`/collections${q}`);
  },
  getById: (id: string) => request<CollectionAssignment>(`/collections/${id}`),
  getTeams: () => request<CollectionTeam[]>('/collections/teams'),
  getZones: () => request<JurisdictionZone[]>('/collections/zones'),
  update: (id: string, status: string, notes?: string) =>
    request<CollectionAssignment>(`/collections/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status, notes })
    }),
  submitProof: (id: string, proof: any) =>
    request<{ proof: any; assignment: CollectionAssignment }>(`/collections/${id}/proof`, {
      method: 'POST',
      body: JSON.stringify(proof)
    })
};

export const processingApi = {
  getBatches: () => request<ProcessingBatch[]>('/processing'),
  getBatchById: (id: string) => request<ProcessingBatch>(`/processing/${id}`),
  createBatch: (data: any) =>
    request<ProcessingBatch>('/processing', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  updateBatch: (id: string, data: any) =>
    request<ProcessingBatch>(`/processing/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    }),
  getProducts: () => request<RecycledProduct[]>('/processing/products'),
  createProduct: (data: any) =>
    request<RecycledProduct>('/processing/products', {
      method: 'POST',
      body: JSON.stringify(data)
    })
};

export const analyticsApi = {
  getOverview: () => request<any>('/analytics/overview'),
  getWaste: () => request<Record<string, number>>('/analytics/waste'),
  getImpact: () => request<ImpactMetrics>('/analytics/impact'),
  getHotspots: () => request<any[]>('/analytics/hotspots'),
  getTrends: () => request<any[]>('/analytics/trends')
};

export const notificationsApi = {
  getAll: () => request<NotificationItem[]>('/notifications'),
  markRead: (id: string) => request<any>(`/notifications/${id}/read`, { method: 'PATCH' }),
  markAllRead: () => request<any>('/notifications/mark-all-read', { method: 'POST' })
};

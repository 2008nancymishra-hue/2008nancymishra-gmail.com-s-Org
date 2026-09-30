import {
  Complaint,
  PickupRequest,
  Collector,
  WasteHotspot,
  AwarenessArticle,
  AppNotification,
  UserProfile,
  ComplaintStatus,
  PickupStatus,
} from '../types';

const BASE_URL = '/api';

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`API error (${res.status}): ${errorText || res.statusText}`);
  }

  return res.json() as Promise<T>;
}

export const api = {
  // Health
  checkHealth: async () => {
    return fetchJson<{ status: string; uptime: number; timestamp: string }>('/health');
  },

  // Stats
  getStats: async () => {
    return fetchJson<{
      totalUsers: number;
      totalComplaints: number;
      resolvedComplaints: number;
      pendingComplaints: number;
      totalPickups: number;
      completedPickups: number;
      activeCollectors: number;
      categoryCounts: Record<string, number>;
      statusCounts: Record<string, number>;
      resolutionRate: number;
    }>('/stats');
  },

  // Complaints
  getComplaints: async (params?: {
    status?: string;
    category?: string;
    priority?: string;
    search?: string;
  }) => {
    const query = new URLSearchParams();
    if (params?.status) query.append('status', params.status);
    if (params?.category) query.append('category', params.category);
    if (params?.priority) query.append('priority', params.priority);
    if (params?.search) query.append('search', params.search);

    const qs = query.toString() ? `?${query.toString()}` : '';
    return fetchJson<Complaint[]>(`/complaints${qs}`);
  },

  getComplaintById: async (id: string) => {
    return fetchJson<Complaint>(`/complaints/${id}`);
  },

  createComplaint: async (data: {
    category: Complaint['category'];
    description: string;
    imageUrl: string;
    location: Complaint['location'];
    priority?: Complaint['priority'];
  }) => {
    return fetchJson<Complaint>('/complaints', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateComplaintStatus: async (
    id: string,
    status: ComplaintStatus,
    notes?: string,
    proofUrl?: string
  ) => {
    return fetchJson<Complaint>(`/complaints/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, notes, proofUrl }),
    });
  },

  assignCollectorToComplaint: async (complaintId: string, collectorId: string) => {
    return fetchJson<Complaint>(`/complaints/${complaintId}/assign`, {
      method: 'POST',
      body: JSON.stringify({ collectorId }),
    });
  },

  // Pickups
  getPickups: async (params?: { status?: string; wasteType?: string }) => {
    const query = new URLSearchParams();
    if (params?.status) query.append('status', params.status);
    if (params?.wasteType) query.append('wasteType', params.wasteType);

    const qs = query.toString() ? `?${query.toString()}` : '';
    return fetchJson<PickupRequest[]>(`/pickups${qs}`);
  },

  createPickup: async (data: {
    wasteType: PickupRequest['wasteType'];
    quantity: PickupRequest['quantity'];
    address: string;
    area: string;
    date: string;
    timeSlot: string;
    notes?: string;
  }) => {
    return fetchJson<PickupRequest>('/pickups', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updatePickupStatus: async (id: string, status: PickupStatus, proofUrl?: string) => {
    return fetchJson<PickupRequest>(`/pickups/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, proofUrl }),
    });
  },

  assignCollectorToPickup: async (pickupId: string, collectorId: string) => {
    return fetchJson<PickupRequest>(`/pickups/${pickupId}/assign`, {
      method: 'POST',
      body: JSON.stringify({ collectorId }),
    });
  },

  // Collectors
  getCollectors: async () => {
    return fetchJson<Collector[]>('/collectors');
  },

  updateCollectorStatus: async (id: string, status: Collector['status']) => {
    return fetchJson<Collector>(`/collectors/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  // Hotspots
  getHotspots: async () => {
    return fetchJson<WasteHotspot[]>('/hotspots');
  },

  dispatchHotspotSquad: async (hotspotId: string) => {
    return fetchJson<{ success: boolean; message: string; hotspot: WasteHotspot }>(
      `/hotspots/${hotspotId}/dispatch`,
      { method: 'POST' }
    );
  },

  // Awareness Articles
  getArticles: async () => {
    return fetchJson<AwarenessArticle[]>('/awareness');
  },

  createArticle: async (data: Omit<AwarenessArticle, 'id'>) => {
    return fetchJson<AwarenessArticle>('/awareness', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateArticle: async (id: string, data: Partial<AwarenessArticle>) => {
    return fetchJson<AwarenessArticle>(`/awareness/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  deleteArticle: async (id: string) => {
    return fetchJson<{ success: boolean }>(`/awareness/${id}`, {
      method: 'DELETE',
    });
  },

  // Notifications
  getNotifications: async () => {
    return fetchJson<AppNotification[]>('/notifications');
  },

  markNotificationRead: async (id: string) => {
    return fetchJson<{ success: boolean }>(`/notifications/${id}/read`, {
      method: 'PATCH',
    });
  },

  markAllNotificationsRead: async () => {
    return fetchJson<{ success: boolean }>('/notifications/read-all', {
      method: 'POST',
    });
  },

  // Profile
  getProfile: async () => {
    return fetchJson<UserProfile>('/profile');
  },

  updateProfile: async (data: Partial<UserProfile>) => {
    return fetchJson<UserProfile>('/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Database Reset
  resetDatabase: async () => {
    return fetchJson<{ success: boolean; message: string }>('/reset', {
      method: 'POST',
    });
  },

  // GitHub Information
  getGitHubInfo: async () => {
    return fetchJson<{
      name: string;
      owner: string;
      fullName: string;
      description: string;
      defaultBranch: string;
      htmlUrl: string;
      cloneUrl: string;
      stars: number;
      forks: number;
      openIssues: number;
      license: string;
      topics: string[];
      techStack: {
        frontend: string[];
        backend: string[];
        deployment: string[];
      };
      endpointsCount: number;
    }>('/github/info');
  },
};

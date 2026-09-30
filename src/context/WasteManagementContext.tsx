import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  UserRole,
  Complaint,
  ComplaintStatus,
  PickupRequest,
  PickupStatus,
  Collector,
  WasteHotspot,
  AwarenessArticle,
  AppNotification,
  UserProfile,
} from '../types';
import {
  INITIAL_CITIZEN,
  INITIAL_COLLECTOR,
  COLLECTORS_LIST,
  INITIAL_COMPLAINTS,
  INITIAL_PICKUPS,
  INITIAL_HOTSPOTS,
  INITIAL_AWARENESS_ARTICLES,
  INITIAL_NOTIFICATIONS,
} from '../data/mockData';
import { api } from '../services/api';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
}

interface WasteManagementContextType {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  currentUser: UserProfile;
  currentCollector: Collector;
  complaints: Complaint[];
  pickups: PickupRequest[];
  collectors: Collector[];
  hotspots: WasteHotspot[];
  articles: AwarenessArticle[];
  notifications: AppNotification[];
  unreadNotificationsCount: number;

  // Server sync status
  isBackendConnected: boolean;
  isLoadingData: boolean;

  // Toast system (replaces window.alert)
  toasts: ToastMessage[];
  showToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;

  // GitHub Modal state
  isGitHubModalOpen: boolean;
  setIsGitHubModalOpen: (open: boolean) => void;

  // Navigation & view states
  activeCitizenTab: string;
  setActiveCitizenTab: (tab: string) => void;
  selectedComplaintId: string | null;
  setSelectedComplaintId: (id: string | null) => void;
  selectedPickupId: string | null;
  setSelectedPickupId: (id: string | null) => void;
  selectedArticleId: string | null;
  setSelectedArticleId: (id: string | null) => void;
  isDeviceFrame: boolean;
  setIsDeviceFrame: (val: boolean) => void;

  // Actions
  addComplaint: (data: {
    category: Complaint['category'];
    description: string;
    imageUrl: string;
    location: Complaint['location'];
    priority?: Complaint['priority'];
  }) => Promise<Complaint>;

  updateComplaintStatus: (
    id: string,
    status: ComplaintStatus,
    notes?: string,
    proofUrl?: string
  ) => Promise<void>;

  assignCollectorToComplaint: (complaintId: string, collectorId: string) => Promise<void>;

  addPickupRequest: (data: {
    wasteType: PickupRequest['wasteType'];
    quantity: PickupRequest['quantity'];
    address: string;
    area: string;
    date: string;
    timeSlot: string;
    notes?: string;
  }) => Promise<PickupRequest>;

  updatePickupStatus: (id: string, status: PickupStatus, proofUrl?: string) => Promise<void>;
  assignCollectorToPickup: (pickupId: string, collectorId: string) => Promise<void>;

  dispatchHotspot: (hotspotId: string) => Promise<void>;

  addArticle: (data: Omit<AwarenessArticle, 'id'>) => Promise<void>;
  updateArticle: (id: string, data: Partial<AwarenessArticle>) => Promise<void>;
  deleteArticle: (id: string) => Promise<void>;

  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
  markNotificationAsRead: (id: string) => Promise<void>;
  markAllNotificationsAsRead: () => Promise<void>;
  resetDemoData: () => Promise<void>;
}

const WasteManagementContext = createContext<WasteManagementContextType | undefined>(undefined);

export const WasteManagementProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userRole, setUserRole] = useState<UserRole>('citizen');
  const [currentUser, setCurrentUser] = useState<UserProfile>(INITIAL_CITIZEN);
  const [currentCollector, setCurrentCollector] = useState<Collector>(INITIAL_COLLECTOR);
  const [complaints, setComplaints] = useState<Complaint[]>(INITIAL_COMPLAINTS);
  const [pickups, setPickups] = useState<PickupRequest[]>(INITIAL_PICKUPS);
  const [collectors, setCollectors] = useState<Collector[]>(COLLECTORS_LIST);
  const [hotspots, setHotspots] = useState<WasteHotspot[]>(INITIAL_HOTSPOTS);
  const [articles, setArticles] = useState<AwarenessArticle[]>(INITIAL_AWARENESS_ARTICLES);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);

  const [activeCitizenTab, setActiveCitizenTab] = useState<string>('home');
  const [selectedComplaintId, setSelectedComplaintId] = useState<string | null>(null);
  const [selectedPickupId, setSelectedPickupId] = useState<string | null>(null);
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [isDeviceFrame, setIsDeviceFrame] = useState<boolean>(true);

  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(false);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(false);
  const [isGitHubModalOpen, setIsGitHubModalOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Fetch initial data from backend API
  const refreshFromBackend = useCallback(async () => {
    try {
      setIsLoadingData(true);
      const [
        complaintsData,
        pickupsData,
        collectorsData,
        hotspotsData,
        articlesData,
        notifsData,
        profileData,
      ] = await Promise.all([
        api.getComplaints().catch(() => INITIAL_COMPLAINTS),
        api.getPickups().catch(() => INITIAL_PICKUPS),
        api.getCollectors().catch(() => COLLECTORS_LIST),
        api.getHotspots().catch(() => INITIAL_HOTSPOTS),
        api.getArticles().catch(() => INITIAL_AWARENESS_ARTICLES),
        api.getNotifications().catch(() => INITIAL_NOTIFICATIONS),
        api.getProfile().catch(() => INITIAL_CITIZEN),
      ]);

      setComplaints(complaintsData);
      setPickups(pickupsData);
      setCollectors(collectorsData);
      setHotspots(hotspotsData);
      setArticles(articlesData);
      setNotifications(notifsData);
      setCurrentUser(profileData);
      if (collectorsData.length > 0) {
        setCurrentCollector(collectorsData[0]);
      }
      setIsBackendConnected(true);
    } catch {
      setIsBackendConnected(false);
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  useEffect(() => {
    refreshFromBackend();
  }, [refreshFromBackend]);

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  const markNotificationAsRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    try {
      await api.markNotificationRead(id);
    } catch {
      // offline handled
    }
  };

  const markAllNotificationsAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      await api.markAllNotificationsRead();
      showToast({
        type: 'info',
        title: 'Notifications Cleared',
        message: 'All alerts marked as read.',
      });
    } catch {
      // offline handled
    }
  };

  const addComplaint = async (data: {
    category: Complaint['category'];
    description: string;
    imageUrl: string;
    location: Complaint['location'];
    priority?: Complaint['priority'];
  }): Promise<Complaint> => {
    try {
      const created = await api.createComplaint(data);
      setComplaints((prev) => [created, ...prev]);
      setCurrentUser((prev) => ({
        ...prev,
        totalComplaintsReported: prev.totalComplaintsReported + 1,
        ecoKarmaPoints: prev.ecoKarmaPoints + 25,
      }));
      showToast({
        type: 'success',
        title: 'Complaint Registered',
        message: `Assigned ID #${created.id}. Sanitation team notified.`,
      });
      return created;
    } catch {
      // Fallback local creation
      const complaintNumber = complaints.length + 126;
      const newId = `WM-2026-00${complaintNumber}`;
      const now = new Date();
      const formattedDate = `${now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}, ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;

      const newComplaint: Complaint = {
        id: newId,
        category: data.category,
        description: data.description,
        imageUrl: data.imageUrl,
        location: data.location,
        submittedDate: formattedDate,
        status: 'Pending',
        priority: data.priority || 'Medium',
        citizenName: currentUser.name,
        citizenPhone: currentUser.phone,
        citizenEmail: currentUser.email,
        timeline: [
          {
            id: 't1',
            title: 'Complaint Submitted',
            description: 'Report lodged with geotagged photo by citizen.',
            timestamp: formattedDate,
            status: 'completed',
          },
          {
            id: 't2',
            title: 'Admin Reviewed',
            description: 'Awaiting review by Sanitation Officer.',
            status: 'current',
          },
          {
            id: 't3',
            title: 'Collector Assigned',
            description: 'Waste collection vehicle dispatch.',
            status: 'upcoming',
          },
          {
            id: 't4',
            title: 'Work In Progress',
            description: 'Collector actively clearing reported waste site.',
            status: 'upcoming',
          },
          {
            id: 't5',
            title: 'Complaint Resolved',
            description: 'Area cleaned and verified with photographic proof.',
            status: 'upcoming',
          },
        ],
      };

      setComplaints((prev) => [newComplaint, ...prev]);
      setCurrentUser((prev) => ({
        ...prev,
        totalComplaintsReported: prev.totalComplaintsReported + 1,
        ecoKarmaPoints: prev.ecoKarmaPoints + 25,
      }));
      showToast({
        type: 'success',
        title: 'Complaint Registered',
        message: `Assigned ID #${newId}. Sanitation team notified.`,
      });
      return newComplaint;
    }
  };

  const updateComplaintStatus = async (
    id: string,
    status: ComplaintStatus,
    notes?: string,
    proofUrl?: string
  ) => {
    try {
      const updated = await api.updateComplaintStatus(id, status, notes, proofUrl);
      setComplaints((prev) => prev.map((c) => (c.id === id ? updated : c)));
    } catch {
      const now = new Date();
      const timestamp = `${now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}, ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;

      setComplaints((prev) =>
        prev.map((c) => {
          if (c.id !== id) return c;
          const updatedTimeline = c.timeline.map((step) => {
            if (status === 'Assigned' && step.title === 'Collector Assigned') {
              return { ...step, status: 'completed' as const, timestamp };
            }
            if (status === 'In Progress' && step.title === 'Work In Progress') {
              return { ...step, status: 'current' as const, timestamp };
            }
            if (status === 'Resolved' && step.title === 'Complaint Resolved') {
              return { ...step, status: 'completed' as const, timestamp };
            }
            if (status === 'Resolved') {
              return { ...step, status: 'completed' as const };
            }
            return step;
          });

          return {
            ...c,
            status,
            resolutionNotes: notes || c.resolutionNotes,
            resolutionProofUrl: proofUrl || c.resolutionProofUrl,
            timeline: updatedTimeline,
          };
        })
      );
    }

    showToast({
      type: status === 'Resolved' ? 'success' : 'info',
      title: `Complaint #${id} Updated`,
      message: `Status is now marked as "${status}".`,
    });
  };

  const assignCollectorToComplaint = async (complaintId: string, collectorId: string) => {
    const collector = collectors.find((col) => col.id === collectorId);
    if (!collector) return;

    try {
      const updated = await api.assignCollectorToComplaint(complaintId, collectorId);
      setComplaints((prev) => prev.map((c) => (c.id === complaintId ? updated : c)));
    } catch {
      const now = new Date();
      const timestamp = `${now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}, ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;

      setComplaints((prev) =>
        prev.map((c) => {
          if (c.id !== complaintId) return c;
          const updatedTimeline = c.timeline.map((step) => {
            if (step.title === 'Admin Reviewed') {
              return { ...step, status: 'completed' as const, timestamp };
            }
            if (step.title === 'Collector Assigned') {
              return {
                ...step,
                status: 'completed' as const,
                description: `Assigned to ${collector.name} (${collector.vehicleNumber}).`,
                timestamp,
              };
            }
            if (step.title === 'Work In Progress') {
              return { ...step, status: 'current' as const };
            }
            return step;
          });

          return {
            ...c,
            status: 'Assigned',
            assignedCollectorId: collector.id,
            assignedCollectorName: collector.name,
            timeline: updatedTimeline,
          };
        })
      );
    }

    setCollectors((prev) =>
      prev.map((col) =>
        col.id === collectorId
          ? { ...col, todayComplaints: col.todayComplaints + 1, pendingTasks: col.pendingTasks + 1 }
          : col
      )
    );

    showToast({
      type: 'info',
      title: 'Crew Dispatched',
      message: `${collector.name} assigned to #${complaintId}.`,
    });
  };

  const addPickupRequest = async (data: {
    wasteType: PickupRequest['wasteType'];
    quantity: PickupRequest['quantity'];
    address: string;
    area: string;
    date: string;
    timeSlot: string;
    notes?: string;
  }): Promise<PickupRequest> => {
    try {
      const created = await api.createPickup(data);
      setPickups((prev) => [created, ...prev]);
      setCurrentUser((prev) => ({
        ...prev,
        totalPickupsRequested: prev.totalPickupsRequested + 1,
        ecoKarmaPoints: prev.ecoKarmaPoints + 15,
      }));
      showToast({
        type: 'success',
        title: 'Pickup Scheduled',
        message: `Order #${created.id} confirmed for ${data.date}.`,
      });
      return created;
    } catch {
      const pickupNum = pickups.length + 1032;
      const newId = `PU-${pickupNum}`;
      const now = new Date();
      const formattedDate = `${now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}, ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;

      const newPickup: PickupRequest = {
        id: newId,
        wasteType: data.wasteType,
        quantity: data.quantity,
        address: data.address,
        area: data.area || 'Sector 14',
        date: data.date,
        timeSlot: data.timeSlot,
        status: 'Waiting for Assignment',
        citizenName: currentUser.name,
        citizenPhone: currentUser.phone,
        notes: data.notes,
        createdAt: formattedDate,
      };

      setPickups((prev) => [newPickup, ...prev]);
      setCurrentUser((prev) => ({
        ...prev,
        totalPickupsRequested: prev.totalPickupsRequested + 1,
        ecoKarmaPoints: prev.ecoKarmaPoints + 15,
      }));
      showToast({
        type: 'success',
        title: 'Pickup Scheduled',
        message: `Order #${newId} confirmed for ${data.date}.`,
      });
      return newPickup;
    }
  };

  const updatePickupStatus = async (id: string, status: PickupStatus, proofUrl?: string) => {
    try {
      const updated = await api.updatePickupStatus(id, status, proofUrl);
      setPickups((prev) => prev.map((p) => (p.id === id ? updated : p)));
    } catch {
      setPickups((prev) =>
        prev.map((p) =>
          p.id === id
            ? { ...p, status, collectorProofUrl: proofUrl || p.collectorProofUrl }
            : p
        )
      );
    }

    showToast({
      type: status === 'Completed' ? 'success' : 'info',
      title: `Pickup #${id} Updated`,
      message: `Status updated to ${status}.`,
    });
  };

  const assignCollectorToPickup = async (pickupId: string, collectorId: string) => {
    const collector = collectors.find((col) => col.id === collectorId);
    if (!collector) return;

    try {
      const updated = await api.assignCollectorToPickup(pickupId, collectorId);
      setPickups((prev) => prev.map((p) => (p.id === pickupId ? updated : p)));
    } catch {
      setPickups((prev) =>
        prev.map((p) =>
          p.id === pickupId
            ? {
                ...p,
                status: 'Assigned',
                assignedCollectorId: collector.id,
                assignedCollectorName: collector.name,
              }
            : p
        )
      );
    }

    setCollectors((prev) =>
      prev.map((col) =>
        col.id === collectorId
          ? { ...col, todayPickups: col.todayPickups + 1, pendingTasks: col.pendingTasks + 1 }
          : col
      )
    );

    showToast({
      type: 'info',
      title: 'Van Dispatched',
      message: `${collector.name} assigned to pickup #${pickupId}.`,
    });
  };

  const dispatchHotspot = async (hotspotId: string) => {
    try {
      const res = await api.dispatchHotspotSquad(hotspotId);
      setHotspots((prev) =>
        prev.map((h) => (h.id === hotspotId ? res.hotspot : h))
      );
      showToast({
        type: 'success',
        title: 'Emergency Patrol Dispatched',
        message: res.message,
      });
    } catch {
      showToast({
        type: 'success',
        title: 'Emergency Patrol Dispatched',
        message: 'Rapid squad dispatched to hotspot.',
      });
    }
  };

  const addArticle = async (data: Omit<AwarenessArticle, 'id'>) => {
    try {
      const created = await api.createArticle(data);
      setArticles((prev) => [created, ...prev]);
    } catch {
      const newArt: AwarenessArticle = {
        ...data,
        id: `art-${Date.now()}`,
      };
      setArticles((prev) => [newArt, ...prev]);
    }
    showToast({
      type: 'success',
      title: 'Article Published',
      message: `"${data.title}" is now live in Awareness Hub.`,
    });
  };

  const updateArticle = async (id: string, data: Partial<AwarenessArticle>) => {
    try {
      const updated = await api.updateArticle(id, data);
      setArticles((prev) => prev.map((art) => (art.id === id ? updated : art)));
    } catch {
      setArticles((prev) =>
        prev.map((art) => (art.id === id ? { ...art, ...data } : art))
      );
    }
    showToast({
      type: 'info',
      title: 'Article Updated',
      message: 'Guide revisions saved successfully.',
    });
  };

  const deleteArticle = async (id: string) => {
    try {
      await api.deleteArticle(id);
      setArticles((prev) => prev.filter((art) => art.id !== id));
    } catch {
      setArticles((prev) => prev.filter((art) => art.id !== id));
    }
    showToast({
      type: 'warning',
      title: 'Article Removed',
      message: 'Educational guide deleted.',
    });
  };

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    try {
      const updated = await api.updateProfile(data);
      setCurrentUser(updated);
    } catch {
      setCurrentUser((prev) => ({ ...prev, ...data }));
    }
    showToast({
      type: 'success',
      title: 'Profile Saved',
      message: 'Citizen records updated successfully.',
    });
  };

  const resetDemoData = async () => {
    try {
      await api.resetDatabase();
    } catch {}
    setCurrentUser(INITIAL_CITIZEN);
    setCurrentCollector(INITIAL_COLLECTOR);
    setComplaints(INITIAL_COMPLAINTS);
    setPickups(INITIAL_PICKUPS);
    setCollectors(COLLECTORS_LIST);
    setHotspots(INITIAL_HOTSPOTS);
    setArticles(INITIAL_AWARENESS_ARTICLES);
    setNotifications(INITIAL_NOTIFICATIONS);
    setActiveCitizenTab('home');
    setSelectedComplaintId(null);
    setSelectedPickupId(null);
    setSelectedArticleId(null);
    showToast({
      type: 'info',
      title: 'Database Reset',
      message: 'Restored initial civic platform seed data.',
    });
  };

  return (
    <WasteManagementContext.Provider
      value={{
        userRole,
        setUserRole,
        currentUser,
        currentCollector,
        complaints,
        pickups,
        collectors,
        hotspots,
        articles,
        notifications,
        unreadNotificationsCount,
        isBackendConnected,
        isLoadingData,
        toasts,
        showToast,
        removeToast,
        isGitHubModalOpen,
        setIsGitHubModalOpen,
        activeCitizenTab,
        setActiveCitizenTab,
        selectedComplaintId,
        setSelectedComplaintId,
        selectedPickupId,
        setSelectedPickupId,
        selectedArticleId,
        setSelectedArticleId,
        isDeviceFrame,
        setIsDeviceFrame,
        addComplaint,
        updateComplaintStatus,
        assignCollectorToComplaint,
        addPickupRequest,
        updatePickupStatus,
        assignCollectorToPickup,
        dispatchHotspot,
        addArticle,
        updateArticle,
        deleteArticle,
        updateUserProfile,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        resetDemoData,
      }}
    >
      {children}
    </WasteManagementContext.Provider>
  );
};

export const useWasteManagement = () => {
  const context = useContext(WasteManagementContext);
  if (!context) {
    throw new Error('useWasteManagement must be used within a WasteManagementProvider');
  }
  return context;
};

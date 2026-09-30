export type UserRole = 'citizen' | 'collector' | 'admin';

export type ComplaintCategory =
  | 'Overflowing Garbage Bin'
  | 'Garbage on Road'
  | 'Missed Collection'
  | 'Illegal Dumping'
  | 'Improper Waste Segregation'
  | 'Other';

export type ComplaintStatus = 'Pending' | 'Assigned' | 'In Progress' | 'Resolved' | 'Rejected';

export type ComplaintPriority = 'Low' | 'Medium' | 'High' | 'Critical';

export interface TimelineStep {
  id: string;
  title: string;
  description: string;
  timestamp?: string;
  status: 'completed' | 'current' | 'upcoming';
}

export interface Complaint {
  id: string;
  category: ComplaintCategory;
  description: string;
  imageUrl: string;
  location: {
    lat: number;
    lng: number;
    address: string;
    area: string;
  };
  submittedDate: string;
  status: ComplaintStatus;
  priority: ComplaintPriority;
  citizenName: string;
  citizenPhone: string;
  citizenEmail: string;
  assignedCollectorId?: string;
  assignedCollectorName?: string;
  timeline: TimelineStep[];
  resolutionProofUrl?: string;
  resolutionNotes?: string;
}

export type WasteType = 'Wet Waste' | 'Dry Waste' | 'Plastic' | 'E-Waste' | 'Hazardous' | 'Other';
export type WasteQuantity = 'Small (1-2 bags)' | 'Medium (3-5 bags)' | 'Large (6+ bags / Bulk)';
export type PickupStatus = 'Waiting for Assignment' | 'Assigned' | 'In Progress' | 'Completed' | 'Cancelled';

export interface PickupRequest {
  id: string;
  wasteType: WasteType;
  quantity: WasteQuantity;
  address: string;
  area: string;
  date: string;
  timeSlot: string;
  status: PickupStatus;
  citizenName: string;
  citizenPhone: string;
  notes?: string;
  createdAt: string;
  assignedCollectorId?: string;
  assignedCollectorName?: string;
  collectorProofUrl?: string;
}

export interface Collector {
  id: string;
  name: string;
  phone: string;
  email: string;
  vehicleNumber: string;
  assignedArea: string;
  status: 'Available' | 'On Route' | 'Off Duty';
  todayPickups: number;
  todayComplaints: number;
  completedTasks: number;
  pendingTasks: number;
  rating: number;
  avatar: string;
}

export interface WasteHotspot {
  id: string;
  areaName: string;
  coordinates: { x: number; y: number }; // Percentage for custom responsive visual city map
  complaintLevel: 'High' | 'Medium' | 'Low';
  totalComplaints: number;
  resolvedComplaints: number;
  pendingComplaints: number;
  pickupRequests: number;
  lastReported: string;
}

export interface AwarenessArticle {
  id: string;
  title: string;
  category: 'Wet Waste' | 'Dry Waste' | 'E-Waste' | 'Hazardous Waste' | 'Recycling';
  readTime: string;
  excerpt: string;
  content: string;
  dos: string[];
  donts: string[];
  tips: string[];
  imageUrl?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'complaint' | 'pickup' | 'awareness' | 'system';
  targetId?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  avatar: string;
  role: UserRole;
  joinedDate: string;
  totalComplaintsReported: number;
  totalPickupsRequested: number;
  ecoKarmaPoints: number;
}

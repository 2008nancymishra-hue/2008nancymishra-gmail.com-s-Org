import React from 'react';
import { useWasteManagement } from '../../context/WasteManagementContext';
import {
  MapPin,
  Bell,
  AlertTriangle,
  Truck,
  FileText,
  BookOpen,
  ArrowRight,
  Clock,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export const CitizenHome: React.FC = () => {
  const {
    currentUser,
    complaints,
    pickups,
    unreadNotificationsCount,
    setActiveCitizenTab,
    setSelectedComplaintId,
    setSelectedPickupId,
  } = useWasteManagement();

  // Find active complaint
  const activeComplaint = complaints.find(
    (c) => c.status === 'In Progress' || c.status === 'Assigned' || c.status === 'Pending'
  ) || complaints[0];

  // Find upcoming pickup
  const upcomingPickup = pickups.find(
    (p) => p.status === 'Waiting for Assignment' || p.status === 'Assigned' || p.status === 'In Progress'
  ) || pickups[0];

  return (
    <div className="flex-1 flex flex-col p-4 pb-20 space-y-4 bg-[#F7F9F7]">
      {/* Top Bar: User Greeting & Location */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setActiveCitizenTab('profile')}
            className="w-10 h-10 rounded-full ring-2 ring-[#2E7D32]/30 overflow-hidden shadow-sm shrink-0 active:scale-95 transition-transform"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </button>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-base font-bold text-gray-900 tracking-tight leading-tight">
                Hello, {currentUser.name.split(' ')[0]} 👋
              </h1>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-gray-500 font-medium">
              <MapPin className="w-3 h-3 text-[#2E7D32]" />
              <span className="truncate max-w-[170px]">{currentUser.address.split(',')[1] || 'Sector 14, New Delhi'}</span>
            </div>
          </div>
        </div>

        {/* Notification Bell */}
        <button
          onClick={() => setActiveCitizenTab('notifications')}
          className="relative p-2.5 rounded-full bg-white border border-gray-200/80 shadow-sm text-gray-700 hover:text-[#2E7D32] hover:bg-[#E8F5E9]/50 transition-all active:scale-95"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white animate-pulse">
              {unreadNotificationsCount}
            </span>
          )}
        </button>
      </div>

      {/* Motivational Civic Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] p-4 text-white shadow-md">
        <div className="absolute -right-6 -bottom-6 w-28 h-28 rounded-full bg-white/10 pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-200 bg-white/15 px-2.5 py-0.5 rounded-full">
              Mission Clean City
            </span>
            <div className="flex items-center gap-1 text-[11px] text-emerald-100 font-mono-numbers">
              <Sparkles className="w-3 h-3 text-amber-300 fill-amber-300" />
              <span>{currentUser.ecoKarmaPoints} Karma</span>
            </div>
          </div>
          <h2 className="text-sm font-bold text-white mb-1">
            Let's keep our city clean & green
          </h2>
          <p className="text-[11px] text-emerald-100/90 leading-relaxed mb-3">
            Every segregated bin and reported roadside hazard earns municipal rebates and cleaner streets.
          </p>
          <button
            onClick={() => setActiveCitizenTab('awareness')}
            className="text-xs font-semibold text-white bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <span>Learn Waste Segregation</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* 4 Main Action Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-2 px-0.5">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Citizen Services
          </span>
          <span className="text-[11px] text-gray-400">Quick Actions</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* 1. Report Waste */}
          <button
            onClick={() => setActiveCitizenTab('report-form')}
            className="p-3.5 bg-white border border-gray-200/80 rounded-2xl text-left shadow-sm hover:border-[#2E7D32] hover:shadow-md transition-all group active:scale-[0.98] flex flex-col justify-between"
          >
            <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <AlertTriangle className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-gray-900 group-hover:text-[#2E7D32] transition-colors">
                Report Waste
              </h3>
              <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">
                Litter & full bins
              </p>
            </div>
          </button>

          {/* 2. Request Pickup */}
          <button
            onClick={() => setActiveCitizenTab('pickup-request')}
            className="p-3.5 bg-white border border-gray-200/80 rounded-2xl text-left shadow-sm hover:border-[#2E7D32] hover:shadow-md transition-all group active:scale-[0.98] flex flex-col justify-between"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#2E7D32] flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <Truck className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-gray-900 group-hover:text-[#2E7D32] transition-colors">
                Request Pickup
              </h3>
              <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">
                Dry & E-waste van
              </p>
            </div>
          </button>

          {/* 3. My Complaints */}
          <button
            onClick={() => setActiveCitizenTab('complaints')}
            className="p-3.5 bg-white border border-gray-200/80 rounded-2xl text-left shadow-sm hover:border-[#2E7D32] hover:shadow-md transition-all group active:scale-[0.98] flex flex-col justify-between"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <FileText className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-gray-900 group-hover:text-[#2E7D32] transition-colors">
                My Complaints
              </h3>
              <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">
                {complaints.length} reports logged
              </p>
            </div>
          </button>

          {/* 4. Waste Awareness */}
          <button
            onClick={() => setActiveCitizenTab('awareness')}
            className="p-3.5 bg-white border border-gray-200/80 rounded-2xl text-left shadow-sm hover:border-[#2E7D32] hover:shadow-md transition-all group active:scale-[0.98] flex flex-col justify-between"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-gray-900 group-hover:text-[#2E7D32] transition-colors">
                Waste Awareness
              </h3>
              <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">
                Segregation guide
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Active Complaint Card */}
      {activeComplaint && (
        <div className="bg-white border border-gray-200/80 rounded-2xl p-3.5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Active Complaint
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                activeComplaint.status === 'In Progress'
                  ? 'bg-purple-100 text-purple-700'
                  : activeComplaint.status === 'Assigned'
                  ? 'bg-blue-100 text-blue-700'
                  : activeComplaint.status === 'Pending'
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-emerald-100 text-emerald-700'
              }`}
            >
              {activeComplaint.status}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <img
              src={activeComplaint.imageUrl}
              alt={activeComplaint.category}
              className="w-14 h-14 rounded-xl object-cover border border-gray-100 shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 text-[11px] text-gray-500 font-mono-numbers">
                <span>{activeComplaint.id}</span>
                <span>·</span>
                <span className="truncate">{activeComplaint.submittedDate.split(',')[0]}</span>
              </div>
              <h4 className="text-xs font-bold text-gray-900 truncate">
                {activeComplaint.category}
              </h4>
              <p className="text-[11px] text-gray-500 truncate mt-0.5">
                {activeComplaint.location.address}
              </p>
            </div>
          </div>

          {/* Mini progress tracker */}
          <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-1 text-[11px] text-gray-600">
              <Clock className="w-3.5 h-3.5 text-[#2E7D32]" />
              <span>
                {activeComplaint.assignedCollectorName
                  ? `Assigned: ${activeComplaint.assignedCollectorName}`
                  : 'In municipal review'}
              </span>
            </div>
            <button
              onClick={() => {
                setSelectedComplaintId(activeComplaint.id);
                setActiveCitizenTab('complaint-details');
              }}
              className="text-xs font-bold text-[#2E7D32] hover:underline flex items-center gap-0.5"
            >
              <span>Track</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Upcoming Pickup Card */}
      {upcomingPickup && (
        <div className="bg-white border border-gray-200/80 rounded-2xl p-3.5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Upcoming Waste Pickup
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              {upcomingPickup.status}
            </span>
          </div>

          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-[11px] text-gray-500 font-mono-numbers">
                <span>{upcomingPickup.id}</span>
                <span>·</span>
                <span className="font-semibold text-gray-800">{upcomingPickup.wasteType}</span>
              </div>
              <p className="text-xs font-semibold text-gray-900 mt-1">
                {upcomingPickup.date}
              </p>
              <p className="text-[11px] text-gray-500 mt-0.5 flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#2E7D32]" />
                <span>{upcomingPickup.timeSlot}</span>
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedPickupId(upcomingPickup.id);
                setActiveCitizenTab('pickup');
              }}
              className="px-3 py-1.5 bg-[#E8F5E9] hover:bg-[#c8e6c9] text-[#2E7D32] font-bold text-xs rounded-xl transition-colors shrink-0"
            >
              Details
            </button>
          </div>
        </div>
      )}

      {/* Recent Civic Updates */}
      <div className="bg-white border border-gray-200/80 rounded-2xl p-3.5 shadow-sm">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Neighborhood Cleanliness Score
          </span>
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            Grade A (94%)
          </span>
        </div>
        <p className="text-xs text-gray-600 leading-relaxed">
          Sector 14 cleared 18 road hazards this week. Municipal compactor trucks arrive daily between 07:00 AM - 09:30 AM.
        </p>
      </div>
    </div>
  );
};

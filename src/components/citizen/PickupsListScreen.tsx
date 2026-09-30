import React, { useState } from 'react';
import { useWasteManagement } from '../../context/WasteManagementContext';
import { PickupStatus } from '../../types';
import {
  Calendar,
  Clock,
  MapPin,
  Truck,
  Plus,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

interface PickupsListScreenProps {
  onNewPickup: () => void;
}

export const PickupsListScreen: React.FC<PickupsListScreenProps> = ({ onNewPickup }) => {
  const { pickups, updatePickupStatus } = useWasteManagement();
  const [filter, setFilter] = useState<'All' | 'Upcoming' | 'Completed'>('All');

  const filtered = pickups.filter((p) => {
    if (filter === 'Upcoming') {
      return (
        p.status === 'Waiting for Assignment' ||
        p.status === 'Assigned' ||
        p.status === 'In Progress'
      );
    }
    if (filter === 'Completed') {
      return p.status === 'Completed' || p.status === 'Cancelled';
    }
    return true;
  });

  const getStatusBadge = (status: PickupStatus) => {
    switch (status) {
      case 'Waiting for Assignment':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Assigned':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'In Progress':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'Completed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Cancelled':
        return 'bg-red-100 text-red-800 border-red-300';
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F7F9F7] pb-20">
      {/* Top Header */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md px-4 pt-3 pb-2 border-b border-gray-200/80">
        <div className="flex items-center justify-between mb-2.5">
          <div>
            <h1 className="text-base font-bold text-gray-900">My Pickups</h1>
            <p className="text-[11px] text-gray-500">
              Scheduled doorstep waste collection requests
            </p>
          </div>
          <button
            onClick={onNewPickup}
            className="px-3 py-1.5 bg-[#2E7D32] hover:bg-[#256629] text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1 active:scale-95 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Book Van</span>
          </button>
        </div>

        {/* Segmented Filter */}
        <div className="flex bg-gray-100 p-1 rounded-xl">
          {(['All', 'Upcoming', 'Completed'] as const).map((tab) => {
            const active = filter === tab;
            return (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  active
                    ? 'bg-white text-[#2E7D32] shadow-sm'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* List */}
      <div className="p-4 space-y-3">
        {filtered.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-gray-200 shadow-sm mt-4">
            <Truck className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-gray-800">No pickups found</h3>
            <p className="text-xs text-gray-500 mt-1">
              You don't have any {filter.toLowerCase()} scheduled collections.
            </p>
            <button
              onClick={onNewPickup}
              className="mt-4 px-4 py-2 bg-[#2E7D32] text-white text-xs font-bold rounded-xl shadow-sm"
            >
              Request a Waste Pickup
            </button>
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-gray-200/90 rounded-2xl p-4 shadow-sm space-y-2.5 transition-all"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-900 font-mono-numbers">
                    {item.id}
                  </span>
                  <span className="text-xs font-semibold text-[#2E7D32] bg-[#E8F5E9] px-2 py-0.5 rounded-md">
                    {item.wasteType}
                  </span>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(
                    item.status
                  )}`}
                >
                  {item.status}
                </span>
              </div>

              {/* Quantity */}
              <p className="text-[11px] text-gray-600 font-medium">
                Volume: <span className="font-semibold text-gray-800">{item.quantity}</span>
              </p>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 bg-gray-50 p-2.5 rounded-xl">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#2E7D32] shrink-0" />
                  <span className="font-mono-numbers truncate">{item.date}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#2E7D32] shrink-0" />
                  <span className="font-mono-numbers text-[11px] truncate">{item.timeSlot}</span>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-1.5 text-xs text-gray-600">
                <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                <span className="truncate">{item.address}</span>
              </div>

              {/* Collector Info / Actions */}
              <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[11px] text-gray-500">
                  {item.assignedCollectorName ? (
                    <span className="flex items-center gap-1">
                      <Truck className="w-3 h-3 text-[#2E7D32]" />
                      <span>Van: {item.assignedCollectorName}</span>
                    </span>
                  ) : (
                    'Vehicle dispatch pending'
                  )}
                </span>

                {item.status === 'Waiting for Assignment' && (
                  <button
                    onClick={() => updatePickupStatus(item.id, 'Cancelled')}
                    className="text-[11px] font-bold text-red-600 hover:underline"
                  >
                    Cancel Request
                  </button>
                )}

                {item.status === 'Completed' && item.collectorProofUrl && (
                  <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Collected & Verified</span>
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

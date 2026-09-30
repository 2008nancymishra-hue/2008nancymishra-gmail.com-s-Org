import React, { useState } from 'react';
import { useWasteManagement } from '../../context/WasteManagementContext';
import { ComplaintStatus } from '../../types';
import {
  Search,
  Filter,
  MapPin,
  Calendar,
  ChevronRight,
  Plus,
  AlertCircle,
} from 'lucide-react';

interface ComplaintsListScreenProps {
  onSelectComplaint: (id: string) => void;
  onNewComplaint: () => void;
}

export const ComplaintsListScreen: React.FC<ComplaintsListScreenProps> = ({
  onSelectComplaint,
  onNewComplaint,
}) => {
  const { complaints } = useWasteManagement();
  const [activeTab, setActiveTab] = useState<'All' | 'Pending' | 'In Progress' | 'Resolved'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const tabs: ('All' | 'Pending' | 'In Progress' | 'Resolved')[] = [
    'All',
    'Pending',
    'In Progress',
    'Resolved',
  ];

  const filteredComplaints = complaints.filter((c) => {
    // Status tab filter
    if (activeTab === 'Pending' && c.status !== 'Pending') return false;
    if (activeTab === 'In Progress' && c.status !== 'In Progress' && c.status !== 'Assigned') return false;
    if (activeTab === 'Resolved' && c.status !== 'Resolved') return false;

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.id.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.location.address.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getStatusBadge = (status: ComplaintStatus) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Assigned':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'In Progress':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'Resolved':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Rejected':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F7F9F7] pb-20">
      {/* Sticky Header */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md px-4 pt-3 pb-2 border-b border-gray-200/80">
        <div className="flex items-center justify-between mb-2.5">
          <div>
            <h1 className="text-base font-bold text-gray-900">My Complaints</h1>
            <p className="text-[11px] text-gray-500">
              Track submitted municipal waste reports
            </p>
          </div>
          <button
            onClick={onNewComplaint}
            className="px-3 py-1.5 bg-[#2E7D32] hover:bg-[#256629] text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1 active:scale-95 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Report</span>
          </button>
        </div>

        {/* Live Search Bar */}
        <div className="relative mb-2">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ID, category, or location..."
            className="w-full pl-9 pr-3 py-2 bg-gray-100/90 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
          />
        </div>

        {/* Tab Filters */}
        <div className="flex bg-gray-100 p-1 rounded-xl">
          {tabs.map((tab) => {
            const active = activeTab === tab;
            const count =
              tab === 'All'
                ? complaints.length
                : tab === 'In Progress'
                ? complaints.filter((c) => c.status === 'In Progress' || c.status === 'Assigned').length
                : complaints.filter((c) => c.status === tab).length;

            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1 ${
                  active
                    ? 'bg-white text-[#2E7D32] shadow-sm'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                <span>{tab}</span>
                <span className="text-[10px] opacity-75 font-mono-numbers">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Complaint List */}
      <div className="p-4 space-y-3">
        {filteredComplaints.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-gray-200 shadow-sm mt-4">
            <AlertCircle className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-gray-800">No complaints found</h3>
            <p className="text-xs text-gray-500 mt-1">
              {searchQuery
                ? 'Try adjusting your search criteria.'
                : `You currently have no ${activeTab.toLowerCase()} complaints.`}
            </p>
            <button
              onClick={onNewComplaint}
              className="mt-4 px-4 py-2 bg-[#2E7D32] text-white text-xs font-bold rounded-xl shadow-sm"
            >
              Report a New Issue
            </button>
          </div>
        ) : (
          filteredComplaints.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectComplaint(item.id)}
              className="bg-white border border-gray-200/90 hover:border-[#2E7D32]/50 rounded-2xl p-3.5 shadow-sm transition-all cursor-pointer active:scale-[0.99] group"
            >
              {/* Header: ID, Category & Badge */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-gray-500 font-mono-numbers">
                  {item.id}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(
                    item.status
                  )}`}
                >
                  {item.status}
                </span>
              </div>

              {/* Main Content */}
              <div className="flex items-center gap-3">
                <img
                  src={item.imageUrl}
                  alt={item.category}
                  className="w-16 h-16 rounded-xl object-cover border border-gray-100 shrink-0 group-hover:scale-105 transition-transform"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-xs font-bold text-gray-900 group-hover:text-[#2E7D32] transition-colors truncate">
                    {item.category}
                  </h3>
                  <div className="flex items-start gap-1 text-[11px] text-gray-500 mt-1">
                    <MapPin className="w-3 h-3 text-[#2E7D32] shrink-0 mt-0.5" />
                    <span className="truncate">{item.location.address}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-1 font-mono-numbers">
                    <Calendar className="w-3 h-3 text-gray-400" />
                    <span>{item.submittedDate}</span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[11px] text-gray-500">
                  {item.assignedCollectorName
                    ? `Assigned: ${item.assignedCollectorName}`
                    : 'Awaiting Inspector'}
                </span>
                <span className="text-xs font-bold text-[#2E7D32] flex items-center gap-0.5 group-hover:underline">
                  <span>View Details</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

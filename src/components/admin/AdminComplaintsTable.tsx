import React, { useState } from 'react';
import { useWasteManagement } from '../../context/WasteManagementContext';
import { Complaint, ComplaintStatus, ComplaintPriority } from '../../types';
import {
  Search,
  Filter,
  Eye,
  UserCheck,
  CheckCircle,
  XCircle,
  MapPin,
  Calendar,
  AlertTriangle,
  Truck,
  ArrowUpDown,
  MoreVertical,
  Check,
} from 'lucide-react';

export const AdminComplaintsTable: React.FC = () => {
  const {
    complaints,
    collectors,
    updateComplaintStatus,
    assignCollectorToComplaint,
  } = useWasteManagement();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [assigningComplaintId, setAssigningComplaintId] = useState<string | null>(null);

  // Filter complaints
  const filtered = complaints.filter((c) => {
    if (statusFilter !== 'All' && c.status !== statusFilter) return false;
    if (priorityFilter !== 'All' && c.priority !== priorityFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        c.id.toLowerCase().includes(q) ||
        c.citizenName.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.location.address.toLowerCase().includes(q)
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
    }
  };

  const getPriorityBadge = (p: ComplaintPriority) => {
    switch (p) {
      case 'Critical':
        return 'text-red-700 bg-red-50 border-red-200';
      case 'High':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'Medium':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'Low':
        return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="bg-white border border-gray-200/90 rounded-2xl shadow-sm overflow-hidden space-y-4 p-5">
      {/* Table Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
        <div>
          <h2 className="text-base font-bold text-gray-900">Complaint Management Queue</h2>
          <p className="text-xs text-gray-500">
            Review, allocate municipal sanitation staff, and monitor incident resolution.
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative min-w-[200px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search complaint, citizen, ID..."
              className="w-full pl-8 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
            />
          </div>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Assigned">Assigned</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Rejected">Rejected</option>
          </select>

          {/* Priority filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
          >
            <option value="All">All Priorities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider text-[10px] border-y border-gray-100">
            <tr>
              <th className="py-2.5 px-3">Complaint ID</th>
              <th className="py-2.5 px-3">Citizen</th>
              <th className="py-2.5 px-3">Category</th>
              <th className="py-2.5 px-3">Location</th>
              <th className="py-2.5 px-3">Date</th>
              <th className="py-2.5 px-3">Priority</th>
              <th className="py-2.5 px-3">Assigned Crew</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-8 text-center text-gray-400">
                  No complaints found matching filters.
                </td>
              </tr>
            ) : (
              filtered.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50/80 transition-colors">
                  {/* ID */}
                  <td className="py-3 px-3 font-bold text-gray-900 font-mono-numbers">
                    {c.id}
                  </td>

                  {/* Citizen */}
                  <td className="py-3 px-3">
                    <p className="font-semibold text-gray-900">{c.citizenName}</p>
                    <p className="text-[10px] text-gray-400 font-mono-numbers">{c.citizenPhone}</p>
                  </td>

                  {/* Category */}
                  <td className="py-3 px-3">
                    <span className="font-medium text-gray-800">{c.category}</span>
                  </td>

                  {/* Location */}
                  <td className="py-3 px-3 max-w-[180px]">
                    <p className="truncate text-gray-600" title={c.location.address}>
                      {c.location.address}
                    </p>
                  </td>

                  {/* Date */}
                  <td className="py-3 px-3 text-gray-500 font-mono-numbers whitespace-nowrap">
                    {c.submittedDate.split(',')[0]}
                  </td>

                  {/* Priority */}
                  <td className="py-3 px-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getPriorityBadge(
                        c.priority
                      )}`}
                    >
                      {c.priority}
                    </span>
                  </td>

                  {/* Assigned Collector */}
                  <td className="py-3 px-3">
                    {c.assignedCollectorName ? (
                      <span className="text-gray-900 font-semibold flex items-center gap-1">
                        <Truck className="w-3 h-3 text-[#2E7D32]" />
                        <span>{c.assignedCollectorName}</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => setAssigningComplaintId(c.id)}
                        className="text-[11px] font-bold text-blue-600 hover:underline flex items-center gap-0.5"
                      >
                        <UserCheck className="w-3 h-3" />
                        <span>Assign Crew</span>
                      </button>
                    )}
                  </td>

                  {/* Status */}
                  <td className="py-3 px-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(
                        c.status
                      )}`}
                    >
                      {c.status}
                    </span>
                  </td>

                  {/* Action buttons */}
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedComplaint(c)}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                        title="View Full Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => setAssigningComplaintId(c.id)}
                        className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50"
                        title="Assign / Reassign Crew"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                      </button>

                      {c.status !== 'Resolved' && (
                        <button
                          onClick={() =>
                            updateComplaintStatus(c.id, 'Resolved', 'Marked resolved by Admin.')
                          }
                          className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50"
                          title="Mark Resolved"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {c.status !== 'Rejected' && (
                        <button
                          onClick={() =>
                            updateComplaintStatus(
                              c.id,
                              'Rejected',
                              'Outside municipal jurisdiction or duplicate.'
                            )
                          }
                          className="p-1.5 rounded-lg text-red-500 hover:bg-red-50"
                          title="Reject"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal: View Details */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-3xl p-5 shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#2E7D32] bg-[#E8F5E9] px-2 py-0.5 rounded-full">
                  {selectedComplaint.category}
                </span>
                <h3 className="text-base font-bold text-gray-900 font-mono-numbers mt-1">
                  Complaint #{selectedComplaint.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedComplaint(null)}
                className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Photo & Description */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="aspect-video rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                <img
                  src={selectedComplaint.imageUrl}
                  alt={selectedComplaint.category}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="space-y-2">
                <p className="text-xs text-gray-700 bg-gray-50 p-2.5 rounded-xl border border-gray-200">
                  {selectedComplaint.description}
                </p>
                <div className="text-xs space-y-1 text-gray-600">
                  <p>
                    <span className="font-semibold text-gray-900">Citizen:</span>{' '}
                    {selectedComplaint.citizenName} ({selectedComplaint.citizenPhone})
                  </p>
                  <p>
                    <span className="font-semibold text-gray-900">Email:</span>{' '}
                    {selectedComplaint.citizenEmail}
                  </p>
                  <p>
                    <span className="font-semibold text-gray-900">Location:</span>{' '}
                    {selectedComplaint.location.address}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Status update bar */}
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between">
              <span className="text-xs font-bold text-gray-700">Change Status:</span>
              <div className="flex gap-1.5">
                {(['Pending', 'Assigned', 'In Progress', 'Resolved', 'Rejected'] as ComplaintStatus[]).map(
                  (st) => (
                    <button
                      key={st}
                      onClick={() => {
                        updateComplaintStatus(selectedComplaint.id, st);
                        setSelectedComplaint({ ...selectedComplaint, status: st });
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                        selectedComplaint.status === st
                          ? 'bg-[#2E7D32] text-white shadow-sm'
                          : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {st}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Close */}
            <button
              onClick={() => setSelectedComplaint(null)}
              className="w-full py-2.5 bg-gray-900 text-white font-bold text-xs rounded-xl"
            >
              Close Details
            </button>
          </div>
        </div>
      )}

      {/* Modal: Assign Collector */}
      {assigningComplaintId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-5 shadow-2xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-900">
                Dispatch Collector to #{assigningComplaintId}
              </h3>
              <button
                onClick={() => setAssigningComplaintId(null)}
                className="w-7 h-7 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-xs"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-gray-500">
              Select an available municipal sanitation driver with matching vehicle type:
            </p>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {collectors.map((col) => (
                <div
                  key={col.id}
                  onClick={() => {
                    assignCollectorToComplaint(assigningComplaintId, col.id);
                    setAssigningComplaintId(null);
                  }}
                  className="p-3 rounded-2xl border border-gray-200 hover:border-[#2E7D32] hover:bg-emerald-50/50 cursor-pointer transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-emerald-100 text-[#2E7D32] flex items-center justify-center font-bold text-xs">
                      <Truck className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-900 group-hover:text-[#2E7D32]">
                        {col.name}
                      </h4>
                      <p className="text-[10px] text-gray-500 font-mono">
                        {col.vehicleNumber} · {col.assignedArea}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    {col.status}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setAssigningComplaintId(null)}
              className="w-full py-2 bg-gray-100 text-gray-700 rounded-xl text-xs font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

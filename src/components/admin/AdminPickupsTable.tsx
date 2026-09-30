import React, { useState } from 'react';
import { useWasteManagement } from '../../context/WasteManagementContext';
import { PickupRequest, PickupStatus } from '../../types';
import {
  Truck,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  UserCheck,
  Eye,
} from 'lucide-react';

export const AdminPickupsTable: React.FC = () => {
  const { pickups, collectors, updatePickupStatus, assignCollectorToPickup } =
    useWasteManagement();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedPickup, setSelectedPickup] = useState<PickupRequest | null>(null);
  const [assigningPickupId, setAssigningPickupId] = useState<string | null>(null);

  const filtered = pickups.filter((p) => {
    if (statusFilter !== 'All' && p.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        p.id.toLowerCase().includes(q) ||
        p.citizenName.toLowerCase().includes(q) ||
        p.wasteType.toLowerCase().includes(q) ||
        p.address.toLowerCase().includes(q)
      );
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
    <div className="bg-white border border-gray-200/90 rounded-2xl shadow-sm overflow-hidden space-y-4 p-5">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
        <div>
          <h2 className="text-base font-bold text-gray-900">Doorstep Waste Pickup Queue</h2>
          <p className="text-xs text-gray-500">
            Allocate specialized e-waste, dry recyclables, and bulk collection vans.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-[200px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search pickup ID, resident..."
              className="w-full pl-8 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
          >
            <option value="All">All Statuses</option>
            <option value="Waiting for Assignment">Waiting Assignment</option>
            <option value="Assigned">Assigned</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider text-[10px] border-y border-gray-100">
            <tr>
              <th className="py-2.5 px-3">Pickup ID</th>
              <th className="py-2.5 px-3">Citizen</th>
              <th className="py-2.5 px-3">Waste Category</th>
              <th className="py-2.5 px-3">Volume</th>
              <th className="py-2.5 px-3">Slot Date & Time</th>
              <th className="py-2.5 px-3">Doorstep Address</th>
              <th className="py-2.5 px-3">Assigned Van</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-8 text-center text-gray-400">
                  No pickup requests matching current criteria.
                </td>
              </tr>
            ) : (
              filtered.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="py-3 px-3 font-bold text-gray-900 font-mono-numbers">
                    {p.id}
                  </td>
                  <td className="py-3 px-3">
                    <p className="font-semibold text-gray-900">{p.citizenName}</p>
                    <p className="text-[10px] text-gray-400 font-mono-numbers">{p.citizenPhone}</p>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-bold text-[#2E7D32] bg-[#E8F5E9] px-2 py-0.5 rounded-md text-[11px]">
                      {p.wasteType}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-gray-700 font-medium">
                    {p.quantity.split(' ')[0]}
                  </td>
                  <td className="py-3 px-3 font-mono-numbers text-gray-600 whitespace-nowrap">
                    <p>{p.date}</p>
                    <p className="text-[10px] text-gray-400">{p.timeSlot}</p>
                  </td>
                  <td className="py-3 px-3 max-w-[160px]">
                    <p className="truncate text-gray-600" title={p.address}>
                      {p.address}
                    </p>
                  </td>
                  <td className="py-3 px-3">
                    {p.assignedCollectorName ? (
                      <span className="text-gray-900 font-semibold flex items-center gap-1">
                        <Truck className="w-3 h-3 text-[#2E7D32]" />
                        <span>{p.assignedCollectorName}</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => setAssigningPickupId(p.id)}
                        className="text-[11px] font-bold text-blue-600 hover:underline flex items-center gap-0.5"
                      >
                        <UserCheck className="w-3 h-3" />
                        <span>Assign Van</span>
                      </button>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(
                        p.status
                      )}`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedPickup(p)}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                        title="View Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => setAssigningPickupId(p.id)}
                        className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50"
                        title="Assign Van"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                      </button>

                      {p.status !== 'Completed' && (
                        <button
                          onClick={() => updatePickupStatus(p.id, 'Completed')}
                          className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50"
                          title="Complete"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
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
      {selectedPickup && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-5 shadow-2xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-900">
                Pickup #{selectedPickup.id} Details
              </h3>
              <button
                onClick={() => setSelectedPickup(null)}
                className="w-7 h-7 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs text-gray-700">
              <div className="bg-gray-50 p-3 rounded-xl space-y-1">
                <p>
                  <span className="font-semibold text-gray-900">Waste Type:</span>{' '}
                  {selectedPickup.wasteType}
                </p>
                <p>
                  <span className="font-semibold text-gray-900">Volume:</span>{' '}
                  {selectedPickup.quantity}
                </p>
                <p>
                  <span className="font-semibold text-gray-900">Date & Slot:</span>{' '}
                  {selectedPickup.date} ({selectedPickup.timeSlot})
                </p>
                <p>
                  <span className="font-semibold text-gray-900">Address:</span>{' '}
                  {selectedPickup.address}
                </p>
                <p>
                  <span className="font-semibold text-gray-900">Citizen:</span>{' '}
                  {selectedPickup.citizenName} ({selectedPickup.citizenPhone})
                </p>
                {selectedPickup.notes && (
                  <p>
                    <span className="font-semibold text-gray-900">Resident Notes:</span>{' '}
                    {selectedPickup.notes}
                  </p>
                )}
              </div>

              {/* Status control */}
              <div>
                <span className="font-bold text-gray-800 block mb-1.5">Change Status:</span>
                <div className="flex flex-wrap gap-1.5">
                  {(
                    [
                      'Waiting for Assignment',
                      'Assigned',
                      'In Progress',
                      'Completed',
                      'Cancelled',
                    ] as PickupStatus[]
                  ).map((st) => (
                    <button
                      key={st}
                      onClick={() => {
                        updatePickupStatus(selectedPickup.id, st);
                        setSelectedPickup({ ...selectedPickup, status: st });
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                        selectedPickup.status === st
                          ? 'bg-[#2E7D32] text-white shadow-sm'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedPickup(null)}
              className="w-full py-2 bg-gray-900 text-white rounded-xl text-xs font-bold"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Modal: Assign Van */}
      {assigningPickupId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-5 shadow-2xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-900">
                Dispatch Collection Van to #{assigningPickupId}
              </h3>
              <button
                onClick={() => setAssigningPickupId(null)}
                className="w-7 h-7 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {collectors.map((col) => (
                <div
                  key={col.id}
                  onClick={() => {
                    assignCollectorToPickup(assigningPickupId, col.id);
                    setAssigningPickupId(null);
                  }}
                  className="p-3 rounded-2xl border border-gray-200 hover:border-[#2E7D32] hover:bg-emerald-50/50 cursor-pointer transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-emerald-100 text-[#2E7D32] flex items-center justify-center font-bold text-xs">
                      <Truck className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-900">{col.name}</h4>
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
              onClick={() => setAssigningPickupId(null)}
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

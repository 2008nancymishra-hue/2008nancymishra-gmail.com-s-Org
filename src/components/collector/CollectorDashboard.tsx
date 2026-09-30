import React, { useState } from 'react';
import { useWasteManagement } from '../../context/WasteManagementContext';
import { Complaint, PickupRequest } from '../../types';
import {
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Calendar,
  AlertTriangle,
  Navigation,
  Camera,
  ChevronRight,
  Phone,
  Filter,
  Check,
  Play,
  RotateCcw,
} from 'lucide-react';

export const CollectorDashboard: React.FC = () => {
  const {
    currentCollector,
    complaints,
    pickups,
    updateComplaintStatus,
    updatePickupStatus,
    showToast,
  } = useWasteManagement();

  const [filterType, setFilterType] = useState<'All' | 'Complaints' | 'Pickups'>('All');
  const [selectedTask, setSelectedTask] = useState<{
    type: 'complaint' | 'pickup';
    item: Complaint | PickupRequest;
  } | null>(null);

  const [proofImage, setProofImage] = useState(
    'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&auto=format&fit=crop&q=80'
  );
  const [proofNotes, setProofNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Filter assigned tasks for this collector
  const assignedComplaints = complaints.filter(
    (c) =>
      c.assignedCollectorId === currentCollector.id ||
      c.status === 'In Progress' ||
      c.status === 'Assigned'
  );

  const assignedPickups = pickups.filter(
    (p) =>
      p.assignedCollectorId === currentCollector.id ||
      p.status === 'Assigned' ||
      p.status === 'In Progress'
  );

  // Stats calculation
  const totalTasks = assignedComplaints.length + assignedPickups.length;
  const completedCount =
    complaints.filter((c) => c.status === 'Resolved' && c.assignedCollectorId === currentCollector.id).length +
    pickups.filter((p) => p.status === 'Completed' && p.assignedCollectorId === currentCollector.id).length;
  const pendingCount = totalTasks;

  const handleStartTask = (type: 'complaint' | 'pickup', id: string) => {
    if (type === 'complaint') {
      updateComplaintStatus(id, 'In Progress', 'Collector arrived on site and started clearing.');
    } else {
      updatePickupStatus(id, 'In Progress');
    }
  };

  const handleCompleteTask = (type: 'complaint' | 'pickup', id: string) => {
    setIsProcessing(true);
    setTimeout(() => {
      if (type === 'complaint') {
        updateComplaintStatus(
          id,
          'Resolved',
          proofNotes || 'Site thoroughly cleared, swept, and disinfected.',
          proofImage
        );
      } else {
        updatePickupStatus(id, 'Completed', proofImage);
      }
      setIsProcessing(false);
      setSelectedTask(null);
      setProofNotes('');
    }, 500);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F7F9F7] pb-16">
      {/* Top Header */}
      <div className="bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] p-4 text-white shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-11 h-11 rounded-full ring-2 ring-white/30 overflow-hidden bg-white shadow-sm">
              <img
                src={currentCollector.avatar}
                alt={currentCollector.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <span className="text-[10px] text-emerald-200 font-bold uppercase tracking-wider">
                Municipal Sanitation Crew
              </span>
              <h1 className="text-base font-bold text-white leading-tight">
                Good Morning, {currentCollector.name.split(' ')[0]} 👋
              </h1>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-emerald-200 block font-mono">
              Vehicle: {currentCollector.vehicleNumber}
            </span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-400/20 border border-emerald-300/40 text-emerald-100">
              {currentCollector.status}
            </span>
          </div>
        </div>

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-4 gap-2 pt-1 text-center">
          <div className="bg-white/10 backdrop-blur-md p-2 rounded-xl border border-white/15">
            <p className="text-base font-extrabold text-white font-mono-numbers">
              {assignedPickups.length}
            </p>
            <p className="text-[10px] text-emerald-100 font-medium">Pickups</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-2 rounded-xl border border-white/15">
            <p className="text-base font-extrabold text-white font-mono-numbers">
              {assignedComplaints.length}
            </p>
            <p className="text-[10px] text-emerald-100 font-medium">Complaints</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-2 rounded-xl border border-white/15">
            <p className="text-base font-extrabold text-white font-mono-numbers">
              {currentCollector.completedTasks + completedCount}
            </p>
            <p className="text-[10px] text-emerald-100 font-medium">Done</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-2 rounded-xl border border-white/15">
            <p className="text-base font-extrabold text-white font-mono-numbers">
              {pendingCount}
            </p>
            <p className="text-[10px] text-emerald-100 font-medium">Pending</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="p-4 pb-2">
        <div className="flex bg-gray-200/80 p-1 rounded-xl">
          {(['All', 'Complaints', 'Pickups'] as const).map((tab) => {
            const active = filterType === tab;
            return (
              <button
                key={tab}
                onClick={() => setFilterType(tab)}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  active ? 'bg-white text-[#2E7D32] shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* Task List */}
      <div className="p-4 pt-1 space-y-3">
        {/* COMPLAINTS SECTION */}
        {(filterType === 'All' || filterType === 'Complaints') && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Assigned Waste Complaints ({assignedComplaints.length})
              </span>
            </div>

            {assignedComplaints.length === 0 ? (
              <p className="text-xs text-gray-400 italic bg-white p-3 rounded-xl border border-gray-100 text-center">
                No active complaints assigned to your vehicle.
              </p>
            ) : (
              assignedComplaints.map((c) => (
                <div
                  key={c.id}
                  className="bg-white border border-gray-200/90 rounded-2xl p-3.5 shadow-sm space-y-2 mb-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-bold text-gray-900 font-mono-numbers">
                        {c.id}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">
                        {c.priority} Priority
                      </span>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        c.status === 'In Progress'
                          ? 'bg-purple-100 text-purple-800'
                          : c.status === 'Resolved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-gray-900">{c.category}</h3>

                  <div className="flex items-start gap-1.5 text-xs text-gray-600">
                    <MapPin className="w-3.5 h-3.5 text-[#2E7D32] shrink-0 mt-0.5" />
                    <span className="truncate">{c.location.address}</span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1">
                    <span>Citizen: {c.citizenName}</span>
                    <span className="font-mono-numbers">{c.submittedDate.split(',')[0]}</span>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 border-t border-gray-100 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setSelectedTask({ type: 'complaint', item: c })}
                      className="py-2 px-3 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-xl transition-colors text-center"
                    >
                      View Details & Map
                    </button>

                    {c.status !== 'In Progress' && c.status !== 'Resolved' ? (
                      <button
                        onClick={() => handleStartTask('complaint', c.id)}
                        className="py-2 px-3 bg-[#2E7D32] hover:bg-[#256629] text-white text-xs font-bold rounded-xl shadow-sm flex items-center justify-center gap-1 active:scale-95 transition-all"
                      >
                        <Play className="w-3.5 h-3.5 fill-white" />
                        <span>Start Task</span>
                      </button>
                    ) : c.status === 'In Progress' ? (
                      <button
                        onClick={() => setSelectedTask({ type: 'complaint', item: c })}
                        className="py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm flex items-center justify-center gap-1 active:scale-95 transition-all"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>Upload Proof & Resolve</span>
                      </button>
                    ) : (
                      <span className="py-2 text-center text-xs font-bold text-emerald-700">
                        ✓ Resolved
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* PICKUPS SECTION */}
        {(filterType === 'All' || filterType === 'Pickups') && (
          <div className="mt-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Scheduled Doorstep Pickups ({assignedPickups.length})
              </span>
            </div>

            {assignedPickups.length === 0 ? (
              <p className="text-xs text-gray-400 italic bg-white p-3 rounded-xl border border-gray-100 text-center">
                No pending doorstep pickups on this route.
              </p>
            ) : (
              assignedPickups.map((p) => (
                <div
                  key={p.id}
                  className="bg-white border border-gray-200/90 rounded-2xl p-3.5 shadow-sm space-y-2 mb-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-bold text-gray-900 font-mono-numbers">
                        {p.id}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-[#2E7D32] border border-emerald-200">
                        {p.wasteType}
                      </span>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        p.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : p.status === 'In Progress'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {p.status}
                    </span>
                  </div>

                  <p className="text-xs text-gray-700">
                    Volume: <span className="font-semibold">{p.quantity}</span>
                  </p>

                  <div className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 p-2 rounded-xl">
                    <Clock className="w-3.5 h-3.5 text-[#2E7D32]" />
                    <span className="font-mono-numbers">
                      {p.date} ({p.timeSlot})
                    </span>
                  </div>

                  <div className="flex items-start gap-1.5 text-xs text-gray-600">
                    <MapPin className="w-3.5 h-3.5 text-[#2E7D32] shrink-0 mt-0.5" />
                    <span className="truncate">{p.address}</span>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 border-t border-gray-100 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setSelectedTask({ type: 'pickup', item: p })}
                      className="py-2 px-3 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-xl transition-colors text-center"
                    >
                      View Details
                    </button>

                    {p.status !== 'In Progress' && p.status !== 'Completed' ? (
                      <button
                        onClick={() => handleStartTask('pickup', p.id)}
                        className="py-2 px-3 bg-[#2E7D32] hover:bg-[#256629] text-white text-xs font-bold rounded-xl shadow-sm flex items-center justify-center gap-1 active:scale-95 transition-all"
                      >
                        <Play className="w-3.5 h-3.5 fill-white" />
                        <span>Start Pickup</span>
                      </button>
                    ) : p.status === 'In Progress' ? (
                      <button
                        onClick={() => setSelectedTask({ type: 'pickup', item: p })}
                        className="py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm flex items-center justify-center gap-1 active:scale-95 transition-all"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Mark Collected</span>
                      </button>
                    ) : (
                      <span className="py-2 text-center text-xs font-bold text-emerald-700">
                        ✓ Collected
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Task Details & Action Modal */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[88vh] overflow-y-auto p-5 shadow-2xl flex flex-col space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  {selectedTask.type === 'complaint' ? 'Complaint Task' : 'Doorstep Pickup Task'}
                </span>
                <h3 className="text-sm font-bold text-gray-900 font-mono-numbers">
                  {selectedTask.item.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedTask(null)}
                className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-xs font-bold"
              >
                ✕
              </button>
            </div>

            {/* Address & Navigation */}
            <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-2xl space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider">
                    Destination Location
                  </p>
                  <p className="text-xs font-bold text-emerald-950 mt-0.5">
                    {selectedTask.type === 'complaint'
                      ? (selectedTask.item as Complaint).location.address
                      : (selectedTask.item as PickupRequest).address}
                  </p>
                  <p className="text-[11px] text-emerald-800 font-medium mt-0.5">
                    Citizen: {selectedTask.item.citizenName} ({selectedTask.item.citizenPhone})
                  </p>
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  onClick={() =>
                    showToast({
                      type: 'info',
                      title: 'Turn-by-Turn GPS Active',
                      message: `Routing compactor van to ${selectedTask.type === 'complaint' ? (selectedTask.item as Complaint).location.address : (selectedTask.item as PickupRequest).address}. Estimated ETA: 7 mins.`,
                    })
                  }
                  className="flex-1 py-2 px-3 bg-[#2E7D32] hover:bg-[#256629] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Start Navigation</span>
                </button>
                <button
                  onClick={() =>
                    showToast({
                      type: 'info',
                      title: 'Calling Resident',
                      message: `Dialing ${selectedTask.item.citizenName} (${selectedTask.item.citizenPhone})...`,
                    })
                  }
                  className="p-2 bg-white text-[#2E7D32] border border-emerald-300 rounded-xl"
                  title="Call Citizen"
                >
                  <Phone className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Photo / Task description */}
            {selectedTask.type === 'complaint' && (
              <div>
                <span className="text-[11px] font-bold text-gray-700 block mb-1">
                  Reported Photo Evidence:
                </span>
                <div className="rounded-xl overflow-hidden border border-gray-200 aspect-video bg-gray-100">
                  <img
                    src={(selectedTask.item as Complaint).imageUrl}
                    alt="Complaint Evidence"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <p className="text-xs text-gray-600 mt-2 p-2 bg-gray-50 rounded-xl">
                  {(selectedTask.item as Complaint).description}
                </p>
              </div>
            )}

            {/* Collector Proof Section */}
            <div className="pt-2 border-t border-gray-100 space-y-2">
              <span className="text-xs font-bold text-gray-800 block">
                Completion Proof & Sanitation Notes
              </span>
              <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                <img
                  src={proofImage}
                  alt="Clearance Proof"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <button
                  onClick={() =>
                    showToast({
                      type: 'success',
                      title: 'Evidence Captured',
                      message: 'New clear site resolution photograph geotagged.',
                    })
                  }
                  className="absolute bottom-2 right-2 bg-black/70 hover:bg-black text-white text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1"
                >
                  <Camera className="w-3 h-3 text-emerald-400" />
                  <span>Retake Photo</span>
                </button>
              </div>

              <input
                type="text"
                value={proofNotes}
                onChange={(e) => setProofNotes(e.target.value)}
                placeholder="Notes (e.g. Cleared 45kg debris, bleached & sanitized area)"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#2E7D32]"
              />
            </div>

            {/* Complete Button */}
            <div className="pt-2">
              <button
                disabled={isProcessing}
                onClick={() => handleCompleteTask(selectedTask.type, selectedTask.item.id)}
                className="w-full py-3.5 bg-[#2E7D32] hover:bg-[#256629] text-white font-bold text-sm rounded-xl shadow-md flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {isProcessing ? (
                  <span>Submitting clearance proof...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>
                      {selectedTask.type === 'complaint'
                        ? 'Confirm Clearance & Mark Resolved'
                        : 'Confirm Waste Collected'}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

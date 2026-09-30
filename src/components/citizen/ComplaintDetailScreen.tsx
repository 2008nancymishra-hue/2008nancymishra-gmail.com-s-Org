import React from 'react';
import { useWasteManagement } from '../../context/WasteManagementContext';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  Circle,
  Truck,
  Phone,
  AlertTriangle,
  User,
  ShieldCheck,
  Check,
} from 'lucide-react';

interface ComplaintDetailScreenProps {
  complaintId: string;
  onBack: () => void;
}

export const ComplaintDetailScreen: React.FC<ComplaintDetailScreenProps> = ({
  complaintId,
  onBack,
}) => {
  const { complaints } = useWasteManagement();
  const complaint = complaints.find((c) => c.id === complaintId) || complaints[0];

  if (!complaint) {
    return (
      <div className="flex-1 p-6 text-center">
        <p className="text-sm text-gray-500">Complaint not found.</p>
        <button onClick={onBack} className="mt-3 text-xs font-bold text-[#2E7D32]">
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-[#F7F9F7] pb-16">
      {/* Sticky Header */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md px-4 py-3 border-b border-gray-200/80 flex items-center justify-between">
        <button
          onClick={onBack}
          className="p-2 -ml-2 rounded-xl text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="text-center">
          <h1 className="text-xs font-bold text-gray-900">Complaint Details</h1>
          <p className="text-[10px] text-gray-500 font-mono-numbers">{complaint.id}</p>
        </div>
        <div className="w-8" />
      </div>

      <div className="p-4 space-y-4">
        {/* Category & Status Banner */}
        <div className="bg-white border border-gray-200/90 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#2E7D32] bg-[#E8F5E9] px-2.5 py-0.5 rounded-full">
              {complaint.category}
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                complaint.status === 'Resolved'
                  ? 'bg-emerald-100 text-emerald-800'
                  : complaint.status === 'In Progress'
                  ? 'bg-purple-100 text-purple-800'
                  : complaint.status === 'Assigned'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {complaint.status}
            </span>
          </div>

          <h2 className="text-sm font-bold text-gray-900 mb-1">
            {complaint.category}
          </h2>
          <p className="text-xs text-gray-600 leading-relaxed">
            {complaint.description}
          </p>

          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500 font-mono-numbers">
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              <span>{complaint.submittedDate}</span>
            </div>
            <div className="flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              <span>Priority: {complaint.priority}</span>
            </div>
          </div>
        </div>

        {/* Visual Timeline Section */}
        <div className="bg-white border border-gray-200/90 rounded-2xl p-4 shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
            Resolution Progress Timeline
          </h3>

          <div className="relative pl-6 space-y-5">
            {/* Vertical connector line */}
            <div className="absolute left-2.5 top-2 bottom-3 w-0.5 bg-gray-200" />

            {complaint.timeline.map((step, idx) => {
              const isCompleted = step.status === 'completed';
              const isCurrent = step.status === 'current';

              return (
                <div key={step.id} className="relative group">
                  {/* Step icon circle */}
                  <div
                    className={`absolute -left-6 top-0 w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                      isCompleted
                        ? 'bg-[#2E7D32] text-white ring-2 ring-emerald-100'
                        : isCurrent
                        ? 'bg-amber-500 text-white ring-4 ring-amber-100 animate-pulse'
                        : 'bg-gray-200 text-gray-400 ring-2 ring-white'
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-3 h-3 stroke-[3]" />
                    ) : isCurrent ? (
                      <Clock className="w-3 h-3 stroke-[2.5]" />
                    ) : (
                      <Circle className="w-2 h-2 fill-current" />
                    )}
                  </div>

                  {/* Step content */}
                  <div>
                    <div className="flex items-center justify-between">
                      <h4
                        className={`text-xs font-bold leading-tight ${
                          isCurrent
                            ? 'text-amber-700'
                            : isCompleted
                            ? 'text-gray-900'
                            : 'text-gray-400'
                        }`}
                      >
                        {step.title}
                        {isCurrent && (
                          <span className="ml-1.5 text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                            Current Stage
                          </span>
                        )}
                      </h4>
                      {step.timestamp && (
                        <span className="text-[10px] text-gray-400 font-mono-numbers">
                          {step.timestamp.split(',')[1] || step.timestamp}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-500 mt-0.5 leading-normal">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Assigned Collector Details (if assigned) */}
        {complaint.assignedCollectorName && (
          <div className="bg-white border border-gray-200/90 rounded-2xl p-4 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2.5">
              Assigned Municipal Collector
            </h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-[#2E7D32] flex items-center justify-center font-bold text-sm">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">
                    {complaint.assignedCollectorName}
                  </h4>
                  <p className="text-[11px] text-gray-500 font-mono-numbers">
                    Vehicle: DL-01-WM-4821 (Compactor)
                  </p>
                </div>
              </div>
              <button
                onClick={() => alert(`Calling municipal driver ${complaint.assignedCollectorName}...`)}
                className="p-2.5 bg-[#E8F5E9] hover:bg-[#c8e6c9] text-[#2E7D32] rounded-xl transition-colors active:scale-95"
                title="Call driver"
              >
                <Phone className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Location & Photo Cards */}
        <div className="bg-white border border-gray-200/90 rounded-2xl p-4 shadow-sm space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Geotagged Incident Photo
          </h3>

          <div className="rounded-xl overflow-hidden border border-gray-200 relative aspect-video bg-gray-100">
            <img
              src={complaint.imageUrl}
              alt="Reported Waste"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="flex items-start gap-2 pt-1 text-xs text-gray-600">
            <MapPin className="w-4 h-4 text-[#2E7D32] shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-gray-900">{complaint.location.address}</p>
              <p className="text-[10px] text-gray-500 font-mono-numbers">
                Lat: {complaint.location.lat.toFixed(4)}°, Lng: {complaint.location.lng.toFixed(4)}°
              </p>
            </div>
          </div>

          {/* If Resolved: show before/after resolution proof */}
          {complaint.status === 'Resolved' && complaint.resolutionProofUrl && (
            <div className="pt-3 border-t border-gray-100">
              <span className="text-xs font-bold text-emerald-800 flex items-center gap-1 mb-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Sanitation Clearance Verification Proof</span>
              </span>
              <div className="rounded-xl overflow-hidden border border-emerald-200 relative aspect-video bg-gray-100">
                <img
                  src={complaint.resolutionProofUrl}
                  alt="Clearance Proof"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              {complaint.resolutionNotes && (
                <p className="text-[11px] text-gray-600 mt-2 bg-emerald-50 p-2 rounded-lg border border-emerald-100">
                  {complaint.resolutionNotes}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

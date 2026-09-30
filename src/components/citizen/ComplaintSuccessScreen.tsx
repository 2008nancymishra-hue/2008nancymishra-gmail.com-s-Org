import React from 'react';
import { useWasteManagement } from '../../context/WasteManagementContext';
import { CheckCircle2, MapPin, Calendar, ArrowRight, ShieldCheck, Share2 } from 'lucide-react';

interface ComplaintSuccessScreenProps {
  complaintId: string;
  onTrack: (id: string) => void;
  onHome: () => void;
}

export const ComplaintSuccessScreen: React.FC<ComplaintSuccessScreenProps> = ({
  complaintId,
  onTrack,
  onHome,
}) => {
  const { complaints } = useWasteManagement();
  const complaint = complaints.find((c) => c.id === complaintId) || complaints[0];

  return (
    <div className="flex-1 flex flex-col justify-between p-5 bg-[#F7F9F7] pb-10">
      {/* Top Banner & Icon */}
      <div className="text-center pt-4">
        <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center ring-8 ring-[#E8F5E9]/50 shadow-sm animate-bounce">
          <CheckCircle2 className="w-10 h-10 stroke-[2.2]" />
        </div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#2E7D32] bg-[#E8F5E9] px-3 py-1 rounded-full">
          Report Logged
        </span>
        <h1 className="text-xl font-extrabold text-gray-900 tracking-tight mt-2">
          Complaint Submitted Successfully!
        </h1>
        <p className="text-xs text-gray-500 mt-1 max-w-[280px] mx-auto">
          Sanitation patrol team has been alerted. You have earned +25 Eco-Karma points.
        </p>
      </div>

      {/* Complaint Summary Card */}
      {complaint && (
        <div className="bg-white border border-gray-200/90 rounded-2xl p-4 shadow-sm my-4 space-y-3">
          {/* Header ID & Status */}
          <div className="flex items-center justify-between pb-2.5 border-b border-gray-100">
            <div>
              <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Complaint ID</span>
              <p className="text-sm font-bold text-gray-900 font-mono-numbers">{complaint.id}</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Status</span>
              <p className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                {complaint.status}
              </p>
            </div>
          </div>

          {/* Image & Details */}
          <div className="flex items-center gap-3">
            <img
              src={complaint.imageUrl}
              alt={complaint.category}
              className="w-16 h-16 rounded-xl object-cover border border-gray-100 shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold text-[#2E7D32] uppercase">
                {complaint.category}
              </span>
              <p className="text-xs text-gray-600 line-clamp-2 mt-0.5">
                {complaint.description}
              </p>
            </div>
          </div>

          {/* Metadata rows */}
          <div className="space-y-1.5 pt-1 text-xs text-gray-600">
            <div className="flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#2E7D32] shrink-0 mt-0.5" />
              <span className="truncate">{complaint.location.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-[#2E7D32] shrink-0" />
              <span className="font-mono-numbers">{complaint.submittedDate}</span>
            </div>
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="space-y-2 pt-2">
        <button
          onClick={() => onTrack(complaint?.id || complaintId)}
          className="w-full py-3.5 px-4 bg-[#2E7D32] hover:bg-[#256629] text-white font-bold text-sm rounded-xl shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <span>Track Complaint Status</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={onHome}
          className="w-full py-3 px-4 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 font-semibold text-xs rounded-xl transition-colors text-center"
        >
          Back to Home Dashboard
        </button>
      </div>
    </div>
  );
};

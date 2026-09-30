import React from 'react';
import { useWasteManagement } from '../../context/WasteManagementContext';
import { CheckCircle2, Calendar, Clock, MapPin, Truck, ArrowRight } from 'lucide-react';

interface PickupSuccessScreenProps {
  pickupId: string;
  onViewPickups: () => void;
  onHome: () => void;
}

export const PickupSuccessScreen: React.FC<PickupSuccessScreenProps> = ({
  pickupId,
  onViewPickups,
  onHome,
}) => {
  const { pickups } = useWasteManagement();
  const pickup = pickups.find((p) => p.id === pickupId) || pickups[0];

  return (
    <div className="flex-1 flex flex-col justify-between p-5 bg-[#F7F9F7] pb-10">
      <div className="text-center pt-4">
        <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center ring-8 ring-[#E8F5E9]/50 shadow-sm animate-bounce">
          <Truck className="w-9 h-9 stroke-[2.2]" />
        </div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#2E7D32] bg-[#E8F5E9] px-3 py-1 rounded-full">
          Pickup Confirmed
        </span>
        <h1 className="text-xl font-extrabold text-gray-900 tracking-tight mt-2">
          Pickup Request Created Successfully
        </h1>
        <p className="text-xs text-gray-500 mt-1 max-w-[280px] mx-auto">
          Municipal collection van has been scheduled. Keep segregated items ready before arrival.
        </p>
      </div>

      {pickup && (
        <div className="bg-white border border-gray-200/90 rounded-2xl p-4 shadow-sm my-4 space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between pb-2.5 border-b border-gray-100">
            <div>
              <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Request ID</span>
              <p className="text-sm font-bold text-gray-900 font-mono-numbers">{pickup.id}</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Status</span>
              <p className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                {pickup.status}
              </p>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-2 text-xs text-gray-700">
            <div className="flex items-center justify-between py-1 bg-gray-50 px-2.5 rounded-xl">
              <span className="text-gray-500">Waste Category:</span>
              <span className="font-bold text-[#2E7D32]">{pickup.wasteType}</span>
            </div>
            <div className="flex items-center justify-between py-1 bg-gray-50 px-2.5 rounded-xl">
              <span className="text-gray-500">Quantity:</span>
              <span className="font-semibold text-gray-800">{pickup.quantity}</span>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <Calendar className="w-3.5 h-3.5 text-[#2E7D32] shrink-0" />
              <span className="font-mono-numbers font-medium">{pickup.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-[#2E7D32] shrink-0" />
              <span className="font-mono-numbers font-medium">{pickup.timeSlot}</span>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#2E7D32] shrink-0 mt-0.5" />
              <span className="truncate">{pickup.address}</span>
            </div>
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="space-y-2 pt-2">
        <button
          onClick={onViewPickups}
          className="w-full py-3.5 px-4 bg-[#2E7D32] hover:bg-[#256629] text-white font-bold text-sm rounded-xl shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <span>View My Pickups</span>
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

import React from 'react';
import { useWasteManagement } from '../../context/WasteManagementContext';
import { Truck, Phone, Mail, MapPin, Star, ShieldCheck, Award } from 'lucide-react';

export const AdminCollectorsList: React.FC = () => {
  const { collectors } = useWasteManagement();

  return (
    <div className="bg-white border border-gray-200/90 rounded-2xl shadow-sm overflow-hidden p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100">
        <div>
          <h2 className="text-base font-bold text-gray-900">
            Municipal Sanitation Fleets & Crews
          </h2>
          <p className="text-xs text-gray-500">
            Field drivers, automated compactor vehicles, and active route coverage.
          </p>
        </div>
        <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 self-start sm:self-auto">
          {collectors.filter((c) => c.status !== 'Off Duty').length} Active On Route
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {collectors.map((c) => (
          <div
            key={c.id}
            className="border border-gray-200 rounded-2xl p-4 flex flex-col justify-between hover:border-[#2E7D32]/50 hover:shadow-xs transition-all space-y-3"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-200 shrink-0">
                  <img
                    src={c.avatar}
                    alt={c.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">{c.name}</h3>
                  <div className="flex items-center gap-1 text-[11px] text-gray-500 font-mono-numbers">
                    <Truck className="w-3 h-3 text-[#2E7D32]" />
                    <span>{c.vehicleNumber}</span>
                  </div>
                </div>
              </div>

              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  c.status === 'On Route'
                    ? 'bg-emerald-100 text-emerald-800'
                    : c.status === 'Available'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {c.status}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs bg-gray-50 p-2.5 rounded-xl">
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase">Today Pickups</p>
                <p className="text-sm font-bold text-gray-900 font-mono-numbers mt-0.5">
                  {c.todayPickups}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase">Complaints</p>
                <p className="text-sm font-bold text-gray-900 font-mono-numbers mt-0.5">
                  {c.todayComplaints}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase">Rating</p>
                <p className="text-sm font-bold text-amber-600 font-mono-numbers mt-0.5 flex items-center justify-center gap-0.5">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>{c.rating}</span>
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600">
              <div className="flex items-center gap-1 truncate max-w-[220px]">
                <MapPin className="w-3 h-3 text-[#2E7D32] shrink-0" />
                <span className="truncate">{c.assignedArea}</span>
              </div>
              <button
                onClick={() => alert(`Calling driver ${c.name} at ${c.phone}...`)}
                className="text-[11px] font-bold text-[#2E7D32] hover:underline"
              >
                Contact Driver
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

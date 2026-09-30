import React, { useState } from 'react';
import { useWasteManagement } from '../../context/WasteManagementContext';
import { WasteHotspot } from '../../types';
import {
  MapPin,
  Filter,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Truck,
  Send,
  Layers,
  Search,
} from 'lucide-react';

export const AdminHotspotsMap: React.FC = () => {
  const { hotspots, collectors, dispatchHotspot } = useWasteManagement();
  const [selectedHotspot, setSelectedHotspot] = useState<WasteHotspot | null>(hotspots[0]);
  const [levelFilter, setLevelFilter] = useState<'All' | 'High' | 'Medium' | 'Low'>('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredHotspots = hotspots.filter((hs) => {
    if (levelFilter !== 'All' && hs.complaintLevel !== levelFilter) return false;
    if (searchTerm.trim() && !hs.areaName.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const getMarkerColor = (level: WasteHotspot['complaintLevel']) => {
    switch (level) {
      case 'High':
        return 'bg-red-500 ring-red-300';
      case 'Medium':
        return 'bg-amber-500 ring-amber-300';
      case 'Low':
        return 'bg-emerald-500 ring-emerald-300';
    }
  };

  return (
    <div className="bg-white border border-gray-200/90 rounded-2xl shadow-sm overflow-hidden p-5 space-y-4">
      {/* Top Header & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-gray-100">
        <div>
          <h2 className="text-base font-bold text-gray-900">Municipal Waste Hotspot Surveillance Map</h2>
          <p className="text-xs text-gray-500">
            Real-time geospatial heat index of recurring overflowing dumpsters and roadside litter.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative min-w-[180px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search area..."
              className="w-full pl-8 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#2E7D32]"
            />
          </div>

          {/* Level filter */}
          <div className="flex bg-gray-100 p-1 rounded-xl">
            {(['All', 'High', 'Medium', 'Low'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setLevelFilter(lvl)}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                  levelFilter === lvl
                    ? 'bg-white text-[#2E7D32] shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Map Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs bg-gray-50 px-3 py-2 rounded-xl border border-gray-200/80">
        <span className="font-bold text-gray-700 text-[11px] uppercase tracking-wider">
          Surveillance Index:
        </span>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
          <span className="text-gray-700 font-medium">Red: High Hazard (20+ complaints)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-amber-500" />
          <span className="text-gray-700 font-medium">Orange: Medium (10-19 complaints)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-emerald-500" />
          <span className="text-gray-700 font-medium">Green: Low / Controlled (&lt;10)</span>
        </div>
      </div>

      {/* Interactive Map Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Visual Map Canvas */}
        <div className="lg:col-span-2 relative h-[440px] rounded-2xl overflow-hidden border border-gray-200 bg-[#E3EBDD] select-none shadow-inner">
          {/* Simulated Cartographic Background */}
          <div
            className="absolute inset-0 opacity-25"
            style={{
              backgroundImage:
                'linear-gradient(#2E7D32 1px, transparent 1px), linear-gradient(90deg, #2E7D32 1px, transparent 1px)',
              backgroundSize: '36px 36px',
            }}
          />

          {/* City road vectors */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" opacity="0.7">
            {/* Expressways */}
            <path d="M -20 120 Q 200 180 400 90 T 800 240" stroke="#FFFFFF" strokeWidth="22" fill="none" />
            <path d="M 320 -20 L 400 480" stroke="#FFFFFF" strokeWidth="18" fill="none" />
            <path d="M -20 320 L 800 340" stroke="#FDE68A" strokeWidth="10" fill="none" />
            <path d="M 140 -20 Q 220 220 180 480" stroke="#FFFFFF" strokeWidth="12" fill="none" />
            <path d="M 450 -20 Q 520 220 620 480" stroke="#FFFFFF" strokeWidth="14" fill="none" />
          </svg>

          {/* Park Zones */}
          <div className="absolute top-10 left-12 w-32 h-24 bg-emerald-400/30 rounded-2xl border border-emerald-500/40 flex items-center justify-center pointer-events-none">
            <span className="text-xs font-bold text-emerald-900 opacity-70">Central Eco Park</span>
          </div>

          <div className="absolute bottom-12 right-20 w-44 h-28 bg-emerald-400/25 rounded-3xl border border-emerald-500/40 flex items-center justify-center pointer-events-none">
            <span className="text-xs font-bold text-emerald-900 opacity-70">Tech Corridor Green Belt</span>
          </div>

          {/* Hotspot Markers */}
          {filteredHotspots.map((hs) => {
            const isSelected = selectedHotspot?.id === hs.id;
            return (
              <div
                key={hs.id}
                onClick={() => setSelectedHotspot(hs)}
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-125 z-20 group"
                style={{ left: `${hs.coordinates.x}%`, top: `${hs.coordinates.y}%` }}
              >
                {/* Ping ring */}
                {hs.complaintLevel === 'High' && (
                  <span className="absolute -inset-2 rounded-full bg-red-400 animate-ping opacity-60 pointer-events-none" />
                )}

                {/* Marker Body */}
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-white shadow-xl ring-4 ${getMarkerColor(
                    hs.complaintLevel
                  )} ${isSelected ? 'ring-8 ring-white scale-110' : ''}`}
                >
                  <MapPin className="w-5 h-5 fill-white stroke-[2.5]" />
                </div>

                {/* Label hover tooltip */}
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  {hs.areaName} ({hs.totalComplaints})
                </div>
              </div>
            );
          })}

          {/* Controls overlay */}
          <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-gray-200 text-xs text-gray-700 shadow-sm">
            Click any pin to inspect hotspot stats & dispatch crews
          </div>
        </div>

        {/* Selected Hotspot Detail Panel */}
        <div className="bg-gray-50 border border-gray-200/90 rounded-2xl p-4 flex flex-col justify-between space-y-4">
          {selectedHotspot ? (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      selectedHotspot.complaintLevel === 'High'
                        ? 'bg-red-100 text-red-800'
                        : selectedHotspot.complaintLevel === 'Medium'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {selectedHotspot.complaintLevel} Complaint Zone
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono">
                    Updated {selectedHotspot.lastReported}
                  </span>
                </div>
                <h3 className="text-base font-bold text-gray-900 leading-snug">
                  {selectedHotspot.areaName}
                </h3>
              </div>

              {/* 4 Stats Cards */}
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="bg-white p-3 rounded-xl border border-gray-200/80 shadow-xs">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                    Total Incidents
                  </span>
                  <span className="text-xl font-extrabold text-gray-900 font-mono-numbers">
                    {selectedHotspot.totalComplaints}
                  </span>
                </div>

                <div className="bg-white p-3 rounded-xl border border-gray-200/80 shadow-xs">
                  <span className="text-[10px] text-amber-600 font-bold uppercase tracking-wider block">
                    Pending Fix
                  </span>
                  <span className="text-xl font-extrabold text-amber-600 font-mono-numbers">
                    {selectedHotspot.pendingComplaints}
                  </span>
                </div>

                <div className="bg-white p-3 rounded-xl border border-gray-200/80 shadow-xs">
                  <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider block">
                    Resolved
                  </span>
                  <span className="text-xl font-extrabold text-[#2E7D32] font-mono-numbers">
                    {selectedHotspot.resolvedComplaints}
                  </span>
                </div>

                <div className="bg-white p-3 rounded-xl border border-gray-200/80 shadow-xs">
                  <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wider block">
                    Doorstep Pickups
                  </span>
                  <span className="text-xl font-extrabold text-blue-600 font-mono-numbers">
                    {selectedHotspot.pickupRequests}
                  </span>
                </div>
              </div>

              {/* Resolution rate bar */}
              <div className="bg-white p-3 rounded-xl border border-gray-200/80 space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Zone Clearance Efficiency:</span>
                  <span className="font-bold text-[#2E7D32] font-mono-numbers">
                    {Math.round(
                      (selectedHotspot.resolvedComplaints /
                        (selectedHotspot.totalComplaints || 1)) *
                        100
                    )}
                    %
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#2E7D32] rounded-full"
                    style={{
                      width: `${Math.round(
                        (selectedHotspot.resolvedComplaints /
                          (selectedHotspot.totalComplaints || 1)) *
                          100
                      )}%`,
                    }}
                  />
                </div>
              </div>

              {/* Action */}
              <div className="pt-2">
                <button
                  onClick={() => dispatchHotspot(selectedHotspot.id)}
                  className="w-full py-3 px-4 bg-[#2E7D32] hover:bg-[#256629] text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Dispatch Rapid Sanitation Squad</span>
                </button>
              </div>
            </div>
          ) : (
            <p className="text-xs text-gray-500 text-center py-10">
              Select an area marker on the map to review telemetry.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

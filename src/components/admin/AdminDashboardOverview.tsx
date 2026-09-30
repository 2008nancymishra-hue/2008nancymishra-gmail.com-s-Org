import React from 'react';
import { useWasteManagement } from '../../context/WasteManagementContext';
import {
  Users,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Truck,
  ShieldCheck,
  TrendingUp,
  MapPin,
  ArrowUpRight,
} from 'lucide-react';

interface AdminDashboardOverviewProps {
  onNavigate: (tab: string) => void;
}

export const AdminDashboardOverview: React.FC<AdminDashboardOverviewProps> = ({ onNavigate }) => {
  const { complaints, pickups, collectors, hotspots } = useWasteManagement();

  // Metrics
  const totalComplaints = complaints.length;
  const pendingComplaints = complaints.filter(
    (c) => c.status === 'Pending' || c.status === 'Assigned' || c.status === 'In Progress'
  ).length;
  const resolvedComplaints = complaints.filter((c) => c.status === 'Resolved').length;
  const totalPickups = pickups.length;
  const activeCollectors = collectors.filter((c) => c.status !== 'Off Duty').length;
  const totalUsers = 1420;

  // Category counts
  const categories = [
    { label: 'Overflowing Bins', key: 'Overflowing Garbage Bin', color: 'bg-emerald-600' },
    { label: 'Road Garbage', key: 'Garbage on Road', color: 'bg-amber-500' },
    { label: 'Missed Collection', key: 'Missed Collection', color: 'bg-blue-500' },
    { label: 'Illegal Dumping', key: 'Illegal Dumping', color: 'bg-red-500' },
    { label: 'Improper Segregation', key: 'Improper Waste Segregation', color: 'bg-purple-500' },
  ];

  const categoryCounts = categories.map((cat) => ({
    ...cat,
    count: complaints.filter((c) => c.category === cat.key).length,
  }));

  const maxCategoryCount = Math.max(...categoryCounts.map((c) => c.count), 1);

  // Status breakdown
  const statusCounts = {
    Pending: complaints.filter((c) => c.status === 'Pending').length,
    Assigned: complaints.filter((c) => c.status === 'Assigned').length,
    'In Progress': complaints.filter((c) => c.status === 'In Progress').length,
    Resolved: complaints.filter((c) => c.status === 'Resolved').length,
  };

  return (
    <div className="space-y-6">
      {/* 6 Top Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Total Users */}
        <div className="bg-white border border-gray-200/90 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Citizens</span>
            <Users className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-xl font-extrabold text-gray-900 font-mono-numbers">
            {totalUsers.toLocaleString()}
          </p>
          <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5 mt-1 font-mono-numbers">
            <TrendingUp className="w-3 h-3" />
            <span>+12% this month</span>
          </span>
        </div>

        {/* Total Complaints */}
        <div
          onClick={() => onNavigate('complaints')}
          className="bg-white border border-gray-200/90 hover:border-[#2E7D32]/50 rounded-2xl p-4 shadow-sm cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Complaints</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-xl font-extrabold text-gray-900 font-mono-numbers">
            {totalComplaints}
          </p>
          <span className="text-[10px] text-gray-500 block mt-1">Total registered</span>
        </div>

        {/* Pending */}
        <div
          onClick={() => onNavigate('complaints')}
          className="bg-white border border-gray-200/90 hover:border-amber-400 rounded-2xl p-4 shadow-sm cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Pending Action</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-xl font-extrabold text-amber-600 font-mono-numbers">
            {pendingComplaints}
          </p>
          <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded font-semibold inline-block mt-1">
            Requires clearance
          </span>
        </div>

        {/* Resolved */}
        <div
          onClick={() => onNavigate('complaints')}
          className="bg-white border border-gray-200/90 hover:border-emerald-400 rounded-2xl p-4 shadow-sm cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Resolved</span>
            <CheckCircle2 className="w-4 h-4 text-[#2E7D32]" />
          </div>
          <p className="text-xl font-extrabold text-[#2E7D32] font-mono-numbers">
            {resolvedComplaints}
          </p>
          <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-semibold inline-block mt-1">
            {Math.round((resolvedComplaints / (totalComplaints || 1)) * 100)}% resolution rate
          </span>
        </div>

        {/* Pickup Requests */}
        <div
          onClick={() => onNavigate('pickups')}
          className="bg-white border border-gray-200/90 hover:border-blue-400 rounded-2xl p-4 shadow-sm cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Pickup Orders</span>
            <Truck className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-xl font-extrabold text-blue-600 font-mono-numbers">
            {totalPickups}
          </p>
          <span className="text-[10px] text-gray-500 block mt-1">Doorstep scheduled</span>
        </div>

        {/* Active Collectors */}
        <div
          onClick={() => onNavigate('collectors')}
          className="bg-white border border-gray-200/90 hover:border-emerald-400 rounded-2xl p-4 shadow-sm cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Active Crews</span>
            <ShieldCheck className="w-4 h-4 text-[#2E7D32]" />
          </div>
          <p className="text-xl font-extrabold text-gray-900 font-mono-numbers">
            {activeCollectors} / {collectors.length}
          </p>
          <span className="text-[10px] text-emerald-700 block mt-1">On active patrol</span>
        </div>
      </div>

      {/* Main Charts & Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Chart 1: Complaints by Category */}
        <div className="bg-white border border-gray-200/90 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-gray-900">Complaints by Category</h3>
              <p className="text-xs text-gray-500">Distribution across waste issue types</p>
            </div>
            <span className="text-xs font-bold text-gray-400 font-mono-numbers">
              {totalComplaints} Total
            </span>
          </div>

          <div className="space-y-3 pt-1">
            {categoryCounts.map((cat) => {
              const percentage = Math.round((cat.count / (totalComplaints || 1)) * 100);
              const barWidth = Math.max(12, Math.round((cat.count / maxCategoryCount) * 100));

              return (
                <div key={cat.label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-gray-700">{cat.label}</span>
                    <span className="font-mono-numbers font-bold text-gray-900">
                      {cat.count} ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${cat.color}`}
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 2: Resolution Status Donut / Breakdown */}
        <div className="bg-white border border-gray-200/90 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-gray-900">Complaint Lifecycle Pipeline</h3>
              <p className="text-xs text-gray-500">Real-time status tracking</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-3 text-center">
              <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">
                Pending
              </span>
              <p className="text-2xl font-extrabold text-amber-600 font-mono-numbers mt-1">
                {statusCounts.Pending}
              </p>
              <p className="text-[10px] text-amber-700 mt-0.5">Awaiting Review</p>
            </div>

            <div className="bg-blue-50 border border-blue-200/80 rounded-xl p-3 text-center">
              <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider">
                Assigned
              </span>
              <p className="text-2xl font-extrabold text-blue-600 font-mono-numbers mt-1">
                {statusCounts.Assigned}
              </p>
              <p className="text-[10px] text-blue-700 mt-0.5">Crew Dispatched</p>
            </div>

            <div className="bg-purple-50 border border-purple-200/80 rounded-xl p-3 text-center">
              <span className="text-[10px] font-bold text-purple-800 uppercase tracking-wider">
                In Progress
              </span>
              <p className="text-2xl font-extrabold text-purple-600 font-mono-numbers mt-1">
                {statusCounts['In Progress']}
              </p>
              <p className="text-[10px] text-purple-700 mt-0.5">On-Site Work</p>
            </div>

            <div className="bg-emerald-50 border border-emerald-200/80 rounded-xl p-3 text-center">
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                Resolved
              </span>
              <p className="text-2xl font-extrabold text-[#2E7D32] font-mono-numbers mt-1">
                {statusCounts.Resolved}
              </p>
              <p className="text-[10px] text-emerald-700 mt-0.5">Verified Proof</p>
            </div>
          </div>

          {/* Clean City Progress bar */}
          <div className="pt-2">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5 font-medium">
              <span>Overall Resolution Target (Goal: 90%)</span>
              <span className="font-bold text-[#2E7D32] font-mono-numbers">
                {Math.round((resolvedComplaints / (totalComplaints || 1)) * 100)}%
              </span>
            </div>
            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-[#2E7D32] rounded-full transition-all duration-500"
                style={{
                  width: `${Math.round((resolvedComplaints / (totalComplaints || 1)) * 100)}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Chart 3 & 4: Area Breakdown & Weekly Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Area-wise complaints */}
        <div className="bg-white border border-gray-200/90 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-gray-900">Area-wise Hotspots</h3>
              <p className="text-xs text-gray-500">Municipal zonal load distribution</p>
            </div>
            <button
              onClick={() => onNavigate('hotspots')}
              className="text-xs font-bold text-[#2E7D32] hover:underline flex items-center gap-0.5"
            >
              <span>View Map</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2 pt-1">
            {hotspots.map((hs) => (
              <div
                key={hs.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100/80 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                      hs.complaintLevel === 'High'
                        ? 'bg-red-500 animate-pulse'
                        : hs.complaintLevel === 'Medium'
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                  />
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">{hs.areaName}</h4>
                    <p className="text-[10px] text-gray-500">
                      Reported {hs.lastReported}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-gray-900 font-mono-numbers">
                    {hs.totalComplaints} complaints
                  </span>
                  <p className="text-[10px] text-gray-500 font-mono-numbers">
                    {hs.pendingComplaints} pending
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Trend (SVG Line Chart) */}
        <div className="bg-white border border-gray-200/90 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-gray-900">Weekly Incident vs Resolution Trend</h3>
              <p className="text-xs text-gray-500">Past 7 days reporting volume</p>
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1 text-gray-600">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span>New</span>
              </span>
              <span className="flex items-center gap-1 text-gray-600">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2E7D32]" />
                <span>Resolved</span>
              </span>
            </div>
          </div>

          {/* SVG Line / Bar Visual representation */}
          <div className="h-44 w-full pt-4">
            <svg className="w-full h-full" viewBox="0 0 400 140" fill="none">
              {/* Horizontal grid lines */}
              <line x1="20" y1="20" x2="380" y2="20" stroke="#F1F5F9" strokeWidth="1" />
              <line x1="20" y1="60" x2="380" y2="60" stroke="#F1F5F9" strokeWidth="1" />
              <line x1="20" y1="100" x2="380" y2="100" stroke="#F1F5F9" strokeWidth="1" />

              {/* Curve 1: New complaints */}
              <path
                d="M 30 90 Q 90 40 150 70 T 270 35 T 370 50"
                stroke="#3B82F6"
                strokeWidth="3"
                fill="none"
              />

              {/* Curve 2: Resolved */}
              <path
                d="M 30 110 Q 90 75 150 85 T 270 45 T 370 30"
                stroke="#2E7D32"
                strokeWidth="3"
                fill="none"
              />

              {/* Data points */}
              <circle cx="30" cy="90" r="4" fill="#3B82F6" />
              <circle cx="150" cy="70" r="4" fill="#3B82F6" />
              <circle cx="270" cy="35" r="4" fill="#3B82F6" />
              <circle cx="370" cy="50" r="4" fill="#3B82F6" />

              <circle cx="30" cy="110" r="4" fill="#2E7D32" />
              <circle cx="150" cy="85" r="4" fill="#2E7D32" />
              <circle cx="270" cy="45" r="4" fill="#2E7D32" />
              <circle cx="370" cy="30" r="4" fill="#2E7D32" />
            </svg>

            {/* Day labels */}
            <div className="flex justify-between text-[10px] text-gray-400 font-mono-numbers px-2 pt-1 border-t border-gray-100">
              <span>Mon 23</span>
              <span>Tue 24</span>
              <span>Wed 25</span>
              <span>Thu 26</span>
              <span>Fri 27</span>
              <span>Sat 28</span>
              <span>Sun 29</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

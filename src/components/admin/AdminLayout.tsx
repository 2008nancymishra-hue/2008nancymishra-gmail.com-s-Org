import React, { useState } from 'react';
import { useWasteManagement } from '../../context/WasteManagementContext';
import { AdminDashboardOverview } from './AdminDashboardOverview';
import { AdminComplaintsTable } from './AdminComplaintsTable';
import { AdminPickupsTable } from './AdminPickupsTable';
import { AdminHotspotsMap } from './AdminHotspotsMap';
import { AdminAwarenessManager } from './AdminAwarenessManager';
import { AdminCollectorsList } from './AdminCollectorsList';
import {
  LayoutDashboard,
  AlertCircle,
  Truck,
  MapPin,
  Users,
  BookOpen,
  Bell,
  BarChart3,
  Settings,
  ShieldCheck,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { complaints, pickups, setIsGitHubModalOpen, showToast } = useWasteManagement();

  const pendingComplaintsCount = complaints.filter(
    (c) => c.status === 'Pending' || c.status === 'Assigned' || c.status === 'In Progress'
  ).length;

  const pendingPickupsCount = pickups.filter(
    (p) => p.status === 'Waiting for Assignment' || p.status === 'Assigned'
  ).length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'complaints', label: 'Complaints', icon: AlertCircle, badge: pendingComplaintsCount },
    { id: 'pickups', label: 'Pickup Requests', icon: Truck, badge: pendingPickupsCount },
    { id: 'hotspots', label: 'Waste Hotspots', icon: MapPin },
    { id: 'collectors', label: 'Collectors & Fleets', icon: Users },
    { id: 'awareness', label: 'Awareness CMS', icon: BookOpen },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="flex-1 flex flex-col md:flex-row min-h-screen bg-[#F4F7F4]">
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-[#163819] text-white p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg bg-white/10 text-white"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <span className="font-bold text-sm">Sanitation Control Admin</span>
        </div>
        <span className="text-xs text-emerald-300 font-mono">Control Room</span>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-[#143317] text-white border-r border-[#2E7D32]/30 flex flex-col justify-between transition-transform duration-200 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-4 space-y-5">
          {/* Logo / Title */}
          <div className="flex items-center gap-3 pb-3 border-b border-white/10">
            <div className="w-9 h-9 rounded-xl bg-[#2E7D32] flex items-center justify-center text-white ring-2 ring-white/20 shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-sm leading-tight text-white">Sanitation Authority</h2>
              <p className="text-[10px] text-emerald-300 font-mono">Municipal Command</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    active
                      ? 'bg-[#2E7D32] text-white shadow-sm ring-1 ring-white/20'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-400 text-gray-900 font-mono-numbers">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer info & GitHub repo */}
        <div className="p-4 border-t border-white/10 bg-[#0e2611] space-y-2.5">
          <button
            onClick={() => setIsGitHubModalOpen(true)}
            className="w-full py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center justify-between transition-colors border border-white/10"
          >
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span>GitHub Repository</span>
            </div>
            <span className="text-[10px] text-amber-300 font-mono font-bold">★ 128</span>
          </button>

          <div className="flex items-center justify-between text-[11px] text-emerald-300">
            <span>System Status:</span>
            <span className="font-bold text-emerald-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Operational</span>
            </span>
          </div>
          <p className="text-[10px] text-gray-400 font-mono">
            Smart Waste OS · v2026.4
          </p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full space-y-6 overflow-y-auto">
        {/* Top Breadcrumb & Status */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
              <span>Admin Console</span>
              <span>/</span>
              <span className="text-gray-900 font-semibold capitalize">{activeTab}</span>
            </div>
            <h1 className="text-xl font-extrabold text-gray-900 tracking-tight capitalize mt-0.5">
              {activeTab === 'dashboard'
                ? 'Executive Civic Overview'
                : activeTab === 'hotspots'
                ? 'Geospatial Waste Hotspots'
                : activeTab}
            </h1>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <div className="bg-white border border-gray-200 px-3 py-1.5 rounded-xl text-xs flex items-center gap-2 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="font-medium text-gray-700">Central Zone: Sector 14</span>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        {activeTab === 'dashboard' && (
          <AdminDashboardOverview onNavigate={(t) => setActiveTab(t)} />
        )}
        {activeTab === 'complaints' && <AdminComplaintsTable />}
        {activeTab === 'pickups' && <AdminPickupsTable />}
        {activeTab === 'hotspots' && <AdminHotspotsMap />}
        {activeTab === 'collectors' && <AdminCollectorsList />}
        {activeTab === 'awareness' && <AdminAwarenessManager />}

        {activeTab === 'reports' && (
          <div className="bg-white border border-gray-200/90 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-gray-900">
              Monthly Waste Audit & Environmental Impact Report
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl">
                <span className="text-xs font-bold text-emerald-800 uppercase">Plastic Diverted</span>
                <p className="text-2xl font-extrabold text-[#2E7D32] font-mono-numbers mt-1">
                  14.8 Tons
                </p>
                <p className="text-xs text-emerald-700 mt-1">From city storm drains into recycling plants.</p>
              </div>
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-2xl">
                <span className="text-xs font-bold text-blue-800 uppercase">E-Waste Recovered</span>
                <p className="text-2xl font-extrabold text-blue-700 font-mono-numbers mt-1">
                  3.2 Tons
                </p>
                <p className="text-xs text-blue-700 mt-1">Certified copper & lead smelting recovery.</p>
              </div>
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl">
                <span className="text-xs font-bold text-amber-800 uppercase">Average Resolution Time</span>
                <p className="text-2xl font-extrabold text-amber-700 font-mono-numbers mt-1">
                  2.4 Hours
                </p>
                <p className="text-xs text-amber-700 mt-1">From citizen submission to verification photo.</p>
              </div>
            </div>
            <button
              onClick={() =>
                showToast({
                  type: 'success',
                  title: 'Audit Report Generated',
                  message: 'Clean City Monthly Audit compiled & ready for municipal review.',
                })
              }
              className="px-4 py-2.5 bg-[#2E7D32] hover:bg-[#256629] text-white text-xs font-bold rounded-xl shadow-sm"
            >
              Export Monthly Audit PDF
            </button>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white border border-gray-200/90 rounded-2xl p-6 shadow-sm space-y-4 max-w-2xl">
            <h3 className="text-base font-bold text-gray-900">Municipal Control Settings</h3>
            <div className="space-y-3 text-xs text-gray-700">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-bold text-gray-900">Auto-Dispatch Rapid Squad</p>
                  <p className="text-gray-500">Automatically assign nearest driver when Critical priority flagged</p>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#2E7D32]" />
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-bold text-gray-900">Citizen SMS & Push Notifications</p>
                  <p className="text-gray-500">Send real-time updates on vehicle arrival</p>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#2E7D32]" />
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-bold text-gray-900">Geofence Boundary Alert</p>
                  <p className="text-gray-500">Alert sanitation officers if waste vehicle deviates from zone</p>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#2E7D32]" />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

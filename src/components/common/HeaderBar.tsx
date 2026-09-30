import React from 'react';
import { useWasteManagement } from '../../context/WasteManagementContext';
import { UserRole } from '../../types';
import {
  Smartphone,
  Monitor,
  RotateCcw,
  User,
  Truck,
  ShieldCheck,
  Github,
  Star,
  Activity,
} from 'lucide-react';

export const HeaderBar: React.FC = () => {
  const {
    userRole,
    setUserRole,
    isDeviceFrame,
    setIsDeviceFrame,
    resetDemoData,
    isBackendConnected,
    setIsGitHubModalOpen,
    setActiveCitizenTab,
    showToast,
  } = useWasteManagement();

  const roles: { role: UserRole; label: string; icon: React.ReactNode; desc: string }[] = [
    { role: 'citizen', label: 'Citizen', icon: <User className="w-3.5 h-3.5" />, desc: 'Rahul (Resident)' },
    { role: 'collector', label: 'Collector', icon: <Truck className="w-3.5 h-3.5" />, desc: 'Vikram (Driver)' },
    { role: 'admin', label: 'Admin', icon: <ShieldCheck className="w-3.5 h-3.5" />, desc: 'Sanitation Officer' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#163819] text-white border-b border-[#2E7D32]/40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-3">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#2E7D32] flex items-center justify-center text-white shadow-sm ring-1 ring-white/20">
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5" />
              <path d="M11 19h8.2a1.8 1.8 0 0 0 1.5-2.6l-3.9-6.9" />
              <path d="m14 12 3-6-4.5-1.5" />
              <path d="M15.5 15.5 19 19l-3.5 3.5" />
              <path d="m4.5 14-2.5 2.5 3.5 3.5" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-tight text-white">Smart Waste Management</span>
              {/* Backend status chip */}
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="hidden sm:inline">REST API</span>
              </span>
            </div>
            <p className="text-[11px] text-emerald-200/80 hidden sm:block">Clean City, Green City</p>
          </div>
        </div>

        {/* Role Switcher */}
        <div className="flex items-center bg-[#0d2610] p-1 rounded-xl border border-white/10 shadow-inner">
          <span className="text-[11px] font-medium text-emerald-300/80 px-2 hidden md:inline">
            Persona:
          </span>
          <div className="flex items-center gap-1">
            {roles.map((r) => {
              const active = userRole === r.role;
              return (
                <button
                  key={r.role}
                  onClick={() => {
                    setUserRole(r.role);
                    if (r.role === 'citizen') {
                      setActiveCitizenTab('home');
                    }
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    active
                      ? 'bg-[#2E7D32] text-white shadow-sm ring-1 ring-white/30'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                  title={r.desc}
                >
                  {r.icon}
                  <span>{r.label}</span>
                  {active && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Actions: GitHub Repo, Frame toggle, Reset */}
        <div className="flex items-center gap-2">
          {/* GitHub Repo Button */}
          <button
            onClick={() => setIsGitHubModalOpen(true)}
            className="px-3 py-1.5 bg-[#0d2610] hover:bg-[#123315] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-white/15 shadow-sm active:scale-95 transition-all"
            title="View Project on GitHub & Source Code"
          >
            <Github className="w-4 h-4" />
            <span className="hidden sm:inline">GitHub</span>
            <span className="text-[10px] text-amber-300 flex items-center gap-0.5 font-mono ml-0.5">
              <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
              <span>128</span>
            </span>
          </button>

          {/* Mobile frame toggle */}
          <div className="flex items-center bg-white/10 rounded-lg p-0.5 border border-white/10">
            <button
              onClick={() => setIsDeviceFrame(true)}
              className={`p-1.5 rounded-md text-xs flex items-center gap-1 transition-colors ${
                isDeviceFrame ? 'bg-[#2E7D32] text-white' : 'text-gray-300 hover:text-white'
              }`}
              title="Mobile Device Frame View"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="text-[11px] hidden lg:inline">Mobile Frame</span>
            </button>
            <button
              onClick={() => setIsDeviceFrame(false)}
              className={`p-1.5 rounded-md text-xs flex items-center gap-1 transition-colors ${
                !isDeviceFrame ? 'bg-[#2E7D32] text-white' : 'text-gray-300 hover:text-white'
              }`}
              title="Fluid Full Screen View"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="text-[11px] hidden lg:inline">Expanded</span>
            </button>
          </div>

          {/* Reset Demo Data */}
          <button
            onClick={() => resetDemoData()}
            className="p-1.5 text-xs text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors flex items-center gap-1 border border-white/10"
            title="Reset Database to Seed State"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="text-[11px] hidden lg:inline">Reset</span>
          </button>
        </div>
      </div>
    </header>
  );
};


import React from 'react';
import { Home, AlertCircle, Truck, BookOpen, User } from 'lucide-react';
import { useWasteManagement } from '../../context/WasteManagementContext';

export const CitizenBottomNav: React.FC = () => {
  const { activeCitizenTab, setActiveCitizenTab } = useWasteManagement();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'complaints', label: 'Complaints', icon: AlertCircle },
    { id: 'pickup', label: 'Pickup', icon: Truck },
    { id: 'awareness', label: 'Awareness', icon: BookOpen },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="sticky bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200/80 px-2 py-1 shrink-0 shadow-[0_-4px_16px_rgba(0,0,0,0.04)]">
      <div className="grid grid-cols-5 items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            activeCitizenTab === item.id ||
            (item.id === 'complaints' &&
              (activeCitizenTab === 'complaint-details' ||
                activeCitizenTab === 'complaint-success' ||
                activeCitizenTab === 'report-form')) ||
            (item.id === 'pickup' &&
              (activeCitizenTab === 'pickup-request' ||
                activeCitizenTab === 'pickup-confirmation'));

          return (
            <button
              key={item.id}
              onClick={() => setActiveCitizenTab(item.id)}
              className="min-h-[48px] flex flex-col items-center justify-center relative py-1 rounded-xl transition-all"
            >
              <div
                className={`p-1 rounded-xl transition-all ${
                  isActive
                    ? 'text-[#2E7D32] bg-[#E8F5E9] scale-105'
                    : 'text-gray-400 hover:text-gray-700'
                }`}
              >
                <Icon className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span
                className={`text-[10px] font-semibold tracking-tight mt-0.5 transition-colors ${
                  isActive ? 'text-[#2E7D32]' : 'text-gray-500'
                }`}
              >
                {item.label}
              </span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-[#2E7D32] absolute bottom-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

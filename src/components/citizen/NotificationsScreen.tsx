import React from 'react';
import { useWasteManagement } from '../../context/WasteManagementContext';
import {
  ArrowLeft,
  CheckCircle,
  Truck,
  AlertCircle,
  BookOpen,
  Check,
  BellOff,
} from 'lucide-react';

interface NotificationsScreenProps {
  onBack: () => void;
}

export const NotificationsScreen: React.FC<NotificationsScreenProps> = ({ onBack }) => {
  const {
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    setActiveCitizenTab,
    setSelectedComplaintId,
    setSelectedPickupId,
  } = useWasteManagement();

  const handleNotificationClick = (notif: typeof notifications[0]) => {
    markNotificationAsRead(notif.id);

    if (notif.type === 'complaint' && notif.targetId) {
      setSelectedComplaintId(notif.targetId);
      setActiveCitizenTab('complaint-details');
    } else if (notif.type === 'pickup' && notif.targetId) {
      setSelectedPickupId(notif.targetId);
      setActiveCitizenTab('pickup');
    } else if (notif.type === 'awareness') {
      setActiveCitizenTab('awareness');
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'complaint':
        return <AlertCircle className="w-4 h-4 text-blue-600" />;
      case 'pickup':
        return <Truck className="w-4 h-4 text-[#2E7D32]" />;
      case 'awareness':
        return <BookOpen className="w-4 h-4 text-amber-600" />;
      default:
        return <CheckCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F7F9F7] pb-20">
      {/* Sticky Header */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md px-4 py-3 border-b border-gray-200/80 flex items-center justify-between">
        <button
          onClick={onBack}
          className="p-2 -ml-2 rounded-xl text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-sm font-bold text-gray-900">Notifications</h1>
        <button
          onClick={markAllNotificationsAsRead}
          className="text-xs font-bold text-[#2E7D32] hover:underline"
        >
          Mark all read
        </button>
      </div>

      <div className="p-4 space-y-2.5">
        {notifications.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-gray-200 shadow-sm mt-4">
            <BellOff className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-gray-800">No new notifications</h3>
            <p className="text-xs text-gray-500 mt-1">
              You're all caught up with your civic updates!
            </p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => handleNotificationClick(notif)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                notif.read
                  ? 'bg-white border-gray-200/80 text-gray-700 hover:bg-gray-50'
                  : 'bg-emerald-50/50 border-emerald-300 shadow-sm text-gray-900'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  notif.read ? 'bg-gray-100' : 'bg-white shadow-sm ring-1 ring-emerald-200'
                }`}
              >
                {getIcon(notif.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold truncate leading-tight">
                    {notif.title}
                  </h4>
                  {!notif.read && (
                    <span className="w-2 h-2 rounded-full bg-[#2E7D32] shrink-0 ml-1.5" />
                  )}
                </div>
                <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">
                  {notif.message}
                </p>
                <span className="text-[10px] text-gray-400 font-mono-numbers mt-1.5 block">
                  {notif.timestamp}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

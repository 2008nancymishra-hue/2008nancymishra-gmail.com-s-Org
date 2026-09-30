import React, { useState } from 'react';
import { useWasteManagement } from '../../context/WasteManagementContext';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Building,
  Edit2,
  FileText,
  Truck,
  Bell,
  HelpCircle,
  Shield,
  LogOut,
  ChevronRight,
  Sparkles,
  Award,
} from 'lucide-react';

interface ProfileScreenProps {
  onLogout: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ onLogout }) => {
  const {
    currentUser,
    updateUserProfile,
    setActiveCitizenTab,
    complaints,
    pickups,
    resetDemoData,
    setIsGitHubModalOpen,
    showToast,
  } = useWasteManagement();

  const [isEditing, setIsEditing] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [editForm, setEditForm] = useState({
    name: currentUser.name,
    phone: currentUser.phone,
    email: currentUser.email,
    address: currentUser.address,
    city: currentUser.city,
  });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile(editForm);
    setIsEditing(false);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F7F9F7] pb-24">
      {/* Top Banner / Avatar Header */}
      <div className="bg-gradient-to-b from-[#1B5E20] to-[#2E7D32] pt-6 pb-8 px-4 text-white rounded-b-3xl shadow-sm relative">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-base font-bold text-white">Citizen Profile</h1>
          <button
            onClick={() => setIsEditing(true)}
            className="px-3 py-1 bg-white/15 hover:bg-white/25 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Edit2 className="w-3 h-3" />
            <span>Edit</span>
          </button>
        </div>

        <div className="flex items-center gap-3.5">
          <div className="w-16 h-16 rounded-full ring-4 ring-white/30 overflow-hidden shadow-lg bg-white shrink-0">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-white leading-tight">
              {currentUser.name}
            </h2>
            <p className="text-xs text-emerald-100 font-mono-numbers mt-0.5">
              {currentUser.phone}
            </p>
            <p className="text-[11px] text-emerald-200 mt-0.5 truncate max-w-[200px]">
              {currentUser.email}
            </p>
          </div>
        </div>

        {/* Eco-Karma Card */}
        <div className="mt-5 bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center">
              <Award className="w-5 h-5 fill-amber-300 text-amber-300" />
            </div>
            <div>
              <p className="text-[10px] text-emerald-100 uppercase tracking-wider font-bold">
                Citizen Eco-Karma
              </p>
              <p className="text-sm font-extrabold text-white font-mono-numbers">
                {currentUser.ecoKarmaPoints} Points
              </p>
            </div>
          </div>
          <span className="text-[10px] bg-emerald-400/20 text-emerald-100 px-2 py-0.5 rounded-full font-semibold border border-emerald-300/30">
            Civic Champion
          </span>
        </div>
      </div>

      {/* Stats Summary row */}
      <div className="px-4 -mt-3">
        <div className="bg-white rounded-2xl p-3 shadow-sm border border-gray-200/90 grid grid-cols-2 divide-x divide-gray-100 text-center">
          <div>
            <p className="text-sm font-extrabold text-gray-900 font-mono-numbers">
              {complaints.length}
            </p>
            <p className="text-[11px] text-gray-500 font-medium">Complaints Logged</p>
          </div>
          <div>
            <p className="text-sm font-extrabold text-gray-900 font-mono-numbers">
              {pickups.length}
            </p>
            <p className="text-[11px] text-gray-500 font-medium">Doorstep Pickups</p>
          </div>
        </div>
      </div>

      {/* Profile Details List */}
      <div className="p-4 space-y-4">
        {/* Address Card */}
        <div className="bg-white rounded-2xl p-3.5 shadow-sm border border-gray-200/90 space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
            Registered Municipal Address
          </span>
          <div className="flex items-start gap-2.5 text-xs text-gray-700">
            <MapPin className="w-4 h-4 text-[#2E7D32] shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-gray-900">{currentUser.address}</p>
              <p className="text-gray-500 font-medium">{currentUser.city}</p>
            </div>
          </div>
        </div>

        {/* Options list */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200/90 divide-y divide-gray-100 overflow-hidden">
          <button
            onClick={() => setActiveCitizenTab('complaints')}
            className="w-full p-3.5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900">My Complaints</h4>
                <p className="text-[10px] text-gray-500">Track status & history</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>

          <button
            onClick={() => setActiveCitizenTab('pickup')}
            className="w-full p-3.5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#2E7D32] flex items-center justify-center">
                <Truck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900">My Pickup Requests</h4>
                <p className="text-[10px] text-gray-500">Doorstep scheduled vans</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>

          <button
            onClick={() => setActiveCitizenTab('notifications')}
            className="w-full p-3.5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900">Notifications</h4>
                <p className="text-[10px] text-gray-500">Updates & alerts</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>

          <button
            onClick={() => setShowHelp(true)}
            className="w-full p-3.5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <HelpCircle className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900">Help & Civic Helpline</h4>
                <p className="text-[10px] text-gray-500">Sanitation control room</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>

          <button
            onClick={() => setIsGitHubModalOpen(true)}
            className="w-full p-3.5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gray-900 text-white flex items-center justify-center">
                <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900">GitHub Repository & Source</h4>
                <p className="text-[10px] text-gray-500">Clone commands & REST API docs</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>

          <button
            onClick={() =>
              showToast({
                type: 'info',
                title: 'Data Governance Act 2026',
                message: 'All geotagged coordinates and personal IDs are encrypted under Civic Privacy standards.',
              })
            }
            className="w-full p-3.5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gray-50 text-gray-600 flex items-center justify-center">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900">Privacy & Terms</h4>
                <p className="text-[10px] text-gray-500">Citizen data protections</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>

          <button
            onClick={onLogout}
            className="w-full p-3.5 text-left flex items-center justify-between hover:bg-red-50 transition-colors text-red-600"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                <LogOut className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold">Log Out</h4>
                <p className="text-[10px] text-red-500">Switch profile or exit</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-red-400" />
          </button>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <form
            onSubmit={handleSaveProfile}
            className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl space-y-3"
          >
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-900">Edit Profile</h3>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="w-7 h-7 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-xs"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#2E7D32]"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-700 mb-1">Phone</label>
              <input
                type="text"
                value={editForm.phone}
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#2E7D32]"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-700 mb-1">Address</label>
              <input
                type="text"
                value={editForm.address}
                onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#2E7D32]"
                required
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-[#2E7D32] text-white rounded-xl text-xs font-bold shadow-md"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-900">Sanitation Help & Support</h3>
              <button
                type="button"
                onClick={() => setShowHelp(false)}
                className="w-7 h-7 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-gray-700">
              <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
                <p className="font-bold text-emerald-900">Municipal 24x7 Waste Helpline</p>
                <p className="font-mono-numbers text-sm font-bold text-[#2E7D32] mt-0.5">
                  1800-11-2026 (Toll Free)
                </p>
                <p className="text-[10px] text-emerald-700 mt-1">
                  Call for emergency road blockage, animal carcasses, or chemical spills.
                </p>
              </div>

              <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl">
                <p className="font-bold text-gray-900">Sanitation Control Room</p>
                <p className="text-gray-600 mt-0.5">
                  Civic Center, 4th Floor, Sector 14, New Delhi.
                </p>
                <p className="text-[10px] text-gray-500 mt-1 font-mono-numbers">
                  Email: control.room@smartwaste.gov.in
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowHelp(false)}
              className="w-full py-2.5 bg-[#2E7D32] text-white rounded-xl text-xs font-bold shadow-md"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

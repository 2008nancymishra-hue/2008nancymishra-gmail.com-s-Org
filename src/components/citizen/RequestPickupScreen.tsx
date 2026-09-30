import React, { useState } from 'react';
import { useWasteManagement } from '../../context/WasteManagementContext';
import { WasteType, WasteQuantity } from '../../types';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Check,
  Truck,
  Sparkles,
  Info,
} from 'lucide-react';

interface RequestPickupScreenProps {
  onBack: () => void;
  onSuccess: (pickupId: string) => void;
}

export const RequestPickupScreen: React.FC<RequestPickupScreenProps> = ({ onBack, onSuccess }) => {
  const { addPickupRequest, currentUser, showToast } = useWasteManagement();

  const wasteTypes: { type: WasteType; icon: string; desc: string; rebate: string }[] = [
    { type: 'Dry Waste', icon: '📦', desc: 'Paper, cardboard, carton packs', rebate: '+15 pts' },
    { type: 'Plastic', icon: '🧴', desc: 'PET bottles, containers, bags', rebate: '+20 pts' },
    { type: 'E-Waste', icon: '💻', desc: 'Laptops, phones, old cables', rebate: '+50 pts' },
    { type: 'Wet Waste', icon: '🥗', desc: 'Bulk garden compost/leaves', rebate: '+10 pts' },
    { type: 'Hazardous', icon: '🧪', desc: 'Batteries, paint cans, solvents', rebate: '+30 pts' },
    { type: 'Other', icon: '♻️', desc: 'Metal scrap, glass bottles', rebate: '+15 pts' },
  ];

  const quantities: { label: WasteQuantity; size: string; helper: string }[] = [
    { label: 'Small (1-2 bags)', size: 'Small', helper: 'Up to 5 kg' },
    { label: 'Medium (3-5 bags)', size: 'Medium', helper: '5 to 15 kg' },
    { label: 'Large (6+ bags / Bulk)', size: 'Large', helper: '15+ kg / Furniture' },
  ];

  const availableDates = [
    { label: 'Today', date: '29 Sep 2026', sub: 'Urgent Slot' },
    { label: 'Tomorrow', date: '30 Sep 2026', sub: 'Standard' },
    { label: 'Thursday', date: '01 Oct 2026', sub: 'Standard' },
    { label: 'Friday', date: '02 Oct 2026', sub: 'Standard' },
  ];

  const timeSlots = [
    '08:00 AM - 10:00 AM',
    '10:00 AM - 12:00 PM',
    '02:00 PM - 04:00 PM',
    '04:00 PM - 06:00 PM',
  ];

  const [wasteType, setWasteType] = useState<WasteType>('E-Waste');
  const [quantity, setQuantity] = useState<WasteQuantity>('Small (1-2 bags)');
  const [selectedDate, setSelectedDate] = useState('30 September 2026');
  const [timeSlot, setTimeSlot] = useState('10:00 AM - 12:00 PM');
  const [address, setAddress] = useState(currentUser.address);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) {
      showToast({
        type: 'warning',
        title: 'Address Required',
        message: 'Please confirm your doorstep pickup address.',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const newPickup = await addPickupRequest({
        wasteType,
        quantity,
        address,
        area: 'Sector 14',
        date: selectedDate,
        timeSlot,
        notes,
      });
      setIsSubmitting(false);
      onSuccess(newPickup.id);
    } catch {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F7F9F7] pb-16">
      {/* Sticky Header */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md px-4 py-3 border-b border-gray-200/80 flex items-center justify-between">
        <button
          onClick={onBack}
          className="p-2 -ml-2 rounded-xl text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-sm font-bold text-gray-900">Request Waste Pickup</h1>
        <div className="w-8" />
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        {/* Step 1: Waste Type */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
            1. Select Waste Stream <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {wasteTypes.map((item) => {
              const active = wasteType === item.type;
              return (
                <button
                  type="button"
                  key={item.type}
                  onClick={() => setWasteType(item.type)}
                  className={`p-2.5 rounded-xl border text-left transition-all flex items-start gap-2 ${
                    active
                      ? 'bg-[#E8F5E9] border-[#2E7D32] ring-1 ring-[#2E7D32]'
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <div className="min-w-0">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold ${active ? 'text-[#2E7D32]' : 'text-gray-900'}`}>
                        {item.type}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-500 truncate mt-0.5">{item.desc}</p>
                    <span className="text-[9px] font-semibold text-emerald-700 font-mono-numbers">
                      {item.rebate}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Waste Quantity */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
            2. Estimated Quantity <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {quantities.map((q) => {
              const active = quantity === q.label;
              return (
                <button
                  type="button"
                  key={q.label}
                  onClick={() => setQuantity(q.label)}
                  className={`p-2 rounded-xl border text-center transition-all ${
                    active
                      ? 'bg-[#2E7D32] text-white border-[#2E7D32] shadow-sm'
                      : 'bg-white text-gray-800 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <p className="text-xs font-bold">{q.size}</p>
                  <p className={`text-[10px] mt-0.5 ${active ? 'text-emerald-100' : 'text-gray-500'}`}>
                    {q.helper}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 3: Date & Slot Selection */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
            3. Choose Date & Time Window <span className="text-red-500">*</span>
          </label>
          <div className="bg-white border border-gray-200/90 rounded-2xl p-3 shadow-sm space-y-3">
            {/* Dates row */}
            <div>
              <span className="text-[11px] font-semibold text-gray-600 mb-1.5 block">
                Pickup Date:
              </span>
              <div className="grid grid-cols-2 gap-2">
                {availableDates.map((d) => {
                  const active = selectedDate.includes(d.date.split(' ')[0]);
                  return (
                    <button
                      type="button"
                      key={d.date}
                      onClick={() => setSelectedDate(d.date)}
                      className={`p-2 rounded-xl border text-left transition-all ${
                        active
                          ? 'bg-[#E8F5E9] border-[#2E7D32] text-[#2E7D32]'
                          : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <p className="text-xs font-bold">{d.label}</p>
                      <p className="text-[10px] opacity-80 font-mono-numbers">{d.date}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Slot */}
            <div>
              <span className="text-[11px] font-semibold text-gray-600 mb-1.5 block">
                Preferred Time Slot:
              </span>
              <div className="grid grid-cols-2 gap-2">
                {timeSlots.map((slot) => {
                  const active = timeSlot === slot;
                  return (
                    <button
                      type="button"
                      key={slot}
                      onClick={() => setTimeSlot(slot)}
                      className={`py-2 px-2.5 rounded-xl border text-xs font-bold font-mono-numbers text-center transition-all ${
                        active
                          ? 'bg-[#2E7D32] text-white border-[#2E7D32] shadow-sm'
                          : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Step 4: Address */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
            4. Doorstep Address & Notes <span className="text-red-500">*</span>
          </label>
          <div className="bg-white border border-gray-200/90 rounded-2xl p-3 shadow-sm space-y-2">
            <div className="relative">
              <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Apartment / Flat, Building, Street"
                className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#2E7D32] focus:outline-none"
                required
              />
            </div>

            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Special instructions (e.g., ring doorbell 402, heavy cardboard carton near lift)"
              className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#2E7D32] focus:outline-none resize-none"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="pt-1">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 bg-[#2E7D32] hover:bg-[#256629] text-white font-bold text-sm rounded-xl shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Scheduling Doorstep Van...</span>
            ) : (
              <>
                <Truck className="w-4 h-4" />
                <span>Request Pickup</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

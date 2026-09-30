import React, { useState } from 'react';
import { useWasteManagement } from '../../context/WasteManagementContext';
import { ComplaintCategory, ComplaintPriority } from '../../types';
import {
  ArrowLeft,
  Camera,
  Upload,
  MapPin,
  Check,
  AlertTriangle,
  Sparkles,
  Crosshair,
  Info,
} from 'lucide-react';

interface ReportWasteScreenProps {
  onBack: () => void;
  onSuccess: (complaintId: string) => void;
}

export const ReportWasteScreen: React.FC<ReportWasteScreenProps> = ({ onBack, onSuccess }) => {
  const { addComplaint, currentUser, showToast } = useWasteManagement();

  const categories: { label: ComplaintCategory; icon: string; desc: string }[] = [
    { label: 'Overflowing Garbage Bin', icon: '🗑️', desc: 'Municipal dumpster spill' },
    { label: 'Garbage on Road', icon: '🛣️', desc: 'Roadside litter or debris' },
    { label: 'Missed Collection', icon: '🚛', desc: 'Scheduled truck skipped lane' },
    { label: 'Illegal Dumping', icon: '⚠️', desc: 'Hazardous or commercial waste' },
    { label: 'Improper Waste Segregation', icon: '♻️', desc: 'Mixed recyclable bins' },
    { label: 'Other', icon: '📍', desc: 'Civic sanitation hazard' },
  ];

  const samplePhotos = [
    {
      title: 'Overflowing Bin',
      url: 'https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?w=600&auto=format&fit=crop&q=80',
    },
    {
      title: 'Road Litter',
      url: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=600&auto=format&fit=crop&q=80',
    },
    {
      title: 'Mixed Waste',
      url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&auto=format&fit=crop&q=80',
    },
    {
      title: 'Illegal Dumping',
      url: 'https://images.unsplash.com/photo-1528323273322-d81458248d40?w=600&auto=format&fit=crop&q=80',
    },
  ];

  const [category, setCategory] = useState<ComplaintCategory>('Overflowing Garbage Bin');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState<string>(samplePhotos[0].url);
  const [address, setAddress] = useState('Gate 2, Green Meadows Society, Sector 14');
  const [area, setArea] = useState('Sector 14');
  const [priority, setPriority] = useState<ComplaintPriority>('High');
  const [pinPosition, setPinPosition] = useState<{ x: number; y: number }>({ x: 50, y: 48 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);

  const handleUseCurrentLocation = () => {
    setPinPosition({ x: 48, y: 52 });
    setAddress('Near Metro Pillar 184, Ring Road, Sector 14');
    setArea('Sector 14');
  };

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
    setPinPosition({ x, y });
    setAddress(`Geotagged Location [Pin at ${x}%, ${y}%], Sector 14`);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      showToast({
        type: 'warning',
        title: 'Description Needed',
        message: 'Please provide a brief description of the waste issue.',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const newComplaint = await addComplaint({
        category,
        description,
        imageUrl,
        location: {
          lat: 28.5355,
          lng: 77.241,
          address,
          area,
        },
        priority,
      });
      setIsSubmitting(false);
      onSuccess(newComplaint.id);
    } catch {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F7F9F7] pb-12">
      {/* Top Header */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md px-4 py-3 border-b border-gray-200/80 flex items-center justify-between">
        <button
          onClick={onBack}
          className="p-2 -ml-2 rounded-xl text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-sm font-bold text-gray-900">Report a Waste Issue</h1>
        <div className="w-8" />
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        {/* Category Selection */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
            1. Select Waste Category <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {categories.map((c) => {
              const selected = category === c.label;
              return (
                <button
                  type="button"
                  key={c.label}
                  onClick={() => setCategory(c.label)}
                  className={`p-2.5 rounded-xl border text-left transition-all flex items-start gap-2 ${
                    selected
                      ? 'bg-[#E8F5E9] border-[#2E7D32] ring-1 ring-[#2E7D32]'
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-lg">{c.icon}</span>
                  <div className="min-w-0">
                    <p className={`text-xs font-bold leading-tight ${selected ? 'text-[#2E7D32]' : 'text-gray-900'}`}>
                      {c.label}
                    </p>
                    <p className="text-[10px] text-gray-500 mt-0.5 truncate">{c.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Photo Upload / Camera Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
              2. Upload Photo Evidence <span className="text-red-500">*</span>
            </label>
            <span className="text-[11px] text-[#2E7D32] font-semibold">Geotagged</span>
          </div>

          <div className="bg-white border border-gray-200/90 rounded-2xl p-3 shadow-sm">
            {/* Image Preview */}
            <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100 border border-gray-200 mb-3 flex items-center justify-center">
              <img
                src={imageUrl}
                alt="Waste issue preview"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm text-white px-2.5 py-1 rounded-md text-[10px] font-mono flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-emerald-400" />
                <span>GPS: 28.5355° N, 77.2410° E</span>
              </div>
            </div>

            {/* Quick Sample Presets */}
            <div className="mb-3">
              <span className="text-[11px] text-gray-500 block mb-1 font-medium">
                Choose sample photo or upload:
              </span>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {samplePhotos.map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setImageUrl(s.url)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-semibold whitespace-nowrap border transition-all ${
                      imageUrl === s.url
                        ? 'bg-[#2E7D32] text-white border-[#2E7D32]'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {s.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-2 gap-2">
              <label className="cursor-pointer py-2 px-3 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors">
                <Upload className="w-4 h-4 text-gray-600" />
                <span>Upload File</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              <button
                type="button"
                onClick={() => {
                  setImageUrl(samplePhotos[1].url);
                  showToast({
                    type: 'success',
                    title: 'Snapshot Geotagged',
                    message: 'Captured incident photo with live GPS coordinates.',
                  });
                }}
                className="py-2 px-3 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Camera className="w-4 h-4 text-[#2E7D32]" />
                <span>Take Photo</span>
              </button>
            </div>
          </div>
        </div>

        {/* Location Section with Interactive Map */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
              3. Waste Location <span className="text-red-500">*</span>
            </label>
            <button
              type="button"
              onClick={handleUseCurrentLocation}
              className="text-xs font-bold text-[#2E7D32] hover:underline flex items-center gap-1"
            >
              <Crosshair className="w-3.5 h-3.5" />
              <span>Use Current Location</span>
            </button>
          </div>

          <div className="bg-white border border-gray-200/90 rounded-2xl p-3 shadow-sm space-y-3">
            {/* Interactive Simulated Map */}
            <div
              onClick={handleMapClick}
              className="relative h-36 rounded-xl overflow-hidden cursor-crosshair border border-gray-200 bg-[#E3EBDD] select-none"
              title="Click anywhere to relocate pin"
            >
              {/* Map grid lines */}
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    'linear-gradient(#2E7D32 1px, transparent 1px), linear-gradient(90deg, #2E7D32 1px, transparent 1px)',
                  backgroundSize: '24px 24px',
                }}
              />

              {/* Road paths simulation */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" opacity="0.6">
                <path d="M -10 40 Q 120 70 250 30 T 450 90" stroke="#FFFFFF" strokeWidth="12" fill="none" />
                <path d="M 180 -10 L 220 180" stroke="#FFFFFF" strokeWidth="10" fill="none" />
                <path d="M -10 110 L 450 120" stroke="#FDE68A" strokeWidth="6" fill="none" />
              </svg>

              {/* Green parks */}
              <div className="absolute top-2 left-3 w-16 h-12 bg-emerald-300/40 rounded-lg border border-emerald-400/50 flex items-center justify-center">
                <span className="text-[9px] font-bold text-emerald-800">Park</span>
              </div>
              <div className="absolute bottom-2 right-4 w-20 h-10 bg-emerald-300/40 rounded-lg border border-emerald-400/50 flex items-center justify-center">
                <span className="text-[9px] font-bold text-emerald-800">Sector 14</span>
              </div>

              {/* Relocatable Pin */}
              <div
                className="absolute -translate-x-1/2 -translate-y-full transition-all duration-200 pointer-events-none"
                style={{ left: `${pinPosition.x}%`, top: `${pinPosition.y}%` }}
              >
                <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg ring-2 ring-white animate-bounce">
                  <MapPin className="w-5 h-5 fill-white" />
                </div>
              </div>

              <div className="absolute bottom-1 right-2 bg-white/80 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] text-gray-600">
                Click map to reposition pin
              </div>
            </div>

            {/* Address Input */}
            <div>
              <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                Landmark or Street Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. Gate 2, Green Meadows Society"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#2E7D32] focus:outline-none"
                required
              />
            </div>
          </div>
        </div>

        {/* Priority & Description */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
            4. Details & Description <span className="text-red-500">*</span>
          </label>
          <div className="bg-white border border-gray-200/90 rounded-2xl p-3 shadow-sm space-y-3">
            {/* Priority Selector */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-700">Urgency Level:</span>
              <div className="flex gap-1.5">
                {(['Low', 'Medium', 'High', 'Critical'] as ComplaintPriority[]).map((p) => {
                  const active = priority === p;
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                        active
                          ? p === 'Critical'
                            ? 'bg-red-600 text-white shadow-sm'
                            : p === 'High'
                            ? 'bg-amber-500 text-white shadow-sm'
                            : 'bg-[#2E7D32] text-white shadow-sm'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Description Textarea */}
            <div>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the issue (e.g., bin has been overflowing for 2 days, dogs scattering trash onto road...)"
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#2E7D32] focus:outline-none resize-none"
                required
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 bg-[#2E7D32] hover:bg-[#256629] text-white font-bold text-sm rounded-xl shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Submitting report to Sanitation Control...</span>
            ) : (
              <>
                <span>Submit Complaint</span>
                <Check className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

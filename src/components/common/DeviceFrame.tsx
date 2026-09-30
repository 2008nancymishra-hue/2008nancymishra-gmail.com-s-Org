import React from 'react';
import { Wifi, BatteryMedium, Signal } from 'lucide-react';

interface DeviceFrameProps {
  children: React.ReactNode;
  enabled: boolean;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({ children, enabled }) => {
  if (!enabled) {
    return <div className="w-full min-h-[calc(100vh-50px)] bg-[#F7F9F7]">{children}</div>;
  }

  return (
    <div className="min-h-[calc(100vh-50px)] py-4 sm:py-8 px-2 sm:px-4 bg-[#EDF3EE] flex justify-center items-start">
      {/* Smartphone Chassis */}
      <div className="relative w-full max-w-[420px] h-[860px] max-h-[92vh] bg-white rounded-[44px] shadow-[0_25px_60px_-15px_rgba(20,50,25,0.25)] border-[8px] border-[#1F2937] ring-1 ring-black/10 flex flex-col overflow-hidden">
        {/* Dynamic Island / Top Hardware Bar */}
        <div className="h-10 bg-white z-40 px-6 pt-2 flex items-center justify-between shrink-0 select-none border-b border-gray-100">
          <span className="text-[12px] font-semibold text-gray-800 tracking-tight">09:41</span>
          
          {/* Dynamic Island pill */}
          <div className="w-24 h-4 bg-gray-900 rounded-full flex items-center justify-center gap-1.5 px-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[9px] text-white/90 font-mono">CleanCity</span>
          </div>

          <div className="flex items-center gap-1.5 text-gray-700">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <BatteryMedium className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Screen Content Viewport */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden relative flex flex-col bg-[#F7F9F7]">
          {children}
        </div>

        {/* Bottom Home Indicator Bar */}
        <div className="h-4 bg-white shrink-0 flex items-center justify-center z-40">
          <div className="w-32 h-1 bg-gray-300 rounded-full" />
        </div>
      </div>
    </div>
  );
};

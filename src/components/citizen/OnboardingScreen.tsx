import React, { useState } from 'react';
import { ArrowRight, Check, ChevronRight } from 'lucide-react';

interface OnboardingScreenProps {
  onComplete: () => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState<number>(0);

  const steps = [
    {
      title: 'Report Waste Issues',
      subtitle: 'Spot roadside litter or overflowing bins? Snap a photo with GPS geotagging to instantly notify municipal sweepers.',
      image: '/src/assets/images/onboarding_report_1790741387404.jpg',
      badge: 'Civic Reporting',
    },
    {
      title: 'Request Waste Pickup',
      subtitle: 'Schedule doorstep pickup for bulky recyclables, dry plastic, or hazardous e-waste with certified municipal vans.',
      image: '/src/assets/images/onboarding_pickup_1790741400224.jpg',
      badge: 'Scheduled Service',
    },
    {
      title: 'Track & Keep Your City Clean',
      subtitle: 'Watch live resolution stages on a timeline, earn Eco-Karma points, and explore segregation guides for a zero-waste city.',
      image: '/src/assets/images/onboarding_clean_city_1790741411175.jpg',
      badge: 'Clean City, Green City',
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const current = steps[currentStep];

  return (
    <div className="min-h-full flex-1 flex flex-col justify-between p-6 bg-white">
      {/* Top Header with Skip */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-1.5">
          {steps.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentStep ? 'w-8 bg-[#2E7D32]' : 'w-2 bg-gray-200'
              }`}
            />
          ))}
        </div>
        <button
          onClick={onComplete}
          className="text-xs font-semibold text-gray-500 hover:text-gray-800 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        >
          Skip
        </button>
      </div>

      {/* Main card with illustration */}
      <div className="my-auto py-4 flex flex-col items-center text-center">
        <div className="relative w-full max-w-[320px] aspect-[4/3] rounded-3xl overflow-hidden mb-6 shadow-md border border-gray-100 bg-[#E8F5E9]/40 flex items-center justify-center p-2">
          <img
            src={current.image}
            alt={current.title}
            className="w-full h-full object-cover rounded-2xl"
            referrerPolicy="no-referrer"
            onError={(e) => {
              const target = e.currentTarget;
              target.style.display = 'none';
            }}
          />
        </div>

        <span className="text-[11px] font-bold uppercase tracking-wider text-[#2E7D32] bg-[#E8F5E9] px-3 py-1 rounded-full mb-3">
          {current.badge}
        </span>

        <h2 className="text-xl font-bold text-gray-900 tracking-tight mb-2">
          {current.title}
        </h2>

        <p className="text-sm text-gray-600 max-w-[300px] leading-relaxed">
          {current.subtitle}
        </p>
      </div>

      {/* Bottom Navigation buttons */}
      <div className="pb-4">
        {currentStep < steps.length - 1 ? (
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className={`flex-1 py-3 px-4 rounded-xl text-xs font-semibold border transition-all ${
                currentStep === 0
                  ? 'opacity-0 pointer-events-none'
                  : 'border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Back
            </button>
            <button
              onClick={handleNext}
              className="flex-[2] py-3.5 px-4 bg-[#2E7D32] hover:bg-[#256629] text-white font-semibold text-sm rounded-xl shadow-md flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={onComplete}
            className="w-full py-3.5 px-4 bg-[#2E7D32] hover:bg-[#256629] text-white font-semibold text-sm rounded-xl shadow-md flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
          >
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { WasteManagementProvider, useWasteManagement } from './context/WasteManagementContext';
import { HeaderBar } from './components/common/HeaderBar';
import { DeviceFrame } from './components/common/DeviceFrame';
import { SplashScreen } from './components/citizen/SplashScreen';
import { OnboardingScreen } from './components/citizen/OnboardingScreen';
import { AuthScreen } from './components/citizen/AuthScreen';
import { CitizenHome } from './components/citizen/CitizenHome';
import { CitizenBottomNav } from './components/citizen/CitizenBottomNav';
import { ReportWasteScreen } from './components/citizen/ReportWasteScreen';
import { ComplaintSuccessScreen } from './components/citizen/ComplaintSuccessScreen';
import { ComplaintsListScreen } from './components/citizen/ComplaintsListScreen';
import { ComplaintDetailScreen } from './components/citizen/ComplaintDetailScreen';
import { RequestPickupScreen } from './components/citizen/RequestPickupScreen';
import { PickupSuccessScreen } from './components/citizen/PickupSuccessScreen';
import { PickupsListScreen } from './components/citizen/PickupsListScreen';
import { AwarenessScreen } from './components/citizen/AwarenessScreen';
import { ProfileScreen } from './components/citizen/ProfileScreen';
import { NotificationsScreen } from './components/citizen/NotificationsScreen';
import { CollectorDashboard } from './components/collector/CollectorDashboard';
import { AdminLayout } from './components/admin/AdminLayout';

import { ToastContainer } from './components/common/ToastContainer';
import { GitHubModal } from './components/common/GitHubModal';

const AppContent: React.FC = () => {
  const {
    userRole,
    setUserRole,
    activeCitizenTab,
    setActiveCitizenTab,
    selectedComplaintId,
    setSelectedComplaintId,
    selectedPickupId,
    setSelectedPickupId,
    isDeviceFrame,
  } = useWasteManagement();

  // Citizen onboarding / auth flow state
  // (Defaults to 'splash' on initial load, with seamless transitions)
  const [citizenStep, setCitizenStep] = useState<'splash' | 'onboarding' | 'auth' | 'app'>('splash');
  const [submittedComplaintId, setSubmittedComplaintId] = useState<string>('WM-2026-00125');
  const [submittedPickupId, setSubmittedPickupId] = useState<string>('PU-1025');

  // Render Citizen App
  const renderCitizenApp = () => {
    if (citizenStep === 'splash') {
      return <SplashScreen onFinish={() => setCitizenStep('onboarding')} />;
    }

    if (citizenStep === 'onboarding') {
      return <OnboardingScreen onComplete={() => setCitizenStep('auth')} />;
    }

    if (citizenStep === 'auth') {
      return <AuthScreen onSuccess={() => setCitizenStep('app')} />;
    }

    // Main App Flow
    return (
      <div className="flex-1 flex flex-col justify-between min-h-full">
        <div className="flex-1 flex flex-col">
          {activeCitizenTab === 'home' && <CitizenHome />}

          {activeCitizenTab === 'report-form' && (
            <ReportWasteScreen
              onBack={() => setActiveCitizenTab('home')}
              onSuccess={(id) => {
                setSubmittedComplaintId(id);
                setSelectedComplaintId(id);
                setActiveCitizenTab('complaint-success');
              }}
            />
          )}

          {activeCitizenTab === 'complaint-success' && (
            <ComplaintSuccessScreen
              complaintId={submittedComplaintId}
              onTrack={(id) => {
                setSelectedComplaintId(id);
                setActiveCitizenTab('complaint-details');
              }}
              onHome={() => setActiveCitizenTab('home')}
            />
          )}

          {activeCitizenTab === 'complaints' && (
            <ComplaintsListScreen
              onSelectComplaint={(id) => {
                setSelectedComplaintId(id);
                setActiveCitizenTab('complaint-details');
              }}
              onNewComplaint={() => setActiveCitizenTab('report-form')}
            />
          )}

          {activeCitizenTab === 'complaint-details' && (
            <ComplaintDetailScreen
              complaintId={selectedComplaintId || 'WM-2026-00125'}
              onBack={() => setActiveCitizenTab('complaints')}
            />
          )}

          {activeCitizenTab === 'pickup-request' && (
            <RequestPickupScreen
              onBack={() => setActiveCitizenTab('home')}
              onSuccess={(id) => {
                setSubmittedPickupId(id);
                setSelectedPickupId(id);
                setActiveCitizenTab('pickup-confirmation');
              }}
            />
          )}

          {activeCitizenTab === 'pickup-confirmation' && (
            <PickupSuccessScreen
              pickupId={submittedPickupId}
              onViewPickups={() => setActiveCitizenTab('pickup')}
              onHome={() => setActiveCitizenTab('home')}
            />
          )}

          {activeCitizenTab === 'pickup' && (
            <PickupsListScreen
              onNewPickup={() => setActiveCitizenTab('pickup-request')}
            />
          )}

          {activeCitizenTab === 'awareness' && <AwarenessScreen />}

          {activeCitizenTab === 'profile' && (
            <ProfileScreen onLogout={() => setCitizenStep('auth')} />
          )}

          {activeCitizenTab === 'notifications' && (
            <NotificationsScreen onBack={() => setActiveCitizenTab('home')} />
          )}
        </div>

        {/* Bottom Nav Bar on Citizen primary tabs */}
        {activeCitizenTab !== 'report-form' &&
          activeCitizenTab !== 'complaint-success' &&
          activeCitizenTab !== 'pickup-confirmation' && (
            <CitizenBottomNav />
          )}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F9F7]">
      {/* Top Demo Controller & Role Switcher */}
      <HeaderBar />

      {/* Main Content Area based on User Role */}
      {userRole === 'admin' ? (
        // Admin layout: when isDeviceFrame is false, shows full wide web desktop dashboard
        // when isDeviceFrame is true, shows in smartphone frame for mobile admin testing
        <DeviceFrame enabled={isDeviceFrame}>
          <AdminLayout />
        </DeviceFrame>
      ) : userRole === 'collector' ? (
        // Waste Collector mobile app
        <DeviceFrame enabled={isDeviceFrame}>
          <CollectorDashboard />
        </DeviceFrame>
      ) : (
        // Citizen mobile app
        <DeviceFrame enabled={isDeviceFrame}>
          {renderCitizenApp()}
        </DeviceFrame>
      )}

      {/* Global In-App Notifications Toast */}
      <ToastContainer />

      {/* Global GitHub Repository & Architecture Hub */}
      <GitHubModal />
    </div>
  );
};

export default function App() {
  return (
    <WasteManagementProvider>
      <AppContent />
    </WasteManagementProvider>
  );
}

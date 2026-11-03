import React, { useState, useEffect } from 'react';
import { UserProfile } from './types';
import { DEMO_USERS } from './data/mockData';
import { BackgroundLayer, BackgroundLightMode } from './components/BackgroundLayer';
import { Header } from './components/Header';
import { AuthModal } from './components/AuthModal';
import { ReferralCoordinationView } from './components/ReferralCoordinationView';
import { DailyRoutineView } from './components/DailyRoutineView';
import { DietPlanView } from './components/DietPlanView';
import { PrecautionsView } from './components/PrecautionsView';
import { AbortionCareView } from './components/AbortionCareView';
import { AurangabadEmergencyView } from './components/AurangabadEmergencyView';
import { AboutNetworkView } from './components/AboutNetworkView';
import { CallModal } from './components/CallModal';
import { Footer } from './components/Footer';

export default function App() {
  // Active Tab
  const [activeTab, setActiveTab] = useState<string>('referrals');

  // Active User Profile - Starts Signed Out by default to protect personal data
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('mombond_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Upgraded Background display mode - default is BRIGHT daylight as requested
  const [backgroundMode, setBackgroundMode] = useState<BackgroundLightMode>('bright');

  const cycleBrightness = () => {
    const sequence: BackgroundLightMode[] = ['bright', 'radiant', 'frosted', 'soft_twilight'];
    const idx = sequence.indexOf(backgroundMode);
    const nextMode = sequence[(idx + 1) % sequence.length];
    setBackgroundMode(nextMode);
  };

  // Modals
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [activeCall, setActiveCall] = useState<{ isOpen: boolean; name: string; phone: string }>({
    isOpen: false,
    name: '',
    phone: '',
  });

  // Transfer preselection
  const [preselectedHospital, setPreselectedHospital] = useState<string | null>(null);

  // Sync user to localStorage
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('mombond_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('mombond_user');
        localStorage.removeItem('jananisetu_user');
      }
    } catch {
      // Ignore in restricted environments
    }
  }, [currentUser]);

  // Sign out handler
  const handleSignOut = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('mombond_user');
      localStorage.removeItem('jananisetu_user');
    } catch {
      // Ignore
    }
  };

  // Initiate call
  const handleInitiateCall = (hospitalName: string, phoneNumber: string) => {
    setActiveCall({
      isOpen: true,
      name: hospitalName,
      phone: phoneNumber,
    });
  };

  // Close call modal
  const handleCloseCall = () => {
    setActiveCall((prev) => ({ ...prev, isOpen: false }));
  };

  // Quick SOS
  const handleQuickSos = () => {
    setActiveCall({
      isOpen: true,
      name: 'Maharashtra 108 Emergency Ambulance',
      phone: '108',
    });
  };

  // Fast dispatch referral
  const handleFastDispatch = (hospitalName: string) => {
    setPreselectedHospital(hospitalName);
    setActiveTab('referrals');
  };

  return (
    <div className="relative min-h-screen text-slate-100 flex flex-col font-sans selection:bg-pink-500 selection:text-white">
      {/* Dynamic Background Image Layer with User's Baby Photo */}
      <BackgroundLayer
        mode={backgroundMode}
        onToggleMode={setBackgroundMode}
      />

      {/* Top Header (Strict 3-zone Top Bar Contract) */}
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onSignOut={handleSignOut}
        onQuickSos={handleQuickSos}
        backgroundMode={backgroundMode}
        onToggleBrightness={cycleBrightness}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'referrals' && (
          <ReferralCoordinationView
            currentUser={currentUser}
            preselectedHospital={preselectedHospital}
            onInitiateCall={handleInitiateCall}
            onNavigateToEmergency={() => setActiveTab('emergency')}
          />
        )}

        {activeTab === 'routine' && (
          <DailyRoutineView
            currentUser={currentUser}
            onLoginSuccess={(user) => setCurrentUser(user)}
            onSignOut={handleSignOut}
            onNavigateToEmergency={() => setActiveTab('emergency')}
            onOpenAuthModal={() => setIsAuthOpen(true)}
            onNavigateToDietPlan={() => setActiveTab('diet-plan')}
          />
        )}

        {activeTab === 'diet-plan' && (
          <DietPlanView
            onNavigateToEmergency={() => setActiveTab('emergency')}
            onNavigateToRoutine={() => setActiveTab('routine')}
          />
        )}

        {activeTab === 'precautions' && (
          <PrecautionsView
            onNavigateToEmergency={() => setActiveTab('emergency')}
          />
        )}

        {activeTab === 'abortion-care' && (
          <AbortionCareView
            onNavigateToEmergency={() => setActiveTab('emergency')}
          />
        )}

        {activeTab === 'emergency' && (
          <AurangabadEmergencyView
            onInitiateCall={handleInitiateCall}
            onFastDispatchReferral={handleFastDispatch}
          />
        )}

        {activeTab === 'about' && (
          <AboutNetworkView />
        )}
      </main>

      {/* Footer */}
      <Footer
        onSelectTab={setActiveTab}
        backgroundMode={backgroundMode}
        onToggleBackgroundMode={setBackgroundMode}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentUser={currentUser}
        onSelectUser={setCurrentUser}
        onSignOut={handleSignOut}
      />

      {/* Emergency Active Call Modal */}
      <CallModal
        isOpen={activeCall.isOpen}
        onClose={handleCloseCall}
        hospitalName={activeCall.name}
        phoneNumber={activeCall.phone}
      />
    </div>
  );
}

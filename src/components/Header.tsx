import React from 'react';
import { UserProfile } from '../types';
import { PhoneCall, UserCheck, Sun, Heart, LogOut, Lock } from 'lucide-react';
import { BackgroundLightMode } from './BackgroundLayer';

interface HeaderProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  currentUser: UserProfile | null;
  onOpenAuth: () => void;
  onSignOut: () => void;
  onQuickSos: () => void;
  backgroundMode: BackgroundLightMode;
  onToggleBrightness: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  currentUser,
  onOpenAuth,
  onSignOut,
  onQuickSos,
  backgroundMode,
  onToggleBrightness,
}) => {
  const navItems = [
    { id: 'referrals', label: 'Referrals' },
    { id: 'routine', label: 'Daily Routine' },
    { id: 'diet-plan', label: 'Diet & Nutrition' },
    { id: 'precautions', label: 'Precautions' },
    { id: 'abortion-care', label: 'Pregnancy Loss Care' },
    { id: 'emergency', label: 'Aurangabad Emergency' },
    { id: 'about', label: 'About Network' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-900/95 backdrop-blur-md border-b border-pink-900/30 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Logo & Wordmark */}
        <button
          onClick={() => onSelectTab('referrals')}
          className="text-xl font-bold tracking-tight text-white hover:text-pink-300 transition-colors whitespace-nowrap shrink-0 flex items-center gap-2.5 cursor-pointer group text-left"
        >
          <img
            src="/assets/aistudio/Pastel_Mother_and_Baby_Heart_Logo-removebg-preview_a4f3412f.png"
            alt="MomBond Mother & Baby Logo"
            className="w-10 h-10 object-contain drop-shadow-[0_2px_8px_rgba(244,114,182,0.35)] group-hover:scale-105 transition-transform"
          />
          <div className="flex flex-col">
            <span className="text-lg font-extrabold leading-tight tracking-tight text-white group-hover:text-pink-300 transition-colors">
              MomBond
            </span>
            <span className="text-[10px] font-semibold text-pink-400 tracking-wider uppercase leading-none">
              Maternal & Ambulance Care
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links (concise, single-line text links with hover underline/states) */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`transition-colors whitespace-nowrap shrink-0 py-1 cursor-pointer ${
                  isActive
                    ? 'text-pink-300 border-b-2 border-pink-500 font-bold'
                    : 'text-slate-300 hover:text-pink-200'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 Primary Action, Brightness & User Status */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Firebase Project & Backend Status Indicator */}
          <div 
            className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 bg-slate-800/80 rounded-lg border border-slate-700 text-[11px] text-slate-300"
            title="Connected to Firebase Project: mombond · Express Backend active"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-emerald-300 font-semibold">Firebase: mombond</span>
          </div>

          {/* Quick Brightness Toggle */}
          <button
            onClick={onToggleBrightness}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-amber-300 bg-amber-950/40 hover:bg-amber-900/60 active:scale-95 transition-all rounded-lg border border-amber-700/60 whitespace-nowrap cursor-pointer"
            title={`Current background light: ${backgroundMode}. Click to switch brightness.`}
          >
            <Sun className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Bright: {backgroundMode === 'radiant' ? 'Ultra' : 'High'}</span>
          </button>

          <button
            onClick={onQuickSos}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-pink-600 hover:bg-pink-500 active:scale-95 transition-all rounded-lg whitespace-nowrap cursor-pointer shadow-md shadow-pink-950"
            title="Immediate Emergency Ambulance & Hospital Link"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Emergency 108</span>
          </button>

          {currentUser ? (
            <div className="flex items-center gap-1.5">
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 active:scale-95 transition-all rounded-lg border border-slate-700 whitespace-nowrap cursor-pointer"
                title={`Active account: ${currentUser.name} (${currentUser.id})`}
              >
                <UserCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="max-w-[100px] truncate">{currentUser.id || currentUser.name.split(' ')[0]}</span>
              </button>

              <button
                onClick={onSignOut}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-rose-300 hover:text-white bg-rose-950/50 hover:bg-rose-900/70 active:scale-95 transition-all rounded-lg border border-rose-800/60 whitespace-nowrap cursor-pointer"
                title="Sign out of MomBond to protect personal data"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 active:scale-95 transition-all rounded-lg border border-pink-500/50 whitespace-nowrap cursor-pointer shadow-sm"
              title="Sign in to view protected maternal daily routine"
            >
              <Lock className="w-3.5 h-3.5 text-pink-400" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Navigation Scrollbar */}
      <div className="lg:hidden flex items-center overflow-x-auto px-4 py-2 bg-slate-900/95 border-t border-slate-800/80 gap-2 scrollbar-none">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors shrink-0 ${
                isActive
                  ? 'bg-pink-600 text-white font-semibold'
                  : 'text-slate-300 bg-slate-800/70 hover:bg-slate-800'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};

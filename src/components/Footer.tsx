import React from 'react';
import { Phone, Image, Sun, Sparkles } from 'lucide-react';
import { BackgroundLightMode } from './BackgroundLayer';

interface FooterProps {
  onSelectTab: (tab: string) => void;
  backgroundMode: BackgroundLightMode;
  onToggleBackgroundMode: (mode: BackgroundLightMode) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectTab,
  backgroundMode,
  onToggleBackgroundMode,
}) => {
  return (
    <footer className="mt-16 border-t border-slate-800 bg-slate-950/90 backdrop-blur-md text-xs text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-3 max-w-md">
            <img
              src="/assets/aistudio/Pastel_Mother_and_Baby_Heart_Logo-removebg-preview_a4f3412f.png"
              alt="MomBond Logo"
              className="w-10 h-10 object-contain drop-shadow-[0_2px_8px_rgba(244,114,182,0.35)] shrink-0 mt-0.5"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white tracking-tight">MomBond</span>
                <span className="text-slate-500">·</span>
                <span className="text-xs text-slate-400">Chhatrapati Sambhajinagar (Aurangabad) Network</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                MomBond Maternal & Newborn Emergency Referral, Transport and Facility Coordination System.
                Connecting rural Primary Health Centres (PHCs) with GMCH Ghati and tertiary trauma centers.
              </p>
            </div>
          </div>

          {/* Background Image Brightness Upgrade Controls */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-1.5 shrink-0">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
              <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" />
              <span>Background Baby Image Brightness:</span>
            </div>
            <div className="flex items-center gap-1">
              {[
                { id: 'bright', label: '☀️ Bright (Default)' },
                { id: 'radiant', label: '🌟 Ultra Bright' },
                { id: 'frosted', label: '🌤️ Soft Frosted' },
                { id: 'soft_twilight', label: '🌙 Twilight' },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => onToggleBackgroundMode(m.id as any)}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-all cursor-pointer ${
                    backgroundMode === m.id
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-950'
                      : 'text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Quick links & Hotlines */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-900">
          <div className="flex flex-wrap items-center gap-6">
            <button onClick={() => onSelectTab('referrals')} className="hover:text-pink-300 transition-colors cursor-pointer">
              Referrals
            </button>
            <button onClick={() => onSelectTab('routine')} className="hover:text-pink-300 transition-colors cursor-pointer">
              Daily Routine
            </button>
            <button onClick={() => onSelectTab('precautions')} className="hover:text-pink-300 transition-colors cursor-pointer">
              Precautions
            </button>
            <button onClick={() => onSelectTab('abortion-care')} className="hover:text-pink-300 transition-colors cursor-pointer">
              Pregnancy Loss Care
            </button>
            <button onClick={() => onSelectTab('emergency')} className="hover:text-pink-300 transition-colors cursor-pointer">
              Aurangabad Emergency
            </button>
            <button onClick={() => onSelectTab('about')} className="hover:text-pink-300 transition-colors cursor-pointer">
              About Network
            </button>
          </div>

          <div className="flex items-center gap-2 text-pink-400 font-mono font-semibold">
            <Phone className="w-3.5 h-3.5" />
            <span>24/7 National Emergency: 108 / 102</span>
          </div>
        </div>

        {/* Clinical Disclaimer */}
        <div className="text-[11px] text-slate-400 text-center leading-relaxed">
          Clinical guidance complies with National Health Mission (NHM) and WHO Maternal & Newborn Health Standards. In acute life-threatening situations, dial 108 immediately.
        </div>
      </div>
    </footer>
  );
};

import React from 'react';
import { ShieldCheck, Heart, Clock, Truck, Building2, CheckCircle2 } from 'lucide-react';

export const AboutNetworkView: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner with user's baby image feature */}
      <div className="bg-slate-900/90 border border-pink-900/40 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center gap-3.5 mb-1">
              <img
                src="/assets/aistudio/Pastel_Mother_and_Baby_Heart_Logo-removebg-preview_a4f3412f.png"
                alt="MomBond Logo"
                className="w-14 h-14 object-contain drop-shadow-[0_2px_12px_rgba(244,114,182,0.4)] shrink-0"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-semibold text-pink-400 uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4" />
                  <span>MomBond Public Health Network · Maharashtra</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Bridging Rural Clinics & Specialized Regional Hospitals
                </h1>
              </div>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              Every mother and newborn deserves rapid, coordinated clinical care. MomBond connects frontline health workers (ASHAs and ANMs at rural Sub-Centres and PHCs) with apex tertiary facilities across Chhatrapati Sambhajinagar (Aurangabad) to eliminate delays in emergency obstetrics.
            </p>
            <div className="flex flex-wrap gap-4 pt-2 text-xs text-slate-400">
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                Zero-Denial Referral Protocol
              </span>
              <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                Pre-Arrival Trauma Preparation
              </span>
            </div>
          </div>

          {/* Baby Photo Spotlight Card */}
          <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="relative aspect-4/3 overflow-hidden">
              <img
                src="/assets/aistudio/images_b21a436d.jpg"
                alt="Cherished Healthy Newborn Baby"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-3 left-4 right-4 text-xs">
                <span className="text-[10px] font-mono uppercase bg-pink-600 text-white px-2 py-0.5 rounded font-bold shadow-sm shadow-pink-950">
                  Our Mission
                </span>
                <p className="text-white font-semibold mt-1">
                  Protecting Every Mother, Welcoming Every Life
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* The Three Delays Framework */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            How MomBond Overcomes the "Three Delays" in Maternal Mortality
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Global obstetric evidence demonstrates that maternal and newborn mortality stems from three critical gaps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Delay 1 */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="w-8 h-8 rounded-lg bg-pink-600/20 border border-pink-500/40 text-pink-400 font-mono font-bold flex items-center justify-center text-sm">
              01
            </div>
            <h3 className="text-sm font-bold text-white">Delay in Deciding to Seek Care</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Family hesitation, unrecognized preeclampsia symptoms, or waiting for labor complications to resolve on their own.
            </p>
            <div className="p-2.5 bg-slate-900 rounded-lg text-xs border border-slate-800 text-pink-300">
              <strong>MomBond Solution:</strong> Accessible daily routine planners, kick counters, and red-flag danger sign recognition educate mothers and families early.
            </div>
          </div>

          {/* Delay 2 */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="w-8 h-8 rounded-lg bg-amber-600/20 border border-amber-500/40 text-amber-400 font-mono font-bold flex items-center justify-center text-sm">
              02
            </div>
            <h3 className="text-sm font-bold text-white">Delay in Reaching Health Facility</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Lack of reliable transport from rural villages (Kannad, Paithan, Gangapur) to Aurangabad, road conditions, and dispatch latency.
            </p>
            <div className="p-2.5 bg-slate-900 rounded-lg text-xs border border-slate-800 text-amber-300">
              <strong>MomBond Solution:</strong> Direct integration with Maharashtra 108 Emergency Ambulances with real-time ETA tracking and rural clinic-to-hospital distance algorithms.
            </div>
          </div>

          {/* Delay 3 */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-600/20 border border-emerald-500/40 text-emerald-400 font-mono font-bold flex items-center justify-center text-sm">
              03
            </div>
            <h3 className="text-sm font-bold text-white">Delay in Receiving Adequate Care</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Arriving at a regional hospital only to find no ventilator, no blood units ready, or having to repeat clinical history.
            </p>
            <div className="p-2.5 bg-slate-900 rounded-lg text-xs border border-slate-800 text-emerald-300">
              <strong>MomBond Solution:</strong> Pre-arrival electronic vitals transfer ensures GMCH Ghati and Civil Hospital trauma teams have blood cross-matched and ICU beds reserved prior to touchdown.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

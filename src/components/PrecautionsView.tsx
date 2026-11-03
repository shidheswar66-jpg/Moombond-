import React, { useState } from 'react';
import { PREGNANCY_PRECAUTIONS } from '../data/mockData';
import { 
  AlertTriangle, 
  ShieldAlert, 
  Pill, 
  CheckSquare, 
  Square, 
  Calendar, 
  Heart, 
  Search, 
  PhoneCall, 
  Luggage, 
  ShieldCheck,
  CheckCircle,
  XCircle,
  Sparkles,
  Home,
  Utensils,
  Car
} from 'lucide-react';

interface PrecautionsViewProps {
  onNavigateToEmergency: () => void;
}

export const PrecautionsView: React.FC<PrecautionsViewProps> = ({ onNavigateToEmergency }) => {
  const [activeSubTab, setActiveSubTab] = useState<'daily_use' | 'danger_signs' | 'trimesters' | 'medications' | 'go_bag'>('daily_use');

  // Hospital Delivery Go-Bag checklist state
  const [goBagItems, setGoBagItems] = useState([
    { id: 'gb-1', category: 'Medical Records', item: 'Mother and Child Protection (MCP / RCH) Card', checked: true },
    { id: 'gb-2', category: 'Medical Records', item: 'Government ID (Aadhaar Card) & Ration Card / Ayushman Card', checked: true },
    { id: 'gb-3', category: 'Medical Records', item: 'All Ultrasounds, Blood Group Card & recent lab reports', checked: true },
    { id: 'gb-4', category: 'Mother Essentials', item: 'Front-opening nursing gowns / loose cotton nighties (3-4 sets)', checked: false },
    { id: 'gb-5', category: 'Mother Essentials', item: 'Maternity sanitary pads (extra absorbency, 2 packs)', checked: false },
    { id: 'gb-6', category: 'Mother Essentials', item: 'Warm socks, comfortable slippers, and shawl', checked: false },
    { id: 'gb-7', category: 'Newborn Essentials', item: 'Soft washed cotton baby clothes (jablas / onesies, 4-5 sets)', checked: false },
    { id: 'gb-8', category: 'Newborn Essentials', item: 'Sterile baby receiving blankets & soft cotton wraps (Godhadi)', checked: false },
    { id: 'gb-9', category: 'Newborn Essentials', item: 'Baby caps, mittens, and soft cotton cloth nappies', checked: false },
    { id: 'gb-10', category: 'Logistics', item: 'Emergency cash & confirmed 108 / 102 driver contact number', checked: true },
  ]);

  const toggleGoBag = (id: string) => {
    setGoBagItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const checkedBagCount = goBagItems.filter((i) => i.checked).length;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner */}
      <div className="bg-slate-900/90 border border-pink-900/40 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-2xl">
        <div className="max-w-3xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-pink-400 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Maternal Safety Standards & Everyday Living</span>
            <span aria-hidden="true">·</span>
            <span>WHO & National Health Mission Guidelines</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Daily Use Precautions, Danger Signs & Delivery Readiness
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Essential everyday precautions to protect your baby and body from accidental trauma, infection, and vascular strain, alongside rapid clinical red-flag emergency warning signs.
          </p>
        </div>

        {/* Sub-tab Navigation */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-6 border-t border-slate-800">
          <button
            onClick={() => setActiveSubTab('daily_use')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'daily_use'
                ? 'bg-pink-600 text-white shadow-md shadow-pink-950'
                : 'text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Daily Use Precautions (Do's & Don'ts)</span>
          </button>
          <button
            onClick={() => setActiveSubTab('danger_signs')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'danger_signs'
                ? 'bg-pink-600 text-white shadow-md shadow-pink-950'
                : 'text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Emergency Danger Signs (Red Flags)</span>
          </button>
          <button
            onClick={() => setActiveSubTab('trimesters')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'trimesters'
                ? 'bg-pink-600 text-white shadow-md shadow-pink-950'
                : 'text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Trimester Clinical Care</span>
          </button>
          <button
            onClick={() => setActiveSubTab('medications')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'medications'
                ? 'bg-pink-600 text-white shadow-md shadow-pink-950'
                : 'text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800'
            }`}
          >
            <Pill className="w-3.5 h-3.5" />
            <span>Medication Safety</span>
          </button>
          <button
            onClick={() => setActiveSubTab('go_bag')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'go_bag'
                ? 'bg-pink-600 text-white shadow-md shadow-pink-950'
                : 'text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800'
            }`}
          >
            <Luggage className="w-3.5 h-3.5" />
            <span>Delivery Go-Bag Checklist</span>
          </button>
        </div>
      </div>

      {/* Subtab 0: Daily Use Precautions (Do's & Don'ts) */}
      {activeSubTab === 'daily_use' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-2">
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>Everyday Life Maternal Precautions (Essential Do's and Don'ts)</span>
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
              Practical, day-to-day guidelines for home safety, rural travel, lifting, diet, chemical exposure, and posture to prevent accidental falls, fetal distress, and preterm labor complications.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PREGNANCY_PRECAUTIONS.dailyUsePrecautions?.map((cat, idx) => (
              <div
                key={idx}
                className="bg-slate-900/95 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5 flex flex-col justify-between hover:border-pink-900/40 transition-colors"
              >
                <div>
                  <h3 className="text-base font-bold text-white pb-3 border-b border-slate-800 flex items-center justify-between">
                    <span>{cat.category}</span>
                    <span className="text-[11px] font-mono text-pink-400">Section 0{idx + 1}</span>
                  </h3>

                  {/* Do's Section */}
                  <div className="space-y-2 pt-4">
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      <span>Daily Do's (Safe Practices)</span>
                    </span>
                    <ul className="space-y-2 pl-1">
                      {cat.doList.map((item, dIdx) => (
                        <li key={dIdx} className="text-xs text-slate-200 flex items-start gap-2 leading-relaxed">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-1.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Don'ts Section */}
                  <div className="space-y-2 pt-5 border-t border-slate-800/80 mt-4">
                    <span className="text-xs font-bold text-pink-400 uppercase tracking-wider flex items-center gap-1.5">
                      <XCircle className="w-4 h-4 text-pink-400" />
                      <span>Daily Don'ts (Strictly Avoid)</span>
                    </span>
                    <ul className="space-y-2 pl-1">
                      {cat.dontList.map((item, dIdx) => (
                        <li key={dIdx} className="text-xs text-pink-200/90 flex items-start gap-2 leading-relaxed bg-pink-950/20 p-2 rounded-lg border border-pink-900/40">
                          <span className="w-1.5 h-1.5 rounded-full bg-pink-500 shrink-0 mt-1.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subtab 1: Danger Signs */}
      {activeSubTab === 'danger_signs' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Obstetric Emergency Danger Signs</h2>
              <p className="text-xs text-slate-400">
                Any of these signs warrant immediate medical intervention at your local clinic or Aurangabad tertiary center.
              </p>
            </div>
            <button
              onClick={onNavigateToEmergency}
              className="px-3.5 py-2 text-xs font-semibold text-pink-300 bg-pink-950/60 border border-pink-800/80 rounded-lg hover:bg-pink-900/60 transition-colors cursor-pointer flex items-center gap-1.5 shadow-md shadow-pink-950"
            >
              <PhoneCall className="w-3.5 h-3.5 text-pink-400" />
              <span>Call 108 Emergency Now</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PREGNANCY_PRECAUTIONS.dangerSigns.map((danger, index) => {
              const isEmergency = danger.severity === 'EMERGENCY';
              return (
                <div
                  key={index}
                  className={`border rounded-xl p-5 transition-all ${
                    isEmergency
                      ? 'bg-pink-950/20 border-pink-800/60 shadow-sm'
                      : 'bg-amber-950/20 border-amber-800/60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <AlertTriangle
                        className={`w-4 h-4 shrink-0 ${
                          isEmergency ? 'text-pink-400' : 'text-amber-400'
                        }`}
                      />
                      <h3 className="text-base font-bold text-white">{danger.title}</h3>
                    </div>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                        isEmergency
                          ? 'bg-pink-900/60 text-pink-200 border border-pink-700/60'
                          : 'bg-amber-900/60 text-amber-200 border border-amber-700/60'
                      }`}
                    >
                      {danger.severity}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed mb-3">
                    {danger.description}
                  </p>

                  <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-2.5 text-xs flex items-start gap-2">
                    <span className="font-semibold text-pink-400 shrink-0">Action:</span>
                    <span className="text-slate-200">{danger.action}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Subtab 2: Trimester Precautions */}
      {activeSubTab === 'trimesters' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {PREGNANCY_PRECAUTIONS.trimesterChecklists.map((tri, idx) => (
              <div
                key={idx}
                className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between hover:border-pink-900/40 transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <h3 className="text-base font-bold text-white">{tri.trimester}</h3>
                    <span className="text-[11px] font-mono text-pink-400">Phase 0{idx + 1}</span>
                  </div>

                  <div className="text-xs font-semibold text-slate-300 bg-slate-950/60 px-3 py-1.5 rounded-lg border border-slate-800/80">
                    Key Focus: {tri.focus}
                  </div>

                  <ul className="space-y-2.5 pt-1">
                    {tri.keyPoints.map((point, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-2 text-xs text-slate-300 leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-pink-500 shrink-0 mt-1.5" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-3 border-t border-slate-800/80 text-[11px] text-slate-400">
                  Ensure all tests are stamped on your Mother & Child Protection (MCP) card.
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subtab 3: Medication Safety */}
      {activeSubTab === 'medications' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white">Pharmacological Safety in Pregnancy</h2>
            <p className="text-xs text-slate-400">
              Certain common drugs cross the placental barrier and cause teratogenic anomalies or organ damage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Safe */}
            <div className="bg-slate-900/90 border border-emerald-900/50 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2 text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
                <h3 className="text-base font-bold text-white">Safe Under Obstetric Direction</h3>
              </div>
              <ul className="space-y-2">
                {PREGNANCY_PRECAUTIONS.medicationSafety[0].drugs.map((d, i) => (
                  <li key={i} className="p-2.5 bg-slate-950/60 border border-slate-800 rounded-lg text-xs text-slate-200 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
              <p className="text-[11px] text-slate-400 italic">
                {PREGNANCY_PRECAUTIONS.medicationSafety[0].note}
              </p>
            </div>

            {/* Contraindicated */}
            <div className="bg-slate-900/90 border border-pink-900/60 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2 text-pink-400">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="text-base font-bold text-white">Strictly Contraindicated (Teratogenic / Dangerous)</h3>
              </div>
              <ul className="space-y-2">
                {PREGNANCY_PRECAUTIONS.medicationSafety[1].drugs.map((d, i) => (
                  <li key={i} className="p-2.5 bg-pink-950/20 border border-pink-900/40 rounded-lg text-xs text-pink-200 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-pink-500 shrink-0 mt-1" />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
              <p className="text-[11px] text-pink-300 font-semibold">
                ⚠️ {PREGNANCY_PRECAUTIONS.medicationSafety[1].note}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Subtab 4: Hospital Delivery Go-Bag */}
      {activeSubTab === 'go_bag' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Luggage className="w-5 h-5 text-pink-400" />
                <span>Hospital Delivery "Go-Bag" Preparedness Checklist</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Have this bag packed and ready by week 35 near your front door for quick ambulance departure.
              </p>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs font-mono shrink-0">
              <span>Packed Items: </span>
              <span className="font-bold text-emerald-400">{checkedBagCount} / {goBagItems.length}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {goBagItems.map((item) => (
              <div
                key={item.id}
                onClick={() => toggleGoBag(item.id)}
                className={`p-3.5 rounded-xl border flex items-center gap-3 cursor-pointer transition-colors ${
                  item.checked
                    ? 'bg-slate-950/60 border-slate-800 text-slate-300'
                    : 'bg-slate-800/40 border-slate-700/80 text-white'
                }`}
              >
                <div className="shrink-0 text-slate-400">
                  {item.checked ? (
                    <CheckSquare className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Square className="w-4 h-4" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-medium">{item.item}</div>
                  <div className="text-[10px] text-slate-500 font-mono">{item.category}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

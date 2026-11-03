import React, { useState } from 'react';
import { ReferralCase, UserProfile } from '../types';
import { INITIAL_REFERRALS, AURANGABAD_HOSPITALS, NEARBY_AURANGABAD_AMBULANCES } from '../data/mockData';
import { saveReferralToFirebase } from '../lib/firebase';
import { 
  Plus, 
  Truck, 
  Building2, 
  Clock, 
  PhoneCall, 
  Activity, 
  Search, 
  MapPin, 
  Send, 
  X,
  Trash2,
  CheckCircle2,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

interface ReferralCoordinationViewProps {
  currentUser: UserProfile | null;
  preselectedHospital?: string | null;
  onInitiateCall: (name: string, phone: string) => void;
  onNavigateToEmergency: () => void;
}

export const ReferralCoordinationView: React.FC<ReferralCoordinationViewProps> = ({
  currentUser,
  preselectedHospital,
  onInitiateCall,
  onNavigateToEmergency,
}) => {
  const [referrals, setReferrals] = useState<ReferralCase[]>(INITIAL_REFERRALS);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Emergency booking form state: requires ONLY Contact Number and Location
  const [bookingContact, setBookingContact] = useState('');
  const [bookingLocation, setBookingLocation] = useState('');
  const [bookingSuccessMsg, setBookingSuccessMsg] = useState<string | null>(null);

  // Safety ambulance contacts filter
  const [ambulanceFilter, setAmbulanceFilter] = useState<string>('all');
  const [ambulanceSearch, setAmbulanceSearch] = useState<string>('');

  // Submit emergency ambulance booking (ONLY Contact & Location required)
  const handleBookAmbulance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingContact.trim() || !bookingLocation.trim()) return;

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newAmbulanceId = `MH-20-108-${randomSuffix}`;
    const newCaseId = `AMB-${Math.floor(100 + Math.random() * 900)}`;
    const driverPhone = '+91 94222 10899';
    const loc = bookingLocation.trim();
    const contact = bookingContact.trim();

    const newCase: ReferralCase = {
      id: newCaseId,
      patientName: `Emergency Booking (Contact: ${contact})`,
      age: 24,
      gestationalWeeks: 32,
      gravidaParity: 'Emergency Dispatch',
      referringFacility: loc,
      targetHospital: preselectedHospital || 'Government Medical College & Hospital (GMCH Ghati)',
      ambulanceId: newAmbulanceId,
      ambulanceName: '108 Advanced Obstetric & Newborn Ambulance',
      ambulanceLocation: `Dispatched & En route to ${loc}`,
      driverName: '108 Ambulance Pilot (MEMS Aurangabad)',
      driverPhone: driverPhone,
      estimatedArrivalMin: 15,
      createdAt: 'Just now',
    };

    setReferrals([newCase, ...referrals]);

    // Persist to Firebase project mombond & notify Express backend
    saveReferralToFirebase(newCase);
    fetch('/api/ambulance/dispatch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contact,
        location: loc,
        targetHospital: newCase.targetHospital,
      }),
    }).catch(() => {});

    setBookingSuccessMsg(`Ambulance ${newAmbulanceId} booked! 108 Pilot dispatched to ${loc}. Driver Phone: ${driverPhone} · Synced with Firebase`);
    setBookingContact('');
    setBookingLocation('');
    setShowCreateModal(false);

    setTimeout(() => {
      setBookingSuccessMsg(null);
    }, 8000);
  };

  // Delete single referral
  const handleDeleteReferral = (caseId: string) => {
    setReferrals((prev) => prev.filter((item) => item.id !== caseId));
  };

  // Clear all referrals
  const handleClearAllReferrals = () => {
    setReferrals([]);
  };

  // Filtered referrals by search
  const filteredReferrals = referrals.filter((item) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        item.patientName.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q) ||
        item.referringFacility.toLowerCase().includes(q) ||
        item.targetHospital.toLowerCase().includes(q) ||
        item.ambulanceId.toLowerCase().includes(q) ||
        item.ambulanceLocation.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Filtered safety ambulances
  const filteredAmbulances = NEARBY_AURANGABAD_AMBULANCES.filter((amb) => {
    const q = ambulanceSearch.toLowerCase();
    const matchesSearch = 
      amb.name.toLowerCase().includes(q) ||
      amb.locationArea.toLowerCase().includes(q) ||
      amb.coverageArea.toLowerCase().includes(q) ||
      amb.phoneNumber.includes(q);

    if (!matchesSearch) return false;

    if (ambulanceFilter === 'city') return amb.distanceFromCityCenter.includes('km') && parseInt(amb.distanceFromCityCenter) <= 10;
    if (ambulanceFilter === 'rural') return amb.serviceCategory.includes('Rural');
    if (ambulanceFilter === 'highway') return amb.serviceCategory.includes('Highway');
    return true;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Network Overview Card with MomBond Logo in Pink Aesthetic */}
      <div className="bg-slate-900/90 border border-pink-900/40 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4 max-w-2xl">
            <img
              src="/assets/aistudio/Pastel_Mother_and_Baby_Heart_Logo-removebg-preview_a4f3412f.png"
              alt="MomBond Emblem"
              className="w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow-[0_4px_16px_rgba(244,114,182,0.4)] shrink-0"
            />
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-pink-400 uppercase tracking-wider">
                <Building2 className="w-4 h-4" />
                <span>MomBond · Inter-Facility Emergency Pipeline</span>
                <span aria-hidden="true">·</span>
                <span>Aurangabad Region</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Maternal & Newborn Emergency Dispatch & Ambulance Hub
              </h1>
              <p className="text-sm text-slate-300 leading-relaxed">
                Directly coordinates 108 GPS-enabled ambulances, connects rural Primary Health Centres (PHCs) to GMCH Ghati tertiary trauma center, and ensures zero delays in critical obstetric transport.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-5 py-3 text-xs font-bold text-white bg-pink-600 hover:bg-pink-500 active:scale-95 transition-all rounded-xl shadow-lg shadow-pink-950 flex items-center gap-2 cursor-pointer"
            >
              <Truck className="w-4 h-4" />
              <span>Book Emergency Ambulance</span>
            </button>
            <button
              onClick={onNavigateToEmergency}
              className="px-4 py-3 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 transition-colors rounded-xl border border-slate-700 flex items-center gap-2 cursor-pointer"
            >
              <PhoneCall className="w-4 h-4 text-emerald-400" />
              <span>Aurangabad Hotlines</span>
            </button>
          </div>
        </div>

        {/* Live Regional Facility Bed Availability Ticker Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-6 mt-6 border-t border-slate-800">
          {AURANGABAD_HOSPITALS.slice(0, 4).map((h) => (
            <div key={h.id} className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 text-xs">
              <div className="text-[11px] font-semibold text-slate-400 truncate">{h.name.split('(')[0]}</div>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-pink-400 font-mono font-bold">
                  {h.maternalIcuBedsAvailable} ICU Beds
                </span>
                <span className="text-emerald-400 font-mono text-[11px]">
                  {h.nicuWarmersAvailable} NICU Warmers
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* QUICK EMERGENCY AMBULANCE BOOKING CARD (Requires ONLY Contact & Location) */}
      <div className="bg-slate-900/95 border-2 border-pink-600/70 rounded-2xl p-6 sm:p-7 shadow-2xl backdrop-blur-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-pink-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-pink-600/20 border border-pink-500/40 text-pink-400 flex items-center justify-center shrink-0">
                <Truck className="w-6 h-6 text-pink-400 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase bg-pink-600 text-white px-2 py-0.5 rounded font-extrabold shadow-sm shadow-pink-950">
                    Instant 108 Dispatch
                  </span>
                  <span className="text-xs text-pink-400 font-semibold">24x7 Emergency Service</span>
                </div>
                <h2 className="text-xl font-bold text-white tracking-tight mt-0.5">
                  Emergency Book Ambulance
                </h2>
              </div>
            </div>
            <div className="text-xs text-slate-400 bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800 self-start sm:self-auto flex items-center gap-1.5">
              <span className="text-emerald-400 font-bold">⚡ Fast Mode:</span>
              <span>Only Contact & Location Required</span>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
            In medical emergencies, every minute counts. Enter only your contact phone number and pickup location below to immediately dispatch the nearest Maharashtra 108 ambulance with trained paramedics.
          </p>

          {bookingSuccessMsg && (
            <div className="p-3.5 bg-emerald-950/80 border border-emerald-600/70 rounded-xl text-xs text-emerald-200 flex items-center gap-2.5 animate-fade-in shadow-lg">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div className="font-medium">{bookingSuccessMsg}</div>
            </div>
          )}

          <form onSubmit={handleBookAmbulance} className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-1">
            <div className="md:col-span-5 space-y-1.5">
              <label className="block text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <PhoneCall className="w-3.5 h-3.5 text-pink-400" />
                <span>Contact Number (Mobile / Caller Phone) *</span>
              </label>
              <input
                type="tel"
                required
                value={bookingContact}
                onChange={(e) => setBookingContact(e.target.value)}
                placeholder="e.g. +91 94222 10899 or 98234XXXXX"
                className="w-full bg-slate-950 border border-slate-700 focus:border-pink-500 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 font-mono outline-none transition-all shadow-inner"
              />
              <span className="text-[11px] text-slate-400">Driver will call this number for navigation</span>
            </div>

            <div className="md:col-span-5 space-y-1.5">
              <label className="block text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-pink-400" />
                <span>Pickup Location (Village / Clinic / Landmark in Aurangabad) *</span>
              </label>
              <input
                type="text"
                required
                value={bookingLocation}
                onChange={(e) => setBookingLocation(e.target.value)}
                placeholder="e.g. Paithan Bus Stand, Gangapur PHC, or CIDCO Aurangabad"
                className="w-full bg-slate-950 border border-slate-700 focus:border-pink-500 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-all shadow-inner"
              />
              <span className="text-[11px] text-slate-400">Where the ambulance should pick up the patient</span>
            </div>

            <div className="md:col-span-2 flex flex-col justify-end pt-1 md:pt-0">
              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-pink-600 hover:bg-pink-500 active:scale-95 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-pink-950 h-[42px]"
              >
                <Truck className="w-4 h-4" />
                <span>Book Ambulance</span>
              </button>
              <span className="text-[10px] text-center text-slate-400 mt-1 hidden md:block">Instant 1-Click</span>
            </div>
          </form>
        </div>
      </div>

      {/* Clean Queue Header Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/80 border border-slate-800 p-3 rounded-xl">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 px-1">
          <Activity className="w-4 h-4 text-pink-500" />
          <span>Active Patient Emergency Transfers ({filteredReferrals.length})</span>
        </div>

        {/* Header Right: Clear All & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {referrals.length > 0 && (
            <button
              onClick={handleClearAllReferrals}
              className="flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs text-red-300 bg-red-950/40 hover:bg-red-900/60 border border-red-900/50 rounded-lg transition-colors cursor-pointer"
              title="Clear all referrals"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
          )}
          <div className="relative sm:w-72">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search patient, ID, clinic, ambulance..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500"
            />
          </div>
        </div>
      </div>

      {/* Referrals List */}
      <div className="space-y-4">
        {filteredReferrals.length === 0 ? (
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-10 text-center space-y-4 shadow-xl">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-pink-600/10 border border-pink-500/30 flex items-center justify-center text-pink-400">
              <Truck className="w-7 h-7 text-pink-400" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">Emergency Referral Queue Ready</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                No active transfers in queue. Use the quick form above (Contact & Location only) or the button below to book an emergency ambulance immediately.
              </p>
            </div>
            <div className="pt-2">
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-5 py-2.5 bg-pink-600 hover:bg-pink-500 active:scale-95 text-white text-xs font-bold rounded-xl transition-all inline-flex items-center gap-2 cursor-pointer shadow-lg shadow-pink-950"
              >
                <Plus className="w-4 h-4" />
                <span>+ Book Emergency Ambulance</span>
              </button>
            </div>
          </div>
        ) : (
          filteredReferrals.map((item) => {
            return (
              <div
                key={item.id}
                className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 hover:border-pink-800/50 transition-all space-y-4 shadow-xl"
              >
                {/* Header Row: Referral ID, Time, Patient & Route with Delete Button */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-pink-400 bg-pink-950/40 px-2 py-0.5 rounded border border-pink-900/40">
                        {item.id}
                      </span>
                      <span className="text-xs text-slate-400">
                        {item.createdAt}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <span>{item.patientName}</span>
                    </h3>
                  </div>

                  {/* Transfer Route summary and Delete action */}
                  <div className="flex items-start gap-4">
                    <div className="text-left sm:text-right text-xs">
                      <div className="text-slate-400">
                        From: <span className="font-semibold text-slate-200">{item.referringFacility}</span>
                      </div>
                      <div className="text-slate-400">
                        To: <span className="font-semibold text-pink-400">{item.targetHospital}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteReferral(item.id)}
                      title="Delete this referral"
                      className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-950/50 border border-transparent hover:border-red-900/50 rounded-lg transition-colors cursor-pointer shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Dedicated Ambulance Number, Name and Location Section */}
                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="flex items-start md:items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-pink-600/20 border border-pink-500/40 text-pink-400 flex items-center justify-center shrink-0 mt-0.5 md:mt-0">
                        <Truck className="w-5 h-5 text-pink-400" />
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                            Ambulance Number:
                          </span>
                          <span className="font-mono text-sm font-extrabold text-white bg-slate-900 border border-pink-900/50 px-2.5 py-0.5 rounded">
                            {item.ambulanceId}
                          </span>
                        </div>
                        <div className="text-xs font-bold text-pink-300">
                          {item.ambulanceName || '108 Advanced Obstetric & Newborn Ambulance'}
                        </div>
                      </div>
                    </div>

                    {item.driverPhone && (
                      <button
                        onClick={() => onInitiateCall(item.driverName || 'Ambulance Driver', item.driverPhone!)}
                        className="px-4 py-2 bg-pink-600 hover:bg-pink-500 active:scale-95 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-2 cursor-pointer shadow-md shadow-pink-950 self-start md:self-auto shrink-0"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>Call Driver ({item.driverName?.split(' ')[0] || '108 Pilot'})</span>
                      </button>
                    )}
                  </div>

                  {/* Location Information */}
                  <div className="flex items-start gap-2.5 pt-2.5 border-t border-slate-800/80 text-xs">
                    <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                        Ambulance Location:
                      </span>
                      <span className="text-xs font-medium text-emerald-300">
                        {item.ambulanceLocation || `${item.referringFacility} - En route to ${item.targetHospital.split('(')[0]}`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* NEARBY AURANGABAD EMERGENCY AMBULANCE DIRECTORY (FOR SAFETY PURPOSE) */}
      <div className="bg-slate-900/90 border border-pink-900/40 rounded-2xl p-6 sm:p-7 backdrop-blur-md shadow-2xl space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                Nearby Aurangabad Emergency Ambulance Numbers (Safety Purpose)
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              Verified 24/7 direct dispatch contacts for Chhatrapati Sambhajinagar city and surrounding rural blocks (Paithan, Kannad, Gangapur, Sillod, Vaijapur, Waluj) for safety & immediate ambulance backup.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-3 py-1.5 rounded-lg shrink-0">
            <PhoneCall className="w-3.5 h-3.5" />
            <span>24/7 Active Fleet</span>
          </div>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={ambulanceSearch}
              onChange={(e) => setAmbulanceSearch(e.target.value)}
              placeholder="Search area, hospital, or taluka (Paithan, Kannad, Gangapur, CIDCO)..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
            {[
              { id: 'all', label: 'All Ambulances' },
              { id: 'city', label: 'City Centers' },
              { id: 'rural', label: 'Rural Talukas' },
              { id: 'highway', label: 'Highway Rescue' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setAmbulanceFilter(f.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                  ambulanceFilter === f.id
                    ? 'bg-pink-600 text-white font-bold shadow-md shadow-pink-950'
                    : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Directory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredAmbulances.map((amb) => (
            <div
              key={amb.id}
              className="bg-slate-950/70 border border-slate-800/80 hover:border-pink-800/60 rounded-xl p-4 flex flex-col justify-between transition-all space-y-3"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono font-bold text-pink-400 bg-pink-950/50 border border-pink-900/50 px-2 py-0.5 rounded">
                    {amb.serviceCategory}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded">
                    {amb.availableAmbulances} Units Ready
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white leading-snug">{amb.name}</h3>
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-pink-500 shrink-0" />
                  <span className="truncate">{amb.locationArea}</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  <strong className="text-slate-300">Safety Purpose:</strong> {amb.purpose}
                </p>
                <div className="text-[11px] text-slate-400">
                  <strong className="text-slate-300">Coverage:</strong> {amb.coverageArea}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2">
                <button
                  onClick={() => onInitiateCall(amb.name, amb.phoneNumber)}
                  className="flex-1 py-2 bg-pink-600 hover:bg-pink-500 active:scale-95 text-white text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-pink-950"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call {amb.phoneNumber}</span>
                </button>
                {amb.alternateNumber && (
                  <button
                    onClick={() => onInitiateCall(amb.name, amb.alternateNumber!)}
                    className="py-2 px-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors border border-slate-700 cursor-pointer"
                    title={`Alternate line: ${amb.alternateNumber}`}
                  >
                    <span>{amb.alternateNumber}</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Ambulance Booking Modal (Requires ONLY Contact & Location) */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-lg bg-slate-900 border border-pink-900/40 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-pink-600/20 border border-pink-500/40 text-pink-400 flex items-center justify-center shrink-0">
                  <Truck className="w-5 h-5 text-pink-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <span>Emergency Ambulance Booking</span>
                  </h2>
                  <p className="text-xs text-slate-400">
                    Requires only contact number and pickup location for instant dispatch.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBookAmbulance} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <PhoneCall className="w-3.5 h-3.5 text-pink-400" />
                  <span>Contact Number (Mobile / Caller Phone) *</span>
                </label>
                <input
                  type="tel"
                  required
                  value={bookingContact}
                  onChange={(e) => setBookingContact(e.target.value)}
                  placeholder="e.g. +91 94222 10899 or 98234XXXXX"
                  className="w-full bg-slate-950 border border-slate-700 focus:border-pink-500 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 font-mono outline-none transition-all shadow-inner"
                />
                <span className="text-[11px] text-slate-400">Ambulance pilot will contact this phone number</span>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-pink-400" />
                  <span>Pickup Location (Village / Clinic / Landmark in Aurangabad) *</span>
                </label>
                <input
                  type="text"
                  required
                  value={bookingLocation}
                  onChange={(e) => setBookingLocation(e.target.value)}
                  placeholder="e.g. Paithan Bus Stand, Gangapur PHC, or CIDCO Aurangabad"
                  className="w-full bg-slate-950 border border-slate-700 focus:border-pink-500 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-all shadow-inner"
                />
                <span className="text-[11px] text-slate-400">Exact address where patient awaits ambulance</span>
              </div>

              <div className="p-3 bg-pink-950/40 border border-pink-900/50 rounded-xl text-xs text-pink-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-pink-400 shrink-0 mt-0.5" />
                <span>
                  Our central 108 controller will automatically route the closest available emergency unit to this location and alert GMCH Ghati Hospital.
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold text-white bg-pink-600 hover:bg-pink-500 rounded-xl transition-colors flex items-center gap-1.5 shadow-md shadow-pink-950 cursor-pointer"
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>Confirm & Book Emergency Ambulance</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

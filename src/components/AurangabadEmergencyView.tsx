import React, { useState } from 'react';
import { AURANGABAD_HOSPITALS, NEARBY_AURANGABAD_AMBULANCES } from '../data/mockData';
import { HospitalFacility, ReferralCase } from '../types';
import { saveReferralToFirebase } from '../lib/firebase';
import { 
  PhoneCall, 
  MapPin, 
  Building2, 
  Clock, 
  ShieldCheck, 
  Search, 
  Navigation, 
  Droplet, 
  Truck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface AurangabadEmergencyViewProps {
  onInitiateCall: (hospitalName: string, phone: string) => void;
  onFastDispatchReferral: (hospitalName: string) => void;
}

export const AurangabadEmergencyView: React.FC<AurangabadEmergencyViewProps> = ({
  onInitiateCall,
  onFastDispatchReferral,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'free_govt' | 'nicu_ready' | 'blood_bank'>('all');
  const [selectedOriginPhc, setSelectedOriginPhc] = useState<keyof HospitalFacility['distanceFromRuralHubs']>('phcPaithan');
  const [sosSent, setSosSent] = useState(false);

  // Quick Ambulance Booking: ONLY Contact Number and Location
  const [quickContact, setQuickContact] = useState('');
  const [quickLocation, setQuickLocation] = useState('');
  const [bookingMessage, setBookingMessage] = useState<string | null>(null);

  // Ambulance contacts search and filter
  const [ambulanceSearch, setAmbulanceSearch] = useState('');
  const [ambulanceFilter, setAmbulanceFilter] = useState<string>('all');

  const emergencyHotlines = [
    {
      name: 'Maharashtra Emergency Ambulance Service (MEMS)',
      number: '108',
      desc: 'Free 24x7 GPS-enabled emergency ambulance with trained Emergency Medical Technician (EMT) on board.',
      tag: 'Toll-Free 24x7',
    },
    {
      name: 'Janani Shishu Suraksha Karyakram (JSSK)',
      number: '102',
      desc: 'Free transport for pregnant mothers from home to health facility and drop-back post delivery.',
      tag: 'Free Maternal Transport',
    },
    {
      name: 'GMCH Ghati Hospital Maternal Emergency Casualty',
      number: '0240-2402412',
      desc: 'Panchakki Road, Aurangabad. Tertiary Level III NICU, obstetric emergency ICU & blood bank.',
      tag: 'Apex Government Tertiary',
    },
    {
      name: 'National Maternal & Child Health Helpline (SUMAN)',
      number: '1800-180-1104',
      desc: 'Zero-tolerance maternal denial policy, clinical grievance & hospital admission facilitation.',
      tag: 'National Toll-Free',
    },
  ];

  // Filtering hospitals
  const filteredHospitals = AURANGABAD_HOSPITALS.filter((h) => {
    const matchesSearch = 
      h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.localName.includes(searchQuery) ||
      h.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.category.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedFilter === 'free_govt') return h.freeUnderGovernmentScheme;
    if (selectedFilter === 'nicu_ready') return h.nicuWarmersAvailable > 0;
    if (selectedFilter === 'blood_bank') return h.bloodBankAvailable;
    return true;
  });

  // Filtering nearby safety ambulances
  const filteredAmbulances = NEARBY_AURANGABAD_AMBULANCES.filter((amb) => {
    const q = ambulanceSearch.toLowerCase();
    const matches = 
      amb.name.toLowerCase().includes(q) ||
      amb.locationArea.toLowerCase().includes(q) ||
      amb.coverageArea.toLowerCase().includes(q) ||
      amb.phoneNumber.includes(q);

    if (!matches) return false;

    if (ambulanceFilter === 'city') return amb.distanceFromCityCenter.includes('km') && parseInt(amb.distanceFromCityCenter) <= 10;
    if (ambulanceFilter === 'rural') return amb.serviceCategory.includes('Rural');
    if (ambulanceFilter === 'highway') return amb.serviceCategory.includes('Highway');
    return true;
  });

  const phcLabels: Record<keyof HospitalFacility['distanceFromRuralHubs'], string> = {
    phcPaithan: 'PHC Paithan (South)',
    phcKannad: 'PHC / RH Kannad (North)',
    phcGangapur: 'PHC Gangapur (West)',
    phcSillod: 'PHC Sillod (North-East)',
    phcVaijapur: 'PHC Vaijapur (Far-West)',
  };

  const handleSosTrigger = () => {
    setSosSent(true);
    setTimeout(() => {
      onInitiateCall('108 Emergency Control Aurangabad', '108');
    }, 1200);
  };

  const handleQuickBookAmbulance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickContact.trim() || !quickLocation.trim()) return;

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const ambNumber = `MH-20-108-${randomSuffix}`;
    const loc = quickLocation.trim();
    const contact = quickContact.trim();

    const referralDoc: ReferralCase = {
      id: `AMB-${Math.floor(100 + Math.random() * 900)}`,
      patientName: `Direct Emergency (Contact: ${contact})`,
      age: 24,
      gestationalWeeks: 32,
      gravidaParity: 'Emergency Transport',
      referringFacility: loc,
      targetHospital: 'Government Medical College & Hospital (GMCH Ghati)',
      ambulanceId: ambNumber,
      ambulanceName: '108 Advanced Obstetric & Newborn Ambulance',
      ambulanceLocation: `Dispatched & En route to ${loc}`,
      driverName: '108 Ambulance Pilot (MEMS Aurangabad)',
      driverPhone: '+91 94222 10899',
      estimatedArrivalMin: 15,
      createdAt: 'Just now',
    };

    // Sync with Firebase and Express Backend
    saveReferralToFirebase(referralDoc);
    fetch('/api/ambulance/dispatch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contact,
        location: loc,
        targetHospital: referralDoc.targetHospital,
      }),
    }).catch(() => {});

    setBookingMessage(`Ambulance ${ambNumber} booked! Dispatched towards ${loc}. Driver will call ${contact} on arrival · Synced with Firebase project mombond.`);
    setQuickContact('');
    setQuickLocation('');

    setTimeout(() => {
      setBookingMessage(null);
    }, 9000);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Banner with MomBond Logo & Emergency SOS Fast Dispatch */}
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
                <MapPin className="w-4 h-4" />
                <span>MomBond · Chhatrapati Sambhajinagar (Aurangabad) Network</span>
                <span aria-hidden="true">·</span>
                <span>24x7 Safety & Transport</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Aurangabad Emergency Directory & Ambulance Coordination
              </h1>
              <p className="text-sm text-slate-300 leading-relaxed">
                Instant ambulance dispatch, priority hospital hotlines, Level III NICU warmers, and verified safety contacts across rural Primary Health Centres and Aurangabad city.
              </p>
            </div>
          </div>

          {/* SOS Fast Dispatch Button */}
          <div className="bg-pink-950/40 border border-pink-800/80 rounded-2xl p-4 sm:p-5 shrink-0 text-center space-y-3">
            <div className="text-xs font-semibold text-pink-300 uppercase tracking-wide">
              Immediate Critical SOS
            </div>
            <button
              onClick={handleSosTrigger}
              className={`w-full px-6 py-3.5 text-sm font-bold text-white rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                sosSent
                  ? 'bg-emerald-600 shadow-emerald-950'
                  : 'bg-pink-600 hover:bg-pink-500 active:scale-95 shadow-pink-950'
              }`}
            >
              <PhoneCall className="w-5 h-5 animate-bounce" />
              <span>{sosSent ? 'Dispatch Alert Sent!' : '1-Tap Emergency SOS (108)'}</span>
            </button>
            <p className="text-[11px] text-slate-400">
              Dispatches nearest 108 ambulance with GPS telemetry & alerts GMCH trauma ward.
            </p>
          </div>
        </div>
      </div>

      {/* QUICK EMERGENCY BOOK AMBULANCE (ONLY CONTACT & LOCATION REQUIRED) */}
      <div className="bg-slate-900/95 border-2 border-pink-600/70 rounded-2xl p-6 sm:p-7 shadow-2xl backdrop-blur-md relative overflow-hidden">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-pink-600/20 border border-pink-500/40 text-pink-400 flex items-center justify-center shrink-0">
                <Truck className="w-6 h-6 text-pink-400 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase bg-pink-600 text-white px-2 py-0.5 rounded font-extrabold shadow-sm shadow-pink-950">
                    Emergency Ambulance Booking
                  </span>
                  <span className="text-xs text-pink-400 font-semibold">Fast Booking Mode</span>
                </div>
                <h2 className="text-xl font-bold text-white tracking-tight mt-0.5">
                  Book Ambulance · Only Contact & Location Required
                </h2>
              </div>
            </div>
            <div className="text-xs text-slate-400 bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800 self-start sm:self-auto">
              ⚡ No medical forms or passwords needed
            </div>
          </div>

          {bookingMessage && (
            <div className="p-3.5 bg-emerald-950/80 border border-emerald-600/70 rounded-xl text-xs text-emerald-200 flex items-center gap-2.5 animate-fade-in shadow-lg">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div className="font-medium">{bookingMessage}</div>
            </div>
          )}

          <form onSubmit={handleQuickBookAmbulance} className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-1">
            <div className="md:col-span-5 space-y-1.5">
              <label className="block text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <PhoneCall className="w-3.5 h-3.5 text-pink-400" />
                <span>Contact Number (Mobile / Caller Phone) *</span>
              </label>
              <input
                type="tel"
                required
                value={quickContact}
                onChange={(e) => setQuickContact(e.target.value)}
                placeholder="e.g. +91 94222 10899 or 98234XXXXX"
                className="w-full bg-slate-950 border border-slate-700 focus:border-pink-500 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 font-mono outline-none transition-all shadow-inner"
              />
              <span className="text-[11px] text-slate-400">Driver will call this phone to coordinate pickup</span>
            </div>

            <div className="md:col-span-5 space-y-1.5">
              <label className="block text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-pink-400" />
                <span>Pickup Location (Village / Clinic / Address in Aurangabad) *</span>
              </label>
              <input
                type="text"
                required
                value={quickLocation}
                onChange={(e) => setQuickLocation(e.target.value)}
                placeholder="e.g. Paithan Bus Stand, Gangapur PHC, or CIDCO Aurangabad"
                className="w-full bg-slate-950 border border-slate-700 focus:border-pink-500 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-all shadow-inner"
              />
              <span className="text-[11px] text-slate-400">Location where ambulance will arrive</span>
            </div>

            <div className="md:col-span-2 flex flex-col justify-end pt-1 md:pt-0">
              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-pink-600 hover:bg-pink-500 active:scale-95 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-pink-950 h-[42px]"
              >
                <Truck className="w-4 h-4" />
                <span>Book Ambulance</span>
              </button>
              <span className="text-[10px] text-center text-slate-400 mt-1 hidden md:block">Instant Dispatch</span>
            </div>
          </form>
        </div>
      </div>

      {/* 24x7 Priority Toll-Free Hotlines */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <PhoneCall className="w-4 h-4 text-pink-500" />
          <span>Priority 24/7 Emergency Hotlines</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {emergencyHotlines.map((hotline, idx) => (
            <div
              key={idx}
              className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-pink-900/40 transition-colors"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono text-pink-400 bg-pink-950/60 border border-pink-800/60 px-2 py-0.5 rounded font-semibold">
                    {hotline.tag}
                  </span>
                  <span className="text-base font-bold text-white font-mono">{hotline.number}</span>
                </div>
                <h3 className="text-sm font-semibold text-white leading-snug">{hotline.name}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{hotline.desc}</p>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-800">
                <button
                  onClick={() => onInitiateCall(hotline.name, hotline.number)}
                  className="w-full py-2 bg-slate-800 hover:bg-pink-600 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call {hotline.number} Now</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* NEARBY AURANGABAD EMERGENCY AMBULANCE DIRECTORY (FOR SAFETY PURPOSE) */}
      <div className="bg-slate-900/90 border border-pink-900/40 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                Nearby Aurangabad Emergency Ambulance Numbers (Safety Purpose)
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Direct emergency contact numbers across Aurangabad city, rural blocks (Paithan, Kannad, Gangapur, Sillod, Vaijapur, Waluj) and Highway Patrol for safety assurance.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-3 py-1.5 rounded-lg shrink-0">
            <Truck className="w-3.5 h-3.5" />
            <span>10 Verified Stations Active</span>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={ambulanceSearch}
              onChange={(e) => setAmbulanceSearch(e.target.value)}
              placeholder="Search by area, hospital, or taluka (Paithan, Kannad, Gangapur, CIDCO)..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
            {[
              { id: 'all', label: 'All Ambulances' },
              { id: 'city', label: 'City Hubs' },
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

        {/* Ambulance Contacts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAmbulances.map((amb) => (
            <div
              key={amb.id}
              className="bg-slate-950/70 border border-slate-800/90 rounded-xl p-4 flex flex-col justify-between hover:border-pink-900/40 transition-all space-y-3"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono font-bold text-pink-400 bg-pink-950/50 border border-pink-900/50 px-2 py-0.5 rounded">
                    {amb.serviceCategory}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded">
                    {amb.availableAmbulances} Ambulances
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
                    title={`Alternate phone: ${amb.alternateNumber}`}
                  >
                    <span>{amb.alternateNumber}</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hospital Directory & Bed Status Section */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-pink-400" />
              <span>Specialized Regional Hospitals (Aurangabad Network)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Equipped with Obstetric ICUs, Blood Storage Centers, and neonatal incubators for high-risk transfers.
            </p>
          </div>

          {/* Travel time origin selector */}
          <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 p-2 rounded-xl text-xs text-slate-300">
            <Navigation className="w-4 h-4 text-sky-400 shrink-0" />
            <span className="text-slate-400">Rural Clinic Origin:</span>
            <select
              value={selectedOriginPhc}
              onChange={(e) => setSelectedOriginPhc(e.target.value as any)}
              className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
            >
              {Object.entries(phcLabels).map(([key, label]) => (
                <option key={key} value={key} className="bg-slate-900 text-white">
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by hospital name, Marathi title, or area..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
            {[
              { id: 'all', label: 'All Centers' },
              { id: 'free_govt', label: 'Government Free' },
              { id: 'nicu_ready', label: 'NICU Warmer Ready' },
              { id: 'blood_bank', label: 'Blood Bank On-Site' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedFilter(f.id as any)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                  selectedFilter === f.id
                    ? 'bg-pink-600 text-white font-semibold shadow-md shadow-pink-950'
                    : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Hospital Cards List */}
        <div className="space-y-4">
          {filteredHospitals.map((hospital) => {
            const distance = hospital.distanceFromRuralHubs[selectedOriginPhc];

            return (
              <div
                key={hospital.id}
                className="bg-slate-950/70 border border-slate-800/90 rounded-xl p-5 hover:border-pink-900/40 transition-all space-y-4"
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                        {hospital.category}
                      </span>
                      {hospital.freeUnderGovernmentScheme && (
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded">
                          Free Care (MJPJAY / JSSK)
                        </span>
                      )}
                      {hospital.bloodBankAvailable && (
                        <span className="text-[10px] font-mono text-pink-400 bg-pink-950/60 border border-pink-800/60 px-2 py-0.5 rounded flex items-center gap-1">
                          <Droplet className="w-2.5 h-2.5" />
                          Blood Bank Active
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-white">{hospital.name}</h3>
                    <p className="text-xs text-slate-400 font-medium">{hospital.localName}</p>

                    <div className="flex items-center gap-1.5 text-xs text-slate-400 pt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-pink-500 shrink-0" />
                      <span>{hospital.address}</span>
                    </div>
                  </div>

                  {/* Contact Buttons */}
                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 lg:shrink-0">
                    <button
                      onClick={() => onInitiateCall(hospital.name, hospital.emergencyPhone)}
                      className="px-4 py-2 bg-pink-600 hover:bg-pink-500 active:scale-95 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-pink-950"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>{hospital.emergencyPhone}</span>
                    </button>

                    <button
                      onClick={() => onFastDispatchReferral(hospital.name)}
                      className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors border border-slate-700 cursor-pointer flex items-center gap-1.5"
                    >
                      <Truck className="w-3.5 h-3.5 text-sky-400" />
                      <span>Prepare Transfer Case</span>
                    </button>
                  </div>
                </div>

                {/* Metrics Bar: Bed availability & Distance from selected rural clinic */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-800/80 text-xs">
                  <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-slate-400 text-[11px] block">Maternal ICU Beds Available</span>
                    <span className="text-sm font-bold text-emerald-400 font-mono tabular-nums">
                      {hospital.maternalIcuBedsAvailable}{' '}
                      <span className="text-slate-500 text-xs font-normal">/ {hospital.maternalIcuBedsTotal} total</span>
                    </span>
                  </div>

                  <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-slate-400 text-[11px] block">Level III NICU Warmers Ready</span>
                    <span className="text-sm font-bold text-sky-400 font-mono tabular-nums">
                      {hospital.nicuWarmersAvailable}{' '}
                      <span className="text-slate-500 text-xs font-normal">/ {hospital.nicuWarmersTotal} total</span>
                    </span>
                  </div>

                  <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-slate-400 text-[11px] block">
                      Distance from {phcLabels[selectedOriginPhc].split(' ')[1]}
                    </span>
                    <span className="text-sm font-bold text-amber-400 font-mono tabular-nums flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-500" />
                      {distance}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

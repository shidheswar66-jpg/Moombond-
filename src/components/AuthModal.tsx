import React, { useState } from 'react';
import { UserProfile, UserRole } from '../types';
import { DEMO_USERS } from '../data/mockData';
import { authenticateWithFirebase } from '../lib/firebase';
import { X, UserCheck, Shield, Building2, Phone, Mail, Stethoscope, Truck, Heart } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onSelectUser: (user: UserProfile) => void;
  onSignOut?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSelectUser,
  onSignOut,
}) => {
  const [authMode, setAuthMode] = useState<'signin' | 'register'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('expectant_mother');
  const [organization, setOrganization] = useState('');
  const [phone, setPhone] = useState('');
  const [formMessage, setFormMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFillAuthorizedCredentials = () => {
    setEmail('omkarswami45');
    setPassword('Swami@123');
    setRole('expectant_mother');
    setFormMessage(null);
  };

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormMessage(null);

    if (authMode === 'signin') {
      const trimmedId = email.trim();
      if (!trimmedId) {
        setFormMessage('Please enter your User ID or Registered Mobile.');
        return;
      }

      // Check specifically for omkarswami45
      if (trimmedId.toLowerCase() === 'omkarswami45') {
        if (password !== 'Swami@123') {
          setFormMessage('Incorrect password for omkarswami45. Required: Swami@123');
          return;
        }
        try {
          const user = await authenticateWithFirebase('omkarswami45', 'Swami@123');
          onSelectUser(user);
          onClose();
        } catch {
          const authorizedUser: UserProfile = {
            id: 'omkarswami45',
            name: 'Omkar Swami',
            role: 'expectant_mother',
            roleTitle: 'Registered Mother & Family Guardian',
            organization: 'MomBond Maternal Care Network',
            location: 'Chhatrapati Sambhajinagar (Aurangabad)',
            phone: '+91 94220 12345',
            email: 'omkarswami45@mombond.health',
          };
          onSelectUser(authorizedUser);
          onClose();
        }
        return;
      }

      // Log in with Firebase
      try {
        const user = await authenticateWithFirebase(trimmedId, password);
        onSelectUser(user);
        onClose();
      } catch (err: any) {
        const loggedUser: UserProfile = {
          id: trimmedId.toLowerCase().startsWith('user-') ? trimmedId : `user-${Date.now()}`,
          name: trimmedId.includes('@') ? trimmedId.split('@')[0].replace('.', ' ') : trimmedId,
          role,
          roleTitle: getRoleTitle(role),
          organization: organization || 'MomBond Regional Health Network',
          location: 'Chhatrapati Sambhajinagar (Aurangabad)',
          phone: phone || '+91 98000 00000',
          email: trimmedId.includes('@') ? trimmedId : `${trimmedId}@mombond.health`,
        };
        onSelectUser(loggedUser);
        onClose();
      }
    } else {
      if (!name || !email) {
        setFormMessage('Please fill in your name and User ID / email.');
        return;
      }
      try {
        const user = await authenticateWithFirebase(email.trim(), password || 'MomBond@2026');
        const newUser: UserProfile = {
          ...user,
          name,
          role,
          roleTitle: getRoleTitle(role),
          organization: organization || 'MomBond Regional Medical Circle',
          phone: phone || '+91 94220 00000',
        };
        onSelectUser(newUser);
        onClose();
      } catch {
        const newUser: UserProfile = {
          id: email.trim(),
          name,
          role,
          roleTitle: getRoleTitle(role),
          organization: organization || 'MomBond Regional Medical Circle',
          location: 'Chhatrapati Sambhajinagar District',
          phone: phone || '+91 94220 00000',
          email: email.trim(),
        };
        onSelectUser(newUser);
        onClose();
      }
    }
  };

  function getRoleTitle(r: UserRole): string {
    switch (r) {
      case 'rural_clinic':
        return 'Auxiliary Nurse Midwife / Rural MO';
      case 'tertiary_hospital':
        return 'Regional Obstetrician / Neonatologist';
      case 'ambulance_dispatch':
        return '108 Transport Dispatch Controller';
      case 'expectant_mother':
        return 'Expectant Mother / Family Guardian';
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-xl bg-slate-900 border border-pink-900/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <img
              src="/assets/aistudio/Pastel_Mother_and_Baby_Heart_Logo-removebg-preview_a4f3412f.png"
              alt="MomBond Logo"
              className="w-11 h-11 object-contain drop-shadow-[0_2px_8px_rgba(244,114,182,0.35)] shrink-0"
            />
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                <span>MomBond Portal</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Secure access to protect personal maternal health & daily routine
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 p-2 gap-2">
          <button
            onClick={() => setAuthMode('signin')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              authMode === 'signin'
                ? 'bg-pink-600 text-white shadow-md shadow-pink-950'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            Sign In with User ID
          </button>
          <button
            onClick={() => setAuthMode('register')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              authMode === 'register'
                ? 'bg-pink-600 text-white shadow-md shadow-pink-950'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            Register New Account
          </button>
        </div>

        {/* Current logged in banner */}
        {currentUser ? (
          <div className="px-6 py-3 bg-slate-800/60 border-b border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <span className="text-slate-400">Current Session:</span>
              <span className="font-semibold text-pink-400">{currentUser.name}</span>
              <span className="text-slate-500">({currentUser.id})</span>
            </div>
            {onSignOut && (
              <button
                type="button"
                onClick={() => {
                  onSignOut();
                  onClose();
                }}
                className="px-2.5 py-1 text-[11px] font-semibold text-rose-300 bg-rose-950/40 hover:bg-rose-900/60 rounded border border-rose-800/60 transition-colors"
              >
                Sign Out
              </button>
            )}
          </div>
        ) : (
          <div className="px-6 py-2.5 bg-amber-950/20 border-b border-amber-900/30 flex items-center justify-between text-xs text-amber-300">
            <span>Status: Signed Out (Personal health records locked)</span>
            <span className="text-[11px] text-slate-400 font-mono">ID: omkarswami45</span>
          </div>
        )}

        <div className="p-6 overflow-y-auto space-y-5">
          {formMessage && (
            <div className="p-3 bg-amber-950/50 border border-amber-800/60 rounded-lg text-xs text-amber-200">
              {formMessage}
            </div>
          )}

          {/* Mode 2: Standard Sign In */}
          {authMode === 'signin' && (
            <form onSubmit={handleCustomSubmit} className="space-y-4">
              {/* Quick credential assist for omkarswami45 */}
              <div className="p-3 bg-pink-950/40 border border-pink-900/60 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-pink-300 flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-pink-400" />
                    <span>Authorized Account Credentials</span>
                  </span>
                  <span className="text-[10px] bg-pink-900/60 text-pink-200 px-1.5 py-0.5 rounded font-mono">Verified</span>
                </div>
                <div className="text-[11px] text-slate-300 font-mono flex items-center justify-between">
                  <span>User ID: <strong className="text-white">omkarswami45</strong></span>
                  <span>Password: <strong className="text-white">Swami@123</strong></span>
                </div>
                <button
                  type="button"
                  onClick={handleFillAuthorizedCredentials}
                  className="w-full py-1.5 text-xs font-semibold text-pink-200 hover:text-white bg-pink-900/50 hover:bg-pink-800/70 border border-pink-700/60 rounded-lg transition-colors cursor-pointer"
                >
                  Auto-Fill Authorized Account (omkarswami45)
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  User ID / Mobile Number / ABHA Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter User ID (e.g. omkarswami45)"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Role Category
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-pink-500"
                >
                  <option value="expectant_mother">Expectant Mother / Guardian</option>
                  <option value="rural_clinic">Rural Health Clinic (PHC / Sub-Centre ANM)</option>
                  <option value="tertiary_hospital">Tertiary Referral Specialist (GMCH / Civil)</option>
                  <option value="ambulance_dispatch">108 Emergency Ambulance Dispatcher</option>
                </select>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded border-slate-700 bg-slate-950 text-pink-600 focus:ring-0" />
                  <span>Remember this device</span>
                </label>
                <span className="text-pink-400 hover:underline cursor-pointer">Forgot Password?</span>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 text-sm font-semibold text-white bg-pink-600 hover:bg-pink-500 rounded-lg transition-colors cursor-pointer shadow-md shadow-pink-950"
              >
                Access MomBond Network
              </button>
            </form>
          )}

          {/* Mode 3: Register */}
          {authMode === 'register' && (
            <form onSubmit={handleCustomSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Full Name & Title
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Dr. Pooja Shinde"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Contact Phone (WhatsApp Alert)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98XXX XXXXX"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Email Address / ABHA Health ID
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="doctor.aurangabad@health.gov.in"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Healthcare Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-pink-500"
                >
                  <option value="rural_clinic">Primary Health Centre (PHC / ANM / ASHA Worker)</option>
                  <option value="tertiary_hospital">Apex Regional Hospital (GMCH / Civil / Private Obstetric)</option>
                  <option value="ambulance_dispatch">108 / 102 Emergency Dispatch Hub</option>
                  <option value="expectant_mother">Expectant Mother or Family Caregiver</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Facility Name / Village Location
                </label>
                <input
                  type="text"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder="e.g. PHC Kannad, Aurangabad District"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-pink-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 text-sm font-semibold text-white bg-pink-600 hover:bg-pink-500 rounded-lg transition-colors cursor-pointer shadow-md shadow-pink-950"
              >
                Register & Initialize Portal
              </button>
            </form>
          )}
        </div>

        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 text-center text-xs text-slate-500">
          MomBond operates under National Health Mission & Maharashtra Emergency Transport Protocols.
        </div>
      </div>
    </div>
  );
};

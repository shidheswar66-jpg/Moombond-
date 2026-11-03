import React, { useState, useEffect } from 'react';
import { Phone, PhoneOff, Mic, MicOff, Volume2, ShieldCheck, X } from 'lucide-react';

interface CallModalProps {
  isOpen: boolean;
  onClose: () => void;
  hospitalName: string;
  phoneNumber: string;
}

export const CallModal: React.FC<CallModalProps> = ({
  isOpen,
  onClose,
  hospitalName,
  phoneNumber,
}) => {
  const [callStatus, setCallStatus] = useState<'connecting' | 'connected' | 'ended'>('connecting');
  const [callSeconds, setCallSeconds] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setCallStatus('connecting');
      setCallSeconds(0);
      return;
    }

    const connectTimeout = setTimeout(() => {
      setCallStatus('connected');
    }, 1800);

    return () => clearTimeout(connectTimeout);
  }, [isOpen]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (callStatus === 'connected') {
      interval = setInterval(() => {
        setCallSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callStatus]);

  if (!isOpen) return null;

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    setCallStatus('ended');
    setTimeout(() => {
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl text-center space-y-6">
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Center Graphic */}
        <div className="flex flex-col items-center space-y-3">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-pink-600/20 border-2 border-pink-500/50 flex items-center justify-center text-pink-400 animate-pulse">
              <Phone className="w-8 h-8" />
            </div>
            {callStatus === 'connected' && (
              <span className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-slate-900 rounded-full" />
            )}
          </div>

          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">{hospitalName}</h3>
            <p className="text-xs font-mono text-pink-400 mt-0.5">{phoneNumber}</p>
          </div>

          <div className="text-xs text-slate-400 font-mono">
            {callStatus === 'connecting' && 'Connecting to Emergency Desk...'}
            {callStatus === 'connected' && (
              <span className="text-emerald-400 font-bold tabular-nums">
                Emergency Line Active · {formatTimer(callSeconds)}
              </span>
            )}
            {callStatus === 'ended' && 'Call Terminated'}
          </div>
        </div>

        {/* Clinical Responder Simulator Message */}
        {callStatus === 'connected' && (
          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl text-left text-xs text-slate-300 space-y-1">
            <div className="flex items-center gap-1.5 text-pink-400 font-semibold text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Aurangabad Maternal Emergency Dispatch:</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              "This is GMCH / 108 Emergency Control Aurangabad. State patient vitals, gestational age, and referring clinic location. Ambulance standby is active."
            </p>
          </div>
        )}

        {/* Real Phone Link Action for mobile users */}
        <a
          href={`tel:${phoneNumber.replace(/[^0-9+]/g, '')}`}
          className="block w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl transition-colors border border-slate-700 cursor-pointer"
        >
          Open in Phone Dialer App ({phoneNumber})
        </a>

        {/* Call Controls */}
        <div className="flex items-center justify-center gap-4 pt-2">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-3.5 rounded-full transition-colors cursor-pointer ${
              isMuted ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <button
            onClick={handleEndCall}
            className="p-4 rounded-full bg-pink-600 hover:bg-pink-700 text-white shadow-lg shadow-pink-950/60 active:scale-95 transition-all cursor-pointer"
            title="End Call"
          >
            <PhoneOff className="w-6 h-6" />
          </button>

          <div
            className="p-3.5 rounded-full bg-slate-800 text-slate-300"
            title="Speaker Active"
          >
            <Volume2 className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
};

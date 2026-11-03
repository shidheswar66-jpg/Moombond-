import React, { useState, useEffect } from 'react';
import { RoutineItem, KickLog, RoutineStepAction, UserProfile } from '../types';
import { DAILY_ROUTINE_TIMETABLE } from '../data/mockData';
import { 
  saveMilestoneToFirebase, 
  saveKickLogToFirebase 
} from '../lib/firebase';
import { 
  Clock, 
  CheckCircle2, 
  Circle, 
  Droplets, 
  HeartHandshake, 
  Activity, 
  Plus, 
  ChevronDown, 
  ChevronUp, 
  Bell, 
  BellRing, 
  Sparkles, 
  Sun, 
  Moon, 
  Info, 
  AlertTriangle, 
  Share2, 
  Download, 
  Check, 
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  Calendar,
  Lock,
  LogOut,
  UserCheck,
  Shield,
  PhoneCall,
  Printer,
  FileText,
  Stethoscope,
  HeartPulse,
  RefreshCw,
  X,
  Salad,
  Utensils
} from 'lucide-react';

interface DailyRoutineViewProps {
  currentUser: UserProfile | null;
  onLoginSuccess: (user: UserProfile) => void;
  onSignOut: () => void;
  onNavigateToEmergency: () => void;
  onOpenAuthModal?: () => void;
  onNavigateToDietPlan?: () => void;
}

export const DailyRoutineView: React.FC<DailyRoutineViewProps> = ({ 
  currentUser,
  onLoginSuccess,
  onSignOut,
  onNavigateToEmergency,
  onOpenAuthModal,
  onNavigateToDietPlan
}) => {
  const [routineItems, setRoutineItems] = useState<RoutineItem[]>(DAILY_ROUTINE_TIMETABLE);
  const [selectedPhase, setSelectedPhase] = useState<'all' | 'morning' | 'afternoon' | 'evening' | 'night'>('all');
  const [selectedTrimester, setSelectedTrimester] = useState<'all' | 'first' | 'second' | 'third'>('all');
  const [expandedItemId, setExpandedItemId] = useState<string | null>('routine-01');
  const [alarmActiveId, setAlarmActiveId] = useState<string | null>(null);
  const [waterGlasses, setWaterGlasses] = useState<number>(7);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Maternal Vitals State for Clinical Record
  const [systolicBp, setSystolicBp] = useState<number>(118);
  const [diastolicBp, setDiastolicBp] = useState<number>(76);
  const [bloodSugar, setBloodSugar] = useState<number>(94);
  const [lastVitalsTime, setLastVitalsTime] = useState<string>('Today, 08:30 AM');
  const [showVitalsEditor, setShowVitalsEditor] = useState<boolean>(false);
  const [tempSystolic, setTempSystolic] = useState<string>('118');
  const [tempDiastolic, setTempDiastolic] = useState<string>('76');
  const [tempSugar, setTempSugar] = useState<string>('94');

  // Cardiff Kick Counter State
  const [isCountingKicks, setIsCountingKicks] = useState<boolean>(false);
  const [currentKicks, setCurrentKicks] = useState<number>(0);
  const [kickTimerSeconds, setKickTimerSeconds] = useState<number>(0);
  const [kickLogs, setKickLogs] = useState<KickLog[]>([
    {
      id: 'kick-01',
      timestamp: 'Today, 11:50 AM',
      count: 10,
      durationMinutes: 38,
      notes: 'Active rolls & rhythmic flutters after 09:00 AM breakfast.',
    },
    {
      id: 'kick-02',
      timestamp: 'Yesterday, 07:20 PM',
      count: 10,
      durationMinutes: 44,
      notes: 'Responsive movements observed during calm left-side rest.',
    },
  ]);

  // Printable Clinical Doctor Summary Modal
  const [showClinicalSummaryModal, setShowClinicalSummaryModal] = useState<boolean>(false);

  // Routine Confirmation Modal & Interactive Dialog State
  const [routineToConfirm, setRoutineToConfirm] = useState<RoutineItem | null>(null);
  const [confirmationNote, setConfirmationNote] = useState<string>('');
  const [confirmChecklist, setConfirmChecklist] = useState<{
    stepDone: boolean;
    hydrated: boolean;
    comfortable: boolean;
  }>({
    stepDone: true,
    hydrated: true,
    comfortable: true,
  });
  const [showBatchConfirmModal, setShowBatchConfirmModal] = useState<boolean>(false);

  // Custom Item Modal State
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newTime, setNewTime] = useState<string>('03:30 PM');
  const [newTitle, setNewTitle] = useState<string>('');
  const [newDesc, setNewDesc] = useState<string>('');
  const [newCategory, setNewCategory] = useState<'wake_sleep' | 'nutrition' | 'exercise' | 'monitoring' | 'rest'>('nutrition');

  // Trigger transient toast feedback
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Open confirmation modal for a specific routine item
  const handleOpenConfirmation = (item: RoutineItem) => {
    setRoutineToConfirm(item);
    setConfirmationNote('');
    setConfirmChecklist({
      stepDone: true,
      hydrated: true,
      comfortable: true,
    });
  };

  // Confirm routine milestone with timestamp and maternal note
  const handleConfirmRoutine = (item: RoutineItem, customNote?: string) => {
    const now = new Date();
    const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const trimmedNote = customNote?.trim();
    const noteSuffix = trimmedNote ? ` · Note: ${trimmedNote}` : '';

    setRoutineItems((prev) =>
      prev.map((i) => {
        if (i.id !== item.id) return i;
        return {
          ...i,
          completed: true,
          completedAt: `Confirmed today at ${timeFormatted}${noteSuffix}`,
        };
      })
    );

    // Sync to Firebase Firestore if logged in
    if (currentUser) {
      saveMilestoneToFirebase(currentUser.id, item.id, true, `${timeFormatted}${noteSuffix}`);
    }

    triggerToast(`✓ Routine Milestone Confirmed: "${item.title}" successfully logged at ${timeFormatted}!`);
    setRoutineToConfirm(null);

    // Auto-expand next pending item
    const currentIndex = routineItems.findIndex((i) => i.id === item.id);
    const nextPending = routineItems.slice(currentIndex + 1).find((i) => !i.completed && i.id !== item.id);
    if (nextPending) {
      setExpandedItemId(nextPending.id);
    }
  };

  // Confirm all pending routine milestones for today
  const handleConfirmAllRoutines = () => {
    const now = new Date();
    const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setRoutineItems((prev) =>
      prev.map((i) => ({
        ...i,
        completed: true,
        completedAt: i.completed ? i.completedAt : `Confirmed today at ${timeFormatted}`,
      }))
    );

    if (currentUser) {
      routineItems.forEach((i) => {
        if (!i.completed) {
          saveMilestoneToFirebase(currentUser.id, i.id, true, `Batch Confirmed at ${timeFormatted}`);
        }
      });
    }

    setShowBatchConfirmModal(false);
    triggerToast(`✓ All ${routineItems.length} daily routine milestones successfully confirmed for today!`);
  };

  // Toggle routine item completion
  const handleCompleteStep = (id: string, customTimeStr?: string) => {
    const now = new Date();
    const timeFormatted = customTimeStr || now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const targetItem = routineItems.find((i) => i.id === id);
    const willBeCompleted = targetItem ? !targetItem.completed : true;

    setRoutineItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        return {
          ...item,
          completed: willBeCompleted,
          completedAt: willBeCompleted ? `Completed today at ${timeFormatted}` : null,
        };
      })
    );

    // Sync to Firebase Firestore if logged in
    if (currentUser) {
      saveMilestoneToFirebase(currentUser.id, id, willBeCompleted, timeFormatted);
    }

    if (targetItem && !targetItem.completed) {
      triggerToast(`Milestone Confirmed: "${targetItem.title}" logged at ${timeFormatted}!`);
      // Auto-expand next pending item
      const currentIndex = routineItems.findIndex((i) => i.id === id);
      const nextPending = routineItems.slice(currentIndex + 1).find((i) => !i.completed);
      if (nextPending) {
        setExpandedItemId(nextPending.id);
      }
    }
  };

  // Alarm reminder simulation
  const handleToggleAlarm = (id: string) => {
    if (alarmActiveId === id) {
      setAlarmActiveId(null);
      triggerToast('Audio reminder cancelled.');
    } else {
      setAlarmActiveId(id);
      const item = routineItems.find((i) => i.id === id);
      triggerToast(`Scheduled reminder active for ${item?.time} (${item?.title})!`);
    }
  };

  // Kick counter timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isCountingKicks) {
      timer = setInterval(() => {
        setKickTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isCountingKicks]);

  const handleRecordKick = () => {
    const nextCount = currentKicks + 1;
    setCurrentKicks(nextCount);
    if (nextCount >= 10) {
      setIsCountingKicks(false);
      const minutesTaken = Math.max(1, Math.round(kickTimerSeconds / 60));
      const newLog: KickLog = {
        id: `kick-${Date.now()}`,
        timestamp: 'Just now',
        count: nextCount,
        durationMinutes: minutesTaken,
        notes: `Recorded 10 kicks in ${minutesTaken} minutes. Fetal heart reactivity positive.`,
      };
      setKickLogs((prev) => [newLog, ...prev]);
      if (currentUser) {
        saveKickLogToFirebase(currentUser.id, newLog);
      }
      triggerToast(`Cardiff Fetal Count Complete: 10 kicks in ${minutesTaken} mins! Autonomic reactivity normal.`);
    }
  };

  const handleStartKickSession = () => {
    setCurrentKicks(0);
    setKickTimerSeconds(0);
    setIsCountingKicks(true);
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Save maternal vitals
  const handleSaveVitals = (e: React.FormEvent) => {
    e.preventDefault();
    const sys = parseInt(tempSystolic, 10) || 120;
    const dia = parseInt(tempDiastolic, 10) || 80;
    const sug = parseInt(tempSugar, 10) || 95;
    setSystolicBp(sys);
    setDiastolicBp(dia);
    setBloodSugar(sug);
    const nowTime = `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    setLastVitalsTime(nowTime);
    setShowVitalsEditor(false);

    if (sys >= 140 || dia >= 90) {
      triggerToast('Alert: Elevated BP (≥140/90). Rest for 15 mins. If headache persists, alert clinic.');
    } else {
      triggerToast('Maternal vitals recorded successfully in clinical log!');
    }
  };

  // Add custom routine item
  const handleAddCustomItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;
    const newItem: RoutineItem = {
      id: `custom-${Date.now()}`,
      time: newTime,
      title: newTitle,
      buttonLabel: `Click Button to Confirm ${newTime} ${newTitle}`,
      timingPhase: 'afternoon',
      category: newCategory,
      description: newDesc || 'Personal doctor-advised maternal routine.',
      actionSteps: [
        {
          stepNumber: 1,
          actionTitle: 'Custom Clinical Action',
          instruction: newDesc || 'Follow prescription guidelines closely.',
          clinicalDetail: 'Personalized protocol advised during antenatal check-up.',
        },
      ],
      clinicalRationale: 'Doctor-tailored maternal and fetal well-being intervention.',
      clinicalTips: ['Record exact dosage and time taken in your Mother-Child card.'],
      trimester: 'all',
      completed: false,
      completedAt: null,
      isCustom: true,
    };
    setRoutineItems((prev) => [...prev, newItem].sort((a, b) => a.time.localeCompare(b.time)));
    setShowAddModal(false);
    setNewTitle('');
    setNewDesc('');
    triggerToast(`New custom routine milestone added for ${newTime}!`);
  };

  // Filter items
  const filteredItems = routineItems.filter((item) => {
    if (selectedPhase !== 'all' && item.timingPhase !== selectedPhase) return false;
    if (selectedTrimester !== 'all' && item.trimester !== 'all' && item.trimester !== selectedTrimester) return false;
    return true;
  });

  const completedCount = routineItems.filter((i) => i.completed).length;
  const progressPercent = Math.round((completedCount / routineItems.length) * 100);

  // Jump to first uncompleted step
  const handleJumpToNextPending = () => {
    const nextPending = routineItems.find((i) => !i.completed);
    if (nextPending) {
      setExpandedItemId(nextPending.id);
      setSelectedPhase('all');
      const el = document.getElementById(nextPending.id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      triggerToast('All 13 daily milestones are complete for today! Exceptional work!');
    }
  };

  // Generate downloadable/copyable clinical log
  const handleCopyLogSummary = () => {
    const textSummary = [
      `=== MOMBOND MATERNAL CLINICAL LOG SUMMARY ===`,
      `Date: ${new Date().toLocaleDateString('en-IN', { dateStyle: 'full' })}`,
      `Patient / User: ${currentUser ? `${currentUser.name} (${currentUser.id})` : 'Registered Mother (Guest Profile)'}`,
      `Blood Pressure: ${systolicBp}/${diastolicBp} mmHg (${systolicBp >= 140 || diastolicBp >= 90 ? 'ELEVATED - NOTIFY CLINIC' : 'Normal Range'})`,
      `Fasting/Post Blood Sugar: ${bloodSugar} mg/dL`,
      `Completed Milestones: ${completedCount} / ${routineItems.length} (${progressPercent}%)`,
      `Daily Hydration: ${waterGlasses * 250} ml (${waterGlasses} of 10 glasses)`,
      `Cardiff 10-Kick Tests Recorded: ${kickLogs.length} sessions logged`,
      `\nStep-by-Step Schedule Execution:`,
      ...routineItems.map(
        (i) =>
          `[${i.completed ? 'COMPLETED' : 'PENDING'}] ${i.time} - ${i.title} ${
            i.completedAt ? `(${i.completedAt})` : ''
          }`
      ),
      `\nAurangabad District Clinical Referral Standards · MomBond Network`,
    ].join('\n');

    navigator.clipboard.writeText(textSummary);
    triggerToast('Clinical log copied to clipboard! Ready to send to your ASHA worker, ANM, or Obstetrician.');
  };

  // Check mineral separation compliance status
  const ironItem = routineItems.find(i => i.id === 'routine-03');
  const calciumItem = routineItems.find(i => i.id === 'routine-07');

  return (
    <div className="space-y-8 animate-fade-in relative max-w-7xl mx-auto">
      {/* Toast Alert Feedback */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-slate-900 border border-emerald-500/80 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs animate-bounce font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP CLINICAL STATUS STRIP: Non-blocking, transparent state indicator */}
      {currentUser ? (
        <div className="bg-emerald-950/40 border border-emerald-700/60 rounded-2xl p-4 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs shadow-lg shadow-emerald-950/20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-900/70 border border-emerald-500/60 flex items-center justify-center shrink-0 text-emerald-300 shadow-inner">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-emerald-300 font-bold">
                <span>Personal Clinical Record Active</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-mono bg-emerald-900/80 text-emerald-200 px-2 py-0.5 rounded border border-emerald-700/60">
                  Firebase: mombond
                </span>
              </div>
              <div className="text-slate-300 text-[11px] mt-0.5">
                Logged in as <strong className="text-white">{currentUser.name}</strong> (<span className="font-mono text-emerald-300">{currentUser.id}</span>) · Real-time cloud sync enabled for kicks, vitals, and milestones.
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end md:self-center">
            <button
              onClick={() => setShowClinicalSummaryModal(true)}
              className="px-3 py-1.5 text-xs font-semibold text-emerald-300 bg-emerald-900/40 hover:bg-emerald-900/80 border border-emerald-700/60 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Doctor Visit Slip</span>
            </button>
            <button
              onClick={onSignOut}
              className="px-3 py-1.5 text-xs font-semibold text-rose-300 hover:text-white bg-rose-950/60 hover:bg-rose-900/80 border border-rose-800/70 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Sign out of MomBond"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-slate-900/90 border border-slate-700/70 rounded-2xl p-4 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-pink-950/60 border border-pink-700/50 flex items-center justify-center shrink-0 text-pink-300">
              <Stethoscope className="w-5 h-5 text-pink-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-white font-bold">
                <span>Maharashtra Standard Maternal Routine & Clinical Timetable</span>
                <span className="text-[10px] font-mono bg-pink-950 text-pink-300 px-2 py-0.5 rounded border border-pink-800/60">
                  Aurangabad District Protocol
                </span>
              </div>
              <div className="text-slate-300 text-[11px] mt-0.5">
                All 13 daily clinical milestones, Cardiff fetal kick stopwatch, and hydration trackers are open and interactive. To sync your private logs to the cloud, use the sign-in button on the top right.
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end md:self-center shrink-0">
            <div className="hidden lg:flex items-center gap-1.5 text-[10px] text-slate-400 font-mono bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-800">
              <span>Sign In Side:</span>
              <strong className="text-pink-300">omkarswami45</strong>
              <span className="text-slate-600">/</span>
              <strong className="text-pink-300">Swami@123</strong>
            </div>

            <button
              onClick={onOpenAuthModal}
              className="px-3.5 py-1.5 text-xs font-bold text-white bg-pink-600 hover:bg-pink-500 rounded-lg transition-all shadow-md shadow-pink-950 flex items-center gap-1.5 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Sign In via Side Panel</span>
            </button>

            <button
              onClick={() => setShowClinicalSummaryModal(true)}
              className="px-3 py-1.5 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden sm:inline">Print Clinical Slip</span>
            </button>
          </div>
        </div>
      )}

      {/* CLINICAL VITALS & MULTI-METRIC OVERVIEW STRIP */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {/* Vitals: Blood Pressure */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold flex items-center gap-1 text-slate-300">
              <HeartPulse className="w-3.5 h-3.5 text-rose-400" />
              <span>Blood Pressure</span>
            </span>
            <button
              onClick={() => setShowVitalsEditor(true)}
              className="text-[10px] text-pink-400 hover:underline cursor-pointer"
            >
              Update
            </button>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-extrabold text-white font-mono tabular-nums">
              {systolicBp}/{diastolicBp}
            </span>
            <span className="text-[11px] text-slate-400">mmHg</span>
          </div>
          <div className="text-[10px] mt-1 flex items-center gap-1 font-medium">
            {systolicBp >= 140 || diastolicBp >= 90 ? (
              <span className="text-rose-400 flex items-center gap-0.5">
                <AlertTriangle className="w-3 h-3 shrink-0" />
                <span>Elevated (Pre-eclampsia Alert)</span>
              </span>
            ) : (
              <span className="text-emerald-400 flex items-center gap-0.5">
                <CheckCircle2 className="w-3 h-3 shrink-0" />
                <span>Normotensive Target Range</span>
              </span>
            )}
          </div>
        </div>

        {/* Mineral Separation Compliance */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold flex items-center gap-1 text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Mineral Separation</span>
            </span>
            <span className="text-[10px] text-amber-400 font-mono">7-Hour Gap</span>
          </div>
          <div className="text-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Iron (IFA 09:00 AM):</span>
              <span className={`text-[11px] font-mono font-bold ${ironItem?.completed ? 'text-emerald-400' : 'text-slate-400'}`}>
                {ironItem?.completed ? '✓ Taken' : 'Pending'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Calcium (04:15 PM):</span>
              <span className={`text-[11px] font-mono font-bold ${calciumItem?.completed ? 'text-emerald-400' : 'text-slate-400'}`}>
                {calciumItem?.completed ? '✓ Taken' : 'Pending'}
              </span>
            </div>
          </div>
          <div className="text-[9px] text-slate-400 mt-1 leading-tight">
            Separated to prevent DMT1 receptor competition
          </div>
          {onNavigateToDietPlan && (
            <button
              type="button"
              onClick={onNavigateToDietPlan}
              className="mt-2 w-full py-1 px-1.5 text-[10px] font-semibold text-emerald-300 hover:text-white bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-800/70 rounded flex items-center justify-center gap-1 transition-colors cursor-pointer"
            >
              <Salad className="w-3 h-3 text-emerald-400" />
              <span>View Diet Separation Guide →</span>
            </button>
          )}
        </div>

        {/* Cardiff Fetal Kick Status */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold flex items-center gap-1 text-slate-300">
              <Activity className="w-3.5 h-3.5 text-pink-400" />
              <span>Fetal 10-Kick Count</span>
            </span>
            <span className="text-[10px] text-pink-400 font-mono">Cardiff Rule</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-extrabold text-white font-mono tabular-nums">
              {currentKicks} <span className="text-xs font-normal text-slate-400">/ 10</span>
            </span>
            <span className="text-[11px] text-slate-400">
              {isCountingKicks ? `(${formatSeconds(kickTimerSeconds)})` : 'Today'}
            </span>
          </div>
          <div className="text-[10px] mt-1 flex items-center gap-1 font-medium">
            {kickLogs.length > 0 ? (
              <span className="text-emerald-400 flex items-center gap-0.5">
                <CheckCircle2 className="w-3 h-3 shrink-0" />
                <span>Last: {kickLogs[0].count} kicks ({kickLogs[0].durationMinutes}m)</span>
              </span>
            ) : (
              <span className="text-slate-400">Ready for counting session</span>
            )}
          </div>
        </div>

        {/* Daily Hydration Status */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold flex items-center gap-1 text-slate-300">
              <Droplets className="w-3.5 h-3.5 text-sky-400" />
              <span>Daily Hydration</span>
            </span>
            <span className="text-[10px] text-sky-400 font-mono">2500 ml Goal</span>
          </div>
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-extrabold text-white font-mono tabular-nums">
                {waterGlasses * 250}
              </span>
              <span className="text-[11px] text-slate-400">/ 2500 ml</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setWaterGlasses((p) => Math.max(0, p - 1))}
                className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center justify-center cursor-pointer"
                title="Decrease 1 glass"
              >
                -
              </button>
              <button
                onClick={() => setWaterGlasses((p) => Math.min(14, p + 1))}
                className="w-6 h-6 rounded bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold flex items-center justify-center cursor-pointer"
                title="Add 1 glass (250ml)"
              >
                +
              </button>
            </div>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
            <div 
              className="bg-sky-500 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, Math.round((waterGlasses / 10) * 100))}%` }}
            />
          </div>
        </div>
      </div>

      {/* HERO SECTION WITH PROTOCOL CONTROLS & TRIMESTER FILTER */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-pink-400 uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Full Clinical Day Protocol</span>
              <span aria-hidden="true">·</span>
              <span>Awakening (07:30 AM) to Sleep (10:15 PM)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Maternal Daily Clinical Routine & Action Tracker
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Every milestone provides an active confirmation button, step-by-step physical execution guidelines, obstetric rationales (including mandatory 7-hour separation between Iron and Calcium), and real-time timestamp logging for your ANM or Obstetrician.
            </p>

            {onNavigateToDietPlan && (
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={onNavigateToDietPlan}
                  className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-emerald-950/60 hover:shadow-emerald-900/80 transition-all border border-emerald-400/40 flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <Salad className="w-4 h-4 text-emerald-200" />
                  <span>View Maternal Diet & Nutrition Plan (What Foods to Eat)</span>
                  <ArrowRight className="w-4 h-4 text-emerald-200" />
                </button>
              </div>
            )}
          </div>

          {/* Quick Progress Indicator Card */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 sm:w-80 shrink-0 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="font-semibold">Today's Milestone Progress</span>
              <span className="font-bold text-pink-400 font-mono tabular-nums text-sm">
                {completedCount} / {routineItems.length} ({progressPercent}%)
              </span>
            </div>

            <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-pink-500 via-amber-400 to-emerald-400 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="flex items-center justify-between gap-2 pt-1">
              <button
                onClick={handleJumpToNextPending}
                className="px-3 py-1.5 bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer shadow-md shadow-pink-950"
              >
                <span>Next Pending Step</span>
                <ArrowRight className="w-3 h-3" />
              </button>

              <button
                onClick={handleCopyLogSummary}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium rounded-lg transition-colors flex items-center gap-1 cursor-pointer border border-slate-700"
                title="Copy shareable summary for doctor"
              >
                <Share2 className="w-3 h-3 text-sky-400" />
                <span>Share Log</span>
              </button>
            </div>
          </div>
        </div>

        {/* Trimester and Gestational Stage Tabs */}
        <div className="pt-6 mt-6 border-t border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-pink-400" />
                <span>Filter By Gestational Stage:</span>
              </span>
            </div>

            {/* Trimester Selector */}
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: 'all', label: 'All Trimesters (13 Milestones)' },
                { id: 'first', label: 'Trimester 1 (Weeks 1–12)' },
                { id: 'second', label: 'Trimester 2 (Weeks 13–27)' },
                { id: 'third', label: 'Trimester 3 (Weeks 28–40)' },
              ].map((tri) => (
                <button
                  key={tri.id}
                  onClick={() => setSelectedTrimester(tri.id as any)}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    selectedTrimester === tri.id
                      ? 'bg-pink-600 text-white shadow-md shadow-pink-950'
                      : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  {tri.label}
                </button>
              ))}
            </div>
          </div>

          {/* Timing Phase Filter */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: 'all', label: 'All Day Schedule' },
                { id: 'morning', label: '🌅 Morning (07:30 - 11:00)' },
                { id: 'afternoon', label: '☀️ Afternoon (11:00 - 16:00)' },
                { id: 'evening', label: '🌇 Evening (16:00 - 20:00)' },
                { id: 'night', label: '🌙 Night (20:00 - Bedtime)' },
              ].map((phase) => (
                <button
                  key={phase.id}
                  onClick={() => setSelectedPhase(phase.id as any)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    selectedPhase === phase.id
                      ? 'bg-slate-700 text-white border border-slate-600'
                      : 'bg-slate-950/60 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  {phase.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAddModal(true)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5 text-pink-400" />
                <span>Add Custom Milestone</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* TWO COLUMN GRID: Left = Timeline Schedule, Right = Clinical Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Step-by-Step Advanced Routine (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          {filteredItems.map((item) => {
            const isExpanded = expandedItemId === item.id;
            const isAlarmSet = alarmActiveId === item.id;

            return (
              <div
                id={item.id}
                key={item.id}
                className={`border rounded-2xl transition-all duration-300 overflow-hidden ${
                  item.completed
                    ? 'bg-slate-900/75 border-emerald-900/50 shadow-sm'
                    : 'bg-slate-900/95 border-slate-800 hover:border-slate-700 shadow-xl'
                }`}
              >
                {/* Header Strip */}
                <div className="p-5 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      {/* Checkbox Icon Indicator */}
                      <button
                        onClick={() => handleCompleteStep(item.id)}
                        className="mt-1 text-slate-400 hover:text-pink-400 transition-colors cursor-pointer shrink-0"
                        title={item.completed ? 'Mark pending' : 'Mark completed'}
                      >
                        {item.completed ? (
                          <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                        ) : (
                          <Circle className="w-6 h-6 text-slate-500 hover:text-white" />
                        )}
                      </button>

                      {/* Content Overview */}
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs font-extrabold text-pink-400 bg-pink-950/60 border border-pink-800/60 px-2.5 py-0.5 rounded-md tabular-nums">
                            {item.time}
                          </span>
                          <span className="text-[11px] font-mono uppercase text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                            {item.category.replace('_', ' ')}
                          </span>
                          {item.completedAt && (
                            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded font-medium flex items-center gap-1">
                              <Check className="w-3 h-3" />
                              {item.completedAt}
                            </span>
                          )}
                          {item.isCustom && (
                            <span className="text-[10px] text-amber-400 bg-amber-950/60 border border-amber-800/60 px-1.5 py-0.5 rounded">
                              Custom Milestone
                            </span>
                          )}
                        </div>

                        <h2 className={`text-base sm:text-lg font-bold ${item.completed ? 'line-through text-slate-400' : 'text-white'}`}>
                          {item.title}
                        </h2>

                        <p className="text-xs text-slate-300 leading-relaxed pt-0.5">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    {/* Quick Right Action Toolbar */}
                    <div className="flex items-center gap-2 self-end sm:self-start shrink-0">
                      <button
                        onClick={() => handleToggleAlarm(item.id)}
                        className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                          isAlarmSet
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 shadow-sm'
                            : 'bg-slate-800/80 text-slate-400 hover:text-white border-slate-700'
                        }`}
                        title={isAlarmSet ? 'Alarm reminder active (click to cancel)' : 'Set audio reminder'}
                      >
                        {isAlarmSet ? <BellRing className="w-4 h-4 animate-bounce" /> : <Bell className="w-4 h-4" />}
                      </button>

                      <button
                        onClick={() => setExpandedItemId(isExpanded ? null : item.id)}
                        className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
                        title={isExpanded ? 'Collapse instructions' : 'View step-by-step instructions'}
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Routine Milestone Confirmation Toolbar */}
                  <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    {item.completed ? (
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="px-3.5 py-2 rounded-xl font-bold text-xs bg-emerald-950/80 border border-emerald-500/70 text-emerald-300 flex items-center gap-1.5 shadow-inner">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>Routine Confirmed & Verified</span>
                        </div>
                        <button
                          onClick={() => handleOpenConfirmation(item)}
                          className="px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 active:scale-95"
                          title="Click to view or edit confirmation details"
                        >
                          <FileText className="w-3.5 h-3.5 text-pink-400" />
                          <span>Confirmation Details</span>
                        </button>
                        <button
                          onClick={() => handleCompleteStep(item.id)}
                          className="px-3 py-2 text-xs font-semibold text-rose-300 hover:text-rose-200 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/50 rounded-xl transition-colors cursor-pointer flex items-center gap-1 active:scale-95"
                          title="Undo confirmation"
                        >
                          <RefreshCw className="w-3 h-3 text-rose-400" />
                          <span>Undo</span>
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-wrap items-center gap-2">
                        {/* The Prominent Routine Confirmation Click Button requested by user */}
                        <button
                          onClick={() => handleOpenConfirmation(item)}
                          className="px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg bg-gradient-to-r from-pink-600 via-rose-600 to-pink-500 hover:from-pink-500 hover:to-rose-400 text-white shadow-pink-950 ring-2 ring-pink-400/50 active:scale-95"
                          title="Click button to confirm routine milestone"
                        >
                          <CheckCircle2 className="w-4 h-4 text-pink-100 shrink-0 animate-pulse" />
                          <span>Click Button to Confirm Routine</span>
                        </button>

                        <button
                          onClick={() => handleCompleteStep(item.id)}
                          className="px-3 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer active:scale-95"
                          title="1-click fast log without notes"
                        >
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Quick Log</span>
                        </button>
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-2">
                      {onNavigateToDietPlan && (item.category === 'nutrition' || ['routine-03', 'routine-04', 'routine-06', 'routine-08', 'routine-11'].includes(item.id)) && (
                        <button
                          type="button"
                          onClick={onNavigateToDietPlan}
                          className="px-3 py-1.5 bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-600/70 text-emerald-200 hover:text-white rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                          title="Open Maternal Diet Plan tab for this meal"
                        >
                          <Salad className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>
                            {item.id === 'routine-03' && 'Diet: Breakfast & Iron Guide'}
                            {item.id === 'routine-04' && 'Diet: Hydration & Fruits'}
                            {item.id === 'routine-06' && 'Diet: Balanced Lunch Thali'}
                            {item.id === 'routine-08' && 'Diet: Calcium & Snack Rules'}
                            {item.id === 'routine-11' && 'Diet: Anti-Reflux Dinner'}
                            {!['routine-03', 'routine-04', 'routine-06', 'routine-08', 'routine-11'].includes(item.id) && 'View Diet Plan'}
                          </span>
                          <ArrowRight className="w-3 h-3 text-emerald-400" />
                        </button>
                      )}

                      <button
                        onClick={() => setExpandedItemId(isExpanded ? null : item.id)}
                        className="text-xs text-pink-400 hover:underline flex items-center gap-1 self-center sm:self-auto cursor-pointer"
                      >
                        <span>{isExpanded ? 'Hide Step-by-Step Guide' : 'Explain Step by Step'}</span>
                        {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Step-by-Step Clinical Explanations */}
                {isExpanded && (
                  <div className="bg-slate-950/80 border-t border-slate-800 p-5 sm:p-6 space-y-5 animate-fade-in">
                    {/* Action Steps Breakdown */}
                    <div className="space-y-3">
                      <div className="text-xs font-bold text-white flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-pink-400" />
                        <span>Step-by-Step Clinical Execution Protocol:</span>
                      </div>

                      <div className="grid grid-cols-1 gap-2.5">
                        {item.actionSteps.map((step) => (
                          <div
                            key={step.stepNumber}
                            className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-1.5"
                          >
                            <div className="flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-pink-600/30 border border-pink-500/60 text-pink-300 font-mono text-[11px] font-bold flex items-center justify-center shrink-0">
                                {step.stepNumber}
                              </span>
                              <h4 className="text-xs font-bold text-white">{step.actionTitle}</h4>
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed pl-7">
                              {step.instruction}
                            </p>
                            <div className="text-[11px] text-slate-400 pl-7 flex items-start gap-1.5 pt-0.5">
                              <Info className="w-3 h-3 text-sky-400 shrink-0 mt-0.5" />
                              <span>
                                <strong className="text-slate-300">Physiology: </strong>
                                {step.clinicalDetail}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Obstetric Rationale Box */}
                    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-1 text-xs">
                      <div className="font-bold text-pink-300 flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-pink-400" />
                        <span>Advanced Obstetric Rationale</span>
                      </div>
                      <p className="text-slate-300 leading-relaxed">
                        {item.clinicalRationale}
                      </p>
                    </div>

                    {/* Clinical Tips List */}
                    {item.clinicalTips && item.clinicalTips.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                          Doctor's Antenatal Tips:
                        </span>
                        <ul className="space-y-1 text-xs text-slate-300">
                          {item.clinicalTips.map((tip, tIdx) => (
                            <li key={tIdx} className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-1.5" />
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Quick Link to Maternal Diet & Nutrition Plan */}
                    {onNavigateToDietPlan && (item.category === 'nutrition' || ['routine-03', 'routine-04', 'routine-06', 'routine-08', 'routine-11'].includes(item.id)) && (
                      <div className="bg-gradient-to-r from-emerald-950/60 to-teal-950/40 border border-emerald-700/60 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2.5 text-emerald-300">
                          <Salad className="w-5 h-5 text-emerald-400 shrink-0" />
                          <div>
                            <strong className="text-white block font-semibold">Want complete trimester recipes and food safety tips?</strong>
                            <span className="text-slate-300 text-[11px]">Check foods to eat, foods to avoid, and safe cooking guidelines in the Maternal Diet Plan.</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={onNavigateToDietPlan}
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 self-start sm:self-center shadow-md active:scale-95"
                        >
                          <span>Open Diet Plan Tab</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Column: Cardiff Kick Counter, Hydration & Clinical Guidelines (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Cardiff Fetal Kick Counter Tool */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-pink-500" />
                <h3 className="text-sm font-bold text-white">Cardiff 10-Kick Counter</h3>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">Count-to-10 Protocol</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Standard clinical screening: A healthy fetus should register at least <strong>10 distinct movements within 2 hours</strong>.
            </p>

            {/* Counter display */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-center space-y-3">
              <div className="text-4xl font-extrabold text-white font-mono tabular-nums">
                {currentKicks} <span className="text-sm font-normal text-slate-400">/ 10</span>
              </div>

              {isCountingKicks ? (
                <div className="space-y-3">
                  <div className="text-xs font-mono text-emerald-400 flex items-center justify-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Session Timer: {formatSeconds(kickTimerSeconds)}</span>
                  </div>

                  <button
                    onClick={handleRecordKick}
                    className="w-full py-3.5 bg-pink-600 hover:bg-pink-500 active:scale-95 text-white font-extrabold rounded-xl transition-all shadow-lg shadow-pink-950 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <HeartHandshake className="w-5 h-5 animate-pulse" />
                    <span>Tap Every Time Baby Kicks</span>
                  </button>

                  <button
                    onClick={() => setIsCountingKicks(false)}
                    className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Pause / Reset Session
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <button
                    onClick={handleStartKickSession}
                    className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer border border-slate-700"
                  >
                    Start 2-Hour Kick Session
                  </button>
                </div>
              )}

              {/* Warning note if reduced movement */}
              <div className="p-2.5 bg-pink-950/30 border border-pink-900/50 rounded-lg text-left text-[11px] text-pink-200 space-y-1">
                <div className="font-semibold flex items-center gap-1 text-pink-300">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>Crucial Warning:</span>
                </div>
                <p>
                  If you perceive fewer than 10 movements in 2 hours after a cold sweet drink, contact your primary health clinic or Aurangabad referral center immediately.
                </p>
                <button
                  onClick={onNavigateToEmergency}
                  className="text-pink-400 hover:underline font-semibold cursor-pointer block mt-1"
                >
                  View Aurangabad Emergency Directory →
                </button>
              </div>
            </div>

            {/* Kick Logs History */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <span className="text-xs font-semibold text-slate-400">Recent Movement Logs</span>
              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {kickLogs.map((log) => (
                  <div key={log.id} className="p-2 bg-slate-950/60 rounded-lg text-xs border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="font-medium text-slate-200">{log.timestamp}</div>
                      <div className="text-[10px] text-slate-400">{log.notes}</div>
                    </div>
                    <div className="font-mono text-emerald-400 font-semibold shrink-0">
                      {log.count} kicks ({log.durationMinutes}m)
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Daily Hydration Counter */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-sky-400" />
                <h3 className="text-sm font-bold text-white">Daily Hydration Tracker</h3>
              </div>
              <span className="text-xs font-mono text-sky-400 font-bold">{waterGlasses * 250} ml / 2500 ml</span>
            </div>

            <p className="text-xs text-slate-300">
              Target: 8–10 glasses daily. Prevents oligohydramnios (low amniotic fluid), constipation, and false Braxton Hicks contractions.
            </p>

            <div className="flex items-center justify-between bg-slate-950 border border-slate-800 rounded-xl p-3">
              <button
                onClick={() => setWaterGlasses((prev) => Math.max(0, prev - 1))}
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center cursor-pointer"
              >
                -
              </button>
              <div className="text-center">
                <div className="text-2xl font-bold text-sky-400 font-mono tabular-nums">
                  {waterGlasses} <span className="text-xs text-slate-400 font-normal">glasses</span>
                </div>
                <div className="text-[10px] text-slate-400">250ml per glass</div>
              </div>
              <button
                onClick={() => setWaterGlasses((prev) => Math.min(14, prev + 1))}
                className="w-8 h-8 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold flex items-center justify-center cursor-pointer shadow-sm"
              >
                +
              </button>
            </div>

            {/* Visual Glass Dots */}
            <div className="flex items-center justify-center gap-1.5 pt-1">
              {Array.from({ length: 10 }).map((_, index) => (
                <div
                  key={index}
                  className={`w-4 h-6 rounded-sm border transition-all ${
                    index < waterGlasses
                      ? 'bg-sky-500 border-sky-400'
                      : 'bg-slate-800 border-slate-700 opacity-40'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Left-Lateral Sleep Posture Guide */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center gap-2">
              <Moon className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-bold text-white">Left-Lateral Sleep Clinical Guide</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Why left side? The large inferior vena cava runs on the right side of the spine. Lying on your left prevents the heavy uterus from pressing on it, maximizing maternal oxygenation to the placenta and kidneys.
            </p>
            <div className="space-y-1.5 text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <div className="flex items-start gap-1.5">
                <span className="text-indigo-400 font-bold">1.</span>
                <span>Place a firm pillow between slightly bent knees to support pelvic alignment.</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="text-indigo-400 font-bold">2.</span>
                <span>Tuck a wedge cushion beneath your belly to reduce spinal twisting.</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="text-indigo-400 font-bold">3.</span>
                <span>Avoid lying flat on your back after 24 weeks gestation.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Maternal Vitals Edit Modal */}
      {showVitalsEditor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <HeartPulse className="w-4 h-4 text-rose-400" />
                <span>Log Maternal Vitals</span>
              </h3>
              <button
                onClick={() => setShowVitalsEditor(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveVitals} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Systolic BP (mmHg)
                  </label>
                  <input
                    type="number"
                    value={tempSystolic}
                    onChange={(e) => setTempSystolic(e.target.value)}
                    placeholder="120"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-pink-500 font-mono"
                  />
                  <span className="text-[10px] text-slate-500">Normal: &lt;130</span>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Diastolic BP (mmHg)
                  </label>
                  <input
                    type="number"
                    value={tempDiastolic}
                    onChange={(e) => setTempDiastolic(e.target.value)}
                    placeholder="80"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-pink-500 font-mono"
                  />
                  <span className="text-[10px] text-slate-500">Normal: &lt;85</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Blood Sugar / Glucose (mg/dL)
                </label>
                <input
                  type="number"
                  value={tempSugar}
                  onChange={(e) => setTempSugar(e.target.value)}
                  placeholder="95"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-pink-500 font-mono"
                />
                <span className="text-[10px] text-slate-500">Fasting target &lt;95 mg/dL; 2h Post-prandial &lt;120 mg/dL</span>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-300 space-y-1">
                <span className="text-amber-400 font-bold block">Preeclampsia Alert Threshold:</span>
                <span>Any reading ≥140/90 mmHg accompanied by persistent headache or blurred vision requires prompt hospital review.</span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowVitalsEditor(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-pink-600 hover:bg-pink-500 rounded-lg transition-colors cursor-pointer shadow-md shadow-pink-950"
                >
                  Save Vitals
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Clinical Doctor Summary Modal */}
      {showClinicalSummaryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-pink-950/80 border border-pink-700/60 flex items-center justify-center text-pink-300">
                  <FileText className="w-5 h-5 text-pink-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Antenatal Clinical Routine Slip</h3>
                  <p className="text-xs text-slate-400">Standardized summary for ASHA, ANM, or Hospital Checkup</p>
                </div>
              </div>
              <button
                onClick={() => setShowClinicalSummaryModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Clinical Printable Sheet */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4 text-xs font-sans">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800/80 pb-3 gap-2">
                <div>
                  <span className="text-[10px] text-pink-400 font-mono uppercase tracking-wider block font-bold">MomBond Maternal Care Network</span>
                  <strong className="text-base text-white">
                    {currentUser ? `${currentUser.name} (${currentUser.id})` : 'Registered Antenatal Patient'}
                  </strong>
                </div>
                <div className="text-right sm:text-right text-[11px] text-slate-400">
                  <div>Date: <strong className="text-white">{new Date().toLocaleDateString('en-IN', { dateStyle: 'long' })}</strong></div>
                  <div>District: <strong className="text-slate-300">Aurangabad (Chh. Sambhajinagar)</strong></div>
                </div>
              </div>

              {/* Vitals & Compliance Summary */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Blood Pressure</span>
                  <strong className="text-sm font-mono text-white">{systolicBp}/{diastolicBp} mmHg</strong>
                </div>
                <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Blood Sugar</span>
                  <strong className="text-sm font-mono text-white">{bloodSugar} mg/dL</strong>
                </div>
                <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Milestones Completed</span>
                  <strong className="text-sm font-mono text-emerald-400">{completedCount} / {routineItems.length}</strong>
                </div>
                <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Daily Hydration</span>
                  <strong className="text-sm font-mono text-sky-400">{waterGlasses * 250} ml</strong>
                </div>
              </div>

              {/* Cardiff Kick Monitoring Report */}
              <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 space-y-1">
                <div className="font-bold text-slate-200 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-pink-400" />
                  <span>Cardiff Fetal Movement Surveillance (Count-to-10):</span>
                </div>
                {kickLogs.length > 0 ? (
                  <p className="text-slate-300 text-[11px]">
                    Most recent session registered <strong>{kickLogs[0].count} distinct movements</strong> in <strong>{kickLogs[0].durationMinutes} minutes</strong>. Autonomic reactivity classified as normal.
                  </p>
                ) : (
                  <p className="text-slate-400 text-[11px]">
                    No kick session logged today yet. Standard protocol is to monitor after morning and evening meals.
                  </p>
                )}
              </div>

              {/* Schedule Execution Checklist */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Today's Milestone Compliance Checklist:
                </span>
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {routineItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-1.5 bg-slate-900/40 rounded border border-slate-800/60 text-[11px]">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-pink-400 font-bold text-[10px]">{item.time}</span>
                        <span className="text-slate-200">{item.title}</span>
                      </div>
                      <span className={`font-mono font-semibold ${item.completed ? 'text-emerald-400' : 'text-slate-500'}`}>
                        {item.completed ? '✓ Logged' : 'Pending'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <span className="text-xs text-slate-400">
                Print or copy this slip to present to Dr. Hedgewar, GMCH, or your local PHC.
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyLogSummary}
                  className="px-4 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Share2 className="w-3.5 h-3.5 text-sky-400" />
                  <span>Copy Clinical Text</span>
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 text-xs font-bold text-white bg-pink-600 hover:bg-pink-500 rounded-xl transition-colors cursor-pointer shadow-md shadow-pink-950 flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Slip</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Custom Routine Milestone Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">Add Custom Maternal Milestone</h3>
            <p className="text-xs text-slate-400">
              Incorporate specific medicine times, glucose testing, or doctor-recommended walks into your daily schedule.
            </p>

            <form onSubmit={handleAddCustomItem} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Time</label>
                <input
                  type="text"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  placeholder="e.g. 02:30 PM"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Blood Sugar Check (Post-Prandial)"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-pink-500"
                >
                  <option value="nutrition">Nutrition & Supplements</option>
                  <option value="monitoring">Monitoring & Vitals</option>
                  <option value="exercise">Exercise & Pelvic Health</option>
                  <option value="rest">Rest & Posture</option>
                  <option value="wake_sleep">Wake / Sleep Cycle</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description / Notes</label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="e.g. Check blood sugar exactly 2 hours after lunch and log result."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-pink-600 hover:bg-pink-500 rounded-lg transition-colors cursor-pointer shadow-md shadow-pink-950"
                >
                  Save Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation of Routine Milestone Interactive Modal */}
      {routineToConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl p-6 shadow-2xl space-y-5 text-white max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-pink-950/70 border border-pink-500/60 flex items-center justify-center text-pink-300">
                  <CheckCircle2 className="w-5 h-5 text-pink-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Confirmation of Routine Milestone</h3>
                  <p className="text-xs text-slate-400">Clinical milestone verification & physical tracking</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setRoutineToConfirm(null)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Routine Milestone Summary Box */}
            <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-4 space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-mono text-xs font-bold text-pink-300 bg-pink-950/80 border border-pink-700/60 px-2.5 py-0.5 rounded-md flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {routineToConfirm.time}
                </span>
                <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                  {routineToConfirm.category.replace('_', ' ')}
                </span>
              </div>
              <h4 className="text-base font-bold text-white">
                {routineToConfirm.title}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {routineToConfirm.description}
              </p>

              {routineToConfirm.clinicalRationale && (
                <div className="pt-2 border-t border-slate-900 text-[11px] text-slate-400 flex items-start gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-pink-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-slate-300">Medical Rationale: </strong>
                    {routineToConfirm.clinicalRationale}
                  </span>
                </div>
              )}
            </div>

            {/* Clinical Verification Checklist */}
            <div className="space-y-2.5">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Maternal Safety & Action Checklist:
              </label>

              <div className="space-y-2 bg-slate-950/60 border border-slate-800 rounded-xl p-3 text-xs">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={confirmChecklist.stepDone}
                    onChange={(e) =>
                      setConfirmChecklist((prev) => ({ ...prev, stepDone: e.target.checked }))
                    }
                    className="mt-0.5 w-4 h-4 rounded text-pink-600 focus:ring-pink-500 bg-slate-900 border-slate-700 accent-pink-500"
                  />
                  <span className="text-slate-200">
                    I have physically carried out the prescribed activity or meal as instructed.
                  </span>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={confirmChecklist.hydrated}
                    onChange={(e) =>
                      setConfirmChecklist((prev) => ({ ...prev, hydrated: e.target.checked }))
                    }
                    className="mt-0.5 w-4 h-4 rounded text-pink-600 focus:ring-pink-500 bg-slate-900 border-slate-700 accent-pink-500"
                  />
                  <span className="text-slate-200">
                    Adequate hydration taken (at least 1 glass of clean/boiled lukewarm water).
                  </span>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={confirmChecklist.comfortable}
                    onChange={(e) =>
                      setConfirmChecklist((prev) => ({ ...prev, comfortable: e.target.checked }))
                    }
                    className="mt-0.5 w-4 h-4 rounded text-pink-600 focus:ring-pink-500 bg-slate-900 border-slate-700 accent-pink-500"
                  />
                  <span className="text-slate-200">
                    No urgent warning signs observed (dizziness, sharp abdominal spasms, or bleeding).
                  </span>
                </label>
              </div>
            </div>

            {/* Maternal Clinical Notes (Optional) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Personal Maternal Note / Observation (Optional)
              </label>
              <textarea
                rows={2}
                value={confirmationNote}
                onChange={(e) => setConfirmationNote(e.target.value)}
                placeholder="e.g. Took iron tablet with fresh lemon water, no nausea felt, resting comfortably."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
              />
            </div>

            {/* Modal Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setRoutineToConfirm(null)}
                className="w-full sm:w-auto px-4 py-2.5 text-xs font-medium text-slate-400 hover:text-white rounded-xl transition-colors cursor-pointer text-center"
              >
                Cancel
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                {routineToConfirm.completed && (
                  <button
                    type="button"
                    onClick={() => {
                      handleCompleteStep(routineToConfirm.id);
                      setRoutineToConfirm(null);
                    }}
                    className="px-3.5 py-2.5 text-xs font-semibold text-rose-300 hover:text-rose-200 bg-rose-950/50 hover:bg-rose-900/60 border border-rose-800/60 rounded-xl transition-colors cursor-pointer"
                  >
                    Undo Confirmation
                  </button>
                )}

                {/* The Primary Click Button to Confirm Routine */}
                <button
                  type="button"
                  onClick={() => handleConfirmRoutine(routineToConfirm, confirmationNote)}
                  className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-pink-600 via-rose-600 to-pink-500 hover:from-pink-500 hover:to-rose-400 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-lg shadow-pink-950 ring-2 ring-pink-400/50 flex items-center justify-center gap-2 active:scale-95"
                >
                  <CheckCircle2 className="w-4 h-4 text-pink-100" />
                  <span>
                    {routineToConfirm.completed
                      ? 'Update Confirmation Record'
                      : '✓ Click Button to Confirm Routine'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Batch Routine Confirmation Modal */}
      {showBatchConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-4 text-white">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Confirm All Daily Routines</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowBatchConfirmModal(false)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to mark all remaining milestones as verified and completed for today?
            </p>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Total Routine Milestones:</span>
                <span className="font-mono font-bold text-white">{routineItems.length}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Already Completed:</span>
                <span className="font-mono text-emerald-400 font-bold">{completedCount}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Pending Confirmation:</span>
                <span className="font-mono text-pink-400 font-bold">{routineItems.length - completedCount}</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowBatchConfirmModal(false)}
                className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmAllRoutines}
                className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-lg shadow-emerald-950 flex items-center gap-1.5 active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>✓ Click Button to Confirm All Routines</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

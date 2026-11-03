export type UserRole = 
  | 'rural_clinic' 
  | 'tertiary_hospital' 
  | 'ambulance_dispatch' 
  | 'expectant_mother';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  roleTitle: string;
  organization: string;
  location: string;
  phone: string;
  email: string;
}

export type TriageLevel = 'CRITICAL' | 'URGENT' | 'MONITORED';

export type TransportStatus = 
  | 'DISPATCH_REQUESTED' 
  | 'AMBULANCE_ASSIGNED' 
  | 'EN_ROUTE_TO_CLINIC' 
  | 'PATIENT_PICKED_UP' 
  | 'EN_ROUTE_TO_HOSPITAL' 
  | 'HANDOVER_COMPLETE';

export interface ReferralCase {
  id: string;
  patientName: string;
  age: number;
  gestationalWeeks: number;
  gravidaParity: string;
  referringFacility: string;
  targetHospital: string;
  triageLevel?: TriageLevel;
  primaryDiagnosis?: string;
  clinicalSummary?: string;
  vitals?: {
    bp?: string;
    pulse?: number;
    spo2?: number;
    fhr?: number; // Fetal Heart Rate (bpm)
    temp?: string;
  };
  transportStatus?: TransportStatus;
  ambulanceId: string;
  ambulanceName: string;
  ambulanceLocation: string;
  driverName?: string;
  driverPhone?: string;
  estimatedArrivalMin?: number;
  createdAt: string;
  referringDoctor?: string;
  assignedSpecialist?: string;
  allocatedBed?: string;
  specialNeeds?: string[];
}

export interface RoutineStepAction {
  stepNumber: number;
  actionTitle: string;
  instruction: string;
  clinicalDetail: string;
}

export interface RoutineItem {
  id: string;
  time: string;
  title: string;
  buttonLabel: string;
  timingPhase: 'morning' | 'afternoon' | 'evening' | 'night';
  category: 'wake_sleep' | 'nutrition' | 'exercise' | 'monitoring' | 'rest';
  description: string;
  actionSteps: RoutineStepAction[];
  clinicalRationale: string;
  clinicalTips: string[];
  trimester: 'all' | 'first' | 'second' | 'third';
  completed: boolean;
  completedAt?: string | null;
  isCustom?: boolean;
}

export interface KickLog {
  id: string;
  timestamp: string;
  count: number;
  durationMinutes: number;
  notes: string;
}

export interface HospitalFacility {
  id: string;
  name: string;
  localName: string;
  category: 'Apex Government Tertiary' | 'District Civil Hospital' | 'Specialized NICU / Medical College' | 'Trust Emergency Care';
  address: string;
  area: string;
  city: string;
  emergencyPhone: string;
  alternatePhone: string;
  distanceFromRuralHubs: {
    phcPaithan: string;
    phcKannad: string;
    phcGangapur: string;
    phcSillod: string;
    phcVaijapur: string;
  };
  maternalIcuBedsTotal: number;
  maternalIcuBedsAvailable: number;
  nicuWarmersTotal: number;
  nicuWarmersAvailable: number;
  bloodBankAvailable: boolean;
  emergencyObstetrician24x7: boolean;
  freeUnderGovernmentScheme: boolean;
  latitude: number;
  longitude: number;
}

export interface NearbyAmbulanceContact {
  id: string;
  name: string;
  locationArea: string;
  phoneNumber: string;
  alternateNumber?: string;
  serviceCategory: string;
  coverageArea: string;
  distanceFromCityCenter: string;
  availableAmbulances: number;
  is24x7: boolean;
  purpose: string;
}

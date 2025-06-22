
export const PATIENT_TYPES = [
  { value: 'all', label: 'All Patient Types' },
  { value: 'Adult', label: 'Adult' },
  { value: 'Pediatric', label: 'Pediatric' },
  { value: 'Geriatric', label: 'Geriatric' },
] as const;

export const MEDICATION_CLASSIFICATIONS = [
  { value: 'all', label: 'All Classifications' },
  { value: 'Cardiac', label: 'Cardiac' },
  { value: 'Respiratory', label: 'Respiratory' },
  { value: 'Anticonvulsant', label: 'Anticonvulsant' },
  { value: 'Antiarrhythmic', label: 'Antiarrhythmic' },
  { value: 'Analgesic', label: 'Analgesic' },
  { value: 'Sedative', label: 'Sedative' },
] as const;

export const ADMINISTRATION_ROUTES = [
  { value: 'all', label: 'All Routes' },
  { value: 'IV', label: 'Intravenous (IV)' },
  { value: 'IM', label: 'Intramuscular (IM)' },
  { value: 'SC', label: 'Subcutaneous (SC)' },
  { value: 'PO', label: 'Oral (PO)' },
  { value: 'SL', label: 'Sublingual (SL)' },
  { value: 'ET', label: 'Endotracheal (ET)' },
  { value: 'Inhalation', label: 'Inhalation' },
] as const;

export const EMERGENCY_CATEGORIES = [
  {
    id: 'cardiac-arrest',
    title: 'Cardiac Arrest',
    description: 'Emergency cardiac medications',
    icon: 'Heart',
    color: 'bg-red-500',
  },
  {
    id: 'respiratory',
    title: 'Respiratory',
    description: 'Breathing emergencies',
    icon: 'Lungs',
    color: 'bg-blue-500',
  },
  {
    id: 'seizure',
    title: 'Seizures',
    description: 'Anticonvulsant medications',
    icon: 'Brain',
    color: 'bg-purple-500',
  },
  {
    id: 'arrhythmia',
    title: 'Arrhythmias',
    description: 'Heart rhythm disorders',
    icon: 'Activity',
    color: 'bg-orange-500',
  },
  {
    id: 'pediatric',
    title: 'Pediatric',
    description: 'Child-specific dosing',
    icon: 'Baby',
    color: 'bg-green-500',
  },
  {
    id: 'high-alert',
    title: 'High Alert',
    description: 'High-risk medications',
    icon: 'AlertTriangle',
    color: 'bg-red-600',
  },
] as const;

export const SEARCH_LIMITS = {
  MEDICATION_SUGGESTIONS: 3,
  INDICATION_SUGGESTIONS: 3,
  TOTAL_SUGGESTIONS: 6,
  RECENT_SEARCHES: 5,
} as const;

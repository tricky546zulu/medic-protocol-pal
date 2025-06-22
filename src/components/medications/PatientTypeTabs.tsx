
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { EmergencyDosingCard } from './EmergencyDosingCard';
import { Baby, User, Heart } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';

type MedicationDosing = Database['public']['Tables']['medication_dosing']['Row'];

interface PatientTypeTabsProps {
  dosing: MedicationDosing[];
  isHighAlert: boolean;
}

export const PatientTypeTabs = ({ dosing, isHighAlert }: PatientTypeTabsProps) => {
  // Group dosing by patient type
  const dosingByType = dosing.reduce((acc, dose) => {
    if (!acc[dose.patient_type]) {
      acc[dose.patient_type] = [];
    }
    acc[dose.patient_type].push(dose);
    return acc;
  }, {} as Record<string, MedicationDosing[]>);

  const patientTypes = Object.keys(dosingByType);
  const defaultType = patientTypes.includes('Adult') ? 'Adult' : patientTypes[0];

  if (patientTypes.length === 0) return null;

  const getPatientTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pediatric':
      case 'neonatal':
        return Baby;
      case 'geriatric':
        return Heart;
      default:
        return User;
    }
  };

  const getPatientTypeColors = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pediatric':
        return 'data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-pink-600 data-[state=active]:text-white data-[state=active]:backdrop-blur-md hover:bg-pink-50/80 border-pink-200/40 text-pink-700 data-[state=active]:shadow-lg data-[state=active]:border-pink-300/60 data-[state=active]:shadow-pink-200/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-md';
      case 'neonatal':
        return 'data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:backdrop-blur-md hover:bg-purple-50/80 border-purple-200/40 text-purple-700 data-[state=active]:shadow-lg data-[state=active]:border-purple-300/60 data-[state=active]:shadow-purple-200/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-md';
      case 'geriatric':
        return 'data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-amber-600 data-[state=active]:text-white data-[state=active]:backdrop-blur-md hover:bg-amber-50/80 border-amber-200/40 text-amber-700 data-[state=active]:shadow-lg data-[state=active]:border-amber-300/60 data-[state=active]:shadow-amber-200/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-md';
      default:
        return 'data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:backdrop-blur-md hover:bg-blue-50/80 border-blue-200/40 text-blue-700 data-[state=active]:shadow-lg data-[state=active]:border-blue-300/60 data-[state=active]:shadow-blue-200/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-md';
    }
  };

  return (
    <Tabs defaultValue={defaultType} className="w-full">
      <TabsList className={`grid w-full mb-8 bg-white/80 backdrop-blur-md shadow-xl border border-white/20 h-auto p-3 rounded-2xl ${patientTypes.length === 1 ? 'grid-cols-1' : patientTypes.length === 2 ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'} gap-2`}>
        {patientTypes.map((type) => {
          const Icon = getPatientTypeIcon(type);
          const colors = getPatientTypeColors(type);
          
          return (
            <TabsTrigger 
              key={type} 
              value={type}
              className={`font-semibold py-4 px-3 sm:px-5 rounded-xl flex items-center gap-2 sm:gap-3 border bg-white/60 backdrop-blur-sm min-h-[3.5rem] ${colors}`}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              <span className="font-semibold tracking-wide text-xs sm:text-sm leading-tight text-center">{type}</span>
            </TabsTrigger>
          );
        })}
      </TabsList>
      
      {patientTypes.map((type) => (
        <TabsContent key={type} value={type} className="space-y-8">
          {dosingByType[type].map((dose) => (
            <EmergencyDosingCard 
              key={dose.id} 
              dosing={dose} 
              isHighAlert={isHighAlert}
            />
          ))}
        </TabsContent>
      ))}
    </Tabs>
  );
};

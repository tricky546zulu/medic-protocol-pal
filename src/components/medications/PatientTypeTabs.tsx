
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
        return 'data-[state=active]:bg-gradient-to-r data-[state=active]:from-rose-400 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:backdrop-blur-lg hover:bg-rose-50/95 border-rose-300/70 text-rose-800 data-[state=active]:shadow-2xl data-[state=active]:border-rose-400/70 data-[state=active]:shadow-rose-400/80 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl shadow-rose-300/60';
      case 'neonatal':
        return 'data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-400 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:backdrop-blur-lg hover:bg-violet-50/95 border-violet-300/70 text-violet-800 data-[state=active]:shadow-2xl data-[state=active]:border-violet-400/70 data-[state=active]:shadow-violet-400/80 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl shadow-violet-300/60';
      case 'geriatric':
        return 'data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-400 data-[state=active]:to-orange-500 data-[state=active]:text-white data-[state=active]:backdrop-blur-lg hover:bg-amber-50/95 border-amber-300/70 text-amber-800 data-[state=active]:shadow-2xl data-[state=active]:border-amber-400/70 data-[state=active]:shadow-amber-400/80 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl shadow-amber-300/60';
      default:
        return 'data-[state=active]:bg-gradient-to-r data-[state=active]:from-sky-400 data-[state=active]:to-blue-500 data-[state=active]:text-white data-[state=active]:backdrop-blur-lg hover:bg-sky-50/95 border-sky-300/70 text-sky-800 data-[state=active]:shadow-2xl data-[state=active]:border-sky-400/70 data-[state=active]:shadow-sky-400/80 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl shadow-sky-300/60';
    }
  };

  return (
    <Tabs defaultValue={defaultType} className="w-full">
      <TabsList className={`grid w-full mb-10 bg-white/95 backdrop-blur-xl shadow-2xl shadow-violet-300/70 border-2 border-white/80 h-auto p-4 rounded-3xl ${patientTypes.length === 1 ? 'grid-cols-1' : patientTypes.length === 2 ? 'grid-cols-2' : patientTypes.length === 3 ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'} gap-4 ring-2 ring-violet-300/60`}>
        {patientTypes.map((type) => {
          const Icon = getPatientTypeIcon(type);
          const colors = getPatientTypeColors(type);
          
          return (
            <TabsTrigger 
              key={type} 
              value={type}
              className={`font-bold py-3 px-3 sm:py-4 sm:px-4 lg:py-5 lg:px-6 rounded-2xl flex flex-col sm:flex-row items-center gap-2 sm:gap-3 lg:gap-4 border-2 bg-white/95 backdrop-blur-lg min-h-[3rem] sm:min-h-[4rem] ${colors} whitespace-normal text-center sm:text-left shadow-lg`}
            >
              <Icon className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <span className="font-bold tracking-wide text-xs sm:text-sm lg:text-base leading-tight break-words">{type}</span>
            </TabsTrigger>
          );
        })}
      </TabsList>
      
      {patientTypes.map((type) => (
        <TabsContent key={type} value={type} className="space-y-10">
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

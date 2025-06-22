
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
        return 'data-[state=active]:bg-pink-400/90 data-[state=active]:text-white data-[state=active]:backdrop-blur-md hover:bg-pink-100/70 border-pink-200/30 text-pink-700 data-[state=active]:shadow-lg data-[state=active]:border-pink-300/50';
      case 'neonatal':
        return 'data-[state=active]:bg-purple-400/90 data-[state=active]:text-white data-[state=active]:backdrop-blur-md hover:bg-purple-100/70 border-purple-200/30 text-purple-700 data-[state=active]:shadow-lg data-[state=active]:border-purple-300/50';
      case 'geriatric':
        return 'data-[state=active]:bg-amber-400/90 data-[state=active]:text-white data-[state=active]:backdrop-blur-md hover:bg-amber-100/70 border-amber-200/30 text-amber-700 data-[state=active]:shadow-lg data-[state=active]:border-amber-300/50';
      default:
        return 'data-[state=active]:bg-slate-500/90 data-[state=active]:text-white data-[state=active]:backdrop-blur-md hover:bg-slate-100/70 border-slate-200/30 text-slate-700 data-[state=active]:shadow-lg data-[state=active]:border-slate-300/50';
    }
  };

  return (
    <Tabs defaultValue={defaultType} className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-8 bg-white/80 backdrop-blur-md shadow-xl border border-white/20 h-auto p-3 rounded-2xl">
        {patientTypes.map((type) => {
          const Icon = getPatientTypeIcon(type);
          const colors = getPatientTypeColors(type);
          
          return (
            <TabsTrigger 
              key={type} 
              value={type}
              className={`font-semibold text-sm py-4 px-5 rounded-xl transition-all duration-200 flex items-center gap-3 h-14 border bg-white/60 backdrop-blur-sm ${colors} min-w-0`}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              <span className="font-semibold tracking-wide truncate">{type}</span>
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


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
        return 'data-[state=active]:bg-pink-500 data-[state=active]:text-white hover:bg-pink-100 border-pink-200 text-pink-700 data-[state=active]:shadow-xl';
      case 'neonatal':
        return 'data-[state=active]:bg-purple-500 data-[state=active]:text-white hover:bg-purple-100 border-purple-200 text-purple-700 data-[state=active]:shadow-xl';
      case 'geriatric':
        return 'data-[state=active]:bg-amber-500 data-[state=active]:text-white hover:bg-amber-100 border-amber-200 text-amber-700 data-[state=active]:shadow-xl';
      default:
        return 'data-[state=active]:bg-blue-500 data-[state=active]:text-white hover:bg-blue-100 border-blue-200 text-blue-700 data-[state=active]:shadow-xl';
    }
  };

  return (
    <Tabs defaultValue={defaultType} className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-8 bg-white/95 backdrop-blur-sm shadow-xl border-0 h-auto p-3 rounded-2xl">
        {patientTypes.map((type) => {
          const Icon = getPatientTypeIcon(type);
          const colors = getPatientTypeColors(type);
          
          return (
            <TabsTrigger 
              key={type} 
              value={type}
              className={`font-bold text-lg py-5 px-8 rounded-xl transition-all duration-300 flex items-center gap-4 min-h-[70px] border-2 ${colors} min-w-0`}
            >
              <Icon className="h-7 w-7 flex-shrink-0" />
              <span className="font-black tracking-wide truncate">{type}</span>
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


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
        return 'data-[state=active]:bg-rose-500 data-[state=active]:text-white hover:bg-rose-50 border-rose-200 text-rose-700';
      case 'neonatal':
        return 'data-[state=active]:bg-violet-500 data-[state=active]:text-white hover:bg-violet-50 border-violet-200 text-violet-700';
      case 'geriatric':
        return 'data-[state=active]:bg-amber-500 data-[state=active]:text-white hover:bg-amber-50 border-amber-200 text-amber-700';
      default:
        return 'data-[state=active]:bg-blue-500 data-[state=active]:text-white hover:bg-blue-50 border-blue-200 text-blue-700';
    }
  };

  return (
    <Tabs defaultValue={defaultType} className="w-full">
      <TabsList className={`grid w-full mb-6 bg-white border shadow-sm rounded-lg h-auto p-2 ${patientTypes.length === 1 ? 'grid-cols-1' : patientTypes.length === 2 ? 'grid-cols-2' : patientTypes.length === 3 ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'} gap-1`}>
        {patientTypes.map((type) => {
          const Icon = getPatientTypeIcon(type);
          const colors = getPatientTypeColors(type);
          
          return (
            <TabsTrigger 
              key={type} 
              value={type}
              className={`font-medium py-2 px-2 rounded-lg flex items-center justify-center gap-2 border transition-colors min-h-[2.5rem] ${colors}`}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm font-medium truncate min-w-0">{type}</span>
            </TabsTrigger>
          );
        })}
      </TabsList>
      
      {patientTypes.map((type) => (
        <TabsContent key={type} value={type} className="space-y-6">
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


import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmergencyDosingCard } from './EmergencyDosingCard';
import { InfusionOnlyCard } from './InfusionOnlyCard';
import type { Database } from '@/integrations/supabase/types';

type MedicationDosing = Database['public']['Tables']['medication_dosing']['Row'];

interface PatientTypeTabsProps {
  dosing: MedicationDosing[];
  isHighAlert?: boolean;
  isInfusionOnly?: boolean;
}

export const PatientTypeTabs = ({ dosing, isHighAlert, isInfusionOnly }: PatientTypeTabsProps) => {
  const patientTypes = [...new Set(dosing.map(d => d.patient_type))];
  const [activeTab, setActiveTab] = useState(patientTypes[0] || '');

  if (patientTypes.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No dosing information available
      </div>
    );
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 h-auto bg-white border border-gray-200 p-1">
        {patientTypes.map((patientType) => (
          <TabsTrigger 
            key={patientType} 
            value={patientType}
            className="px-3 py-2 text-sm font-medium data-[state=active]:bg-blue-100 data-[state=active]:text-blue-900 data-[state=active]:border-blue-300"
          >
            {patientType}
          </TabsTrigger>
        ))}
      </TabsList>
      
      {patientTypes.map((patientType) => {
        const patientDosing = dosing.filter(d => d.patient_type === patientType);
        
        return (
          <TabsContent key={patientType} value={patientType} className="mt-6">
            <div className="grid gap-6">
              {patientDosing.map((dose) => (
                <div key={dose.id}>
                  {isInfusionOnly ? (
                    <InfusionOnlyCard 
                      dosing={dose} 
                      isHighAlert={isHighAlert}
                    />
                  ) : (
                    <EmergencyDosingCard 
                      dosing={dose} 
                      isHighAlert={isHighAlert}
                    />
                  )}
                </div>
              ))}
            </div>
          </TabsContent>
        );
      })}
    </Tabs>
  );
};

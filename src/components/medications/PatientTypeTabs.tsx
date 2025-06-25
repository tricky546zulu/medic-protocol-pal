
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
      <div className="text-center py-12 text-gray-500">
        <div className="text-lg font-medium mb-2">No dosing information available</div>
        <div className="text-sm">Please check back later or contact your administrator.</div>
      </div>
    );
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full h-auto bg-gray-50 border border-gray-200 p-1 rounded-lg mb-6" style={{ gridTemplateColumns: `repeat(${patientTypes.length}, 1fr)` }}>
        {patientTypes.map((patientType) => (
          <TabsTrigger 
            key={patientType} 
            value={patientType}
            className="px-4 py-3 text-sm font-medium rounded-md data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm text-gray-600 hover:text-gray-900 transition-all"
          >
            {patientType}
          </TabsTrigger>
        ))}
      </TabsList>
      
      {patientTypes.map((patientType) => {
        const patientDosing = dosing.filter(d => d.patient_type === patientType);
        
        return (
          <TabsContent key={patientType} value={patientType} className="mt-0">
            <div className="space-y-4">
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

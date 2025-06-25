
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
        <div className="text-base font-medium mb-1">No dosing information available</div>
        <div className="text-sm">Please check back later or contact your administrator.</div>
      </div>
    );
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      {/* Simplified Tab List - Better overflow handling */}
      <TabsList className="grid w-full h-auto bg-gray-50 border border-gray-200 p-1 rounded-lg mb-4 overflow-x-auto" 
                style={{ gridTemplateColumns: `repeat(${patientTypes.length}, minmax(0, 1fr))` }}>
        {patientTypes.map((patientType) => (
          <TabsTrigger 
            key={patientType} 
            value={patientType}
            className="px-3 py-2 text-sm font-medium rounded-md data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm text-gray-600 hover:text-gray-900 transition-all whitespace-nowrap truncate min-w-0"
            title={patientType}
          >
            {patientType}
          </TabsTrigger>
        ))}
      </TabsList>
      
      {/* Tab Content - Simplified spacing */}
      {patientTypes.map((patientType) => {
        const patientDosing = dosing.filter(d => d.patient_type === patientType);
        
        return (
          <TabsContent key={patientType} value={patientType} className="mt-0">
            <div className="space-y-3">
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

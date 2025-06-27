
import React, { useState, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmergencyDosingCard } from './EmergencyDosingCard';
import { InfusionOnlyCard } from './InfusionOnlyCard';
import type { Database } from '@/integrations/supabase/types';
import { cn } from '@/lib/utils';
import { AlertCircleIcon } from 'lucide-react'; // Import icon for empty state

type MedicationDosing = Database['public']['Tables']['medication_dosing']['Row'];

interface PatientTypeTabsProps {
  dosing: MedicationDosing[];
  isHighAlert?: boolean;
  isInfusionOnly?: boolean;
}

// Define a standard order for patient types
const PATIENT_TYPE_ORDER: Record<string, number> = {
  'Adult': 1,
  'Pediatric': 2,
  'Neonate': 3,
  // Add other common types here if needed
};


export const PatientTypeTabs = ({ dosing, isHighAlert = false, isInfusionOnly = false }: PatientTypeTabsProps) => {
  // Memoize sorted patient types to prevent re-sorting on every render
  const sortedPatientTypes = useMemo(() => {
    const uniqueTypes = [...new Set(dosing.map(d => d.patient_type || "Unknown"))]; // Handle null/undefined patient_type
    return uniqueTypes.sort((a, b) => {
      const orderA = PATIENT_TYPE_ORDER[a] || Infinity; // Default to end if not in defined order
      const orderB = PATIENT_TYPE_ORDER[b] || Infinity;
      if (orderA !== orderB) {
        return orderA - orderB;
      }
      return a.localeCompare(b); // Fallback to alphabetical if order is the same or not defined
    });
  }, [dosing]);

  const [activeTab, setActiveTab] = useState(sortedPatientTypes[0] || '');

  if (sortedPatientTypes.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground flex flex-col items-center">
        <AlertCircleIcon className="h-10 w-10 mb-3 text-muted-foreground/70" />
        <p className="text-base font-medium mb-1">No Dosing Information Available</p>
        <p className="text-sm">
          Please check back later or contact support if you believe this is an error.
        </p>
      </div>
    );
  }

  const gridColsClass = sortedPatientTypes.length <= 4
    ? `grid-cols-${sortedPatientTypes.length}`
    : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4';


  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList
        className={cn(
          "grid w-full h-auto bg-muted p-1 rounded-lg mb-4 sm:mb-6", // Use themed background, responsive margin
          gridColsClass // Dynamic grid columns
        )}
      >
        {sortedPatientTypes.map((patientType) => (
          <TabsTrigger 
            key={patientType} 
            value={patientType}
            className={cn(
              "px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm font-medium rounded-md", // Responsive padding and text size
              "data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
              "text-muted-foreground hover:text-foreground transition-all whitespace-nowrap truncate min-w-0"
            )}
            title={patientType}
          >
            {patientType}
          </TabsTrigger>
        ))}
      </TabsList>
      
      {sortedPatientTypes.map((patientType) => {
        // Filter dosing for the current patient type
        const patientDosing = dosing.filter(d => (d.patient_type || "Unknown") === patientType);
        
        return (
          <TabsContent key={patientType} value={patientType} className="mt-0 focus-visible:ring-0 focus-visible:ring-offset-0"> {/* Remove focus ring on content */}
            {patientDosing.length > 0 ? (
              <div className="space-y-3 sm:space-y-4"> {/* Responsive spacing */}
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
            ) : (
              // This case should ideally not happen if patientTypes are derived from dosing with actual entries.
              // But as a fallback:
              <div className="text-center py-6 text-muted-foreground">
                No specific dosing information found for {patientType}.
              </div>
            )}
          </TabsContent>
        );
      })}
    </Tabs>
  );
};

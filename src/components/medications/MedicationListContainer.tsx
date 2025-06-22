
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MedicationCard } from './MedicationCard';
import type { Database } from '@/integrations/supabase/types';

type Medication = Database['public']['Tables']['medications']['Row'];

interface MedicationListContainerProps {
  medications: Medication[];
  isLoading: boolean;
  activeFiltersCount: number;
}

export const MedicationListContainer = ({
  medications,
  isLoading,
  activeFiltersCount,
}: MedicationListContainerProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse bg-white/95 backdrop-blur-lg border-2 border-white/80 rounded-3xl shadow-xl shadow-gray-300/60">
            <div className="h-48 bg-gray-200/80 rounded-3xl"></div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="mb-4 text-sm text-gray-700 font-medium">
        Showing {medications.length} medication{medications.length !== 1 ? 's' : ''}
        {activeFiltersCount > 0 && ` (${activeFiltersCount} filter${activeFiltersCount !== 1 ? 's' : ''} applied)`}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {medications.map((medication) => (
          <MedicationCard key={medication.id} medication={medication} />
        ))}
      </div>
    </>
  );
};

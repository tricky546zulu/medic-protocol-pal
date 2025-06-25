
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Pill, AlertTriangle } from 'lucide-react';
import { BookmarkButton } from './BookmarkButton';
import type { Database } from '@/integrations/supabase/types';

type Medication = Database['public']['Tables']['medications']['Row'];

interface MedicationHeaderProps {
  medication: Medication;
}

export const MedicationHeader = ({ medication }: MedicationHeaderProps) => {
  return (
    <div className="med-card mb-8">
      <div className="med-card-header">
        <div className="flex items-start gap-4 min-w-0 flex-1">
          <div className="flex-shrink-0 w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center border border-blue-200">
            <Pill className="h-6 w-6 text-blue-600" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="med-title mb-4">{medication.medication_name}</h1>
            {medication.classification && medication.classification.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {medication.classification.map((cls, index) => (
                  <span key={cls} className="med-category-tag">
                    {cls}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex flex-col gap-3 flex-shrink-0">
          {medication.high_alert && (
            <div className="med-critical-tag flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              <span>High Alert Medication</span>
            </div>
          )}
          <BookmarkButton 
            medicationId={medication.id} 
            medicationName={medication.medication_name} 
          />
        </div>
      </div>
    </div>
  );
};

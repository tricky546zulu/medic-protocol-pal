
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
    <div className="mb-8 p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-4">
          <div className="flex items-start gap-4 min-w-0 flex-1">
            <div className="flex-shrink-0 w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center border border-blue-200">
              <Pill className="h-6 w-6 text-blue-600" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-semibold text-gray-900 mb-3 break-words leading-tight">{medication.medication_name}</h1>
              {medication.classification && medication.classification.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {medication.classification.map((cls, index) => (
                    <Badge key={index} variant="secondary" className="text-sm bg-gray-100 text-gray-700 border-0 px-3 py-1">
                      {cls}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            {medication.high_alert && (
              <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <span className="text-sm font-medium text-red-700">High Alert Medication</span>
              </div>
            )}
            <BookmarkButton 
              medicationId={medication.id} 
              medicationName={medication.medication_name} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

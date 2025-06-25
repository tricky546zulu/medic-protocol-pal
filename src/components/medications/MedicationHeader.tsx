
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
    <div className="mb-6 p-4 bg-white border border-gray-200 rounded-lg">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <Pill className="h-5 w-5 text-blue-600" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl font-semibold text-gray-900 mb-2 break-words leading-tight">
                {medication.medication_name}
              </h1>
              {medication.classification && medication.classification.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {medication.classification.slice(0, 4).map((cls, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className="text-xs bg-gray-100 text-gray-700 px-2 py-1 truncate max-w-32"
                      title={cls}
                    >
                      {cls}
                    </Badge>
                  ))}
                  {medication.classification.length > 4 && (
                    <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600 px-2 py-1">
                      +{medication.classification.length - 4}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
            {medication.high_alert && (
              <div className="flex items-center gap-1 px-2 py-1 bg-red-50 border border-red-200 rounded text-xs">
                <AlertTriangle className="h-3 w-3 text-red-600" />
                <span className="font-medium text-red-700 whitespace-nowrap">High Alert</span>
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

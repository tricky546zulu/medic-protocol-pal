
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
    <div className={`mb-10 p-6 rounded-lg bg-white/85 backdrop-blur-lg border border-white/30 shadow-lg transition-all duration-300 ${medication.high_alert ? 'ring-1 ring-red-400/60' : 'ring-1 ring-violet-200/40'}`}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-4">
          <div className="flex items-start gap-4 min-w-0 flex-1">
            <div className="flex-shrink-0 p-3 bg-gradient-to-br from-violet-100 to-purple-200 rounded-lg border border-violet-200/50 shadow-lg">
              <Pill className="h-6 w-6 text-violet-700" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 break-words leading-tight">{medication.medication_name}</h1>
              {medication.classification && medication.classification.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {medication.classification.map((cls, index) => (
                    <Badge key={index} variant="secondary" className="text-sm bg-gradient-to-r from-violet-100 to-purple-200 text-violet-800 px-3 py-1 rounded-lg border border-violet-200/60 font-medium">
                      <span className="break-words max-w-32">{cls}</span>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            {medication.high_alert && (
              <Badge variant="destructive" className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg shadow-lg bg-gradient-to-r from-red-500 to-red-600 border border-red-300/50 font-bold">
                <AlertTriangle className="h-4 w-4" />
                <span className="hidden sm:inline">HIGH ALERT MEDICATION</span>
                <span className="sm:hidden">HIGH ALERT</span>
              </Badge>
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

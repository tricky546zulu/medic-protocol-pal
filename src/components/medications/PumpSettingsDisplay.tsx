
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Syringe } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';

type MedicationDosing = Database['public']['Tables']['medication_dosing']['Row'];

interface PumpSettingsDisplayProps {
  dosing: MedicationDosing;
}

export const PumpSettingsDisplay = ({ dosing }: PumpSettingsDisplayProps) => {
  if (!dosing.requires_infusion_pump) return null;

  const pumpSettings = dosing.infusion_pump_settings as any;
  
  if (!pumpSettings || Object.keys(pumpSettings).length === 0) return null;

  return (
    <div className="mt-5 p-5 sm:p-6 bg-gradient-to-br from-blue-50/98 to-sky-100/95 rounded-3xl text-xs sm:text-sm backdrop-blur-lg border-2 border-blue-200/70 hover:shadow-xl transition-all duration-200 shadow-xl shadow-blue-300/60">
      <div className="font-bold text-blue-800 mb-4 flex items-center gap-3">
        <Syringe className="h-4 w-4" />
        ⚠️ IV PUMP SETTINGS:
      </div>
      
      {pumpSettings.medication_selection && (
        <div className="mb-4 p-4 bg-gradient-to-r from-blue-100/98 to-sky-200/95 rounded-2xl backdrop-blur-lg border-2 border-blue-300/60 shadow-lg shadow-blue-200/50">
          <span className="font-bold text-blue-900 text-xs sm:text-sm">PUMP MEDICATION:</span>
          <div className="font-bold text-blue-900 break-words text-xs sm:text-sm mt-2">{pumpSettings.medication_selection}</div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {pumpSettings.cca_setting && (
          <div className="bg-white/98 p-4 rounded-2xl backdrop-blur-lg border-2 border-white/60 hover:bg-white transition-all duration-200 shadow-lg shadow-blue-200/40">
            <span className="font-semibold text-xs sm:text-sm">CCA:</span> <span className="break-words text-xs sm:text-sm font-medium">{pumpSettings.cca_setting}</span>
          </div>
        )}
        {pumpSettings.line_option && (
          <div className="bg-white/98 p-4 rounded-2xl backdrop-blur-lg border-2 border-white/60 hover:bg-white transition-all duration-200 shadow-lg shadow-blue-200/40">
            <span className="font-semibold text-xs sm:text-sm">Line:</span> <span className="break-words text-xs sm:text-sm font-medium">{pumpSettings.line_option}</span>
          </div>
        )}
        {pumpSettings.duration && (
          <div className="bg-white/98 p-4 rounded-2xl backdrop-blur-lg border-2 border-white/60 hover:bg-white transition-all duration-200 shadow-lg shadow-blue-200/40">
            <span className="font-semibold text-xs sm:text-sm">Duration:</span> <span className="break-words text-xs sm:text-sm font-medium">{pumpSettings.duration}</span>
          </div>
        )}
        {pumpSettings.vtbi && (
          <div className="bg-white/98 p-4 rounded-2xl backdrop-blur-lg border-2 border-white/60 hover:bg-white transition-all duration-200 shadow-lg shadow-blue-200/40">
            <span className="font-semibold text-xs sm:text-sm">VTBI:</span> <span className="break-words text-xs sm:text-sm font-medium">{pumpSettings.vtbi}</span>
          </div>
        )}
      </div>
      {pumpSettings.pump_instructions && (
        <div className="mt-4 pt-4 border-t-2 border-blue-300/70">
          <span className="font-semibold text-xs sm:text-sm">Instructions:</span> <span className="break-words text-xs sm:text-sm font-medium">{pumpSettings.pump_instructions}</span>
        </div>
      )}
    </div>
  );
};

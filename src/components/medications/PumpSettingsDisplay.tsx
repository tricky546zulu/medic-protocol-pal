
import React from 'react';
import { Syringe } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';

type MedicationDosing = Database['public']['Tables']['medication_dosing']['Row'];

interface PumpSettingsDisplayProps {
  dosing: MedicationDosing;
}

export const PumpSettingsDisplay = ({ dosing }: PumpSettingsDisplayProps) => {
  if (!dosing.requires_infusion_pump) {
    return null;
  }

  const pumpSettings = dosing.infusion_pump_settings as any;
  
  // Check if pump settings object has any meaningful data
  const hasSettings = pumpSettings && (
    pumpSettings.medication_selection || pumpSettings.cca_setting
  );

  if (!hasSettings) {
    return (
      <div className="flex items-center gap-2 text-blue-700 text-sm">
        <Syringe className="h-4 w-4" />
        <span>IV Pump Required</span>
      </div>
    );
  }

  return (
    <div className="text-sm p-2 bg-blue-50 rounded border border-blue-200">
      <div className="flex items-center gap-2 text-blue-800 font-medium mb-1">
        <Syringe className="h-4 w-4" />
        IV Pump Settings
      </div>
      
      {pumpSettings.medication_selection && (
        <div className="text-blue-900 mb-1">{pumpSettings.medication_selection}</div>
      )}

      <div className="text-blue-800 space-y-1">
        {pumpSettings.cca_setting && <div>CCA: {pumpSettings.cca_setting}</div>}
        {pumpSettings.line_option && <div>Line: {pumpSettings.line_option}</div>}
        {pumpSettings.duration && <div>Duration: {pumpSettings.duration}</div>}
        {pumpSettings.vtbi && <div>VTBI: {pumpSettings.vtbi}</div>}
        {pumpSettings.pump_instructions && (
          <div className="pt-1 border-t border-blue-200 italic text-xs">
            {pumpSettings.pump_instructions}
          </div>
        )}
      </div>
    </div>
  );
};

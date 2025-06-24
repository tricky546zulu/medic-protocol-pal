
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
    pumpSettings.medication_selection ||
    pumpSettings.cca_setting ||
    pumpSettings.line_option ||
    pumpSettings.duration ||
    pumpSettings.vtbi ||
    pumpSettings.pump_instructions
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
    <div className="border border-blue-200 rounded-lg p-3 bg-blue-50">
      <div className="flex items-center gap-2 mb-2">
        <Syringe className="h-4 w-4 text-blue-600" />
        <span className="text-sm font-medium text-blue-800">IV Pump Settings</span>
      </div>
      
      {pumpSettings.medication_selection && (
        <div className="mb-2 p-2 bg-white rounded border border-blue-100">
          <span className="text-sm font-medium text-blue-900">{pumpSettings.medication_selection}</span>
        </div>
      )}

      <div className="text-sm text-blue-800 space-y-1">
        {pumpSettings.cca_setting && <div>CCA: {pumpSettings.cca_setting}</div>}
        {pumpSettings.line_option && <div>Line: {pumpSettings.line_option}</div>}
        {pumpSettings.duration && <div>Duration: {pumpSettings.duration}</div>}
        {pumpSettings.vtbi && <div>VTBI: {pumpSettings.vtbi}</div>}
        {pumpSettings.pump_instructions && (
          <div className="pt-2 border-t border-blue-200 italic">
            {pumpSettings.pump_instructions}
          </div>
        )}
      </div>
    </div>
  );
};

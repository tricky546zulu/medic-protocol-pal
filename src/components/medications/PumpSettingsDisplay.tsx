
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Syringe } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';

type MedicationDosing = Database['public']['Tables']['medication_dosing']['Row'];

interface PumpSettingsDisplayProps {
  dosing: MedicationDosing;
}

export const PumpSettingsDisplay = ({ dosing }: PumpSettingsDisplayProps) => {
  console.log('PumpSettingsDisplay - dosing:', dosing);
  console.log('PumpSettingsDisplay - requires_infusion_pump:', dosing.requires_infusion_pump);
  console.log('PumpSettingsDisplay - infusion_pump_settings:', dosing.infusion_pump_settings);

  if (!dosing.requires_infusion_pump) {
    console.log('PumpSettingsDisplay - Not required, returning null');
    return null;
  }

  const pumpSettings = dosing.infusion_pump_settings as any;
  
  if (!pumpSettings || (typeof pumpSettings === 'object' && Object.keys(pumpSettings).length === 0)) {
    console.log('PumpSettingsDisplay - No pump settings found');
    return (
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center gap-2 text-blue-700">
          <Syringe className="h-4 w-4" />
          <span className="text-sm font-medium">IV Pump Required - Settings not configured</span>
        </div>
      </div>
    );
  }

  console.log('PumpSettingsDisplay - Rendering pump settings:', pumpSettings);

  return (
    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
      <div className="flex items-center gap-2 mb-3">
        <Syringe className="h-4 w-4 text-blue-600" />
        <span className="text-xs font-medium text-blue-600 uppercase tracking-wide">IV Pump Settings</span>
      </div>
      
      {pumpSettings.medication_selection && (
        <div className="mb-3 p-2 bg-white border border-blue-200 rounded">
          <p className="text-xs font-medium text-blue-600 mb-1">Pump Medication</p>
          <p className="text-sm font-medium text-blue-900">{pumpSettings.medication_selection}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
        {pumpSettings.cca_setting && (
          <div className="bg-white p-2 border border-blue-100 rounded">
            <span className="text-xs font-medium text-blue-600">CCA: </span>
            <span className="text-sm text-blue-900">{pumpSettings.cca_setting}</span>
          </div>
        )}
        {pumpSettings.line_option && (
          <div className="bg-white p-2 border border-blue-100 rounded">
            <span className="text-xs font-medium text-blue-600">Line: </span>
            <span className="text-sm text-blue-900">{pumpSettings.line_option}</span>
          </div>
        )}
        {pumpSettings.duration && (
          <div className="bg-white p-2 border border-blue-100 rounded">
            <span className="text-xs font-medium text-blue-600">Duration: </span>
            <span className="text-sm text-blue-900">{pumpSettings.duration}</span>
          </div>
        )}
        {pumpSettings.vtbi && (
          <div className="bg-white p-2 border border-blue-100 rounded">
            <span className="text-xs font-medium text-blue-600">VTBI: </span>
            <span className="text-sm text-blue-900">{pumpSettings.vtbi}</span>
          </div>
        )}
      </div>
      
      {pumpSettings.pump_instructions && (
        <div className="mt-3 pt-3 border-t border-blue-200">
          <p className="text-xs font-medium text-blue-600 mb-1">Instructions</p>
          <p className="text-sm text-blue-900">{pumpSettings.pump_instructions}</p>
        </div>
      )}
    </div>
  );
};

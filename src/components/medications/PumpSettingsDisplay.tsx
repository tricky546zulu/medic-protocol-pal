
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
    <div className="p-3 bg-blue-50 rounded-lg text-sm border border-blue-200">
      <div className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
        <Syringe className="h-4 w-4" />
        ⚠️ IV PUMP SETTINGS:
      </div>
      
      {pumpSettings.medication_selection && (
        <div className="mb-3 p-2 bg-blue-100 rounded-lg border border-blue-300">
          <span className="font-semibold text-blue-900 text-sm">PUMP MEDICATION:</span>
          <div className="font-semibold text-blue-900 text-sm mt-1">{pumpSettings.medication_selection}</div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
        {pumpSettings.cca_setting && (
          <div className="bg-white p-2 rounded-lg border border-white">
            <span className="font-medium text-sm">CCA:</span>{' '}
            <span className="text-sm font-medium">{pumpSettings.cca_setting}</span>
          </div>
        )}
        {pumpSettings.line_option && (
          <div className="bg-white p-2 rounded-lg border border-white">
            <span className="font-medium text-sm">Line:</span>{' '}
            <span className="text-sm font-medium">{pumpSettings.line_option}</span>
          </div>
        )}
        {pumpSettings.duration && (
          <div className="bg-white p-2 rounded-lg border border-white">
            <span className="font-medium text-sm">Duration:</span>{' '}
            <span className="text-sm font-medium">{pumpSettings.duration}</span>
          </div>
        )}
        {pumpSettings.vtbi && (
          <div className="bg-white p-2 rounded-lg border border-white">
            <span className="font-medium text-sm">VTBI:</span>{' '}
            <span className="text-sm font-medium">{pumpSettings.vtbi}</span>
          </div>
        )}
      </div>
      {pumpSettings.pump_instructions && (
        <div className="mt-2 pt-2 border-t border-blue-300">
          <span className="font-medium text-sm">Instructions:</span>{' '}
          <span className="text-sm font-medium">{pumpSettings.pump_instructions}</span>
        </div>
      )}
    </div>
  );
};

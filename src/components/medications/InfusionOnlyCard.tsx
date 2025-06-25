
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Syringe, AlertTriangle } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';

type MedicationDosing = Database['public']['Tables']['medication_dosing']['Row'];

interface InfusionOnlyCardProps {
  dosing: MedicationDosing;
  isHighAlert?: boolean;
}

export const InfusionOnlyCard = ({ dosing, isHighAlert }: InfusionOnlyCardProps) => {
  const pumpSettings = dosing.infusion_pump_settings as any;

  return (
    <div className="med-card">
      <div className="med-card-header">
        <div className="min-w-0 flex-1">
          <h3 className="med-section-title flex items-center gap-2">
            <Syringe className="h-5 w-5 text-blue-600" />
            {dosing.indication}
          </h3>
          {dosing.patient_type && (
            <span className="med-label">{dosing.patient_type}</span>
          )}
        </div>
        {isHighAlert && (
          <span className="med-critical-tag flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            High Alert
          </span>
        )}
      </div>
      
      <div className="med-section">
        {/* Primary Medication Selection */}
        {pumpSettings?.medication_selection && (
          <div className="text-center p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500 mb-6">
            <div className="text-2xl font-semibold text-blue-900">
              {pumpSettings.medication_selection}
            </div>
          </div>
        )}

        {/* Concentration */}
        {dosing.concentration_supplied && (
          <div className="text-center mb-6">
            <span className="med-label">Concentration: </span>
            <span className="med-body-text font-semibold">{dosing.concentration_supplied}</span>
          </div>
        )}

        {/* Pump Settings Grid */}
        <div className="med-pump-settings">
          <div className="flex items-center gap-2 mb-3">
            <Syringe className="h-4 w-4 text-blue-600" />
            <span className="med-section-title text-blue-800">Pump Settings</span>
          </div>
          <div className="med-dosing-grid">
            {pumpSettings?.cca_setting && (
              <div>
                <span className="med-label block mb-1">CCA Setting</span>
                <p className="med-body-text font-medium">{pumpSettings.cca_setting}</p>
              </div>
            )}
            {pumpSettings?.line_option && (
              <div>
                <span className="med-label block mb-1">Line</span>
                <p className="med-body-text font-medium">Line {pumpSettings.line_option}</p>
              </div>
            )}
            {pumpSettings?.duration && (
              <div>
                <span className="med-label block mb-1">Duration</span>
                <p className="med-body-text font-medium">{pumpSettings.duration}</p>
              </div>
            )}
            {pumpSettings?.vtbi && (
              <div>
                <span className="med-label block mb-1">VTBI</span>
                <p className="med-body-text font-medium">{pumpSettings.vtbi}</p>
              </div>
            )}
          </div>
          
          {pumpSettings?.pump_instructions && (
            <div className="mt-4 p-3 bg-blue-100 rounded border-l-2 border-blue-500">
              <p className="med-body-text text-blue-800 italic">{pumpSettings.pump_instructions}</p>
            </div>
          )}
        </div>

        {/* Essential Notes */}
        {dosing.notes && dosing.notes.length > 0 && (
          <div className="med-critical-note">
            <p>{dosing.notes[0]}</p>
          </div>
        )}
      </div>
    </div>
  );
};

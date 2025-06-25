
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Syringe, AlertTriangle } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';

type MedicationDosing = Database['public']['Tables']['medication_dosing']['Row'];

interface EmergencyDosingCardProps {
  dosing: MedicationDosing;
  isHighAlert?: boolean;
}

export const EmergencyDosingCard = ({ dosing, isHighAlert }: EmergencyDosingCardProps) => {
  const pumpSettings = dosing.infusion_pump_settings as any;
  const hasPumpSettings = dosing.requires_infusion_pump && pumpSettings && (
    pumpSettings.medication_selection || pumpSettings.cca_setting
  );

  return (
    <div className="med-card">
      <div className="med-card-header">
        <div className="min-w-0 flex-1">
          <h3 className="med-section-title">{dosing.indication}</h3>
          {dosing.patient_type && (
            <span className="med-label">{dosing.patient_type}</span>
          )}
        </div>
        <div className="flex gap-2">
          {dosing.route && (
            <span className="med-category-tag">
              {dosing.route}
            </span>
          )}
          {hasPumpSettings && (
            <span className="med-category-tag flex items-center gap-1">
              <Syringe className="h-3 w-3" />
              IV Pump
            </span>
          )}
          {isHighAlert && (
            <span className="med-critical-tag flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              High Alert
            </span>
          )}
        </div>
      </div>
      
      <div className="med-section">
        {/* Primary Emergency Dose - Prominent Display */}
        <div className="text-center p-6 bg-red-50 rounded-lg border-l-4 border-red-500 mb-6">
          <div className="text-3xl font-bold text-red-900 mb-2">
            {dosing.dose}
          </div>
          {dosing.concentration_supplied && (
            <div className="med-body-text text-red-700 font-medium">
              {dosing.concentration_supplied}
            </div>
          )}
        </div>

        {/* Pump Settings Grid */}
        {hasPumpSettings && (
          <div className="med-pump-settings">
            <div className="flex items-center gap-2 mb-3">
              <Syringe className="h-4 w-4 text-blue-600" />
              <span className="med-section-title text-blue-800">IV Pump Required</span>
            </div>
            <div className="med-dosing-grid">
              {pumpSettings.medication_selection && (
                <div>
                  <span className="med-label block mb-1">Medication Selection</span>
                  <p className="med-body-text font-medium">{pumpSettings.medication_selection}</p>
                </div>
              )}
              {pumpSettings.cca_setting && (
                <div>
                  <span className="med-label block mb-1">CCA Setting</span>
                  <p className="med-body-text font-medium">{pumpSettings.cca_setting}</p>
                </div>
              )}
              {pumpSettings.duration && (
                <div>
                  <span className="med-label block mb-1">Duration</span>
                  <p className="med-body-text font-medium">{pumpSettings.duration}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Critical Notes */}
        {dosing.notes && dosing.notes.length > 0 && (
          <div className="med-critical-note">
            <p>{dosing.notes[0]}</p>
          </div>
        )}
      </div>
    </div>
  );
};

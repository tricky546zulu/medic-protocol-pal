
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
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
    <Card className="bg-white border border-gray-200">
      <CardContent className="p-4">
        {/* Header - Simplified */}
        <div className="flex items-start justify-between mb-4 gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-semibold text-gray-900 break-words leading-tight">
              {dosing.indication}
            </h3>
            {dosing.route && (
              <p className="text-sm text-gray-600 mt-1 truncate">
                Route: {dosing.route}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-1 flex-shrink-0">
            {hasPumpSettings && (
              <Badge className="bg-blue-50 text-blue-700 border-blue-200 text-xs whitespace-nowrap">
                <Syringe className="h-3 w-3 mr-1" />
                IV Pump
              </Badge>
            )}
            {isHighAlert && (
              <Badge className="bg-red-50 text-red-700 border-red-200 text-xs whitespace-nowrap">
                <AlertTriangle className="h-3 w-3 mr-1" />
                High Alert
              </Badge>
            )}
          </div>
        </div>

        {/* Primary Dose - Streamlined */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4 text-center">
          <div className="text-xl font-bold text-gray-900 break-words">
            {dosing.dose}
          </div>
          {dosing.concentration_supplied && (
            <div className="text-sm text-gray-600 mt-1 break-words">
              Supply: {dosing.concentration_supplied}
            </div>
          )}
        </div>

        {/* Pump Settings - Compact */}
        {hasPumpSettings && (
          <div className="bg-blue-50 rounded-lg p-3 mb-4">
            <h4 className="text-sm font-semibold text-blue-900 mb-2">IV Pump Settings</h4>
            <div className="space-y-1 text-sm">
              {pumpSettings.medication_selection && (
                <div className="break-words">
                  <span className="font-medium text-blue-800">Med:</span> {pumpSettings.medication_selection}
                </div>
              )}
              {pumpSettings.cca_setting && (
                <div className="break-words">
                  <span className="font-medium text-blue-800">CCA:</span> {pumpSettings.cca_setting}
                </div>
              )}
              {pumpSettings.line_option && (
                <div>
                  <span className="font-medium text-blue-800">Line:</span> {pumpSettings.line_option}
                </div>
              )}
              {pumpSettings.duration && (
                <div className="break-words">
                  <span className="font-medium text-blue-800">Duration:</span> {pumpSettings.duration}
                </div>
              )}
              {pumpSettings.vtbi && (
                <div className="break-words">
                  <span className="font-medium text-blue-800">VTBI:</span> {pumpSettings.vtbi}
                </div>
              )}
              {pumpSettings.pump_instructions && (
                <div className="mt-2 p-2 bg-white rounded text-xs text-blue-900 break-words">
                  {pumpSettings.pump_instructions}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Notes - Simplified */}
        {dosing.notes && dosing.notes.length > 0 && (
          <div className="bg-amber-50 rounded-lg p-3">
            <h4 className="text-sm font-semibold text-amber-800 mb-2 flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Notes
            </h4>
            <div className="space-y-1">
              {dosing.notes.map((note, index) => (
                <div key={index} className="text-sm text-amber-900 break-words">
                  • {note}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

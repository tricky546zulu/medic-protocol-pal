
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
  const hasValidPumpSettings = dosing.requires_infusion_pump && pumpSettings && (
    pumpSettings.medication_selection ||
    pumpSettings.cca_setting ||
    pumpSettings.line_option ||
    pumpSettings.duration ||
    pumpSettings.vtbi ||
    pumpSettings.pump_instructions
  );

  return (
    <Card className="bg-white border border-gray-200 hover:border-gray-300 transition-colors duration-200">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <CardTitle className="text-base font-medium text-gray-900 leading-tight">
            {dosing.indication}
          </CardTitle>
          <div className="flex flex-wrap gap-2">
            {dosing.route && (
              <Badge variant="outline" className="text-xs px-2 py-1 border-gray-300 text-gray-700">
                {dosing.route}
              </Badge>
            )}
            {hasValidPumpSettings && (
              <Badge variant="outline" className="flex items-center gap-1 text-xs px-2 py-1 border-blue-300 text-blue-700">
                <Syringe className="h-3 w-3" />
                IV Pump
              </Badge>
            )}
            {isHighAlert && (
              <Badge variant="outline" className="flex items-center gap-1 text-xs px-2 py-1 border-red-300 text-red-700">
                <AlertTriangle className="h-3 w-3" />
                High Alert
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Emergency Dose - Primary Focus */}
        <div className="text-center">
          <p className="text-sm font-medium text-gray-600 mb-2">Emergency Dose</p>
          <div className="text-2xl font-bold text-gray-900 p-4 border-2 border-red-200 rounded-lg bg-red-50">
            {dosing.dose}
          </div>
          {dosing.concentration_supplied && (
            <p className="text-sm text-gray-600 mt-2 font-medium">
              {dosing.concentration_supplied}
            </p>
          )}
        </div>

        {/* IV Pump Settings - Only if valid settings exist */}
        {hasValidPumpSettings && (
          <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
            <div className="flex items-center gap-2 mb-3">
              <Syringe className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">IV Pump Settings</span>
            </div>
            
            {pumpSettings.medication_selection && (
              <div className="mb-3 p-2 bg-white rounded border border-blue-100">
                <span className="text-sm font-medium text-blue-900">{pumpSettings.medication_selection}</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 text-sm">
              {pumpSettings.cca_setting && (
                <div>
                  <span className="font-medium text-blue-700">CCA:</span> {pumpSettings.cca_setting}
                </div>
              )}
              {pumpSettings.line_option && (
                <div>
                  <span className="font-medium text-blue-700">Line:</span> {pumpSettings.line_option}
                </div>
              )}
              {pumpSettings.duration && (
                <div>
                  <span className="font-medium text-blue-700">Duration:</span> {pumpSettings.duration}
                </div>
              )}
              {pumpSettings.vtbi && (
                <div>
                  <span className="font-medium text-blue-700">VTBI:</span> {pumpSettings.vtbi}
                </div>
              )}
            </div>
            
            {pumpSettings.pump_instructions && (
              <div className="mt-3 pt-3 border-t border-blue-200 text-sm text-blue-800">
                {pumpSettings.pump_instructions}
              </div>
            )}
          </div>
        )}

        {/* Critical Notes Only */}
        {dosing.notes && dosing.notes.length > 0 && (
          <div className="border-l-4 border-amber-400 pl-3 py-2">
            <p className="text-sm font-medium text-amber-800 mb-1">Important Notes</p>
            {dosing.notes.slice(0, 2).map((note, index) => (
              <p key={index} className="text-sm text-amber-700">{note}</p>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

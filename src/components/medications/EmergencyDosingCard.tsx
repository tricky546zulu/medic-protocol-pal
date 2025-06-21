
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Syringe } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';

type MedicationDosing = Database['public']['Tables']['medication_dosing']['Row'];

interface EmergencyDosingCardProps {
  dosing: MedicationDosing;
  isHighAlert: boolean;
}

export const EmergencyDosingCard = ({ dosing, isHighAlert }: EmergencyDosingCardProps) => {
  const pumpSettings = dosing.infusion_pump_settings as any;

  return (
    <Card className={`border-2 ${isHighAlert ? 'border-red-500 bg-red-50' : 'border-blue-500 bg-blue-50'}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            {isHighAlert && <AlertTriangle className="h-5 w-5 text-red-600" />}
            {dosing.patient_type}
          </CardTitle>
          <div className="flex gap-2">
            {dosing.route && (
              <Badge variant="secondary" className="font-semibold">
                {dosing.route}
              </Badge>
            )}
            {dosing.requires_infusion_pump && (
              <Badge variant="outline" className="flex items-center gap-1 bg-blue-100 border-blue-400 text-blue-800">
                <Syringe className="h-3 w-3" />
                IV Pump
              </Badge>
            )}
          </div>
        </div>
        <p className="text-sm font-medium text-gray-700">{dosing.indication}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center p-4 bg-white rounded-lg border-2 border-gray-300">
            <p className="text-xs font-medium text-gray-600 mb-1">DOSE</p>
            <p className="text-2xl font-bold text-gray-900">{dosing.dose}</p>
          </div>
          
          {dosing.concentration_supplied && (
            <div className="text-center p-3 bg-gray-100 rounded-lg">
              <p className="text-xs font-medium text-gray-600 mb-1">CONCENTRATION</p>
              <p className="text-lg font-semibold text-gray-800">{dosing.concentration_supplied}</p>
            </div>
          )}

          {dosing.requires_infusion_pump && pumpSettings && (
            <div className="bg-blue-100 border border-blue-300 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Syringe className="h-4 w-4 text-blue-700" />
                <p className="text-xs font-bold text-blue-700 uppercase">IV PUMP SETTINGS</p>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {pumpSettings.cca_setting && (
                  <div>
                    <span className="font-medium text-blue-700">CCA:</span>
                    <span className="text-blue-800 ml-1">{pumpSettings.cca_setting}</span>
                  </div>
                )}
                {pumpSettings.line_option && (
                  <div>
                    <span className="font-medium text-blue-700">Line:</span>
                    <span className="text-blue-800 ml-1">{pumpSettings.line_option}</span>
                  </div>
                )}
                {pumpSettings.duration && (
                  <div>
                    <span className="font-medium text-blue-700">Duration:</span>
                    <span className="text-blue-800 ml-1">{pumpSettings.duration}</span>
                  </div>
                )}
                {pumpSettings.vtbi && (
                  <div>
                    <span className="font-medium text-blue-700">VTBI:</span>
                    <span className="text-blue-800 ml-1">{pumpSettings.vtbi}</span>
                  </div>
                )}
              </div>
              {pumpSettings.pump_instructions && (
                <div className="mt-2 pt-2 border-t border-blue-200">
                  <p className="text-xs font-medium text-blue-700 mb-1">INSTRUCTIONS:</p>
                  <p className="text-xs text-blue-800">{pumpSettings.pump_instructions}</p>
                </div>
              )}
            </div>
          )}

          {dosing.notes && dosing.notes.length > 0 && (
            <div className="border-t pt-3">
              <p className="text-xs font-medium text-gray-600 mb-2">NOTES</p>
              <ul className="space-y-1">
                {dosing.notes.map((note, index) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                    <span className="text-blue-500 mt-1 text-xs">•</span>
                    {note}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

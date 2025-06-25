
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Syringe, AlertTriangle, Clock } from 'lucide-react';
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
    <Card className="bg-white border border-gray-200 shadow-sm print:shadow-none print:border-2 print:border-black">
      <CardContent className="p-6">
        {/* Header Section */}
        <div className="flex items-start justify-between mb-6 pb-4 border-b border-gray-100">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {dosing.indication}
            </h3>
            {dosing.route && (
              <span className="text-sm text-gray-600">Route: {dosing.route}</span>
            )}
          </div>
          <div className="flex gap-2">
            {hasPumpSettings && (
              <Badge className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100">
                <Syringe className="h-3 w-3 mr-1" />
                IV Pump Required
              </Badge>
            )}
            {isHighAlert && (
              <Badge className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100">
                <AlertTriangle className="h-3 w-3 mr-1" />
                High Alert
              </Badge>
            )}
          </div>
        </div>

        {/* Primary Dose Display */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6 border border-gray-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 mb-2">
              {dosing.dose}
            </div>
            {dosing.concentration_supplied && (
              <div className="text-sm font-medium text-gray-600">
                Supply: {dosing.concentration_supplied}
              </div>
            )}
          </div>
        </div>

        {/* Pump Settings Grid */}
        {hasPumpSettings && (
          <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-200">
            <h4 className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
              <Syringe className="h-4 w-4" />
              IV Pump Settings
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              {pumpSettings.medication_selection && (
                <div>
                  <span className="font-medium text-blue-800">Medication:</span>
                  <div className="text-blue-900">{pumpSettings.medication_selection}</div>
                </div>
              )}
              {pumpSettings.cca_setting && (
                <div>
                  <span className="font-medium text-blue-800">CCA Setting:</span>
                  <div className="text-blue-900">{pumpSettings.cca_setting}</div>
                </div>
              )}
              {pumpSettings.line_option && (
                <div>
                  <span className="font-medium text-blue-800">Line:</span>
                  <div className="text-blue-900">Line {pumpSettings.line_option}</div>
                </div>
              )}
              {pumpSettings.duration && (
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3 text-blue-600" />
                  <span className="font-medium text-blue-800">Duration:</span>
                  <div className="text-blue-900">{pumpSettings.duration}</div>
                </div>
              )}
              {pumpSettings.vtbi && (
                <div>
                  <span className="font-medium text-blue-800">VTBI:</span>
                  <div className="text-blue-900">{pumpSettings.vtbi}</div>
                </div>
              )}
            </div>
            {pumpSettings.pump_instructions && (
              <div className="mt-3 p-3 bg-white rounded border border-blue-200">
                <div className="text-sm text-blue-900">{pumpSettings.pump_instructions}</div>
              </div>
            )}
          </div>
        )}

        {/* Critical Notes */}
        {dosing.notes && dosing.notes.length > 0 && (
          <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
            <h4 className="text-sm font-semibold text-amber-800 mb-2 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Important Notes
            </h4>
            <div className="space-y-2">
              {dosing.notes.map((note, index) => (
                <div key={index} className="text-sm text-amber-900">
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

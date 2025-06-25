
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Syringe, AlertTriangle, Settings, Clock } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';

type MedicationDosing = Database['public']['Tables']['medication_dosing']['Row'];

interface InfusionOnlyCardProps {
  dosing: MedicationDosing;
  isHighAlert?: boolean;
}

export const InfusionOnlyCard = ({ dosing, isHighAlert }: InfusionOnlyCardProps) => {
  const pumpSettings = dosing.infusion_pump_settings as any;

  return (
    <Card className="bg-white border border-gray-200 shadow-sm print:shadow-none print:border-2 print:border-black">
      <CardContent className="p-6">
        {/* Header Section */}
        <div className="flex items-start justify-between mb-6 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <Syringe className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {dosing.indication}
              </h3>
              <span className="text-sm text-gray-600">Continuous Infusion Protocol</span>
            </div>
          </div>
          {isHighAlert && (
            <Badge className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100">
              <AlertTriangle className="h-3 w-3 mr-1" />
              High Alert
            </Badge>
          )}
        </div>

        {/* Primary Medication Selection */}
        {pumpSettings?.medication_selection && (
          <div className="bg-blue-50 rounded-lg p-6 mb-6 border border-blue-200">
            <div className="text-center">
              <div className="text-xl font-bold text-blue-900 mb-2">
                {pumpSettings.medication_selection}
              </div>
              {dosing.concentration_supplied && (
                <div className="text-sm font-medium text-blue-700">
                  Concentration: {dosing.concentration_supplied}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Pump Configuration Grid */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
          <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Pump Configuration
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {pumpSettings?.cca_setting && (
              <div className="bg-white rounded p-3 border border-gray-200">
                <span className="font-medium text-gray-700">CCA Setting</span>
                <div className="text-gray-900 font-semibold">{pumpSettings.cca_setting}</div>
              </div>
            )}
            {pumpSettings?.line_option && (
              <div className="bg-white rounded p-3 border border-gray-200">
                <span className="font-medium text-gray-700">Line Selection</span>
                <div className="text-gray-900 font-semibold">Line {pumpSettings.line_option}</div>
              </div>
            )}
            {pumpSettings?.duration && (
              <div className="bg-white rounded p-3 border border-gray-200">
                <span className="font-medium text-gray-700 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Duration
                </span>
                <div className="text-gray-900 font-semibold">{pumpSettings.duration}</div>
              </div>
            )}
            {pumpSettings?.vtbi && (
              <div className="bg-white rounded p-3 border border-gray-200">
                <span className="font-medium text-gray-700">VTBI</span>
                <div className="text-gray-900 font-semibold">{pumpSettings.vtbi}</div>
              </div>
            )}
          </div>
        </div>

        {/* Pump Instructions */}
        {pumpSettings?.pump_instructions && (
          <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-200">
            <h4 className="text-sm font-semibold text-blue-900 mb-2">Instructions</h4>
            <div className="text-sm text-blue-900">{pumpSettings.pump_instructions}</div>
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

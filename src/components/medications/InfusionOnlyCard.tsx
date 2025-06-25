
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
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
    <Card className="bg-white border border-gray-200">
      <CardContent className="p-4">
        {/* Header - Simplified */}
        <div className="flex items-start justify-between mb-4 gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-semibold text-gray-900 break-words leading-tight">
              {dosing.indication}
            </h3>
            <p className="text-sm text-gray-600 mt-1">Continuous Infusion</p>
          </div>
          {isHighAlert && (
            <Badge className="bg-red-50 text-red-700 border-red-200 text-xs whitespace-nowrap flex-shrink-0">
              <AlertTriangle className="h-3 w-3 mr-1" />
              High Alert
            </Badge>
          )}
        </div>

        {/* Primary Selection - Streamlined */}
        {pumpSettings?.medication_selection && (
          <div className="bg-blue-50 rounded-lg p-4 mb-4 text-center">
            <div className="text-lg font-bold text-blue-900 break-words">
              {pumpSettings.medication_selection}
            </div>
            {dosing.concentration_supplied && (
              <div className="text-sm text-blue-700 mt-1 break-words">
                {dosing.concentration_supplied}
              </div>
            )}
          </div>
        )}

        {/* Pump Configuration - Compact Grid */}
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-1">
            <Syringe className="h-3 w-3" />
            Pump Settings
          </h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {pumpSettings?.cca_setting && (
              <div className="break-words">
                <span className="font-medium text-gray-700">CCA:</span>
                <div className="text-gray-900">{pumpSettings.cca_setting}</div>
              </div>
            )}
            {pumpSettings?.line_option && (
              <div>
                <span className="font-medium text-gray-700">Line:</span>
                <div className="text-gray-900">Line {pumpSettings.line_option}</div>
              </div>
            )}
            {pumpSettings?.duration && (
              <div className="break-words">
                <span className="font-medium text-gray-700">Duration:</span>
                <div className="text-gray-900">{pumpSettings.duration}</div>
              </div>
            )}
            {pumpSettings?.vtbi && (
              <div className="break-words">
                <span className="font-medium text-gray-700">VTBI:</span>
                <div className="text-gray-900">{pumpSettings.vtbi}</div>
              </div>
            )}
          </div>
        </div>

        {/* Instructions - Compact */}
        {pumpSettings?.pump_instructions && (
          <div className="bg-blue-50 rounded-lg p-3 mb-4">
            <h4 className="text-sm font-semibold text-blue-900 mb-1">Instructions</h4>
            <div className="text-sm text-blue-900 break-words">{pumpSettings.pump_instructions}</div>
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

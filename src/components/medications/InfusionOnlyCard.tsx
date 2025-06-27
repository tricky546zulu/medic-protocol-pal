
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
    <Card className="bg-white border border-gray-200 hover:border-blue-300 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-lg font-medium text-gray-900 flex items-center gap-2">
            <Syringe className="h-5 w-5 text-blue-600" />
            {dosing.indication}
          </CardTitle>
          {isHighAlert && (
            <Badge variant="outline" className="flex items-center gap-1 text-red-700 border-red-300">
              <AlertTriangle className="h-3 w-3" />
              High Alert
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Primary: Medication Selection */}
        {pumpSettings?.medication_selection && (
          <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-lg font-semibold text-blue-900">
              {pumpSettings.medication_selection}
            </div>
          </div>
        )}

        {/* Concentration */}
        {dosing.concentration_supplied && (
          <div className="text-center">
            <span className="text-sm text-gray-600">Concentration: </span>
            <span className="font-medium text-gray-900">{dosing.concentration_supplied}</span>
          </div>
        )}

        {/* Pump Settings - Simplified */}
        <div className="space-y-2 text-sm">
          {pumpSettings?.cca_setting && (
            <div className="flex justify-between">
              <span className="text-gray-600">CCA Setting:</span>
              <span className="font-medium">{pumpSettings.cca_setting}</span>
            </div>
          )}
          {pumpSettings?.line_option && (
            <div className="flex justify-between">
              <span className="text-gray-600">Line:</span>
              <span className="font-medium">Line {pumpSettings.line_option}</span>
            </div>
          )}
          {pumpSettings?.duration && (
            <div className="flex justify-between">
              <span className="text-gray-600">Duration:</span>
              <span className="font-medium">{pumpSettings.duration}</span>
            </div>
          )}
          {pumpSettings?.vtbi && (
            <div className="flex justify-between">
              <span className="text-gray-600">VTBI:</span>
              <span className="font-medium">{pumpSettings.vtbi}</span>
            </div>
          )}
        </div>

        {pumpSettings?.pump_instructions && (
          <div className="text-sm text-gray-700 p-2 bg-gray-50 rounded border-l-2 border-blue-400">
            {pumpSettings.pump_instructions}
          </div>
        )}

        {/* Essential Notes Only */}
        {dosing.notes && dosing.notes.length > 0 && (
          <div className="text-sm text-amber-800 p-2 bg-amber-50 rounded border-l-2 border-amber-400">
            {dosing.notes.slice(0, 1).map((note, index) => (
              <div key={index}>{note}</div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

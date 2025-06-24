
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
    <Card className="bg-white border border-blue-200 hover:border-blue-300 transition-colors duration-200">
      <CardHeader className="pb-4 bg-blue-50">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <CardTitle className="text-base font-medium text-blue-900 leading-tight flex items-center gap-2">
            <Syringe className="h-5 w-5 text-blue-600" />
            {dosing.indication}
          </CardTitle>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="flex items-center gap-1 text-xs px-2 py-1 border-blue-300 text-blue-700 bg-blue-100">
              <Syringe className="h-3 w-3" />
              Infusion Only
            </Badge>
            {isHighAlert && (
              <Badge variant="outline" className="flex items-center gap-1 text-xs px-2 py-1 border-red-300 text-red-700 bg-red-50">
                <AlertTriangle className="h-3 w-3" />
                High Alert
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Medication Selection - Primary Focus */}
        {pumpSettings?.medication_selection && (
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600 mb-2">Medication for IV Pump</p>
            <div className="text-lg font-bold text-blue-900 p-3 border-2 border-blue-200 rounded-lg bg-blue-50">
              {pumpSettings.medication_selection}
            </div>
          </div>
        )}

        {/* Concentration */}
        {dosing.concentration_supplied && (
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600 mb-1">Concentration</p>
            <div className="text-base font-semibold text-gray-800">
              {dosing.concentration_supplied}
            </div>
          </div>
        )}

        {/* Pump Settings Grid */}
        <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
          <div className="grid grid-cols-2 gap-3 text-sm">
            {pumpSettings?.cca_setting && (
              <div className="bg-white p-2 rounded border">
                <span className="font-medium text-blue-700 block">CCA Setting:</span>
                <span className="text-blue-900">{pumpSettings.cca_setting}</span>
              </div>
            )}
            {pumpSettings?.line_option && (
              <div className="bg-white p-2 rounded border">
                <span className="font-medium text-blue-700 block">Line:</span>
                <span className="text-blue-900">Line {pumpSettings.line_option}</span>
              </div>
            )}
            {pumpSettings?.duration && (
              <div className="bg-white p-2 rounded border">
                <span className="font-medium text-blue-700 block">Duration:</span>
                <span className="text-blue-900">{pumpSettings.duration}</span>
              </div>
            )}
            {pumpSettings?.vtbi && (
              <div className="bg-white p-2 rounded border">
                <span className="font-medium text-blue-700 block">VTBI:</span>
                <span className="text-blue-900">{pumpSettings.vtbi}</span>
              </div>
            )}
          </div>
          
          {pumpSettings?.pump_instructions && (
            <div className="mt-3 pt-3 border-t border-blue-200 text-sm text-blue-800 bg-white p-2 rounded">
              <span className="font-medium block mb-1">Instructions:</span>
              {pumpSettings.pump_instructions}
            </div>
          )}
        </div>

        {/* Notes if any */}
        {dosing.notes && dosing.notes.length > 0 && (
          <div className="border-l-4 border-amber-400 pl-3 py-2 bg-amber-50">
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

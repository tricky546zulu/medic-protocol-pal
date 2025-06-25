
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
    <Card className="bg-white border border-gray-200 hover:border-gray-300 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-lg font-medium text-gray-900">
            {dosing.indication}
          </CardTitle>
          <div className="flex gap-2">
            {dosing.route && (
              <Badge variant="outline" className="text-gray-700 border-gray-300">
                {dosing.route}
              </Badge>
            )}
            {hasPumpSettings && (
              <Badge variant="outline" className="flex items-center gap-1 text-blue-700 border-blue-300">
                <Syringe className="h-3 w-3" />
                IV Pump
              </Badge>
            )}
            {isHighAlert && (
              <Badge variant="outline" className="flex items-center gap-1 text-red-700 border-red-300">
                <AlertTriangle className="h-3 w-3" />
                High Alert
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Primary: Emergency Dose */}
        <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
          <div className="text-2xl font-bold text-red-900 mb-1">
            {dosing.dose}
          </div>
          {dosing.concentration_supplied && (
            <div className="text-sm text-red-700">
              {dosing.concentration_supplied}
            </div>
          )}
        </div>

        {/* Essential Pump Settings Only */}
        {hasPumpSettings && (
          <div className="text-sm space-y-1 p-2 bg-blue-50 rounded border border-blue-200">
            <div className="font-medium text-blue-800 mb-1">IV Pump Required</div>
            {pumpSettings.medication_selection && (
              <div className="text-blue-900">{pumpSettings.medication_selection}</div>
            )}
            {pumpSettings.cca_setting && (
              <div className="text-blue-800">CCA: {pumpSettings.cca_setting}</div>
            )}
          </div>
        )}

        {/* Critical Notes Only */}
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

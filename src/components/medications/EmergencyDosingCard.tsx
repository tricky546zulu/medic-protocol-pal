
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Syringe, AlertTriangle } from 'lucide-react';
import { PumpSettingsDisplay } from './PumpSettingsDisplay';
import type { Database } from '@/integrations/supabase/types';

type MedicationDosing = Database['public']['Tables']['medication_dosing']['Row'];

interface EmergencyDosingCardProps {
  dosing: MedicationDosing;
  isHighAlert?: boolean;
}

export const EmergencyDosingCard = ({ dosing, isHighAlert }: EmergencyDosingCardProps) => {
  return (
    <Card className="bg-white border border-gray-200 hover:border-gray-300 transition-colors duration-200">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <CardTitle className="text-base font-medium text-gray-900 leading-tight">
            {dosing.indication}
          </CardTitle>
          <div className="flex flex-wrap gap-2">
            {dosing.route && (
              <Badge variant="outline" className="text-xs px-2 py-1 bg-gray-50 border-gray-300 text-gray-700">
                {dosing.route}
              </Badge>
            )}
            {dosing.requires_infusion_pump && (
              <Badge variant="outline" className="flex items-center gap-1 text-xs px-2 py-1 bg-blue-50 border-blue-300 text-blue-700">
                <Syringe className="h-3 w-3" />
                IV Pump
              </Badge>
            )}
            {isHighAlert && (
              <Badge variant="outline" className="flex items-center gap-1 text-xs px-2 py-1 bg-red-50 border-red-300 text-red-700">
                <AlertTriangle className="h-3 w-3" />
                High Alert
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Emergency Dose */}
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="text-center">
            <p className="text-xs font-medium text-red-600 mb-2 uppercase tracking-wide">Emergency Dose</p>
            <p className="text-lg font-semibold text-red-900 bg-white p-3 rounded border border-red-100">
              {dosing.dose}
            </p>
          </div>
        </div>

        {/* Concentration */}
        {dosing.concentration_supplied && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs font-medium text-blue-600 mb-1">Concentration Supplied</p>
            <p className="text-sm text-blue-900 font-medium">{dosing.concentration_supplied}</p>
          </div>
        )}

        {/* Pump Settings */}
        <PumpSettingsDisplay dosing={dosing} />

        {/* Provider Routes */}
        {dosing.provider_routes && dosing.provider_routes.length > 0 && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-xs font-medium text-green-600 mb-2">Provider Routes</p>
            <div className="flex flex-wrap gap-1.5">
              {dosing.provider_routes.map((route, index) => (
                <Badge key={index} variant="secondary" className="text-xs px-2 py-1 bg-white border border-green-300 text-green-700">
                  {route}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Compatibility & Stability */}
        {dosing.compatibility_stability && dosing.compatibility_stability.length > 0 && (
          <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
            <p className="text-xs font-medium text-purple-600 mb-2">Compatibility & Stability</p>
            <ul className="space-y-1">
              {dosing.compatibility_stability.map((item, index) => (
                <li key={index} className="text-sm text-purple-800 flex items-start gap-2">
                  <span className="text-purple-500 mt-1 flex-shrink-0">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Notes */}
        {dosing.notes && dosing.notes.length > 0 && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-xs font-medium text-amber-600 mb-2">Important Notes</p>
            <ul className="space-y-1">
              {dosing.notes.map((note, index) => (
                <li key={index} className="text-sm text-amber-800 flex items-start gap-2">
                  <span className="text-amber-500 mt-1 flex-shrink-0">•</span>
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

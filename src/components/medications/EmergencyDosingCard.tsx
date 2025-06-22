
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
    <Card className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 group overflow-hidden">
      <CardHeader className="p-4 bg-gray-50 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <CardTitle className="text-lg font-semibold text-gray-900 flex-1 min-w-0">
            <span className="block truncate">{dosing.indication}</span>
          </CardTitle>
          <div className="flex flex-wrap gap-2 flex-shrink-0">
            {dosing.route && (
              <Badge variant="outline" className="bg-white border-gray-300 text-gray-700 text-xs px-2 py-1 rounded-lg font-medium">
                <span className="truncate">{dosing.route}</span>
              </Badge>
            )}
            {dosing.requires_infusion_pump && (
              <Badge variant="outline" className="flex items-center gap-1 text-blue-700 border-blue-300 bg-blue-50 text-xs px-2 py-1 rounded-lg font-medium">
                <Syringe className="h-3 w-3 flex-shrink-0" />
                <span className="hidden sm:inline truncate">IV Pump Required</span>
                <span className="sm:hidden">IV Pump</span>
              </Badge>
            )}
            {isHighAlert && (
              <Badge variant="destructive" className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg font-medium bg-red-500 text-white border-red-500">
                <AlertTriangle className="h-3 w-3 flex-shrink-0" />
                <span className="hidden sm:inline">HIGH ALERT</span>
                <span className="sm:hidden">ALERT</span>
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Emergency Dose */}
          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <h4 className="text-sm font-semibold text-red-800 mb-2 uppercase tracking-wide text-center">🚨 Emergency Dose</h4>
            <div className="text-center">
              <p className="font-bold text-lg sm:text-xl text-red-900 bg-white p-2 sm:p-3 rounded-lg border border-red-200 break-words">
                {dosing.dose}
              </p>
            </div>
          </div>

          {/* Concentration */}
          {dosing.concentration_supplied && (
            <div className="p-3 bg-blue-50 rounded-lg text-sm border border-blue-200">
              <span className="font-semibold text-blue-800">Concentration Supplied:</span>{' '}
              <span className="font-medium text-blue-900 break-words">{dosing.concentration_supplied}</span>
            </div>
          )}

          {/* Pump Settings */}
          <PumpSettingsDisplay dosing={dosing} />

          {/* Provider Routes */}
          {dosing.provider_routes && dosing.provider_routes.length > 0 && (
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-800 mb-2 text-sm uppercase tracking-wide">Provider Routes:</h4>
              <div className="flex flex-wrap gap-1">
                {dosing.provider_routes.map((route, index) => (
                  <Badge key={index} variant="secondary" className="text-xs bg-white text-green-800 px-2 py-1 rounded-lg border border-green-300 font-medium">
                    <span className="truncate max-w-24">{route}</span>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Compatibility & Stability */}
          {dosing.compatibility_stability && dosing.compatibility_stability.length > 0 && (
            <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
              <h4 className="font-semibold text-purple-800 mb-2 text-sm uppercase tracking-wide">Compatibility & Stability:</h4>
              <ul className="space-y-2">
                {dosing.compatibility_stability.map((item, index) => (
                  <li key={index} className="text-sm text-purple-800 flex items-start gap-2 bg-white p-2 rounded-lg">
                    <span className="text-purple-600 mt-0.5 flex-shrink-0 font-bold">•</span>
                    <span className="font-medium leading-relaxed break-words">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Notes */}
          {dosing.notes && dosing.notes.length > 0 && (
            <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
              <h4 className="font-semibold text-amber-800 mb-2 text-sm uppercase tracking-wide">⚠️ Important Notes:</h4>
              <ul className="space-y-2">
                {dosing.notes.map((note, index) => (
                  <li key={index} className="text-sm text-amber-800 flex items-start gap-2 bg-white p-2 rounded-lg">
                    <span className="text-amber-600 mt-0.5 flex-shrink-0 font-bold">•</span>
                    <span className="font-medium leading-relaxed break-words">{note}</span>
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

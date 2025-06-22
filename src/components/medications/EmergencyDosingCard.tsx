
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
    <Card className="bg-white/98 backdrop-blur-xl border-3 border-white/90 rounded-3xl shadow-2xl shadow-violet-400/80 hover:shadow-2xl hover:shadow-violet-500/90 transition-all duration-300 group overflow-hidden ring-3 ring-violet-400/70 hover:ring-violet-500/80 hover:scale-[1.01]">
      <CardHeader className="p-6 sm:p-8 bg-gradient-to-br from-white/98 to-violet-50/95 backdrop-blur-xl border-b-3 border-violet-200/70">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle className="text-lg sm:text-xl font-bold break-words flex-1">{dosing.indication}</CardTitle>
          <div className="flex flex-wrap gap-2 sm:gap-3 flex-shrink-0">
            {dosing.route && (
              <Badge variant="outline" className="bg-white/98 border-3 border-gray-300/80 text-gray-800 text-xs sm:text-sm px-3 py-2 rounded-2xl backdrop-blur-xl hover:bg-white hover:scale-105 transition-all duration-200 font-semibold min-h-[32px] whitespace-nowrap shadow-xl shadow-gray-300/60">{dosing.route}</Badge>
            )}
            {dosing.requires_infusion_pump && (
              <Badge variant="outline" className="flex items-center gap-2 text-blue-800 border-3 border-blue-300/80 bg-gradient-to-r from-blue-100/98 to-sky-200/95 text-xs sm:text-sm px-3 py-2 rounded-2xl backdrop-blur-xl hover:scale-105 transition-all duration-200 font-semibold min-h-[32px] whitespace-nowrap shadow-xl shadow-blue-300/60">
                <Syringe className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">IV Pump Required</span>
                <span className="sm:hidden">IV Pump</span>
              </Badge>
            )}
            {isHighAlert && (
              <Badge variant="destructive" className="flex items-center gap-2 text-xs sm:text-sm px-3 py-2 rounded-2xl font-semibold bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-all duration-200 backdrop-blur-xl border-3 border-red-400/70 shadow-2xl shadow-red-400/80 ring-2 ring-red-500/60 min-h-[32px] whitespace-nowrap">
                <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">HIGH ALERT</span>
                <span className="sm:hidden">ALERT</span>
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 sm:p-8 bg-white/98">
        <div className="space-y-6">
          {/* Emergency Dose */}
          <div className="p-6 sm:p-8 bg-gradient-to-br from-red-50/98 to-rose-100/95 rounded-3xl border-3 border-red-200/80 backdrop-blur-xl hover:shadow-xl transition-all duration-200 shadow-2xl shadow-red-300/70">
            <h4 className="text-sm sm:text-base font-bold text-red-800 mb-4 uppercase tracking-wide">🚨 Emergency Dose</h4>
            <p className="font-bold text-xl sm:text-2xl lg:text-3xl break-words text-center text-red-900 bg-white/95 p-4 sm:p-6 rounded-2xl border-2 border-red-200/70 shadow-xl shadow-red-200/60">{dosing.dose}</p>
          </div>

          {/* Concentration */}
          {dosing.concentration_supplied && (
            <div className="p-5 sm:p-6 bg-gradient-to-br from-blue-50/98 to-sky-100/95 rounded-3xl text-sm sm:text-base backdrop-blur-xl border-3 border-blue-200/80 hover:shadow-xl transition-all duration-200 shadow-xl shadow-blue-300/60">
              <span className="font-bold text-blue-800">Concentration Supplied:</span> <span className="break-words font-semibold text-blue-900">{dosing.concentration_supplied}</span>
            </div>
          )}

          {/* Pump Settings */}
          <PumpSettingsDisplay dosing={dosing} />

          {/* Provider Routes */}
          {dosing.provider_routes && dosing.provider_routes.length > 0 && (
            <div className="p-5 sm:p-6 bg-gradient-to-br from-green-50/98 to-emerald-100/95 rounded-3xl backdrop-blur-xl border-3 border-green-200/80 hover:shadow-xl transition-all duration-200 shadow-xl shadow-green-300/60">
              <h4 className="font-bold text-green-800 mb-4 text-sm sm:text-base uppercase tracking-wide">Provider Routes:</h4>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {dosing.provider_routes.map((route, index) => (
                  <Badge key={index} variant="secondary" className="text-xs sm:text-sm bg-white/98 text-green-800 px-3 sm:px-4 py-2 rounded-2xl border-2 border-green-300/70 backdrop-blur-xl hover:scale-105 hover:shadow-lg hover:bg-white transition-all duration-200 font-semibold break-words max-w-full shadow-lg shadow-green-200/60">
                    <span className="truncate">{route}</span>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Compatibility & Stability */}
          {dosing.compatibility_stability && dosing.compatibility_stability.length > 0 && (
            <div className="p-5 sm:p-6 bg-gradient-to-br from-purple-50/98 to-violet-100/95 rounded-3xl backdrop-blur-xl border-3 border-purple-200/80 hover:shadow-xl transition-all duration-200 shadow-xl shadow-purple-300/60">
              <h4 className="font-bold text-purple-800 mb-4 text-sm sm:text-base uppercase tracking-wide">Compatibility & Stability:</h4>
              <ul className="space-y-3">
                {dosing.compatibility_stability.map((item, index) => (
                  <li key={index} className="text-sm sm:text-base text-purple-800 flex items-start gap-3 sm:gap-4 bg-white/98 p-4 rounded-2xl backdrop-blur-xl hover:shadow-md transition-all duration-200 shadow-md shadow-purple-200/50">
                    <span className="text-purple-600 mt-1 flex-shrink-0 font-bold text-base sm:text-lg">•</span>
                    <span className="break-words leading-relaxed font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Notes */}
          {dosing.notes && dosing.notes.length > 0 && (
            <div className="p-5 sm:p-6 bg-gradient-to-br from-amber-50/98 to-orange-100/95 rounded-3xl backdrop-blur-xl border-3 border-amber-200/80 hover:shadow-xl transition-all duration-200 shadow-xl shadow-amber-300/60">
              <h4 className="font-bold text-amber-800 mb-4 text-sm sm:text-base uppercase tracking-wide">⚠️ Important Notes:</h4>
              <ul className="space-y-3">
                {dosing.notes.map((note, index) => (
                  <li key={index} className="text-sm sm:text-base text-amber-800 flex items-start gap-3 sm:gap-4 bg-white/98 p-4 rounded-2xl backdrop-blur-xl hover:shadow-md transition-all duration-200 shadow-md shadow-amber-200/50">
                    <span className="text-amber-600 mt-1 flex-shrink-0 font-bold text-base sm:text-lg">•</span>
                    <span className="break-words leading-relaxed font-medium">{note}</span>
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


import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Syringe, Baby, User, Heart } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';

type MedicationDosing = Database['public']['Tables']['medication_dosing']['Row'];

interface EmergencyDosingCardProps {
  dosing: MedicationDosing;
  isHighAlert: boolean;
}

export const EmergencyDosingCard = ({ dosing, isHighAlert }: EmergencyDosingCardProps) => {
  const pumpSettings = dosing.infusion_pump_settings as any;
  
  const getPatientTypeConfig = (patientType: string) => {
    switch (patientType.toLowerCase()) {
      case 'pediatric':
        return {
          headerBg: 'bg-gradient-to-r from-rose-400 to-pink-500 backdrop-blur-lg shadow-2xl shadow-rose-300/60',
          icon: Baby,
          badgeColor: 'bg-gradient-to-r from-rose-100/90 to-pink-200/80 border-rose-200/60 text-rose-800 hover:from-rose-200/90 hover:to-pink-300/80 transition-all duration-200 hover:scale-105',
          pumpBg: 'bg-gradient-to-br from-rose-50/90 to-pink-100/80 border-rose-200/50 backdrop-blur-lg shadow-lg shadow-rose-200/50',
          pumpText: 'text-rose-800',
          accentColor: 'text-rose-700',
          ringColor: 'ring-rose-300/50'
        };
      case 'neonatal':
        return {
          headerBg: 'bg-gradient-to-r from-violet-400 to-purple-500 backdrop-blur-lg shadow-2xl shadow-violet-300/60',
          icon: Baby,
          badgeColor: 'bg-gradient-to-r from-violet-100/90 to-purple-200/80 border-violet-200/60 text-violet-800 hover:from-violet-200/90 hover:to-purple-300/80 transition-all duration-200 hover:scale-105',
          pumpBg: 'bg-gradient-to-br from-violet-50/90 to-purple-100/80 border-violet-200/50 backdrop-blur-lg shadow-lg shadow-violet-200/50',
          pumpText: 'text-violet-800',
          accentColor: 'text-violet-700',
          ringColor: 'ring-violet-300/50'
        };
      case 'geriatric':
        return {
          headerBg: 'bg-gradient-to-r from-amber-400 to-orange-500 backdrop-blur-lg shadow-2xl shadow-amber-300/60',
          icon: Heart,
          badgeColor: 'bg-gradient-to-r from-amber-100/90 to-orange-200/80 border-amber-200/60 text-amber-800 hover:from-amber-200/90 hover:to-orange-300/80 transition-all duration-200 hover:scale-105',
          pumpBg: 'bg-gradient-to-br from-amber-50/90 to-orange-100/80 border-amber-200/50 backdrop-blur-lg shadow-lg shadow-amber-200/50',
          pumpText: 'text-amber-800',
          accentColor: 'text-amber-700',
          ringColor: 'ring-amber-300/50'
        };
      default:
        return {
          headerBg: 'bg-gradient-to-r from-sky-400 to-blue-500 backdrop-blur-lg shadow-2xl shadow-sky-300/60',
          icon: User,
          badgeColor: 'bg-gradient-to-r from-sky-100/90 to-blue-200/80 border-sky-200/60 text-sky-800 hover:from-sky-200/90 hover:to-blue-300/80 transition-all duration-200 hover:scale-105',
          pumpBg: 'bg-gradient-to-br from-sky-50/90 to-blue-100/80 border-sky-200/50 backdrop-blur-lg shadow-lg shadow-sky-200/50',
          pumpText: 'text-sky-800',
          accentColor: 'text-sky-700',
          ringColor: 'ring-sky-300/50'
        };
    }
  };

  const config = getPatientTypeConfig(dosing.patient_type);
  const PatientIcon = config.icon;

  return (
    <Card className={`bg-white/85 backdrop-blur-lg border border-white/30 rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-2xl shadow-2xl hover:scale-[1.01] ring-1 ${config.ringColor} ${isHighAlert ? 'ring-2 ring-red-400/60 shadow-red-300/40' : ''}`}>
      <CardHeader className={`p-6 sm:p-8 ${config.headerBg} text-white border-b border-white/20`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <CardTitle className="text-base sm:text-lg font-semibold flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-5 min-w-0 flex-1">
            <div className="flex items-center gap-3 sm:gap-5 min-w-0 flex-1">
              {isHighAlert && <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-300 flex-shrink-0 shadow-2xl drop-shadow-lg" />}
              <div className="flex-shrink-0 p-3 sm:p-4 bg-white/25 rounded-2xl backdrop-blur-lg border border-white/40 hover:bg-white/35 transition-all duration-200 shadow-lg shadow-black/20">
                <PatientIcon className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-base sm:text-lg font-bold uppercase tracking-wide break-words leading-tight">
                  {dosing.patient_type} Patient
                </div>
              </div>
            </div>
          </CardTitle>
          <div className="flex flex-wrap gap-2 sm:gap-3 flex-shrink-0">
            {dosing.route && (
              <Badge variant="secondary" className="text-xs sm:text-sm px-3 sm:px-4 py-2 bg-white/90 text-gray-800 rounded-2xl border border-white/60 backdrop-blur-lg font-semibold hover:bg-white transition-all duration-200 hover:scale-105 shadow-lg shadow-black/20 min-h-[36px] whitespace-nowrap">
                {dosing.route}
              </Badge>
            )}
            {dosing.requires_infusion_pump && (
              <Badge variant="outline" className={`flex items-center gap-2 ${config.badgeColor} text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-2xl border backdrop-blur-lg font-semibold shadow-lg shadow-black/20 min-h-[36px] whitespace-nowrap`}>
                <Syringe className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">IV Pump</span>
                <span className="sm:hidden">Pump</span>
              </Badge>
            )}
          </div>
        </div>
        <div className="mt-6 bg-white/25 rounded-2xl p-4 sm:p-5 backdrop-blur-lg border border-white/20 hover:bg-white/30 transition-all duration-200 shadow-lg shadow-black/20">
          <p className="text-sm font-semibold text-white/95 leading-relaxed break-words">{dosing.indication}</p>
        </div>
      </CardHeader>
      <CardContent className="p-6 sm:p-8">
        <div className="space-y-6 sm:space-y-8">
          <div className="text-center p-6 sm:p-8 bg-gradient-to-br from-gray-50/90 to-gray-100/80 rounded-3xl backdrop-blur-lg border border-gray-100/60 hover:shadow-lg transition-all duration-200 hover:scale-[1.01] shadow-lg shadow-gray-200/50">
            <p className="text-xs sm:text-sm font-bold text-gray-600 mb-4 uppercase tracking-wide">Emergency Dose</p>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 leading-tight break-words">{dosing.dose}</p>
            <div className="mt-4 h-1 bg-gradient-to-r from-transparent via-gray-300/60 to-transparent rounded-full"></div>
          </div>
          
          {dosing.concentration_supplied && (
            <div className="text-center p-5 sm:p-6 bg-gradient-to-br from-gray-50/80 to-white/90 rounded-2xl backdrop-blur-lg border border-gray-100/60 hover:shadow-lg transition-all duration-200 shadow-md shadow-gray-200/40">
              <p className="text-xs sm:text-sm font-bold text-gray-600 mb-3 uppercase tracking-wide">Concentration Supplied</p>
              <p className="text-base sm:text-lg font-semibold text-gray-800 break-words leading-relaxed">{dosing.concentration_supplied}</p>
            </div>
          )}

          {dosing.requires_infusion_pump && pumpSettings && (
            <div className={`${config.pumpBg} rounded-3xl p-6 sm:p-8 border transition-all duration-200`}>
              <div className="flex items-center gap-4 mb-6 sm:mb-8">
                <div className="p-3 bg-white/90 rounded-2xl backdrop-blur-lg border border-white/60 hover:bg-white transition-all duration-200 shadow-lg shadow-black/10">
                  <Syringe className={`h-5 w-5 sm:h-6 sm:w-6 ${config.accentColor} flex-shrink-0`} />
                </div>
                <p className={`text-base sm:text-lg font-bold ${config.pumpText} uppercase tracking-wide break-words flex-1`}>
                  ⚠️ IV Pump Settings
                </p>
              </div>
              
              {pumpSettings.medication_selection && (
                <div className="mb-6 p-5 sm:p-6 bg-white/90 rounded-2xl backdrop-blur-lg border border-white/50 hover:bg-white transition-all duration-200 shadow-lg shadow-black/10">
                  <p className={`text-xs sm:text-sm font-bold ${config.pumpText} uppercase mb-3 tracking-wide`}>Pump Medication:</p>
                  <p className="text-base sm:text-lg font-semibold text-gray-900 break-words leading-relaxed">{pumpSettings.medication_selection}</p>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 text-sm sm:text-base">
                {pumpSettings.cca_setting && (
                  <div className="bg-white/90 p-4 sm:p-5 rounded-2xl backdrop-blur-lg border border-white/50 hover:bg-white hover:shadow-md transition-all duration-200 shadow-md shadow-black/10">
                    <span className={`font-bold ${config.pumpText} text-xs sm:text-sm uppercase block mb-3`}>CCA:</span>
                    <span className="text-gray-900 font-semibold text-sm sm:text-base break-words">{pumpSettings.cca_setting}</span>
                  </div>
                )}
                {pumpSettings.line_option && (
                  <div className="bg-white/90 p-4 sm:p-5 rounded-2xl backdrop-blur-lg border border-white/50 hover:bg-white hover:shadow-md transition-all duration-200 shadow-md shadow-black/10">
                    <span className={`font-bold ${config.pumpText} text-xs sm:text-sm uppercase block mb-3`}>Line:</span>
                    <span className="text-gray-900 font-semibold text-sm sm:text-base break-words">{pumpSettings.line_option}</span>
                  </div>
                )}
                {pumpSettings.duration && (
                  <div className="bg-white/90 p-4 sm:p-5 rounded-2xl backdrop-blur-lg border border-white/50 hover:bg-white hover:shadow-md transition-all duration-200 shadow-md shadow-black/10">
                    <span className={`font-bold ${config.pumpText} text-xs sm:text-sm uppercase block mb-3`}>Duration:</span>
                    <span className="text-gray-900 font-semibold text-sm sm:text-base break-words">{pumpSettings.duration}</span>
                  </div>
                )}
                {pumpSettings.vtbi && (
                  <div className="bg-white/90 p-4 sm:p-5 rounded-2xl backdrop-blur-lg border border-white/50 hover:bg-white hover:shadow-md transition-all duration-200 shadow-md shadow-black/10">
                    <span className={`font-bold ${config.pumpText} text-xs sm:text-sm uppercase block mb-3`}>VTBI:</span>
                    <span className="text-gray-900 font-semibold text-sm sm:text-base break-words">{pumpSettings.vtbi}</span>
                  </div>
                )}
              </div>
              
              {pumpSettings.pump_instructions && (
                <div className="mt-6 sm:mt-8 pt-6 border-t border-white/50">
                  <p className={`text-xs sm:text-sm font-bold ${config.pumpText} mb-4 uppercase tracking-wide`}>Pump Instructions:</p>
                  <p className="text-sm sm:text-base text-gray-800 font-semibold bg-white/90 p-4 sm:p-5 rounded-2xl leading-relaxed break-words backdrop-blur-lg border border-white/50 hover:bg-white transition-all duration-200 shadow-md shadow-black/10">{pumpSettings.pump_instructions}</p>
                </div>
              )}
            </div>
          )}

          {dosing.notes && dosing.notes.length > 0 && (
            <div className="border-t border-gray-200/60 pt-6 sm:pt-8">
              <p className="text-xs sm:text-sm font-bold text-gray-600 mb-4 sm:mb-5 uppercase tracking-wide">Important Notes</p>
              <ul className="space-y-3 sm:space-y-4">
                {dosing.notes.map((note, index) => (
                  <li key={index} className="text-sm sm:text-base text-gray-700 flex items-start gap-3 sm:gap-4 bg-gradient-to-r from-gray-50/90 to-white/90 p-4 sm:p-5 rounded-2xl backdrop-blur-lg border border-gray-100/60 hover:shadow-lg transition-all duration-200 shadow-md shadow-gray-200/40">
                    <span className={`${config.accentColor} mt-1 text-base sm:text-lg font-bold flex-shrink-0`}>•</span>
                    <span className="font-semibold leading-relaxed break-words">{note}</span>
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


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
          badgeColor: 'bg-gradient-to-r from-rose-100/95 to-pink-200/90 border-rose-300/70 text-rose-800 hover:from-rose-200/95 hover:to-pink-300/90 transition-all duration-200 hover:scale-105',
          pumpBg: 'bg-gradient-to-br from-rose-50/95 to-pink-100/90 border-rose-300/60 backdrop-blur-lg shadow-xl shadow-rose-200/60',
          pumpText: 'text-rose-800',
          accentColor: 'text-rose-700',
          ringColor: 'ring-rose-400/60 shadow-rose-300/50'
        };
      case 'neonatal':
        return {
          headerBg: 'bg-gradient-to-r from-violet-400 to-purple-500 backdrop-blur-lg shadow-2xl shadow-violet-300/60',
          icon: Baby,
          badgeColor: 'bg-gradient-to-r from-violet-100/95 to-purple-200/90 border-violet-300/70 text-violet-800 hover:from-violet-200/95 hover:to-purple-300/90 transition-all duration-200 hover:scale-105',
          pumpBg: 'bg-gradient-to-br from-violet-50/95 to-purple-100/90 border-violet-300/60 backdrop-blur-lg shadow-xl shadow-violet-200/60',
          pumpText: 'text-violet-800',
          accentColor: 'text-violet-700',
          ringColor: 'ring-violet-400/60 shadow-violet-300/50'
        };
      case 'geriatric':
        return {
          headerBg: 'bg-gradient-to-r from-amber-400 to-orange-500 backdrop-blur-lg shadow-2xl shadow-amber-300/60',
          icon: Heart,
          badgeColor: 'bg-gradient-to-r from-amber-100/95 to-orange-200/90 border-amber-300/70 text-amber-800 hover:from-amber-200/95 hover:to-orange-300/90 transition-all duration-200 hover:scale-105',
          pumpBg: 'bg-gradient-to-br from-amber-50/95 to-orange-100/90 border-amber-300/60 backdrop-blur-lg shadow-xl shadow-amber-200/60',
          pumpText: 'text-amber-800',
          accentColor: 'text-amber-700',
          ringColor: 'ring-amber-400/60 shadow-amber-300/50'
        };
      default:
        return {
          headerBg: 'bg-gradient-to-r from-sky-400 to-blue-500 backdrop-blur-lg shadow-2xl shadow-sky-300/60',
          icon: User,
          badgeColor: 'bg-gradient-to-r from-sky-100/95 to-blue-200/90 border-sky-300/70 text-sky-800 hover:from-sky-200/95 hover:to-blue-300/90 transition-all duration-200 hover:scale-105',
          pumpBg: 'bg-gradient-to-br from-sky-50/95 to-blue-100/90 border-sky-300/60 backdrop-blur-lg shadow-xl shadow-sky-200/60',
          pumpText: 'text-sky-800',
          accentColor: 'text-sky-700',
          ringColor: 'ring-sky-400/60 shadow-sky-300/50'
        };
    }
  };

  const config = getPatientTypeConfig(dosing.patient_type);
  const PatientIcon = config.icon;

  return (
    <Card className={`bg-white/98 backdrop-blur-xl border-2 border-white/80 rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-2xl shadow-2xl hover:scale-[1.01] ring-2 ${config.ringColor} ${isHighAlert ? 'ring-4 ring-red-500/70 shadow-red-400/50' : ''}`}>
      <CardHeader className={`p-6 sm:p-8 ${config.headerBg} text-white border-b-2 border-white/30`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <CardTitle className="text-base sm:text-lg font-semibold flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-5 min-w-0 flex-1">
            <div className="flex items-center gap-3 sm:gap-5 min-w-0 flex-1">
              {isHighAlert && <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-300 flex-shrink-0 shadow-2xl drop-shadow-lg" />}
              <div className="flex-shrink-0 p-3 sm:p-4 bg-white/30 rounded-2xl backdrop-blur-lg border-2 border-white/50 hover:bg-white/40 transition-all duration-200 shadow-xl shadow-black/30">
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
              <Badge variant="secondary" className="text-xs sm:text-sm px-3 sm:px-4 py-2 bg-white/95 text-gray-800 rounded-2xl border-2 border-white/70 backdrop-blur-lg font-semibold hover:bg-white transition-all duration-200 hover:scale-105 shadow-xl shadow-black/30 min-h-[36px] whitespace-nowrap">
                {dosing.route}
              </Badge>
            )}
            {dosing.requires_infusion_pump && (
              <Badge variant="outline" className={`flex items-center gap-2 ${config.badgeColor} text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-2xl border-2 backdrop-blur-lg font-semibold shadow-xl shadow-black/30 min-h-[36px] whitespace-nowrap`}>
                <Syringe className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">IV Pump</span>
                <span className="sm:hidden">Pump</span>
              </Badge>
            )}
          </div>
        </div>
        <div className="mt-6 bg-white/30 rounded-2xl p-4 sm:p-5 backdrop-blur-lg border-2 border-white/30 hover:bg-white/35 transition-all duration-200 shadow-xl shadow-black/30">
          <p className="text-sm font-semibold text-white/98 leading-relaxed break-words">{dosing.indication}</p>
        </div>
      </CardHeader>
      <CardContent className="p-6 sm:p-8 bg-white/98">
        <div className="space-y-6 sm:space-y-8">
          <div className="text-center p-6 sm:p-8 bg-gradient-to-br from-gray-50/98 to-gray-100/95 rounded-3xl backdrop-blur-lg border-2 border-gray-200/70 hover:shadow-xl transition-all duration-200 hover:scale-[1.01] shadow-xl shadow-gray-300/60">
            <p className="text-xs sm:text-sm font-bold text-gray-700 mb-4 uppercase tracking-wide">Emergency Dose</p>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 leading-tight break-words">{dosing.dose}</p>
            <div className="mt-4 h-1 bg-gradient-to-r from-transparent via-gray-400/70 to-transparent rounded-full"></div>
          </div>
          
          {dosing.concentration_supplied && (
            <div className="text-center p-5 sm:p-6 bg-gradient-to-br from-gray-50/95 to-white/98 rounded-2xl backdrop-blur-lg border-2 border-gray-200/60 hover:shadow-xl transition-all duration-200 shadow-xl shadow-gray-300/50">
              <p className="text-xs sm:text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">Concentration Supplied</p>
              <p className="text-base sm:text-lg font-semibold text-gray-800 break-words leading-relaxed">{dosing.concentration_supplied}</p>
            </div>
          )}

          {dosing.requires_infusion_pump && pumpSettings && (
            <div className={`${config.pumpBg} rounded-3xl p-6 sm:p-8 border-2 transition-all duration-200`}>
              <div className="flex items-center gap-4 mb-6 sm:mb-8">
                <div className="p-3 bg-white/95 rounded-2xl backdrop-blur-lg border-2 border-white/70 hover:bg-white transition-all duration-200 shadow-xl shadow-black/20">
                  <Syringe className={`h-5 w-5 sm:h-6 sm:w-6 ${config.accentColor} flex-shrink-0`} />
                </div>
                <p className={`text-base sm:text-lg font-bold ${config.pumpText} uppercase tracking-wide break-words flex-1`}>
                  ⚠️ IV Pump Settings
                </p>
              </div>
              
              {pumpSettings.medication_selection && (
                <div className="mb-6 p-5 sm:p-6 bg-white/98 rounded-2xl backdrop-blur-lg border-2 border-white/60 hover:bg-white transition-all duration-200 shadow-xl shadow-black/20">
                  <p className={`text-xs sm:text-sm font-bold ${config.pumpText} uppercase mb-3 tracking-wide`}>Pump Medication:</p>
                  <p className="text-base sm:text-lg font-semibold text-gray-900 break-words leading-relaxed">{pumpSettings.medication_selection}</p>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 text-sm sm:text-base">
                {pumpSettings.cca_setting && (
                  <div className="bg-white/98 p-4 sm:p-5 rounded-2xl backdrop-blur-lg border-2 border-white/60 hover:bg-white hover:shadow-lg transition-all duration-200 shadow-lg shadow-black/20">
                    <span className={`font-bold ${config.pumpText} text-xs sm:text-sm uppercase block mb-3`}>CCA:</span>
                    <span className="text-gray-900 font-semibold text-sm sm:text-base break-words">{pumpSettings.cca_setting}</span>
                  </div>
                )}
                {pumpSettings.line_option && (
                  <div className="bg-white/98 p-4 sm:p-5 rounded-2xl backdrop-blur-lg border-2 border-white/60 hover:bg-white hover:shadow-lg transition-all duration-200 shadow-lg shadow-black/20">
                    <span className={`font-bold ${config.pumpText} text-xs sm:text-sm uppercase block mb-3`}>Line:</span>
                    <span className="text-gray-900 font-semibold text-sm sm:text-base break-words">{pumpSettings.line_option}</span>
                  </div>
                )}
                {pumpSettings.duration && (
                  <div className="bg-white/98 p-4 sm:p-5 rounded-2xl backdrop-blur-lg border-2 border-white/60 hover:bg-white hover:shadow-lg transition-all duration-200 shadow-lg shadow-black/20">
                    <span className={`font-bold ${config.pumpText} text-xs sm:text-sm uppercase block mb-3`}>Duration:</span>
                    <span className="text-gray-900 font-semibold text-sm sm:text-base break-words">{pumpSettings.duration}</span>
                  </div>
                )}
                {pumpSettings.vtbi && (
                  <div className="bg-white/98 p-4 sm:p-5 rounded-2xl backdrop-blur-lg border-2 border-white/60 hover:bg-white hover:shadow-lg transition-all duration-200 shadow-lg shadow-black/20">
                    <span className={`font-bold ${config.pumpText} text-xs sm:text-sm uppercase block mb-3`}>VTBI:</span>
                    <span className="text-gray-900 font-semibold text-sm sm:text-base break-words">{pumpSettings.vtbi}</span>
                  </div>
                )}
              </div>
              
              {pumpSettings.pump_instructions && (
                <div className="mt-6 sm:mt-8 pt-6 border-t-2 border-white/60">
                  <p className={`text-xs sm:text-sm font-bold ${config.pumpText} mb-4 uppercase tracking-wide`}>Pump Instructions:</p>
                  <p className="text-sm sm:text-base text-gray-800 font-semibold bg-white/98 p-4 sm:p-5 rounded-2xl leading-relaxed break-words backdrop-blur-lg border-2 border-white/60 hover:bg-white transition-all duration-200 shadow-lg shadow-black/20">{pumpSettings.pump_instructions}</p>
                </div>
              )}
            </div>
          )}

          {dosing.notes && dosing.notes.length > 0 && (
            <div className="border-t-2 border-gray-300/70 pt-6 sm:pt-8">
              <p className="text-xs sm:text-sm font-bold text-gray-700 mb-4 sm:mb-5 uppercase tracking-wide">Important Notes</p>
              <ul className="space-y-3 sm:space-y-4">
                {dosing.notes.map((note, index) => (
                  <li key={index} className="text-sm sm:text-base text-gray-700 flex items-start gap-3 sm:gap-4 bg-gradient-to-r from-gray-50/98 to-white/95 p-4 sm:p-5 rounded-2xl backdrop-blur-lg border-2 border-gray-200/60 hover:shadow-xl transition-all duration-200 shadow-lg shadow-gray-300/50">
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

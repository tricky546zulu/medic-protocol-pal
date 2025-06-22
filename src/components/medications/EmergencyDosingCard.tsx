
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
          headerBg: 'bg-gradient-to-r from-pink-500 to-pink-600 backdrop-blur-md shadow-pink-200/50',
          icon: Baby,
          badgeColor: 'bg-pink-100/80 border-pink-200/60 text-pink-700 hover:bg-pink-150/90 transition-all duration-200 hover:scale-105',
          pumpBg: 'bg-pink-50/80 border-pink-200/40 backdrop-blur-sm',
          pumpText: 'text-pink-700',
          accentColor: 'text-pink-600'
        };
      case 'neonatal':
        return {
          headerBg: 'bg-gradient-to-r from-purple-500 to-purple-600 backdrop-blur-md shadow-purple-200/50',
          icon: Baby,
          badgeColor: 'bg-purple-100/80 border-purple-200/60 text-purple-700 hover:bg-purple-150/90 transition-all duration-200 hover:scale-105',
          pumpBg: 'bg-purple-50/80 border-purple-200/40 backdrop-blur-sm',
          pumpText: 'text-purple-700',
          accentColor: 'text-purple-600'
        };
      case 'geriatric':
        return {
          headerBg: 'bg-gradient-to-r from-amber-500 to-amber-600 backdrop-blur-md shadow-amber-200/50',
          icon: Heart,
          badgeColor: 'bg-amber-100/80 border-amber-200/60 text-amber-700 hover:bg-amber-150/90 transition-all duration-200 hover:scale-105',
          pumpBg: 'bg-amber-50/80 border-amber-200/40 backdrop-blur-sm',
          pumpText: 'text-amber-700',
          accentColor: 'text-amber-600'
        };
      default:
        return {
          headerBg: 'bg-gradient-to-r from-blue-500 to-indigo-600 backdrop-blur-md shadow-blue-200/50',
          icon: User,
          badgeColor: 'bg-blue-100/80 border-blue-200/60 text-blue-700 hover:bg-blue-150/90 transition-all duration-200 hover:scale-105',
          pumpBg: 'bg-blue-50/80 border-blue-200/40 backdrop-blur-sm',
          pumpText: 'text-blue-700',
          accentColor: 'text-blue-600'
        };
    }
  };

  const config = getPatientTypeConfig(dosing.patient_type);
  const PatientIcon = config.icon;

  return (
    <Card className={`bg-white/80 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl shadow-lg hover:scale-[1.01] ${isHighAlert ? 'ring-2 ring-red-200/50' : ''}`}>
      <CardHeader className={`p-6 ${config.headerBg} text-white border-b border-white/10 shadow-lg`}>
        <div className="flex items-center justify-between gap-4">
          <CardTitle className="text-base font-semibold flex items-center gap-4 min-w-0 flex-1">
            {isHighAlert && <AlertTriangle className="h-4 w-4 text-yellow-300 flex-shrink-0 animate-pulse" />}
            <div className="flex-shrink-0 p-3 bg-white/20 rounded-xl backdrop-blur-sm border border-white/30 hover:bg-white/30 transition-all duration-200">
              <PatientIcon className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-base font-semibold uppercase tracking-wide break-words leading-tight">
                {dosing.patient_type} Patient
              </div>
            </div>
          </CardTitle>
          <div className="flex gap-2 flex-shrink-0">
            {dosing.route && (
              <Badge variant="secondary" className="text-xs px-3 py-1 bg-white/90 text-gray-800 rounded-xl border border-white/50 backdrop-blur-sm font-medium hover:bg-white transition-all duration-200 hover:scale-105">
                {dosing.route}
              </Badge>
            )}
            {dosing.requires_infusion_pump && (
              <Badge variant="outline" className={`flex items-center gap-2 ${config.badgeColor} text-xs px-3 py-1 rounded-xl border backdrop-blur-sm font-medium`}>
                <Syringe className="h-3 w-3" />
                IV Pump
              </Badge>
            )}
          </div>
        </div>
        <div className="mt-4 bg-white/20 rounded-xl p-4 backdrop-blur-sm border border-white/10 hover:bg-white/25 transition-all duration-200">
          <p className="text-sm font-medium text-white/95 leading-relaxed break-words">{dosing.indication}</p>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="text-center p-6 bg-gradient-to-br from-gray-50/90 to-gray-100/80 rounded-2xl backdrop-blur-sm border border-gray-100/60 hover:shadow-md transition-all duration-200 hover:scale-[1.01]">
            <p className="text-xs font-medium text-gray-600 mb-3 uppercase tracking-wide">Emergency Dose</p>
            <p className="text-xl md:text-2xl font-bold text-gray-900 leading-tight break-words">{dosing.dose}</p>
            <div className="mt-3 h-1 bg-gradient-to-r from-transparent via-gray-300/50 to-transparent rounded-full"></div>
          </div>
          
          {dosing.concentration_supplied && (
            <div className="text-center p-5 bg-gradient-to-br from-gray-50/80 to-white/90 rounded-xl backdrop-blur-sm border border-gray-100/50 hover:shadow-md transition-all duration-200">
              <p className="text-xs font-medium text-gray-600 mb-3 uppercase tracking-wide">Concentration Supplied</p>
              <p className="text-base font-semibold text-gray-800 break-words leading-relaxed">{dosing.concentration_supplied}</p>
            </div>
          )}

          {dosing.requires_infusion_pump && pumpSettings && (
            <div className={`${config.pumpBg} rounded-2xl p-6 border shadow-sm hover:shadow-md transition-all duration-200`}>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-white/80 rounded-xl backdrop-blur-sm border border-white/50 hover:bg-white transition-all duration-200">
                  <Syringe className={`h-5 w-5 ${config.accentColor} flex-shrink-0`} />
                </div>
                <p className={`text-sm font-semibold ${config.pumpText} uppercase tracking-wide break-words flex-1`}>
                  ⚠️ IV Pump Settings
                </p>
              </div>
              
              {pumpSettings.medication_selection && (
                <div className="mb-5 p-4 bg-white/90 rounded-xl backdrop-blur-sm border border-white/40 hover:bg-white transition-all duration-200">
                  <p className={`text-xs font-medium ${config.pumpText} uppercase mb-2 tracking-wide`}>Pump Medication:</p>
                  <p className="text-sm font-semibold text-gray-900 break-words leading-relaxed">{pumpSettings.medication_selection}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {pumpSettings.cca_setting && (
                  <div className="bg-white/90 p-4 rounded-xl backdrop-blur-sm border border-white/40 hover:bg-white hover:shadow-sm transition-all duration-200">
                    <span className={`font-medium ${config.pumpText} text-xs uppercase block mb-2`}>CCA:</span>
                    <span className="text-gray-900 font-semibold text-sm break-words">{pumpSettings.cca_setting}</span>
                  </div>
                )}
                {pumpSettings.line_option && (
                  <div className="bg-white/90 p-4 rounded-xl backdrop-blur-sm border border-white/40 hover:bg-white hover:shadow-sm transition-all duration-200">
                    <span className={`font-medium ${config.pumpText} text-xs uppercase block mb-2`}>Line:</span>
                    <span className="text-gray-900 font-semibold text-sm break-words">{pumpSettings.line_option}</span>
                  </div>
                )}
                {pumpSettings.duration && (
                  <div className="bg-white/90 p-4 rounded-xl backdrop-blur-sm border border-white/40 hover:bg-white hover:shadow-sm transition-all duration-200">
                    <span className={`font-medium ${config.pumpText} text-xs uppercase block mb-2`}>Duration:</span>
                    <span className="text-gray-900 font-semibold text-sm break-words">{pumpSettings.duration}</span>
                  </div>
                )}
                {pumpSettings.vtbi && (
                  <div className="bg-white/90 p-4 rounded-xl backdrop-blur-sm border border-white/40 hover:bg-white hover:shadow-sm transition-all duration-200">
                    <span className={`font-medium ${config.pumpText} text-xs uppercase block mb-2`}>VTBI:</span>
                    <span className="text-gray-900 font-semibold text-sm break-words">{pumpSettings.vtbi}</span>
                  </div>
                )}
              </div>
              
              {pumpSettings.pump_instructions && (
                <div className="mt-6 pt-5 border-t border-white/40">
                  <p className={`text-xs font-medium ${config.pumpText} mb-3 uppercase tracking-wide`}>Pump Instructions:</p>
                  <p className="text-sm text-gray-800 font-medium bg-white/90 p-4 rounded-xl leading-relaxed break-words backdrop-blur-sm border border-white/40 hover:bg-white transition-all duration-200">{pumpSettings.pump_instructions}</p>
                </div>
              )}
            </div>
          )}

          {dosing.notes && dosing.notes.length > 0 && (
            <div className="border-t border-gray-200/50 pt-6">
              <p className="text-xs font-medium text-gray-600 mb-4 uppercase tracking-wide">Important Notes</p>
              <ul className="space-y-3">
                {dosing.notes.map((note, index) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start gap-3 bg-gradient-to-r from-gray-50/80 to-white/90 p-4 rounded-xl backdrop-blur-sm border border-gray-100/50 hover:shadow-md transition-all duration-200">
                    <span className={`${config.accentColor} mt-0.5 text-sm font-bold flex-shrink-0`}>•</span>
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


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
          headerBg: 'bg-pink-400/90 backdrop-blur-md',
          icon: Baby,
          badgeColor: 'bg-pink-100/70 border-pink-200/50 text-pink-700',
          pumpBg: 'bg-pink-50/80 border-pink-200/30 backdrop-blur-sm',
          pumpText: 'text-pink-700',
          accentColor: 'text-pink-600'
        };
      case 'neonatal':
        return {
          headerBg: 'bg-purple-400/90 backdrop-blur-md',
          icon: Baby,
          badgeColor: 'bg-purple-100/70 border-purple-200/50 text-purple-700',
          pumpBg: 'bg-purple-50/80 border-purple-200/30 backdrop-blur-sm',
          pumpText: 'text-purple-700',
          accentColor: 'text-purple-600'
        };
      case 'geriatric':
        return {
          headerBg: 'bg-amber-400/90 backdrop-blur-md',
          icon: Heart,
          badgeColor: 'bg-amber-100/70 border-amber-200/50 text-amber-700',
          pumpBg: 'bg-amber-50/80 border-amber-200/30 backdrop-blur-sm',
          pumpText: 'text-amber-700',
          accentColor: 'text-amber-600'
        };
      default:
        return {
          headerBg: 'bg-slate-500/90 backdrop-blur-md',
          icon: User,
          badgeColor: 'bg-slate-100/70 border-slate-200/50 text-slate-700',
          pumpBg: 'bg-slate-50/80 border-slate-200/30 backdrop-blur-sm',
          pumpText: 'text-slate-700',
          accentColor: 'text-slate-600'
        };
    }
  };

  const config = getPatientTypeConfig(dosing.patient_type);
  const PatientIcon = config.icon;

  return (
    <Card className={`bg-white/80 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden transition-all duration-200 hover:shadow-xl shadow-lg ${isHighAlert ? 'ring-2 ring-red-200/50' : ''}`}>
      <CardHeader className={`p-6 ${config.headerBg} text-white border-b border-white/10`}>
        <div className="flex items-center justify-between gap-4">
          <CardTitle className="text-base font-semibold flex items-center gap-4 min-w-0 flex-1">
            {isHighAlert && <AlertTriangle className="h-4 w-4 text-yellow-300 flex-shrink-0" />}
            <div className="flex-shrink-0 p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <PatientIcon className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-base font-semibold uppercase tracking-wide truncate">
                {dosing.patient_type} Patient
              </div>
            </div>
          </CardTitle>
          <div className="flex gap-2 flex-shrink-0">
            {dosing.route && (
              <Badge variant="secondary" className="text-xs px-3 py-1 bg-white/90 text-gray-800 rounded-xl border border-white/50 backdrop-blur-sm font-medium">
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
        <div className="mt-4 bg-white/20 rounded-xl p-4 backdrop-blur-sm border border-white/10">
          <p className="text-sm font-medium text-white/95 leading-relaxed">{dosing.indication}</p>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="text-center p-5 bg-gray-50/80 rounded-xl backdrop-blur-sm border border-gray-100/50">
            <p className="text-xs font-medium text-gray-600 mb-3 uppercase tracking-wide">Emergency Dose</p>
            <p className="text-xl md:text-2xl font-bold text-gray-900 leading-tight break-words">{dosing.dose}</p>
          </div>
          
          {dosing.concentration_supplied && (
            <div className="text-center p-5 bg-gray-50/80 rounded-xl backdrop-blur-sm border border-gray-100/50">
              <p className="text-xs font-medium text-gray-600 mb-3 uppercase tracking-wide">Concentration Supplied</p>
              <p className="text-base font-semibold text-gray-800 break-words">{dosing.concentration_supplied}</p>
            </div>
          )}

          {dosing.requires_infusion_pump && pumpSettings && (
            <div className={`${config.pumpBg} rounded-xl p-5 border`}>
              <div className="flex items-center gap-3 mb-5">
                <Syringe className={`h-5 w-5 ${config.accentColor} flex-shrink-0`} />
                <p className={`text-sm font-semibold ${config.pumpText} uppercase tracking-wide truncate`}>
                  ⚠️ IV Pump Settings
                </p>
              </div>
              
              {pumpSettings.medication_selection && (
                <div className="mb-5 p-4 bg-white/80 rounded-xl backdrop-blur-sm border border-white/30">
                  <p className={`text-xs font-medium ${config.pumpText} uppercase mb-2 tracking-wide`}>Pump Medication:</p>
                  <p className="text-sm font-semibold text-gray-900 break-words">{pumpSettings.medication_selection}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {pumpSettings.cca_setting && (
                  <div className="bg-white/80 p-4 rounded-xl backdrop-blur-sm border border-white/30">
                    <span className={`font-medium ${config.pumpText} text-xs uppercase block mb-2`}>CCA:</span>
                    <span className="text-gray-900 font-semibold text-sm break-words">{pumpSettings.cca_setting}</span>
                  </div>
                )}
                {pumpSettings.line_option && (
                  <div className="bg-white/80 p-4 rounded-xl backdrop-blur-sm border border-white/30">
                    <span className={`font-medium ${config.pumpText} text-xs uppercase block mb-2`}>Line:</span>
                    <span className="text-gray-900 font-semibold text-sm break-words">{pumpSettings.line_option}</span>
                  </div>
                )}
                {pumpSettings.duration && (
                  <div className="bg-white/80 p-4 rounded-xl backdrop-blur-sm border border-white/30">
                    <span className={`font-medium ${config.pumpText} text-xs uppercase block mb-2`}>Duration:</span>
                    <span className="text-gray-900 font-semibold text-sm break-words">{pumpSettings.duration}</span>
                  </div>
                )}
                {pumpSettings.vtbi && (
                  <div className="bg-white/80 p-4 rounded-xl backdrop-blur-sm border border-white/30">
                    <span className={`font-medium ${config.pumpText} text-xs uppercase block mb-2`}>VTBI:</span>
                    <span className="text-gray-900 font-semibold text-sm break-words">{pumpSettings.vtbi}</span>
                  </div>
                )}
              </div>
              
              {pumpSettings.pump_instructions && (
                <div className="mt-5 pt-5 border-t border-white/30">
                  <p className={`text-xs font-medium ${config.pumpText} mb-3 uppercase tracking-wide`}>Pump Instructions:</p>
                  <p className="text-sm text-gray-800 font-medium bg-white/80 p-4 rounded-xl leading-relaxed break-words backdrop-blur-sm border border-white/30">{pumpSettings.pump_instructions}</p>
                </div>
              )}
            </div>
          )}

          {dosing.notes && dosing.notes.length > 0 && (
            <div className="border-t border-gray-200/50 pt-6">
              <p className="text-xs font-medium text-gray-600 mb-4 uppercase tracking-wide">Important Notes</p>
              <ul className="space-y-3">
                {dosing.notes.map((note, index) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start gap-3 bg-gray-50/80 p-4 rounded-xl backdrop-blur-sm border border-gray-100/50">
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

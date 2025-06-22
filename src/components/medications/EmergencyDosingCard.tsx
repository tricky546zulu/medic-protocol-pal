
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
          borderColor: 'border-pink-200',
          bgColor: 'bg-pink-50',
          headerBg: 'bg-pink-500',
          icon: Baby,
          badgeColor: 'bg-pink-100 border-pink-200 text-pink-700',
          pumpBg: 'bg-pink-50 border-pink-200',
          pumpText: 'text-pink-700',
          accentColor: 'text-pink-600'
        };
      case 'neonatal':
        return {
          borderColor: 'border-purple-200',
          bgColor: 'bg-purple-50',
          headerBg: 'bg-purple-500',
          icon: Baby,
          badgeColor: 'bg-purple-100 border-purple-200 text-purple-700',
          pumpBg: 'bg-purple-50 border-purple-200',
          pumpText: 'text-purple-700',
          accentColor: 'text-purple-600'
        };
      case 'geriatric':
        return {
          borderColor: 'border-amber-200',
          bgColor: 'bg-amber-50',
          headerBg: 'bg-amber-500',
          icon: Heart,
          badgeColor: 'bg-amber-100 border-amber-200 text-amber-700',
          pumpBg: 'bg-amber-50 border-amber-200',
          pumpText: 'text-amber-700',
          accentColor: 'text-amber-600'
        };
      default:
        return {
          borderColor: 'border-slate-200',
          bgColor: 'bg-slate-50',
          headerBg: 'bg-slate-500',
          icon: User,
          badgeColor: 'bg-slate-100 border-slate-200 text-slate-700',
          pumpBg: 'bg-slate-50 border-slate-200',
          pumpText: 'text-slate-700',
          accentColor: 'text-slate-600'
        };
    }
  };

  const config = getPatientTypeConfig(dosing.patient_type);
  const PatientIcon = config.icon;

  return (
    <Card className={`border-0 shadow-lg bg-white rounded-xl overflow-hidden transition-all duration-200 hover:shadow-xl ${isHighAlert ? 'ring-2 ring-red-200' : ''}`}>
      <CardHeader className={`p-4 ${config.headerBg} text-white`}>
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-base font-semibold flex items-center gap-3 min-w-0 flex-1">
            {isHighAlert && <AlertTriangle className="h-4 w-4 text-yellow-300 flex-shrink-0" />}
            <div className="flex-shrink-0 p-2 bg-white/20 rounded-lg">
              <PatientIcon className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-base font-semibold uppercase tracking-wide truncate">
                {dosing.patient_type} Patient
              </div>
            </div>
          </CardTitle>
          <div className="flex gap-2 flex-shrink-0">
            {dosing.route && (
              <Badge variant="secondary" className="text-xs px-2 py-1 bg-white/90 text-gray-800 rounded-md border border-white/50">
                {dosing.route}
              </Badge>
            )}
            {dosing.requires_infusion_pump && (
              <Badge variant="outline" className={`flex items-center gap-1 ${config.badgeColor} text-xs px-2 py-1 rounded-md border`}>
                <Syringe className="h-3 w-3" />
                IV Pump
              </Badge>
            )}
          </div>
        </div>
        <div className="mt-3 bg-white/20 rounded-lg p-3">
          <p className="text-sm font-medium text-white/95 leading-relaxed">{dosing.indication}</p>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-xs font-medium text-gray-600 mb-2 uppercase tracking-wide">Emergency Dose</p>
            <p className="text-xl font-bold text-gray-900 leading-tight break-words">{dosing.dose}</p>
          </div>
          
          {dosing.concentration_supplied && (
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-xs font-medium text-gray-600 mb-2 uppercase tracking-wide">Concentration Supplied</p>
              <p className="text-base font-semibold text-gray-800 break-words">{dosing.concentration_supplied}</p>
            </div>
          )}

          {dosing.requires_infusion_pump && pumpSettings && (
            <div className={`${config.pumpBg} rounded-lg p-4`}>
              <div className="flex items-center gap-3 mb-4">
                <Syringe className={`h-4 w-4 ${config.accentColor} flex-shrink-0`} />
                <p className={`text-sm font-semibold ${config.pumpText} uppercase tracking-wide truncate`}>
                  ⚠️ IV Pump Settings
                </p>
              </div>
              
              {pumpSettings.medication_selection && (
                <div className="mb-4 p-3 bg-white rounded-lg">
                  <p className={`text-xs font-medium ${config.pumpText} uppercase mb-2 tracking-wide`}>Pump Medication:</p>
                  <p className="text-sm font-semibold text-gray-900 break-words">{pumpSettings.medication_selection}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                {pumpSettings.cca_setting && (
                  <div className="bg-white p-3 rounded-lg">
                    <span className={`font-medium ${config.pumpText} text-xs uppercase block mb-1`}>CCA:</span>
                    <span className="text-gray-900 font-semibold text-sm break-words">{pumpSettings.cca_setting}</span>
                  </div>
                )}
                {pumpSettings.line_option && (
                  <div className="bg-white p-3 rounded-lg">
                    <span className={`font-medium ${config.pumpText} text-xs uppercase block mb-1`}>Line:</span>
                    <span className="text-gray-900 font-semibold text-sm break-words">{pumpSettings.line_option}</span>
                  </div>
                )}
                {pumpSettings.duration && (
                  <div className="bg-white p-3 rounded-lg">
                    <span className={`font-medium ${config.pumpText} text-xs uppercase block mb-1`}>Duration:</span>
                    <span className="text-gray-900 font-semibold text-sm break-words">{pumpSettings.duration}</span>
                  </div>
                )}
                {pumpSettings.vtbi && (
                  <div className="bg-white p-3 rounded-lg">
                    <span className={`font-medium ${config.pumpText} text-xs uppercase block mb-1`}>VTBI:</span>
                    <span className="text-gray-900 font-semibold text-sm break-words">{pumpSettings.vtbi}</span>
                  </div>
                )}
              </div>
              
              {pumpSettings.pump_instructions && (
                <div className="mt-4 pt-4 border-t border-white/50">
                  <p className={`text-xs font-medium ${config.pumpText} mb-2 uppercase tracking-wide`}>Pump Instructions:</p>
                  <p className="text-sm text-gray-800 font-medium bg-white p-3 rounded-lg leading-relaxed break-words">{pumpSettings.pump_instructions}</p>
                </div>
              )}
            </div>
          )}

          {dosing.notes && dosing.notes.length > 0 && (
            <div className="border-t border-gray-200 pt-4">
              <p className="text-xs font-medium text-gray-600 mb-3 uppercase tracking-wide">Important Notes</p>
              <ul className="space-y-2">
                {dosing.notes.map((note, index) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start gap-3 bg-gray-50 p-3 rounded-lg">
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

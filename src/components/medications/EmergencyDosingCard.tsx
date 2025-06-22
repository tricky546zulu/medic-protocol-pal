
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
  
  // Determine patient type styling
  const getPatientTypeConfig = (patientType: string) => {
    switch (patientType.toLowerCase()) {
      case 'pediatric':
        return {
          borderColor: 'border-green-500',
          bgColor: 'bg-green-50',
          headerBg: 'bg-green-500',
          icon: Baby,
          badgeColor: 'bg-green-100 border-green-400 text-green-800',
          pumpBg: 'bg-green-100 border-green-400',
          pumpText: 'text-green-700',
          accentColor: 'text-green-600'
        };
      case 'neonatal':
        return {
          borderColor: 'border-purple-500',
          bgColor: 'bg-purple-50',
          headerBg: 'bg-purple-500',
          icon: Baby,
          badgeColor: 'bg-purple-100 border-purple-400 text-purple-800',
          pumpBg: 'bg-purple-100 border-purple-400',
          pumpText: 'text-purple-700',
          accentColor: 'text-purple-600'
        };
      case 'geriatric':
        return {
          borderColor: 'border-orange-500',
          bgColor: 'bg-orange-50',
          headerBg: 'bg-orange-500',
          icon: Heart,
          badgeColor: 'bg-orange-100 border-orange-400 text-orange-800',
          pumpBg: 'bg-orange-100 border-orange-400',
          pumpText: 'text-orange-700',
          accentColor: 'text-orange-600'
        };
      default: // Adult
        return {
          borderColor: 'border-blue-500',
          bgColor: 'bg-blue-50',
          headerBg: 'bg-blue-500',
          icon: User,
          badgeColor: 'bg-blue-100 border-blue-400 text-blue-800',
          pumpBg: 'bg-blue-100 border-blue-400',
          pumpText: 'text-blue-700',
          accentColor: 'text-blue-600'
        };
    }
  };

  const config = getPatientTypeConfig(dosing.patient_type);
  const PatientIcon = config.icon;

  return (
    <Card className={`border-2 ${config.borderColor} ${config.bgColor} shadow-xl rounded-2xl overflow-hidden ${isHighAlert ? 'ring-4 ring-red-300' : ''}`}>
      <CardHeader className={`pb-4 ${config.headerBg} text-white`}>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold flex items-center gap-3">
            {isHighAlert && <AlertTriangle className="h-6 w-6 text-yellow-300" />}
            <div className="p-2 bg-white/20 rounded-xl">
              <PatientIcon className="h-6 w-6" />
            </div>
            <div>
              <div className="text-2xl font-black uppercase tracking-wider">
                {dosing.patient_type} PATIENT
              </div>
              {dosing.patient_type.toLowerCase() === 'pediatric' && (
                <div className="text-sm font-medium opacity-90 mt-1">
                  Special Pediatric Dosing Protocol
                </div>
              )}
            </div>
          </CardTitle>
          <div className="flex flex-col gap-2">
            {dosing.route && (
              <Badge variant="secondary" className="font-bold text-lg px-4 py-2 bg-white/90 text-gray-800 rounded-xl shadow-lg">
                {dosing.route}
              </Badge>
            )}
            {dosing.requires_infusion_pump && (
              <Badge variant="outline" className={`flex items-center gap-2 ${config.badgeColor} font-bold text-sm px-3 py-2 rounded-xl shadow-lg`}>
                <Syringe className="h-4 w-4" />
                IV PUMP REQUIRED
              </Badge>
            )}
          </div>
        </div>
        <div className="mt-3 bg-white/20 rounded-lg p-3">
          <p className="text-lg font-semibold text-white/95">{dosing.indication}</p>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="text-center p-6 bg-white rounded-2xl border-4 border-gray-300 shadow-lg">
            <p className="text-sm font-bold text-gray-600 mb-2 uppercase tracking-wider">EMERGENCY DOSE</p>
            <p className="text-4xl font-black text-gray-900 leading-tight">{dosing.dose}</p>
          </div>
          
          {dosing.concentration_supplied && (
            <div className="text-center p-4 bg-gray-100 rounded-xl border-2 border-gray-200">
              <p className="text-xs font-bold text-gray-600 mb-2 uppercase tracking-wider">CONCENTRATION SUPPLIED</p>
              <p className="text-xl font-bold text-gray-800">{dosing.concentration_supplied}</p>
            </div>
          )}

          {dosing.requires_infusion_pump && pumpSettings && (
            <div className={`${config.pumpBg} border-3 ${config.borderColor} rounded-2xl p-6 shadow-lg`}>
              <div className="flex items-center gap-3 mb-4">
                <Syringe className={`h-6 w-6 ${config.accentColor}`} />
                <p className={`text-lg font-black ${config.pumpText} uppercase tracking-wider`}>
                  ⚠️ IV PUMP SETTINGS
                </p>
              </div>
              
              {pumpSettings.medication_selection && (
                <div className="mb-4 p-3 bg-white rounded-xl border-2 border-gray-300 shadow-md">
                  <p className={`text-xs font-black ${config.pumpText} uppercase mb-2 tracking-wider`}>PUMP MEDICATION:</p>
                  <p className="text-lg font-bold text-gray-900">{pumpSettings.medication_selection}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 text-sm">
                {pumpSettings.cca_setting && (
                  <div className="bg-white p-3 rounded-lg border-2 border-gray-200 shadow-md">
                    <span className={`font-black ${config.pumpText} text-xs uppercase block`}>CCA:</span>
                    <span className="text-gray-900 font-bold text-lg">{pumpSettings.cca_setting}</span>
                  </div>
                )}
                {pumpSettings.line_option && (
                  <div className="bg-white p-3 rounded-lg border-2 border-gray-200 shadow-md">
                    <span className={`font-black ${config.pumpText} text-xs uppercase block`}>Line:</span>
                    <span className="text-gray-900 font-bold text-lg">{pumpSettings.line_option}</span>
                  </div>
                )}
                {pumpSettings.duration && (
                  <div className="bg-white p-3 rounded-lg border-2 border-gray-200 shadow-md">
                    <span className={`font-black ${config.pumpText} text-xs uppercase block`}>Duration:</span>
                    <span className="text-gray-900 font-bold text-lg">{pumpSettings.duration}</span>
                  </div>
                )}
                {pumpSettings.vtbi && (
                  <div className="bg-white p-3 rounded-lg border-2 border-gray-200 shadow-md">
                    <span className={`font-black ${config.pumpText} text-xs uppercase block`}>VTBI:</span>
                    <span className="text-gray-900 font-bold text-lg">{pumpSettings.vtbi}</span>
                  </div>
                )}
              </div>
              
              {pumpSettings.pump_instructions && (
                <div className="mt-4 pt-4 border-t-2 border-white/50">
                  <p className={`text-sm font-black ${config.pumpText} mb-2 uppercase tracking-wider`}>PUMP INSTRUCTIONS:</p>
                  <p className="text-sm text-gray-800 font-semibold bg-white p-3 rounded-lg">{pumpSettings.pump_instructions}</p>
                </div>
              )}
            </div>
          )}

          {dosing.notes && dosing.notes.length > 0 && (
            <div className="border-t-2 border-gray-300 pt-4">
              <p className="text-sm font-bold text-gray-600 mb-3 uppercase tracking-wider">IMPORTANT NOTES</p>
              <ul className="space-y-2">
                {dosing.notes.map((note, index) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start gap-3 bg-white p-3 rounded-lg border border-gray-200">
                    <span className={`${config.accentColor} mt-1 text-lg font-bold`}>•</span>
                    <span className="font-medium">{note}</span>
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

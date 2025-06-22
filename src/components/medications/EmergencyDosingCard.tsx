
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
  
  // Professional patient type configuration with cohesive styling
  const getPatientTypeConfig = (patientType: string) => {
    switch (patientType.toLowerCase()) {
      case 'pediatric':
        return {
          borderColor: 'border-pink-400',
          bgColor: 'bg-pink-50',
          headerBg: 'bg-gradient-to-r from-pink-400 to-pink-500',
          icon: Baby,
          badgeColor: 'bg-pink-100 border-pink-300 text-pink-800',
          pumpBg: 'bg-pink-100 border-pink-300',
          pumpText: 'text-pink-700',
          accentColor: 'text-pink-600',
          tabColor: 'data-[state=active]:bg-pink-500 data-[state=active]:text-white hover:bg-pink-100 border-pink-200 text-pink-700'
        };
      case 'neonatal':
        return {
          borderColor: 'border-purple-400',
          bgColor: 'bg-purple-50',
          headerBg: 'bg-gradient-to-r from-purple-400 to-purple-500',
          icon: Baby,
          badgeColor: 'bg-purple-100 border-purple-300 text-purple-800',
          pumpBg: 'bg-purple-100 border-purple-300',
          pumpText: 'text-purple-700',
          accentColor: 'text-purple-600',
          tabColor: 'data-[state=active]:bg-purple-500 data-[state=active]:text-white hover:bg-purple-100 border-purple-200 text-purple-700'
        };
      case 'geriatric':
        return {
          borderColor: 'border-amber-400',
          bgColor: 'bg-amber-50',
          headerBg: 'bg-gradient-to-r from-amber-400 to-amber-500',
          icon: Heart,
          badgeColor: 'bg-amber-100 border-amber-300 text-amber-800',
          pumpBg: 'bg-amber-100 border-amber-300',
          pumpText: 'text-amber-700',
          accentColor: 'text-amber-600',
          tabColor: 'data-[state=active]:bg-amber-500 data-[state=active]:text-white hover:bg-amber-100 border-amber-200 text-amber-700'
        };
      default: // Adult
        return {
          borderColor: 'border-blue-400',
          bgColor: 'bg-blue-50',
          headerBg: 'bg-gradient-to-r from-blue-500 to-blue-600',
          icon: User,
          badgeColor: 'bg-blue-100 border-blue-300 text-blue-800',
          pumpBg: 'bg-blue-100 border-blue-300',
          pumpText: 'text-blue-700',
          accentColor: 'text-blue-600',
          tabColor: 'data-[state=active]:bg-blue-500 data-[state=active]:text-white hover:bg-blue-100 border-blue-200 text-blue-700'
        };
    }
  };

  const config = getPatientTypeConfig(dosing.patient_type);
  const PatientIcon = config.icon;

  return (
    <Card className={`border-2 ${config.borderColor} ${config.bgColor} shadow-xl rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl ${isHighAlert ? 'ring-4 ring-red-300 ring-opacity-50' : ''}`}>
      <CardHeader className={`pb-6 ${config.headerBg} text-white shadow-lg`}>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold flex items-center gap-4">
            {isHighAlert && <AlertTriangle className="h-6 w-6 text-yellow-300 animate-pulse" />}
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm border border-white/30">
              <PatientIcon className="h-6 w-6" />
            </div>
            <div>
              <div className="text-2xl font-black uppercase tracking-wider drop-shadow-sm">
                {dosing.patient_type} PATIENT
              </div>
              {dosing.patient_type.toLowerCase() === 'pediatric' && (
                <div className="text-sm font-semibold opacity-95 mt-1 bg-white/20 px-3 py-1 rounded-lg backdrop-blur-sm">
                  Specialized Pediatric Care Protocol
                </div>
              )}
            </div>
          </CardTitle>
          <div className="flex flex-col gap-3">
            {dosing.route && (
              <Badge variant="secondary" className="font-bold text-lg px-4 py-2 bg-white/95 text-gray-800 rounded-xl shadow-lg border border-white/50">
                {dosing.route}
              </Badge>
            )}
            {dosing.requires_infusion_pump && (
              <Badge variant="outline" className={`flex items-center gap-2 ${config.badgeColor} font-bold text-sm px-4 py-2 rounded-xl shadow-lg border-2`}>
                <Syringe className="h-4 w-4" />
                IV PUMP REQUIRED
              </Badge>
            )}
          </div>
        </div>
        <div className="mt-4 bg-white/20 rounded-xl p-4 backdrop-blur-sm border border-white/30">
          <p className="text-lg font-semibold text-white/95 leading-relaxed">{dosing.indication}</p>
        </div>
      </CardHeader>
      <CardContent className="p-8">
        <div className="space-y-8">
          <div className="text-center p-8 bg-white rounded-2xl border-4 border-gray-300 shadow-xl">
            <p className="text-sm font-black text-gray-600 mb-3 uppercase tracking-widest">EMERGENCY DOSE</p>
            <p className="text-5xl font-black text-gray-900 leading-tight tracking-tight">{dosing.dose}</p>
          </div>
          
          {dosing.concentration_supplied && (
            <div className="text-center p-6 bg-gray-50 rounded-xl border-2 border-gray-200 shadow-md">
              <p className="text-xs font-black text-gray-600 mb-3 uppercase tracking-widest">CONCENTRATION SUPPLIED</p>
              <p className="text-2xl font-bold text-gray-800">{dosing.concentration_supplied}</p>
            </div>
          )}

          {dosing.requires_infusion_pump && pumpSettings && (
            <div className={`${config.pumpBg} border-3 ${config.borderColor} rounded-2xl p-8 shadow-xl`}>
              <div className="flex items-center gap-4 mb-6">
                <Syringe className={`h-7 w-7 ${config.accentColor}`} />
                <p className={`text-xl font-black ${config.pumpText} uppercase tracking-wider`}>
                  ⚠️ IV PUMP SETTINGS
                </p>
              </div>
              
              {pumpSettings.medication_selection && (
                <div className="mb-6 p-4 bg-white rounded-xl border-2 border-gray-300 shadow-lg">
                  <p className={`text-xs font-black ${config.pumpText} uppercase mb-3 tracking-widest`}>PUMP MEDICATION:</p>
                  <p className="text-xl font-bold text-gray-900">{pumpSettings.medication_selection}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-sm">
                {pumpSettings.cca_setting && (
                  <div className="bg-white p-4 rounded-xl border-2 border-gray-200 shadow-lg">
                    <span className={`font-black ${config.pumpText} text-xs uppercase block mb-1`}>CCA:</span>
                    <span className="text-gray-900 font-bold text-xl">{pumpSettings.cca_setting}</span>
                  </div>
                )}
                {pumpSettings.line_option && (
                  <div className="bg-white p-4 rounded-xl border-2 border-gray-200 shadow-lg">
                    <span className={`font-black ${config.pumpText} text-xs uppercase block mb-1`}>Line:</span>
                    <span className="text-gray-900 font-bold text-xl">{pumpSettings.line_option}</span>
                  </div>
                )}
                {pumpSettings.duration && (
                  <div className="bg-white p-4 rounded-xl border-2 border-gray-200 shadow-lg">
                    <span className={`font-black ${config.pumpText} text-xs uppercase block mb-1`}>Duration:</span>
                    <span className="text-gray-900 font-bold text-xl">{pumpSettings.duration}</span>
                  </div>
                )}
                {pumpSettings.vtbi && (
                  <div className="bg-white p-4 rounded-xl border-2 border-gray-200 shadow-lg">
                    <span className={`font-black ${config.pumpText} text-xs uppercase block mb-1`}>VTBI:</span>
                    <span className="text-gray-900 font-bold text-xl">{pumpSettings.vtbi}</span>
                  </div>
                )}
              </div>
              
              {pumpSettings.pump_instructions && (
                <div className="mt-6 pt-6 border-t-2 border-white/50">
                  <p className={`text-sm font-black ${config.pumpText} mb-3 uppercase tracking-wider`}>PUMP INSTRUCTIONS:</p>
                  <p className="text-sm text-gray-800 font-semibold bg-white p-4 rounded-xl shadow-md leading-relaxed">{pumpSettings.pump_instructions}</p>
                </div>
              )}
            </div>
          )}

          {dosing.notes && dosing.notes.length > 0 && (
            <div className="border-t-4 border-gray-300 pt-6">
              <p className="text-sm font-black text-gray-600 mb-4 uppercase tracking-widest">IMPORTANT NOTES</p>
              <ul className="space-y-3">
                {dosing.notes.map((note, index) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start gap-4 bg-white p-4 rounded-xl border-2 border-gray-200 shadow-md">
                    <span className={`${config.accentColor} mt-1 text-xl font-bold`}>•</span>
                    <span className="font-medium leading-relaxed">{note}</span>
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
